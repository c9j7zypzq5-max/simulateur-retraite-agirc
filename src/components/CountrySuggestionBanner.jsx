import { useState, useEffect } from 'react';
import { useNavigate } from '../lib/router.jsx';
import { useCountry } from '../lib/router.jsx';
import { guessCountryFromBrowser } from '../i18n/currency.js';

const LABELS = {
  ch: { name: 'Suisse', flag: '🇨🇭', dest: '/ch', version: 'suisse' },
  be: { name: 'Belgique', flag: '🇧🇪', dest: '/be', version: 'belge' },
};

// Bannière de suggestion de pays : s'affiche quand le navigateur détecte CH ou BE
// et que l'utilisateur est sur la version FR. Disparaît définitivement après un clic
// (sessionStorage), pour ne pas interrompre les visites suivantes.
export default function CountrySuggestionBanner() {
  const [suggestedCountry, setSuggestedCountry] = useState(null);
  const currentCountry = useCountry();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentCountry !== 'fr') return;
    if (sessionStorage.getItem('simfinly-country-dismissed')) return;
    const guess = guessCountryFromBrowser();
    if (guess) setSuggestedCountry(guess);
  }, [currentCountry]);

  if (!suggestedCountry) return null;

  const info = LABELS[suggestedCountry];
  const dismiss = () => {
    sessionStorage.setItem('simfinly-country-dismissed', '1');
    setSuggestedCountry(null);
  };
  const accept = () => {
    dismiss();
    navigate(info.dest);
  };

  return (
    <div
      role="banner"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(15,24,40,0.10)',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px',
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontSize: 13,
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{info.flag}</span>
      <span style={{ flex: 1, color: 'var(--text)' }}>
        Vous semblez être en {info.name}. Voir les simulateurs adaptés à votre pays ?
      </span>
      <button
        onClick={accept}
        style={{
          background: 'var(--primary)', color: '#fff',
          border: 'none', borderRadius: 7,
          padding: '6px 14px', cursor: 'pointer',
          fontSize: 12, fontWeight: 600,
          fontFamily: "'Hanken Grotesk', sans-serif",
          flexShrink: 0,
        }}
      >
        Version {info.version}
      </button>
      <button
        onClick={dismiss}
        aria-label="Fermer"
        style={{
          background: 'transparent', border: 'none',
          color: 'var(--text-secondary)', cursor: 'pointer',
          fontSize: 16, lineHeight: 1, padding: '4px 6px',
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
