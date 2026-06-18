import { useAuthContext } from "../context/AuthProvider.jsx";

// Hook d'accès au statut d'authentification. S'appuie sur AuthProvider.
// Conserve les champs historiques `isPro` et `email` utilisés dans l'app.
// Le statut Pro provient du profil en base (alimenté par Stripe) — il n'est
// plus stocké ni modifiable dans le navigateur.
export function useAuth() {
  const ctx = useAuthContext();
  return {
    ...ctx,
    email: ctx.user?.email || ctx.profile?.email || null,
  };
}
