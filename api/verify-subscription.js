import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { session_id } = req.query;
  if (!session_id || typeof session_id !== 'string') return res.status(400).json({ error: 'Missing session_id' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'Stripe not configured' });

  try {
    const stripe = new Stripe(secretKey);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
