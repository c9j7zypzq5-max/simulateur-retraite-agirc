import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const CATEGORY_COLORS = {
  'Retraite':   '#818cf8',
  'Immobilier': '#a855f7',
  'Impôts':     '#f97316',
  'Finances':   '#22c55e',
  'FIRE':       '#ef4444',
  'Budget':     '#14b8a6',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title    = searchParams.get('title')   || 'mesimulateurs.fr';
  const emoji    = searchParams.get('emoji')   || '📊';
  const category = searchParams.get('cat')     || '';
  const result   = searchParams.get('result')  || '';
  const catColor = CATEGORY_COLORS[category]   || '#b8934a';

  return new ImageResponse(
    <div
      style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #060e1c 0%, #0e1e3a 60%, #0b1528 100%)',
        padding: '60px 64px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Barres décoratives */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 80, opacity: 0.35 }}>
        {[40, 55, 70, 50, 80, 65, 90].map((h, i) => (
          <div key={i} style={{ width: 22, height: h, background: '#b8934a', borderRadius: 4 }} />
        ))}
      </div>

      {/* Corps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Badge catégorie */}
        {category && (
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: `${catColor}22`, border: `1px solid ${catColor}66`,
            borderRadius: 20, padding: '6px 20px',
            color: catColor, fontSize: 18, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            width: 'fit-content',
          }}>
            {category}
          </div>
        )}

        {/* Emoji + Titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 80 }}>{emoji}</span>
          <div style={{
            fontSize: 62, fontWeight: 700, color: '#fff',
            lineHeight: 1.1, maxWidth: 780,
          }}>
            {title}
          </div>
        </div>

        {/* Résultat mis en avant si présent */}
        {result && (
          <div style={{
            fontSize: 48, fontWeight: 700,
            background: 'linear-gradient(90deg, #b8934a, #e8c06a)',
            backgroundClip: 'text', color: 'transparent',
          }}>
            {result}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{
          fontSize: 28, fontWeight: 700, color: '#b8934a', letterSpacing: '0.02em',
        }}>
          mesimulateurs.fr
        </div>
        <div style={{
          fontSize: 18, color: '#64748b', letterSpacing: '0.06em',
        }}>
          Gratuit · Sans inscription · 100 % local
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
