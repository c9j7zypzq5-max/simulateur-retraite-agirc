// Champ de formule assisté — bouton « ƒ » qui ouvre une palette : les
// identifiants disponibles (champs + variables déjà définies) et les fonctions
// supportées, insérés à la position du curseur. Enlève le principal frein
// d'adoption pour une cible non-technique (plus besoin de connaître la syntaxe
// BAREME/IF par cœur).

import { useRef, useState } from 'react';
import { t } from '../../i18n';

// insert = texte inséré ; caret = position du curseur après insertion (dans le
// texte inséré) pour tomber pile dans la 1ʳᵉ parenthèse.
const FUNCTIONS: { label: string; insert: string; caret: number }[] = [
  { label: 'IF', insert: 'IF(, , )', caret: 3 },
  { label: 'AND', insert: 'AND(, )', caret: 4 },
  { label: 'OR', insert: 'OR(, )', caret: 3 },
  { label: 'MIN', insert: 'MIN(, )', caret: 4 },
  { label: 'MAX', insert: 'MAX(, )', caret: 4 },
  { label: 'ROUND', insert: 'ROUND(, 2)', caret: 6 },
  { label: 'ABS', insert: 'ABS()', caret: 4 },
  { label: 'SQRT', insert: 'SQRT()', caret: 5 },
  { label: 'POW', insert: 'POW(, )', caret: 4 },
  { label: 'FLOOR', insert: 'FLOOR()', caret: 6 },
  { label: 'CEIL', insert: 'CEIL()', caret: 5 },
  { label: 'MOD', insert: 'MOD(, )', caret: 4 },
  { label: 'BAREME', insert: 'BAREME("", )', caret: 8 },
];

interface FormulaInputProps {
  value: string;
  onChange: (v: string) => void;
  refs: string[]; // identifiants insérables (champs + variables)
  placeholder?: string;
  style?: React.CSSProperties;
}

export default function FormulaInput({ value, onChange, refs, placeholder, style }: FormulaInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  function insert(text: string, caretOffset?: number) {
    const el = inputRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + text + value.slice(end));
    // Restaurer focus + curseur après le re-render.
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + (caretOffset ?? text.length);
      el.setSelectionRange(pos, pos);
    });
  }

  const chipStyle: React.CSSProperties = { fontFamily: 'ui-monospace, monospace', fontSize: 12, padding: '3px 8px' };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          style={{ fontFamily: 'ui-monospace, monospace', ...style }}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className="icon" title={t('editor.formula.insert')} onClick={() => setOpen((o) => !o)}>ƒ</button>
      </div>
      {open && (
        <div
          className="card"
          style={{ position: 'absolute', zIndex: 5, top: '100%', right: 0, marginTop: 4, minWidth: 220, boxShadow: '0 4px 16px rgba(15,24,40,0.14)' }}
        >
          {refs.length > 0 ? (
            <>
              <div className="lbl">{t('editor.formula.refs')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {refs.map((r) => (
                  <button key={r} type="button" className="btn" style={chipStyle} onClick={() => insert(r)}>{r}</button>
                ))}
              </div>
            </>
          ) : (
            <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-secondary)' }}>{t('editor.formula.noRefs')}</p>
          )}
          <div className="lbl">{t('editor.formula.functions')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {FUNCTIONS.map((f) => (
              <button key={f.label} type="button" className="btn" style={{ fontSize: 12, padding: '3px 8px' }} onClick={() => insert(f.insert, f.caret)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
