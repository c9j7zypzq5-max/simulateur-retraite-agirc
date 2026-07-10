// Déclenche le Checkout Stripe pour passer Pro/Premium. Le serveur
// (api/stripe.js) répond 500 "Stripe not configured" tant que les clés
// Stripe réelles ne sont pas renseignées — voir builder/.env.example.

import { supabase } from './supabase';

export async function startCheckout(plan: 'pro' | 'premium'): Promise<{ error?: string }> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { error: 'Non authentifié' };

  const res = await fetch('/api/stripe?action=create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ origin: window.location.origin, plan }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { error: body.error || `Erreur ${res.status}` };
  window.location.href = body.url;
  return {};
}
