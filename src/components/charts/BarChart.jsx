import { useState, useRef } from "react";

// Composant graphique SVG — barres verticales, empilées ou simples.
//
// bars: [{ label, segments: [{ value, color, label? }] }]
//   — Pour une barre simple : segments = [{ value, color }]
//   — Pour une barre empilée : segments = [{ value, color, label }, { value, color, label }]
// yFmt(v) → string
// exportMode: boolean — palette claire fixe pour PDF

const PAD = { top: 24, right: 16, bottom: 42, left: 60 };
const W = 560, H = 260;
const iW = W - PAD.left - PAD.right;
const iH = H - PAD.top - PAD.bottom;

const EX = {
  border: "#ddd6c8",
  textSec: "#7a6c52",
  textMain: "#1c1208",
  cardBg: "#ffffff",
};

export default function BarChart({
  bars = [],
  yFmt = (v) => String(v),
  exportMode = false,
  aria = "Graphique",
  height = "min(260px, 50vw)",
}) {
  const svgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  if (!bars.length) return null;

  const border   = exportMode ? EX.border   : "var(--border)";
  const textSec  = exportMode ? EX.textSec  : "var(--text-secondary)";
  const textMain = exportMode ? EX.textMain : "var(--text)";
  const cardBg   = exportMode ? EX.cardBg   : "var(--card-bg)";

  const maxVal = Math.max(...bars.map(b => b.segments.reduce((s, seg) => s + seg.value, 0)), 1);
  const yScale = (v) => (v / (maxVal * 1.1)) * iH;

  const barW = Math.min(56, (iW / bars.length) * 0.62);
  const barStep = iW / bars.length;

  const yTicks = [0.25, 0.5, 0.75, 1.0].map(f => ({
    val: maxVal * 1.1 * f,
    y: PAD.top + iH - yScale(maxVal * 1.1 * f),
  }));

  // Légende des segments (dédupliquée)
  const legendItems = [];
  const seenLabels = new Set();
  for (const bar of bars) {
    for (const seg of bar.segments) {
      if (seg.label && !seenLabels.has(seg.label)) {
        seenLabels.add(seg.label);
        legendItems.push({ label: seg.label, color: seg.color });
      }
    }
  }

  const getHoverIdx = (clientX) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const svgX = ((clientX - rect.left) / rect.width) * W;
    let best = null, bestD = Infinity;
    bars.forEach((_, i) => {
      const bx = PAD.left + i * barStep + barStep / 2;
      const d = Math.abs(svgX - bx);
      if (d < bestD) { bestD = d; best = i; }
    });
    return bestD < barStep * 0.7 ? best : null;
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height, display: "block", overflow: "visible", touchAction: "none" }}
      role="img"
      aria-label={aria}
      onMouseMove={e => setHoverIdx(getHoverIdx(e.clientX))}
      onMouseLeave={() => setHoverIdx(null)}
      onTouchMove={e => { e.preventDefault(); if (e.touches[0]) setHoverIdx(getHoverIdx(e.touches[0].clientX)); }}
      onTouchEnd={() => setHoverIdx(null)}
    >
      {/* Grille horizontale */}
      {yTicks.map((t, i) => (
        <line key={i} x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y}
          stroke={border} strokeWidth="0.5" />
      ))}

      {/* Labels axe Y */}
      {yTicks.map((t, i) => (
        <text key={i} x={PAD.left - 6} y={t.y + 4} textAnchor="end" fontSize="11"
          fill={textSec} fontFamily="DM Sans,sans-serif">
          {yFmt(t.val)}
        </text>
      ))}

      {/* Axes */}
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom}
        stroke={border} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom}
        stroke={border} strokeWidth="1" />

      {/* Barres */}
      {bars.map((bar, i) => {
        const bx = PAD.left + i * barStep + barStep / 2 - barW / 2;
        const isHover = hoverIdx === i;
        const total = bar.segments.reduce((s, seg) => s + seg.value, 0);
        let stackY = H - PAD.bottom;

        return (
          <g key={i}>
            {bar.segments.map((seg, j) => {
              const bh = yScale(seg.value);
              stackY -= bh;
              return (
                <rect key={j}
                  x={bx} y={stackY} width={barW} height={bh}
                  fill={seg.color}
                  opacity={isHover ? 1 : 0.85}
                  rx={j === bar.segments.length - 1 ? 4 : 0}
                  ry={j === bar.segments.length - 1 ? 4 : 0}
                  style={{ transition: "opacity 0.15s" }}
                />
              );
            })}

            {/* Label axe X */}
            <text x={bx + barW / 2} y={H - PAD.bottom + 15} textAnchor="middle" fontSize="12"
              fill={isHover ? "#b8934a" : textSec} fontFamily="DM Sans,sans-serif">
              {bar.label}
            </text>

            {/* Tooltip au survol */}
            {isHover && (() => {
              const lines = bar.segments.filter(s => s.value > 0).map(s => ({ label: s.label || "", value: yFmt(s.value), color: s.color }));
              if (!lines.length) return null;
              const TT_W = 150, TT_LINE = 18, TT_PAD = 10;
              const TT_H = TT_PAD * 2 + 16 + lines.length * TT_LINE;
              const cx = bx + barW / 2;
              const topY = H - PAD.bottom - yScale(total) - TT_H - 8;
              const boxX = Math.max(PAD.left, Math.min(W - PAD.right - TT_W, cx - TT_W / 2));
              const boxY = Math.max(PAD.top, topY);
              return (
                <g pointerEvents="none">
                  <rect x={boxX} y={boxY} width={TT_W} height={TT_H} rx="7"
                    fill={cardBg} stroke="#b8934a" strokeWidth="1" opacity="0.97" />
                  <text x={boxX + TT_PAD} y={boxY + TT_PAD + 12} fontSize="12" fontWeight="600"
                    fill={textMain} fontFamily="DM Sans,sans-serif">{yFmt(total)}</text>
                  {lines.map((l, li) => (
                    <g key={li}>
                      <circle cx={boxX + TT_PAD + 4} cy={boxY + TT_PAD + 14 + (li + 1) * TT_LINE}
                        r="3" fill={l.color} />
                      <text x={boxX + TT_PAD + 14}
                        y={boxY + TT_PAD + 14 + (li + 1) * TT_LINE + 5}
                        fontSize="11" fill={l.color} fontFamily="DM Sans,sans-serif">
                        {l.label ? `${l.label} : ${l.value}` : l.value}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* Légende */}
      {legendItems.length > 1 && legendItems.map((item, i) => (
        <g key={i} transform={`translate(${PAD.left + i * 130}, ${PAD.top - 11})`}>
          <circle cx="4" cy="-1" r="4" fill={item.color} opacity="0.9" />
          <text x="13" y="3" fontSize="12" fill={textSec} fontFamily="DM Sans,sans-serif">{item.label}</text>
        </g>
      ))}
    </svg>
  );
}
