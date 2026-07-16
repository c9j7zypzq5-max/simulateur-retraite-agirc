// Écran Auth — email/mot de passe (connexion ou inscription) + magic link.
// Pas d'OAuth au MVP.

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { t } from '../../i18n';

type Mode = 'signin' | 'signup' | 'magic';

export default function Login() {
  const { signInWithPassword, signUpWithPassword, signInWithMagicLink } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
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
      } else {
        const { error: err } = await signInWithMagicLink(email);
        if (err) setError(err);
        else setInfo(t('auth.magicSent'));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} className="card" style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>Simfinly Builder</h1>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['signin', 'signup', 'magic'] as const).map((m) => (
            <button
              key={m}
              type="button"
              className="btn"
              style={mode === m ? { background: 'var(--primary-soft)', borderColor: 'var(--primary)', color: 'var(--primary)' } : undefined}
              onClick={() => { setMode(m); setError(null); setInfo(null); }}
            >
              {t(`auth.tabs.${m}`)}
            </button>
          ))}
        </div>

        <label>
          <span className="lbl">{t('auth.email')}</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>

        {mode !== 'magic' && (
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
      </form>
    </div>
  );
}
