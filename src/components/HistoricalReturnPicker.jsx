import { useState, useRef, useEffect } from 'react';
import { buildHistoricalPresets } from '../data/sp500Returns.js';

export default function HistoricalReturnPicker({ duration, onSelect }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const presets = buildHistoricalPresets(duration);

  // Group presets
  const groups = [];
  const seen = new Set();
  for (const p of presets) {
    if (!seen.has(p.group)) { seen.add(p.group); groups.push(p.group); }
  }

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Utiliser des données historiques S&P 500"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 7,
          border: '1px solid var(--border-gold)',
          background: open ? 'rgba(184,147,74,0.12)' : 'rgba(184,147,74,0.06)',
          color: 'var(--gold-mid)', fontSize: 11,
          fontFamily: "'Hanken Grotesk', sans-serif",
          cursor: 'pointer', whiteSpace: 'nowrap', minHeight: 28,
        }}
      >
        📊 Historique S&P 500
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          zIndex: 200, width: 280,
          background: 'var(--card-bg)',
          border: '1px solid var(--border-gold)',
          borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              S&amp;P 500 — rendements historiques
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>
              Cliquez pour utiliser ce taux dans votre simulation
            </div>
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto', padding: '6px 0 8px' }}>
            {groups.map(group => (
              <div key={group}>
                <div style={{ fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', padding: '8px 14px 4px' }}>
                  {group}
                </div>
                {presets.filter(p => p.group === group).map((p, i) => {
                  const color = p.rate >= 0 ? '#22c55e' : '#ef4444';
                  return (
                    <button
                      key={i}
                      onClick={() => { onSelect(p.rate); setOpen(false); }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        width: '100%', padding: '7px 14px',
                        background: p.highlight ? 'rgba(184,147,74,0.08)' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s',
                        minHeight: 34,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,147,74,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = p.highlight ? 'rgba(184,147,74,0.08)' : 'transparent'}
                    >
                      <span style={{ fontSize: 12, color: 'var(--text)', textAlign: 'left' }}>{p.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color, flexShrink: 0, marginLeft: 8 }}>
                        {p.rate > 0 ? '+' : ''}{String(p.rate).replace('.', ',')} %
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ padding: '6px 14px 10px', borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Rendements totaux annualisés (dividendes réinvestis). Données historiques, non garanties pour le futur.
          </div>
        </div>
      )}
    </div>
  );
}
