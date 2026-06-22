import { createClient } from '@supabase/supabase-js';

// Client Supabase côté navigateur.
// La clé "anon" est PUBLIQUE par conception (elle est censée se retrouver dans
// le bundle JS). La sécurité ne repose JAMAIS sur le secret de cette clé mais
// sur les politiques Row-Level Security (RLS) définies dans supabase/schema.sql :
// chaque requête est exécutée au nom de l'utilisateur connecté (JWT), et la base
// n'autorise que l'accès à ses propres lignes.
//
// La clé service_role (qui contourne RLS) ne doit JAMAIS être préfixée VITE_
// ni utilisée ici : elle reste uniquement côté serveur (api/), pour le webhook.

const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // nécessaire pour les retours OAuth Google / liens email
      },
    })
  : null;
