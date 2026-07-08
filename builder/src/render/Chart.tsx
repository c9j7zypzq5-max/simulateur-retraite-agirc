// Graphique SVG minimal — barres ou donut. Palette dérivée de la couleur
// primaire du thème client, aucune dépendance (budget < 100 ko de la page
// publique).

interface ChartProps {
  type: 'bars' | 'donut';
  items: { label: string; value: number }[];
  primary: string;
  fmt: (v: number) => string;
}

// Déclinaisons d'opacité de la couleur primaire : lisible quel que soit le thème.
const OPACITIES = [1, 0.65, 0.4, 0.22];

export default function Chart({ type, items, primary, fmt }: ChartProps) {
  const valid = items.filter((i) => Number.isFinite(i.value) && i.value >= 0);
  if (valid.length === 0) return null;
  return (
    <div style={{ marginTop: 18 }}>
      {type === 'bars' ? (
        <Bars items={valid} primary={primary} fmt={fmt} />
      ) : (
        <Donut items={valid} primary={primary} fmt={fmt} />
      )}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10, justifyContent: 'center' }}>
        {valid.map((it, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: primary, opacity: OPACITIES[i % OPACITIES.length] }} />
            {it.label} · {fmt(it.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

function Bars({ items, primary, fmt }: Omit<ChartProps, 'type'>) {
  const W = 320;
  const H = 140;
  const max = Math.max(...items.map((i) => i.value), 1);
  const step = W / items.length;
  const barW = Math.min(64, step * 0.6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }} role="img" aria-label={items.map((i) => `${i.label} : ${fmt(i.value)}`).join(', ')}>
      {items.map((it, i) => {
        const h = (it.value / max) * (H - 8);
        return (
          <rect
            key={i}
            x={step * i + (step - barW) / 2}
            y={H - h}
            width={barW}
            height={h}
            rx={4}
            fill={primary}
            opacity={OPACITIES[i % OPACITIES.length]}
          />
        );
      })}
    </svg>
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
            opacity={OPACITIES[i % OPACITIES.length]}
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
