import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";
import { syncFromCloud } from "../hooks/useSimHistory.js";

// Contexte d'authentification global. Source de vérité côté client pour :
//   - l'utilisateur connecté (session Supabase),
//   - son profil (dont le statut d'abonnement, écrit côté serveur par Stripe).
// Le statut Pro N'EST JAMAIS décidé par le navigateur : il provient du profil
// en base, alimenté par le webhook/verify Stripe. Le client ne fait que le lire.

const AuthContext = createContext(null);

// Valeurs de repli si Supabase n'est pas (encore) configuré, pour que le site
// continue de fonctionner normalement (mode invité) sans planter.
const FALLBACK = {
  user: null, profile: null, isPro: false, reportCount: 0, loading: false, isConfigured: false,
  incrementReportCount: async () => {},
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
      .select("email, subscription_status, current_period_end, stripe_customer_id, report_count")
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
      if (u) syncFromCloud(u, supabase).catch(() => {});
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [loadProfile]);

  // Compteur de rapports générés (quota gratuit). Incrémenté côté client sur la
  // propre ligne du profil (RLS) — pas de statut sensible, pas de fonction serverless.
  const incrementReportCount = useCallback(async () => {
    if (!supabase || !user?.id) return;
    let next = 1;
    setProfile((p) => {
      next = (p?.report_count || 0) + 1;
      return p ? { ...p, report_count: next } : { report_count: next };
    });
    await supabase.from("profiles").update({ report_count: next }).eq("id", user.id);
  }, [user?.id]);

  const value = {
    user,
    profile,
    isPro: profile?.subscription_status === "active",
    reportCount: profile?.report_count || 0,
    incrementReportCount,
    loading,
    isConfigured: isSupabaseConfigured,
    signUp: (email, password) => supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/connexion` } }),
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
