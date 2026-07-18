// Contexte d'authentification — session Supabase (email/mot de passe +
// magic link, pas d'OAuth au MVP). Le workspace est créé paresseusement au
// premier login (voir ensureWorkspace dans lib/db.ts), appelé depuis ici.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { ensureWorkspace } from '../../lib/db';

interface AuthState {
  session: Session | null;
  loading: boolean;
  // true entre le clic sur le lien de réinitialisation reçu par email et la
  // définition du nouveau mot de passe (événement Supabase PASSWORD_RECOVERY).
  recovery: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      // Le lien de réinitialisation ouvre une session ET émet cet événement :
      // on bascule l'UI de connexion vers « définir un nouveau mot de passe ».
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Workspace paresseux : dès qu'une session existe, s'assurer qu'il existe.
  useEffect(() => {
    if (session?.user) ensureWorkspace().catch(() => {});
  }, [session?.user?.id]);

  const value: AuthState = {
    session,
    loading,
    recovery,
    async signInWithPassword(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    async signUpWithPassword(email, password) {
      const { error } = await supabase.auth.signUp({ email, password });
      return error ? { error: error.message } : {};
    },
    async signInWithMagicLink(email) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      return error ? { error: error.message } : {};
    },
    // Envoie l'email de réinitialisation ; le lien ramène sur /login où le
    // formulaire « nouveau mot de passe » s'affiche (état recovery).
    async resetPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return error ? { error: error.message } : {};
    },
    async updatePassword(password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) setRecovery(false);
      return error ? { error: error.message } : {};
    },
    async signOut() {
      await supabase.auth.signOut();
    },
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth doit être utilisé sous AuthProvider');
  return ctx;
}
