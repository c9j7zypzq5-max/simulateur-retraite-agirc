import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { origin, email } = req.body;
  if (!origin || typeof origin !== 'string') return res.status(400).json({ error: 'Missing origin' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!secretKey || !priceId) return res.status(500).json({ error: 'Stripe not configured' });

  try {
    const stripe = new Stripe(secretKey);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
