import { useState, useRef, useMemo } from "react";

// Composant graphique générique SVG — courbe(s) + aire optionnelle + tooltip + grille.
//
// series: [{ id, label, points: [{x, y}], color, fillColor?, strokeWidth?, dashed? }]
// xFmt(v) → string    : formatteur pour l'axe X (ex. "(v) => `Année ${v}`")
// yFmt(v) → string    : formatteur pour l'axe Y (ex. "(v) => `${(v/1000).toFixed(0)}k€`")
// annotations: [{ x?, y?, label?, color?, dashed? }] — lignes de référence
// exportMode: boolean — palette claire fixe (pour capture PDF, sans CSS vars)

const PAD = { top: 26, right: 52, bottom: 38, left: 68 };
const W = 600, H = 300;
const iW = W - PAD.left - PAD.right;
const iH = H - PAD.top - PAD.bottom;

// Palette claire fixe pour le mode export (capture PDF).
const EX = {
  border: "#ddd6c8",
  textSec: "#7a6c52",
  textMain: "#1c1208",
  cardBg: "#ffffff",
  borderGold: "var(--primary)",
};

export default function LineAreaChart({
  series = [],
  xFmt = (v) => String(v),
  yFmt = (v) => String(v),
  annotations = [],
  exportMode = false,
  aria = "Graphique",
  height = "min(300px, 55vw)",
}) {
  const svgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  const allPts = useMemo(() => series.flatMap(s => s.points), [series]);
  const maxX = useMemo(() => Math.max(...allPts.map(p => p.x), 1), [allPts]);
  const maxY = useMemo(() => {
    const dataMax = Math.max(...allPts.map(p => p.y), ...annotations.filter(a => a.y != null).map(a => a.y), 1);
    return dataMax * 1.1;
  }, [allPts, annotations]);

  if (!allPts.length || !series.length || !series[0].points.length) return null;

  const cx = (v) => PAD.left + (v / maxX) * iW;
  const cy = (v) => PAD.top + iH - (v / maxY) * iH;

  // Lignes de grille horizontales (4 paliers)
  const yTicks = [0.25, 0.5, 0.75, 1.0].map(f => ({ val: maxY * f, yv: cy(maxY * f) }));

  // Labels axe X (max 6 points)
  const basePts = series[0].points;
  const xStep = Math.max(1, Math.ceil(basePts.length / 6));
  const xTicks = basePts.filter((_, i) => i % xStep === 0 || i === basePts.length - 1);

  // Données de tracé par série
  const seriesData = series.map(s => {
    const pts = s.points.map(p => `${cx(p.x).toFixed(1)},${cy(p.y).toFixed(1)}`).join(" ");
    const first = s.points[0], last = s.points[s.points.length - 1];
    const fillPts = s.points.length > 1
      ? `${cx(first.x).toFixed(1)},${(H - PAD.bottom).toFixed(1)} ${pts} ${cx(last.x).toFixed(1)},${(H - PAD.bottom).toFixed(1)}`
      : "";
    return { ...s, pts, fillPts };
  });

  // Clé d'animation : change si les données changent
  const animKey = useMemo(() => `${series.map(s => s.points.length + "_" + Math.round(s.points[s.points.length - 1]?.y ?? 0)).join("__")}`, [series]);

  // Hover : index le plus proche du curseur
  const getIdx = (clientX) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return null;
    const svgX = ((clientX - rect.left) / rect.width) * W;
    const clamped = Math.max(PAD.left, Math.min(W - PAD.right, svgX));
    const xVal = ((clamped - PAD.left) / iW) * maxX;
    let best = 0, bestD = Infinity;
    basePts.forEach((p, i) => { const d = Math.abs(p.x - xVal); if (d < bestD) { bestD = d; best = i; } });
    return best;
  };

  // Tooltip
  const TT_W = 164, TT_LINE = 18, TT_PAD = 10;
  const tooltipLines = hoverIdx != null ? series.map(s => ({
    color: s.color,
    value: yFmt(s.points[hoverIdx]?.y ?? 0),
    label: s.label,
  })) : [];
  const TT_H = TT_PAD * 2 + 16 + tooltipLines.length * TT_LINE;

  const hoverXVal = hoverIdx != null ? basePts[hoverIdx]?.x : null;
  const hxCoord = hoverXVal != null ? cx(hoverXVal) : null;

  // Variables CSS vs palette d'export
  const border   = exportMode ? EX.border   : "var(--border)";
  const textSec  = exportMode ? EX.textSec  : "var(--text-secondary)";
  const textMain = exportMode ? EX.textMain : "var(--text)";
  const cardBg   = exportMode ? EX.cardBg   : "var(--card-bg)";
  const bordG    = exportMode ? EX.borderGold : "var(--border-gold)";

  const css = `
    @keyframes la_draw_${animKey}{from{stroke-dashoffset:2000}to{stroke-dashoffset:0}}
    @keyframes la_fade_${animKey}{from{opacity:0}to{opacity:1}}
    .la_line_${animKey}{stroke-dasharray:2000;stroke-dashoffset:2000;animation:la_draw_${animKey} 1.4s ease-out forwards}
    .la_area_${animKey}{opacity:0;animation:la_fade_${animKey} 1.2s ease-out .3s forwards}
  `;

  return (
    <svg
      key={animKey}
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height, display: "block", overflow: "visible", touchAction: "none" }}
      role="img"
      aria-label={aria}
      onMouseMove={e => setHoverIdx(getIdx(e.clientX))}
      onMouseLeave={() => setHoverIdx(null)}
      onTouchMove={e => { e.preventDefault(); if (e.touches[0]) setHoverIdx(getIdx(e.touches[0].clientX)); }}
      onTouchEnd={() => setHoverIdx(null)}
    >
      <defs><style>{css}</style></defs>

      {/* Grille horizontale */}
      {yTicks.map((t, i) => (
        <line key={i} x1={PAD.left} y1={t.yv} x2={W - PAD.right} y2={t.yv}
          stroke={border} strokeWidth="0.5" />
      ))}

      {/* Lignes de référence (annotations) */}
      {annotations.map((a, i) => (
        <g key={i}>
          {a.y != null && (
            <>
              <line x1={PAD.left} y1={cy(a.y)} x2={W - PAD.right} y2={cy(a.y)}
                stroke={a.color || "var(--gold)"} strokeWidth="1.5"
                strokeDasharray={a.dashed !== false ? "5,4" : undefined} opacity="0.6" />
              {a.label && (
                <text x={W - PAD.right + 4} y={cy(a.y) + 4} fontSize="11"
                  fill={a.color || "var(--gold)"} fontFamily="Hanken Grotesk,sans-serif" opacity="0.85">
                  {a.label}
                </text>
              )}
            </>
          )}
          {a.x != null && (
            <line x1={cx(a.x)} y1={PAD.top} x2={cx(a.x)} y2={H - PAD.bottom}
              stroke={a.color || "var(--gold)"} strokeWidth="1.5"
              strokeDasharray={a.dashed !== false ? "4,3" : undefined} opacity="0.55" />
          )}
        </g>
      ))}

      {/* Aires */}
      {seriesData.map((s, i) => s.fillColor !== false && s.fillPts && (
        <polygon key={`fill-${i}`}
          className={`la_area_${animKey}`}
          points={s.fillPts}
          fill={s.fillColor ?? (exportMode ? `${s.color}30` : `${s.color}26`)}
        />
      ))}

      {/* Courbes */}
      {seriesData.map((s, i) => (
        <polyline key={`line-${i}`}
          className={`la_line_${animKey}`}
          points={s.pts}
          fill="none"
          stroke={s.color}
          strokeWidth={s.strokeWidth ?? 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={s.dashed ? "6,4" : undefined}
          pathLength="2000"
        />
      ))}

      {/* Axes */}
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom}
        stroke={border} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom}
        stroke={border} strokeWidth="1" />

      {/* Labels axe X */}
      {xTicks.map((p, i) => (
        <text key={i} x={cx(p.x)} y={H - 6} textAnchor="middle" fontSize="12"
          fill={textSec} fontFamily="Hanken Grotesk,sans-serif">
          {xFmt(p.x)}
        </text>
      ))}

      {/* Labels axe Y */}
      {yTicks.map((t, i) => (
        <text key={i} x={PAD.left - 6} y={t.yv + 4} textAnchor="end" fontSize="12"
          fill={textSec} fontFamily="Hanken Grotesk,sans-serif">
          {yFmt(t.val)}
        </text>
      ))}

      {/* Légende (si plusieurs séries) */}
      {series.length > 1 && series.map((s, i) => (
        <g key={`leg-${i}`} transform={`translate(${PAD.left + i * 120},${PAD.top - 11})`}>
          <circle cx="4" cy="-1" r="4" fill={s.color} opacity="0.9" />
          <text x="13" y="3" fontSize="12" fill={textSec} fontFamily="Hanken Grotesk,sans-serif">{s.label}</text>
        </g>
      ))}

      {/* Point de départ */}
      {series[0].points[0] && (
        <circle cx={cx(series[0].points[0].x)} cy={cy(series[0].points[0].y)}
          r="3.5" fill={series[0].color} opacity="0.7" />
      )}
      {/* Point final */}
      {series[0].points.length > 1 && (
        <circle cx={cx(series[0].points[series[0].points.length - 1].x)}
          cy={cy(series[0].points[series[0].points.length - 1].y)}
          r="4" fill={series[0].color} />
      )}

      {/* Crosshair + tooltip au survol */}
      {hoverIdx != null && hxCoord != null && (() => {
        const flip = hxCoord > W / 2;
        let boxX = flip ? hxCoord - TT_W - 12 : hxCoord + 12;
        boxX = Math.max(PAD.left, Math.min(W - PAD.right - TT_W, boxX));
        const mainY = cy(series[0].points[hoverIdx]?.y ?? 0);
        const boxY = Math.max(PAD.top, Math.min(H - PAD.bottom - TT_H, mainY - TT_H - 8));
        return (
          <g pointerEvents="none">
            <line x1={hxCoord} y1={PAD.top} x2={hxCoord} y2={H - PAD.bottom}
              stroke={exportMode ? "#00000020" : "rgba(255,255,255,0.18)"} strokeWidth="1" />
            {seriesData.map((s, i) => (
              <circle key={i} cx={hxCoord} cy={cy(s.points[hoverIdx]?.y ?? 0)}
                r="4.5" fill={s.color} stroke={cardBg} strokeWidth="1.5" />
            ))}
            <rect x={boxX} y={boxY} width={TT_W} height={TT_H} rx="7"
              fill={cardBg} stroke={bordG} strokeWidth="1" opacity="0.97" />
            <text x={boxX + TT_PAD} y={boxY + TT_PAD + 12} fontSize="12" fontWeight="600"
              fill={textMain} fontFamily="Hanken Grotesk,sans-serif">
              {xFmt(hoverXVal)}
            </text>
            {tooltipLines.map((l, i) => (
              <g key={i}>
                <circle cx={boxX + TT_PAD + 4} cy={boxY + TT_PAD + 14 + (i + 1) * TT_LINE}
                  r="3" fill={l.color} />
                <text x={boxX + TT_PAD + 14}
                  y={boxY + TT_PAD + 14 + (i + 1) * TT_LINE + 5}
                  fontSize="12" fill={l.color} fontFamily="Hanken Grotesk,sans-serif">
                  {l.value}
                </text>
              </g>
            ))}
          </g>
        );
      })()}
    </svg>
  );
}
