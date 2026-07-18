// Écran Auth — email/mot de passe (connexion ou inscription) + magic link +
// réinitialisation de mot de passe. Le clic sur le lien de réinitialisation
// (reçu par email) ramène ici en état `recovery` : on affiche alors le
// formulaire « nouveau mot de passe ».

import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hasPendingIntent } from '../../lib/intent';
import { t } from '../../i18n';
import { Particles } from '../Chrome';

type Mode = 'signin' | 'signup' | 'magic' | 'reset';

export default function Login() {
  const { signInWithPassword, signUpWithPassword, signInWithMagicLink, resetPassword, updatePassword, recovery } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Arrivée depuis l'éditeur d'essai (« Publier ») ou avec une intention en
  // attente : on ouvre d'emblée sur l'inscription et on explicite l'enjeu.
  const publishIntent = searchParams.get('intent') === 'publish' || hasPendingIntent();
  const [mode, setMode] = useState<Mode>(publishIntent ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error: err } = await signInWithPassword(email, password);
        if (err) setError(err);
      } else if (mode === 'signup') {
        const { error: err } = await signUpWithPassword(email, password);
        if (err) setError(err);
        else setInfo(t('auth.signupSent'));
      } else if (mode === 'magic') {
        const { error: err } = await signInWithMagicLink(email);
        if (err) setError(err);
        else setInfo(t('auth.magicSent'));
      } else {
        const { error: err } = await resetPassword(email);
        if (err) setError(err);
        else setInfo(t('auth.resetSent'));
      }
    } finally {
      setBusy(false);
    }
  }

  // Définition du nouveau mot de passe après clic sur le lien de réinitialisation.
  async function submitNewPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: err } = await updatePassword(password);
      if (err) setError(err);
      else navigate('/');
    } finally {
      setBusy(false);
    }
  }

  const brand = (
    <Link to="/" className="brand" style={{ justifyContent: 'center', marginBottom: 2 }}>
      <span className="brand-mark">S</span>
      <span className="brand-name">simfinly <em>builder</em></span>
    </Link>
  );

  // --- Nouveau mot de passe (flux de récupération) ---
  if (recovery) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
        <Particles />
        <form onSubmit={submitNewPassword} className="card" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 16, padding: 28 }}>
          {brand}
          <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{t('auth.updateTitle')}</div>
          <label>
            <span className="lbl">{t('auth.newPassword')}</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </label>
          {error && <p style={{ color: 'var(--negative)', fontSize: 12, margin: 0 }}>{error}</p>}
          <button className="btn primary" type="submit" disabled={busy}>{busy ? '…' : t('auth.updateSubmit')}</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
      <Particles />
      <form onSubmit={submit} className="card" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 16, padding: 28 }}>
        {brand}

        {publishIntent && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', background: 'var(--primary-soft)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', lineHeight: 1.5 }}>
            {t('essai.loginIntent')}
          </p>
        )}

        {mode === 'reset' ? (
          <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{t('auth.resetTitle')}</div>
        ) : (
          <div style={{ display: 'flex', gap: 6, background: 'var(--input-bg)', padding: 4, borderRadius: 999 }}>
            {(['signin', 'signup', 'magic'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`btn chip${mode === m ? ' active' : ''}`}
                style={{ flex: 1, border: mode === m ? undefined : '1.5px solid transparent', background: mode === m ? undefined : 'transparent' }}
                onClick={() => { setMode(m); setError(null); setInfo(null); }}
              >
                {t(`auth.tabs.${m}`)}
              </button>
            ))}
          </div>
        )}

        <label>
          <span className="lbl">{t('auth.email')}</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>

        {(mode === 'signin' || mode === 'signup') && (
          <label>
            <span className="lbl">{t('auth.password')}</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </label>
        )}

        {error && <p style={{ color: 'var(--negative)', fontSize: 12, margin: 0 }}>{error}</p>}
        {info && <p style={{ color: 'var(--primary)', fontSize: 12, margin: 0 }}>{info}</p>}

        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? '…' : t(`auth.submit.${mode}`)}
        </button>

        {mode === 'signin' && (
          <button type="button" onClick={() => { setMode('reset'); setError(null); setInfo(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            {t('auth.forgot')}
          </button>
        )}
        {mode === 'reset' && (
          <button type="button" onClick={() => { setMode('signin'); setError(null); setInfo(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            {t('auth.backToSignin')}
          </button>
        )}
      </form>
    </div>
  );
}
