import Stripe from 'stripe';

// Vercel: disable body parser so we receive the raw buffer for signature verification
export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) return res.status(500).end();

  let event;
  try {
    const stripe = new Stripe(secretKey);
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
        const stripe = new Stripe(secretKey);
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
