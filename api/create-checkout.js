import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { origin, path, s } = req.body;
  if (!origin || typeof origin !== 'string') return res.status(400).json({ error: 'Missing origin' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'Stripe not configured' });

  try {
    const stripe = new Stripe(secretKey);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
