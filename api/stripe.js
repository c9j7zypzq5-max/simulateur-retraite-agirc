import Stripe from 'stripe';

// bodyParser disabled: we parse JSON manually and read raw body for webhook
export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function parseJson(req) {
  const raw = await getRawBody(req);
  try { return JSON.parse(raw.toString() || '{}'); } catch { return {}; }
}

// --- Supabase (serveur) ---------------------------------------------------
// Client admin avec la clé service_role : contourne RLS pour écrire le statut
// d'abonnement. N'est JAMAIS exposé au navigateur (pas de préfixe VITE_).
function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  // import différé pour ne pas alourdir les autres actions
  return import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  );
}

// Valide un JWT Supabase (envoyé en Authorization: Bearer) et renvoie l'utilisateur.
async function getUserFromAuthHeader(req) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7);
  const adminP = getSupabaseAdmin();
  if (!adminP) return null;
  const admin = await adminP;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

const toIso = (unixSeconds) =>
  unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;

async function handleCreateCheckout(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  const { origin, path, s } = await parseJson(req);
  if (!origin || typeof origin !== 'string') return res.status(400).json({ error: 'Missing origin' });

  const backPath = path || '/';
  const cancelUrl = s ? `${origin}${backPath}?s=${s}` : `${origin}${backPath}`;
  const successUrl = `${origin}/merci?session_id={CHECKOUT_SESSION_ID}&back=${encodeURIComponent(backPath)}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    // locale 'auto' : Stripe affiche le checkout dans la langue du navigateur.
    locale: 'auto',
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: 199,
        product_data: {
          name: 'Rapport Pro Simfinly',
          description: 'Rapport PDF professionnel multi-pages de votre simulation',
        },
      },
      quantity: 1,
    }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_intent_data: { description: 'Rapport Pro Simfinly.com' },
  });

  res.status(200).json({ url: session.url });
}

async function handleCreateSubscription(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  const { origin, email } = await parseJson(req);
  if (!origin || typeof origin !== 'string') return res.status(400).json({ error: 'Missing origin' });

  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) return res.status(500).json({ error: 'Stripe not configured' });

  // Identifie l'utilisateur connecté pour LIER l'abonnement à son compte.
  // client_reference_id sert ensuite à rattacher le client Stripe au profil.
  const user = await getUserFromAuthHeader(req);

  const params = {
    mode: 'subscription',
    // locale 'auto' : checkout traduit selon la langue du client.
    locale: 'auto',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/merci-pro?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pro`,
    allow_promotion_codes: true,
  };
  if (user) {
    params.client_reference_id = user.id;
    params.customer_email = user.email;
  } else if (email && typeof email === 'string' && email.includes('@')) {
    params.customer_email = email;
  }

  const session = await stripe.checkout.sessions.create(params);
  res.status(200).json({ url: session.url });
}

// Portail client Stripe : page hébergée et sécurisée pour gérer/résilier
// l'abonnement. On exige le JWT du compte et on n'ouvre QUE le portail du
// client Stripe rattaché à ce compte (impossible d'accéder à celui d'autrui).
async function handlePortal(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  const { origin } = await parseJson(req);

  const user = await getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ error: 'Non authentifié' });

  const admin = await getSupabaseAdmin();
  if (!admin) return res.status(500).json({ error: 'Auth non configurée' });

  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return res.status(400).json({ error: 'Aucun abonnement associé à ce compte.' });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin || ''}/compte`,
  });
  res.status(200).json({ url: session.url });
}

async function handleVerifyPayment(req, res, stripe, query) {
  if (req.method !== 'GET') return res.status(405).end();
  const session_id = query.session_id;
  if (!session_id || typeof session_id !== 'string') return res.status(400).json({ error: 'Missing session_id' });

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    const cached = await redis.get(`paid:${session_id}`);
    if (cached) return res.status(200).json({ paid: true });
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const paid = session.payment_status === 'paid';

  if (paid && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    await redis.set(`paid:${session_id}`, '1', { ex: 3600 });
  }

  res.status(200).json({ paid });
}

async function handleVerifySubscription(req, res, stripe, query) {
  if (req.method !== 'GET') return res.status(405).end();
  const session_id = query.session_id;
  if (!session_id || typeof session_id !== 'string') return res.status(400).json({ error: 'Missing session_id' });

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['customer', 'subscription'],
  });

  const active = session.status === 'complete';
  const email = session.customer_email
    || (typeof session.customer === 'object' ? session.customer?.email : null)
    || '';
  const userId = session.client_reference_id || null;
  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id || null;
  const periodEnd = typeof session.subscription === 'object'
    ? toIso(session.subscription?.current_period_end)
    : null;

  // Source de vérité : on écrit le statut Pro dans le profil (clé service_role,
  // contourne RLS). Rattache le client Stripe au compte via client_reference_id.
  if (active && userId && customerId) {
    try {
      const admin = await getSupabaseAdmin();
      if (admin) {
        await admin.from('profiles').update({
          stripe_customer_id: customerId,
          subscription_status: 'active',
          current_period_end: periodEnd,
        }).eq('id', userId);
        admin.from('analytics_events').insert({
          event: 'subscription_converted',
          user_id: userId,
          properties: { plan: 'pro', amount: session.amount_total },
        }).catch(() => {});
      }
    } catch { /* ne bloque pas le retour utilisateur */ }
  }

  res.status(200).json({ active, email });
}

async function handleWebhook(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(500).end();

  let event;
  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  if (
    event.type === 'customer.subscription.deleted' ||
    event.type === 'customer.subscription.updated'
  ) {
    const subscription = event.data.object;
    const newStatus =
      event.type === 'customer.subscription.deleted' ? 'cancelled'
      : subscription.status === 'active' ? 'active'
      : 'cancelled';

    // Met à jour le profil rattaché à ce client Stripe (résiliation/renouvellement).
    try {
      const admin = await getSupabaseAdmin();
      if (admin && subscription.customer) {
        await admin.from('profiles').update({
          subscription_status: newStatus,
          current_period_end: toIso(subscription.current_period_end),
        }).eq('stripe_customer_id', subscription.customer);
      }
    } catch { /* webhook must always return 200 */ }
  }

  res.status(200).json({ received: true });
}

export default async function handler(req, res) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'Stripe not configured' });

  const stripe = new Stripe(secretKey);
  const query = req.query || {};
  const action = query.action;

  try {
    if (action === 'create-checkout') return await handleCreateCheckout(req, res, stripe);
    if (action === 'create-subscription') return await handleCreateSubscription(req, res, stripe);
    if (action === 'verify-payment') return await handleVerifyPayment(req, res, stripe, query);
    if (action === 'verify-subscription') return await handleVerifySubscription(req, res, stripe, query);
    if (action === 'portal') return await handlePortal(req, res, stripe);
    if (action === 'webhook') return await handleWebhook(req, res, stripe);
    res.status(404).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('[stripe] unhandled error:', err?.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
