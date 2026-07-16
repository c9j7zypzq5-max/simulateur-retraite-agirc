// Graphique SVG minimal — barres verticales/horizontales ou donut. Palette
// dérivée de la couleur primaire du thème client, aucune dépendance (budget
// < 100 ko de la page publique). Les valeurs sont affichées sur/à côté des
// barres pour une lecture immédiate (argument face aux embeds concurrents).

interface ChartProps {
  type: 'bars' | 'hbars' | 'donut';
  items: { label: string; value: number }[];
  primary: string;
  fmt: (v: number) => string;
}

// Déclinaisons d'opacité de la couleur primaire : lisible quel que soit le thème.
const OPACITIES = [1, 0.65, 0.4, 0.22];
const op = (i: number) => OPACITIES[i % OPACITIES.length];

export default function Chart({ type, items, primary, fmt }: ChartProps) {
  const valid = items.filter((i) => Number.isFinite(i.value) && i.value >= 0);
  if (valid.length === 0) return null;
  return (
    <div style={{ marginTop: 18 }}>
      {type === 'donut' && <Donut items={valid} primary={primary} fmt={fmt} />}
      {type === 'bars' && <Bars items={valid} primary={primary} fmt={fmt} />}
      {type === 'hbars' && <HBars items={valid} primary={primary} fmt={fmt} />}
      {/* Légende — inutile en barres horizontales (le libellé est déjà sur chaque barre). */}
      {type !== 'hbars' && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10, justifyContent: 'center' }}>
          {valid.map((it, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: primary, opacity: op(i) }} />
              {it.label} · {fmt(it.value)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Bars({ items, primary, fmt }: Omit<ChartProps, 'type'>) {
  const W = 320;
  const H = 160;
  const TOP = 20; // réserve pour les étiquettes de valeur au-dessus des barres
  const max = Math.max(...items.map((i) => i.value), 1);
  const step = W / items.length;
  const barW = Math.min(64, step * 0.6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }} role="img" aria-label={items.map((i) => `${i.label} : ${fmt(i.value)}`).join(', ')}>
      {items.map((it, i) => {
        const h = (it.value / max) * (H - TOP - 4);
        const x = step * i + step / 2;
        const y = H - h;
        return (
          <g key={i}>
            <rect x={x - barW / 2} y={y} width={barW} height={h} rx={4} fill={primary} opacity={op(i)} />
            <text x={x} y={y - 5} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">
              {fmt(it.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Barres horizontales : idéales quand les libellés sont longs (ils tiennent
// à gauche de chaque barre).
function HBars({ items, primary, fmt }: Omit<ChartProps, 'type'>) {
  const rowH = 34;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440, margin: '0 auto' }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
            <span>{it.label}</span>
            <span style={{ fontWeight: 600 }}>{fmt(it.value)}</span>
          </div>
          <div style={{ height: rowH - 20, borderRadius: 4, background: 'color-mix(in srgb, currentColor 8%, transparent)' }}>
            <div
              style={{
                width: `${(it.value / max) * 100}%`,
                height: '100%',
                borderRadius: 4,
                background: primary,
                opacity: op(i),
                minWidth: 2,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Donut({ items, primary, fmt }: Omit<ChartProps, 'type'>) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" style={{ width: 150, display: 'block', margin: '0 auto' }} role="img" aria-label={items.map((i) => `${i.label} : ${fmt(i.value)}`).join(', ')}>
      {items.map((it, i) => {
        const frac = it.value / total;
        const seg = (
          <circle
            key={i}
            cx={70}
            cy={70}
            r={R}
            fill="none"
            stroke={primary}
            opacity={op(i)}
            strokeWidth={22}
            strokeDasharray={`${frac * C} ${C}`}
            strokeDashoffset={-offset * C}
            transform="rotate(-90 70 70)"
          />
        );
        offset += frac;
        return seg;
      })}
    </svg>
  );
}
