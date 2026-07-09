// Client Supabase du builder. Projet partagé avec le site principal
// (région EU eu-west-3) ; tables préfixées builder_, isolation par RLS.
// La clé anon/publishable est publique par design.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Message explicite en dev : évite un échec opaque au premier appel réseau.
  console.warn('[builder] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants — voir builder/.env.example');
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: { persistSession: true, autoRefreshToken: true },
});
