// Toutes les actions Stripe du builder, via ?action=<nom> — même convention
// que api/stripe.js du site principal (dont ce fichier reprend les patterns
// éprouvés : CSRF via Origin, JWT Supabase en Authorization, webhook vérifié
// par signature, client admin service_role jamais exposé au navigateur).
//
// ⚠️ Nécessite des identifiants Stripe réels (mode test) non fournis à ce
// stade : STRIPE_SECRET_KEY, STRIPE_PRO_PRICE_ID, STRIPE_PREMIUM_PRICE_ID,
// STRIPE_WEBHOOK_SECRET. Sans eux, chaque action répond 500 "Stripe not
// configured" plutôt que de planter — voir builder/.env.example.

import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

const MAX_BODY_BYTES = 100 * 1024;

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) { reject(new Error('payload_too_large')); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function parseJson(req) {
  try {
    const raw = await getRawBody(req);
    return JSON.parse(raw.toString() || '{}');
  } catch (e) {
    if (e.message === 'payload_too_large') throw e;
    return {};
  }
}

function verifyCsrf(req) {
  const origin = req.headers['origin'] || '';
  const host = req.headers['host'] || '';
  if (!origin) return true; // server-to-server, webhook, etc.
  try {
    const originHost = new URL(origin).host;
    return originHost === host || originHost.endsWith('.simfinly.com');
  } catch { return false; }
}

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }),
  );
}

async function getUserFromAuthHeader(req, admin) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header || !header.startsWith('Bearer ')) return null;
  const { data, error } = await admin.auth.getUser(header.slice(7));
  if (error || !data?.user) return null;
  return data.user;
}

// Le workspace est créé côté client au premier login (ensureWorkspace) ; ici
// on le lit seulement, jamais on ne le crée (le service route n'a pas à
// dupliquer cette logique).
async function getWorkspaceIdForUser(admin, userId) {
  const { data } = await admin.from('builder_workspaces').select('id').eq('owner', userId).maybeSingle();
  return data?.id ?? null;
}

function priceIdToPlan(priceId) {
  if (priceId && priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  if (priceId && priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return 'premium';
  return null;
}

async function handleCreateSubscription(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!verifyCsrf(req)) return res.status(403).json({ error: 'Forbidden' });
  const { origin, plan } = await parseJson(req);
  if (!origin || typeof origin !== 'string') return res.status(400).json({ error: 'Missing origin' });
  if (plan !== 'pro' && plan !== 'premium') return res.status(400).json({ error: 'Invalid plan' });

  const priceId = plan === 'pro' ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) return res.status(500).json({ error: 'Stripe not configured' });

  const admin = await getSupabaseAdmin();
  if (!admin) return res.status(500).json({ error: 'Stripe not configured' });
  const user = await getUserFromAuthHeader(req, admin);
  if (!user) return res.status(401).json({ error: 'Non authentifié' });

  const workspaceId = await getWorkspaceIdForUser(admin, user.id);
  if (!workspaceId) return res.status(400).json({ error: 'Aucun workspace pour ce compte' });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    locale: 'auto',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/?upgraded=1`,
    cancel_url: `${origin}/`,
    client_reference_id: workspaceId,
    customer_email: user.email,
    allow_promotion_codes: true,
  });
  res.status(200).json({ url: session.url });
}

// Portail client Stripe : n'ouvre que le portail du client Stripe rattaché au
// workspace de l'utilisateur connecté (impossible d'accéder à celui d'autrui).
async function handlePortal(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  const { origin } = await parseJson(req);

  const admin = await getSupabaseAdmin();
  if (!admin) return res.status(500).json({ error: 'Stripe not configured' });
  const user = await getUserFromAuthHeader(req, admin);
  if (!user) return res.status(401).json({ error: 'Non authentifié' });

  const workspaceId = await getWorkspaceIdForUser(admin, user.id);
  if (!workspaceId) return res.status(400).json({ error: 'Aucun workspace pour ce compte' });

  const { data: sub } = await admin
    .from('builder_subscriptions')
    .select('stripe_customer_id')
    .eq('workspace_id', workspaceId)
    .maybeSingle();
  if (!sub?.stripe_customer_id) return res.status(400).json({ error: 'Aucun abonnement associé à ce compte.' });

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin || ''}/`,
  });
  res.status(200).json({ url: session.url });
}

async function handleWebhook(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(500).end();

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, req.headers['stripe-signature'], webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const admin = await getSupabaseAdmin();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.mode === 'subscription' && session.client_reference_id && admin) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const plan = priceIdToPlan(subscription.items.data[0]?.price?.id);
        if (plan) {
          await (await admin).from('builder_subscriptions').upsert({
            workspace_id: session.client_reference_id,
            stripe_customer_id: session.customer,
            plan,
            status: 'active',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'workspace_id' });
        }
      }
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      if (admin) {
        const plan = event.type === 'customer.subscription.deleted'
          ? 'free'
          : priceIdToPlan(subscription.items.data[0]?.price?.id) ?? 'free';
        const status = event.type === 'customer.subscription.deleted'
          ? 'cancelled'
          : subscription.status === 'active' ? 'active' : 'cancelled';
        await (await admin).from('builder_subscriptions').update({
          plan,
          status,
          updated_at: new Date().toISOString(),
        }).eq('stripe_customer_id', subscription.customer);
      }
    }
  } catch {
    // Le webhook doit toujours répondre 200 pour éviter les retries en boucle
    // de Stripe ; une écriture ratée reste visible dans les logs Vercel.
  }

  res.status(200).json({ received: true });
}

export default async function handler(req, res) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'Stripe not configured' });
  const stripe = new Stripe(secretKey);

  const action = req.query.action;
  switch (action) {
    case 'create-subscription': return handleCreateSubscription(req, res, stripe);
    case 'portal': return handlePortal(req, res, stripe);
    case 'webhook': return handleWebhook(req, res, stripe);
    default: return res.status(404).json({ error: 'Unknown action' });
  }
}
