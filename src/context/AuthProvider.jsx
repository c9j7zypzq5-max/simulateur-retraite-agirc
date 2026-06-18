import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";

// Contexte d'authentification global. Source de vérité côté client pour :
//   - l'utilisateur connecté (session Supabase),
//   - son profil (dont le statut d'abonnement, écrit côté serveur par Stripe).
// Le statut Pro N'EST JAMAIS décidé par le navigateur : il provient du profil
// en base, alimenté par le webhook/verify Stripe. Le client ne fait que le lire.

const AuthContext = createContext(null);

// Valeurs de repli si Supabase n'est pas (encore) configuré, pour que le site
// continue de fonctionner normalement (mode invité) sans planter.
const FALLBACK = {
  user: null, profile: null, isPro: false, loading: false, isConfigured: false,
  signUp: async () => ({ error: { message: "Authentification non configurée." } }),
  signIn: async () => ({ error: { message: "Authentification non configurée." } }),
  signInGoogle: async () => ({ error: { message: "Authentification non configurée." } }),
  signOut: async () => {},
  resetPassword: async () => ({ error: { message: "Authentification non configurée." } }),
  refreshProfile: async () => {},
  getAccessToken: async () => null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (uid) => {
    if (!supabase || !uid) { setProfile(null); return; }
    // RLS garantit qu'on ne lit que SON propre profil.
    const { data } = await supabase
      .from("profiles")
      .select("email, subscription_status, current_period_end, stripe_customer_id")
      .eq("id", uid)
      .maybeSingle();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const u = data.session?.user ?? null;
      setUser(u);
      loadProfile(u?.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      loadProfile(u?.id);
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  const value = {
    user,
    profile,
    isPro: profile?.subscription_status === "active",
    loading,
    isConfigured: isSupabaseConfigured,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signInGoogle: () => supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/compte` },
    }),
    signOut: async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); },
    resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/compte`,
    }),
    refreshProfile: () => loadProfile(user?.id),
    getAccessToken: async () => {
      if (!supabase) return null;
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token || null;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext) || FALLBACK;
}
