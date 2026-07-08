import type { Theme } from '../../schema/types';
import { t } from '../../i18n';

const COLOR_KEYS = ['primary', 'background', 'text'] as const;

export default function ThemePanel({ theme, onChange }: { theme: Theme; onChange: (p: Partial<Theme>) => void }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {COLOR_KEYS.map((k) => (
          <label key={k} style={{ flex: 1 }}>
            <span className="lbl">{t(`editor.theme.${k}`)}</span>
            <input
              type="color"
              value={theme[k]}
              onChange={(e) => onChange({ [k]: e.target.value })}
              style={{ width: '100%', height: 36, padding: 2, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', cursor: 'pointer' }}
            />
          </label>
        ))}
      </div>
      <label>
        <span className="lbl">{t('editor.theme.logoUrl')}</span>
        <input
          type="url"
          placeholder="https://…"
          value={theme.logoUrl ?? ''}
          onChange={(e) => onChange({ logoUrl: e.target.value || undefined })}
        />
      </label>
      {/* Police custom : Premium uniquement — volontairement absent au Lot 1. */}
    </div>
  );
}
