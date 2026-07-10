// Page publique — s.simfinly.com/{slug} (routé via /s/:slug, voir vercel.json).
// Surface « page hébergée » ET « iframe embed » : c'est littéralement la même
// page, l'embed n'étant qu'une iframe pointant dessus (embed.js). Le rendu du
// calculateur passe par LE composant partagé ; seule la capture de soumission
// est spécifique à cette surface (absente de l'aperçu éditeur).

import { useEffect, useState } from 'react';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { getPublishedBySlug, recordView, recordSubmission, type PublicCalculator as PublicCalc } from '../lib/publicClient';
import { t } from '../i18n';

function slugFromPath(): string | null {
  const m = window.location.pathname.match(/^\/s\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

const isEmbed = window.self !== window.top;

export default function PublicCalculator() {
  const [calc, setCalc] = useState<PublicCalc | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'notfound'>('loading');
  const [values, setValues] = useState<Record<string, number>>({});
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Capture email (Pro+, calc.capture_email) : les résultats restent masqués
  // tant que ce formulaire n'a pas été validé. Le valider EST la soumission
  // (email attaché) — pas de double action avec le bouton « Enregistrer ».
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  useEffect(() => {
    const slug = slugFromPath();
    if (!slug) { setStatus('notfound'); return; }
    getPublishedBySlug(slug).then((c) => {
      if (!c) { setStatus('notfound'); return; }
      setCalc(c);
      setStatus('ready');
      document.title = `${c.title} — Simfinly`;
      recordView(c.id).catch(() => {});
    }).catch(() => setStatus('notfound'));
  }, []);

  if (status === 'loading') return null;
  if (status === 'notfound' || !calc) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Calculateur introuvable.
      </div>
    );
  }

  const needsGate = calc.capture_email && !emailUnlocked;

  async function handleSubmit() {
    if (!calc) return;
    setSubmitState('sending');
    try {
      await recordSubmission(calc.id, values, isEmbed ? 'embed' : 'hosted');
      setSubmitState('sent');
    } catch {
      setSubmitState('idle');
    }
  }

  async function handleEmailGate(e: React.FormEvent) {
    e.preventDefault();
    if (!calc) return;
    if (!consent) { setGateError('Merci de cocher la case de consentement.'); return; }
    setGateSubmitting(true);
    setGateError(null);
    try {
      await recordSubmission(calc.id, values, isEmbed ? 'embed' : 'hosted', email);
      setEmailUnlocked(true);
    } catch {
      setGateError('Une erreur est survenue, réessayez.');
    } finally {
      setGateSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: isEmbed ? undefined : '100vh', display: 'flex', justifyContent: 'center', padding: isEmbed ? 0 : 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <CalculatorRenderer
          calculator={calc}
          values={values}
          onChange={(id, v) => setValues((p) => ({ ...p, [id]: v }))}
          showBadge={!calc.hide_badge}
          hideResults={needsGate}
        />

        {needsGate ? (
          <form onSubmit={handleEmailGate} className="card" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <strong style={{ fontSize: 14 }}>{t('public.emailGateTitle')}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{t('public.emailGateHelp')}</p>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
            />
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
              {t('public.emailGateConsent')}
            </label>
            {gateError && <p style={{ margin: 0, color: 'var(--negative)', fontSize: 12 }}>{gateError}</p>}
            <button className="btn primary" type="submit" disabled={gateSubmitting}>
              {gateSubmitting ? '…' : t('public.emailGateSubmit')}
            </button>
          </form>
        ) : (
          !calc.capture_email && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button
                className="btn primary"
                disabled={submitState !== 'idle'}
                onClick={handleSubmit}
                style={{ width: '100%', maxWidth: 560 }}
              >
                {submitState === 'sent' ? '✓ Enregistré' : t('public.saveCta')}
              </button>
            </div>
          )
        )}

        {calc.over_free_quota && (
          <div className="card" style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            ⚠️ {t('public.upgradeBanner')}
          </div>
        )}
      </div>
    </div>
  );
}
