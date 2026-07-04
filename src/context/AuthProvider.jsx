import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { ACCOUNT_ENABLED } from "../config/features.js";
import { syncFromCloud } from "../hooks/useSimHistory.js";

// Contexte d'authentification global. Source de vérité côté client pour :
//   - l'utilisateur connecté (session Supabase),
//   - son profil (dont le statut d'abonnement, écrit côté serveur par Stripe).
// Le statut Pro N'EST JAMAIS décidé par le navigateur : il provient du profil
// en base, alimenté par le webhook/verify Stripe. Le client ne fait que le lire.
//
// AuthProvider enveloppe TOUTE l'application (voir App.jsx) : il est donc monté
// sur chaque page, y compris quand ACCOUNT_ENABLED = false. Le SDK Supabase
// (~55 Ko gzippés) n'est donc importé dynamiquement (import() dans l'effet
// ci-dessous) que si ACCOUNT_ENABLED est activé — jamais en import statique en
// tête de fichier, sans quoi ce module (et transitivement @supabase/supabase-js)
// serait inclus dans le graphe d'imports synchrone et téléchargé sur CHAQUE
// page du site, y compris quand le compte/Pro est désactivé.

const AuthContext = createContext(null);

// Valeurs de repli si Supabase n'est pas (encore) configuré, pour que le site
// continue de fonctionner normalement (mode invité) sans planter.
const _authNotConfigured = () =>
  typeof window !== "undefined" && window.location.pathname.startsWith("/en")
    ? "Authentication not configured."
    : "Authentification non configurée.";

const FALLBACK = {
  user: null, profile: null, isPro: false, reportCount: 0, loading: false, isConfigured: false,
  incrementReportCount: async () => {},
  signUp: async () => ({ error: { message: _authNotConfigured() } }),
  signIn: async () => ({ error: { message: _authNotConfigured() } }),
  signInGoogle: async () => ({ error: { message: _authNotConfigured() } }),
  signOut: async () => {},
  resetPassword: async () => ({ error: { message: _authNotConfigured() } }),
  refreshProfile: async () => {},
  getAccessToken: async () => null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(ACCOUNT_ENABLED);
  const [isConfigured, setIsConfigured] = useState(false);
  // Client Supabase chargé dynamiquement (cf. effet ci-dessous) — jamais
  // disponible tant qu'ACCOUNT_ENABLED est false ou que le chargement n'a pas
  // encore résolu.
  const supabaseRef = useRef(null);

  const loadProfile = useCallback(async (uid) => {
    const supabase = supabaseRef.current;
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
    if (!ACCOUNT_ENABLED) { setLoading(false); return; }
    let mounted = true;
    let unsubscribe = () => {};

    import("../lib/supabase.js").then(({ supabase, isSupabaseConfigured }) => {
      if (!mounted) return;
      supabaseRef.current = supabase;
      setIsConfigured(isSupabaseConfigured);
      if (!isSupabaseConfigured) { setLoading(false); return; }

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
      unsubscribe = () => sub.subscription.unsubscribe();
    });

    return () => { mounted = false; unsubscribe(); };
  }, [loadProfile]);

  // Compteur de rapports générés (quota gratuit). Incrémenté côté client sur la
  // propre ligne du profil (RLS) — pas de statut sensible, pas de fonction serverless.
  const incrementReportCount = useCallback(async () => {
    const supabase = supabaseRef.current;
    if (!supabase || !user?.id) return;
    let next = 1;
    setProfile((p) => {
      next = (p?.report_count || 0) + 1;
      return p ? { ...p, report_count: next } : { report_count: next };
    });
    await supabase.from("profiles").update({ report_count: next }).eq("id", user.id);
  }, [user?.id]);

  function getLocalePath(path) {
    if (typeof window === 'undefined') return path;
    const prefix = ['en', 'be', 'ch'].find(p =>
      window.location.pathname.startsWith(`/${p}/`) || window.location.pathname === `/${p}`
    );
    return prefix ? `/${prefix}${path}` : path;
  }

  const value = {
    user,
    profile,
    isPro: profile?.subscription_status === "active",
    reportCount: profile?.report_count || 0,
    incrementReportCount,
    loading,
    isConfigured,
    signUp: (email, password) => supabaseRef.current.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${getLocalePath('/connexion')}` } }),
    signIn: (email, password) => supabaseRef.current.auth.signInWithPassword({ email, password }),
    signInGoogle: () => supabaseRef.current.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${getLocalePath('/compte')}` },
    }),
    signOut: async () => { await supabaseRef.current?.auth.signOut(); setUser(null); setProfile(null); },
    resetPassword: (email) => supabaseRef.current.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/compte`,
    }),
    refreshProfile: () => loadProfile(user?.id),
    getAccessToken: async () => {
      const supabase = supabaseRef.current;
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
