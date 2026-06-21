import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "../lib/router.jsx";
import { localeFromPath, countryFromPath, COUNTRIES } from "../i18n/config.js";
import { canonicalPath, alternatePath, countryAlternatePath, localePath, EN_ROUTES } from "../i18n/paths.js";

// Entrée "English" traitée comme un pseudo-pays (langue internationale).
const EN_OPTION = { lang: 'en', label: 'English', flag: '🌐', locale: 'en' };

// Sélecteur de pays / langue sous forme de menu déroulant avec drapeaux.
// Remplace LangSwitch (bouton FR↔EN) par une interface multi-pays extensible.
export default function CountrySwitch({ compact = false }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const locale = localeFromPath(pathname);
  const country = locale === 'en' ? 'en' : countryFromPath(pathname);
  const canon = canonicalPath(pathname);

  // Construction des options disponibles pour la page courante
  const options = [];

  // 🇫🇷 France — toujours disponible (chemin canonique sans préfixe)
  options.push({ code: 'fr', ...COUNTRIES.fr, path: canon === '/' ? '/' : canon });

  // 🇧🇪 Belgique — si la route existe en /be/
  const bePath = countryAlternatePath(pathname, 'fr');
  if (bePath !== null) {
    options.push({ code: 'be', ...COUNTRIES.be, path: bePath });
  }

  // 🌐 English — si la route existe en /en/
  if (locale !== 'en' && EN_ROUTES.has(canon)) {
    const enPath = alternatePath(pathname, 'fr');
    if (enPath) options.push({ code: 'en', ...EN_OPTION, path: enPath });
  } else if (locale === 'en') {
    // Sur une page EN, proposer le retour vers la version FR
    const frPath = canon;
    // Already added as 'fr' above
  }

  // Fermer le menu sur clic extérieur ou Escape
  useEffect(() => {
    if (!open) return;
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  // Pas d'alternatives → ne rien afficher
  if (options.length < 2) return null;

  const current = options.find(o => o.code === country) || options[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Changer de pays / Switch country"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'var(--chip-bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: compact ? 12 : 13,
          fontWeight: 500,
          minHeight: 32,
          padding: compact ? '4px 8px' : '6px 12px',
        }}
      >
        <span style={{ fontSize: compact ? 14 : 16, lineHeight: 1 }}>{current.flag}</span>
        {!compact && <span style={{ color: 'var(--text-secondary)' }}>{current.label}</span>}
        <span style={{
          fontSize: 9, opacity: 0.6,
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
        }}>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', bottom: '100%', right: 0, marginBottom: 6,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(15,24,40,0.13)',
            minWidth: 175,
            overflow: 'hidden',
            zIndex: 500,
          }}
        >
          {options.map(opt => {
            const isActive = opt.code === country;
            return (
              <button
                key={opt.code}
                role="option"
                aria-selected={isActive}
                onClick={() => { navigate(opt.path); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 14px',
                  background: isActive ? 'var(--primary-soft)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--hover-bg)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{opt.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--primary)' : 'var(--text)',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    {opt.code === 'fr' ? 'Simulateurs France' : opt.code === 'be' ? 'Simulateurs Belgique' : 'International'}
                  </div>
                </div>
                {isActive && <span style={{ fontSize: 8, color: 'var(--primary)', flexShrink: 0 }}>●</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
