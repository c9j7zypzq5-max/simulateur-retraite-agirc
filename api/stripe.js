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
  return JSON.parse(raw.toString());
}

async function handleCreateCheckout(req, res, stripe) {
  if (req.method !== 'POST') return res.status(405).end();
  const { origin, path, s } = await parseJson(req);
  if (!origin || typeof origin !== 'string') return res.status(400).json({ error: 'Missing origin' });

  const backPath = path || '/';
  const cancelUrl = s ? `${origin}${backPath}?s=${s}` : `${origin}${backPath}`;
  const successUrl = `${origin}/merci?session_id={CHECKOUT_SESSION_ID}&back=${encodeURIComponent(backPath)}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
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

  const params = {
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/merci-pro?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pro`,
    allow_promotion_codes: true,
  };
  if (email && typeof email === 'string' && email.includes('@')) {
    params.customer_email = email;
  }

  const session = await stripe.checkout.sessions.create(params);
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
  const stripeSubId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id || '';

  if (active && email && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    await redis.set(`sub:${email}`, JSON.stringify({ status: 'active', stripeSubId, updatedAt: new Date().toISOString() }));
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
    const newStatus = subscription.status === 'active' ? 'active' : 'cancelled';

    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        const email = customer.deleted ? null : customer.email;

        if (email) {
          const { Redis } = await import('@upstash/redis');
          const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
          const existing = await redis.get(`sub:${email}`);
          const data = existing ? JSON.parse(existing) : {};
          await redis.set(`sub:${email}`, JSON.stringify({ ...data, status: newStatus, updatedAt: new Date().toISOString() }));
        }
      } catch { /* webhook must always return 200 */ }
    }
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
    if (action === 'webhook') return await handleWebhook(req, res, stripe);
    res.status(404).json({ error: 'Unknown action' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
