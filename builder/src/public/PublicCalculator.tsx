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

  return (
    <div style={{ minHeight: isEmbed ? undefined : '100vh', display: 'flex', justifyContent: 'center', padding: isEmbed ? 0 : 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <CalculatorRenderer
          calculator={calc}
          values={values}
          onChange={(id, v) => setValues((p) => ({ ...p, [id]: v }))}
        />
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
      </div>
    </div>
  );
}
