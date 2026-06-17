import { useState, useRef, useCallback } from "react";

function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOut(t)   { return 1 - Math.pow(1 - t, 3); }

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function fmtK(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} M€`;
  if (v >= 1_000)     return `${Math.round(v / 1000)} k€`;
  return `${Math.round(v)} €`;
}

// ─── Rendu d'une frame sur canvas 720×1280 ────────────────────────────────────
// chartData: [{t: number (years), value: number}]  — monthly resolution recommended
// targetValue: optional horizontal cible line
// metrics: [{label, value (string)}]
// ageActuel: optional — if provided, X axis shows "age" labels instead of "year N"
function drawFrame(ctx, {
  t,
  simulatorName,
  emoji,
  chartData,
  targetValue,
  metrics,
  color = '#b8934a',
  ageActuel,
}) {
  const W = 720, H = 1280;
  const pts = chartData || [];

  // ── Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#060e1c');
  bg.addColorStop(0.6, '#0e1e3a');
  bg.addColorStop(1, '#0b1528');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Grille décorative
  ctx.strokeStyle = `rgba(${hexToRgb(color)},0.05)`;
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // ────────────────────────────────────
  // Phase 1 : intro (t 0→0.12)
  // ────────────────────────────────────
  const intro = Math.min(1, t / 0.12);
  ctx.globalAlpha = easeOut(intro);

  // Badge simulateur
  const badgeX = W / 2, badgeY = 140;
  ctx.fillStyle = `rgba(${hexToRgb(color)},0.15)`;
  roundRect(ctx, badgeX - 170, badgeY - 22, 340, 44, 22);
  ctx.fill();
  ctx.strokeStyle = `rgba(${hexToRgb(color)},0.5)`;
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX - 170, badgeY - 22, 340, 44, 22);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = 'bold 17px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${emoji}  ${simulatorName}`, badgeX, badgeY + 7);

  // Titre
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px DM Sans, sans-serif';
  ctx.fillText('Ma simulation', W / 2, 240);
  ctx.font = 'bold 50px DM Sans, sans-serif';
  ctx.fillStyle = color;
  ctx.fillText('simfinly.com', W / 2, 306);

  ctx.globalAlpha = 1;

  // ────────────────────────────────────
  // Phase 2 : courbe animée (t 0.10→0.80)
  // ────────────────────────────────────
  const chartPhase    = Math.max(0, Math.min(1, (t - 0.10) / 0.70));
  const chartProgress = easeInOut(chartPhase);

  const chartX = 60, chartY = 380, chartW = W - 120, chartH = 460;

  if (pts.length >= 2) {
    const maxIdx      = Math.max(1, Math.floor(chartProgress * (pts.length - 1)));
    const visiblePts  = pts.slice(0, maxIdx + 1);

    // ── Y scale : dynamique selon les points visibles (+ cible si déjà visible)
    const visibleMax  = Math.max(...visiblePts.map(d => d.value), 1);
    const scaleTarget = (targetValue && targetValue < visibleMax * 2) ? targetValue : 0;
    const rawMax      = Math.max(visibleMax, scaleTarget);
    const maxP        = rawMax * 1.18; // 18 % d'espace au dessus

    const maxT = pts[pts.length - 1]?.t || 1;
    const cx = tt => chartX + (tt / maxT) * chartW;
    const cy = p  => chartY + chartH - (p / maxP)  * chartH;

    // Ligne cible
    if (targetValue) {
      const cyTarget = cy(targetValue);
      if (cyTarget >= chartY && cyTarget <= chartY + chartH) {
        ctx.globalAlpha = Math.min(1, chartPhase * 3) * 0.5;
        ctx.strokeStyle = color;
        ctx.setLineDash([6, 5]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(chartX, cyTarget);
        ctx.lineTo(chartX + chartW, cyTarget);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = Math.min(1, chartPhase * 3) * 0.8;
        ctx.fillStyle = color;
        ctx.font = '13px DM Sans, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(fmtK(targetValue), chartX + chartW, cyTarget - 6);
        ctx.globalAlpha = 1;
      }
    }

    // Aire
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx(pts[0].t), chartY + chartH);
    visiblePts.forEach(d => ctx.lineTo(cx(d.t), cy(d.value)));
    ctx.lineTo(cx(visiblePts[visiblePts.length - 1].t), chartY + chartH);
    ctx.closePath();
    ctx.fill();

    // Ligne
    ctx.globalAlpha = 1;
    const grad = ctx.createLinearGradient(chartX, 0, chartX + chartW, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, lightenHex(color, 0.3));
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    visiblePts.forEach((d, i) => i === 0 ? ctx.moveTo(cx(d.t), cy(d.value)) : ctx.lineTo(cx(d.t), cy(d.value)));
    ctx.stroke();

    // Point animé
    const last  = visiblePts[visiblePts.length - 1];
    const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 12);
    ctx.fillStyle = `rgba(${hexToRgb(color)},${0.15 + 0.1 * pulse})`;
    ctx.beginPath();
    ctx.arc(cx(last.t), cy(last.value), 14 + 4 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = lightenHex(color, 0.25);
    ctx.beginPath();
    ctx.arc(cx(last.t), cy(last.value), 6, 0, Math.PI * 2);
    ctx.fill();

    // Compteur valeur courante
    ctx.fillStyle = lightenHex(color, 0.2);
    ctx.font = 'bold 30px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(fmtK(last.value), chartX + chartW, chartY + chartH + 36);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px DM Sans, sans-serif';
    ctx.fillText('Valeur projetée', chartX + chartW, chartY + chartH + 56);

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartX, chartY); ctx.lineTo(chartX, chartY + chartH);
    ctx.moveTo(chartX, chartY + chartH); ctx.lineTo(chartX + chartW, chartY + chartH);
    ctx.stroke();

    // Labels axe X (temps / âge)
    const step = Math.ceil(maxT / 4);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    for (let tt = 0; tt <= maxT; tt += step) {
      const label = ageActuel != null ? `${Math.round(ageActuel + tt)} ans` : `${Math.round(tt)} ans`;
      ctx.fillText(label, cx(tt), chartY + chartH + 20);
    }

    // Ticks axe Y (scale dynamique)
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.textAlign = 'left';
    for (const f of [0.25, 0.5, 0.75]) {
      const val = maxP * f;
      const yy  = cy(val);
      ctx.fillText(fmtK(val), chartX + 4, yy - 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartX, yy);
      ctx.lineTo(chartX + chartW, yy);
      ctx.stroke();
    }
  }

  // ────────────────────────────────────
  // Phase 3 : métriques (t 0.75→0.92)
  // ────────────────────────────────────
  const metricsPhase = Math.max(0, Math.min(1, (t - 0.75) / 0.17));
  ctx.globalAlpha = easeOut(metricsPhase);

  const metY    = 920;
  const cols    = Math.min(metrics.length, 2);
  const cardW   = (W - 120 - (cols - 1) * 12) / cols;

  (metrics || []).slice(0, 4).forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const mx  = 60 + col * (cardW + 12);
    const my  = metY + row * 90;
    const cw  = i === metrics.length - 1 && metrics.length % 2 !== 0 ? W - 120 : cardW;

    ctx.fillStyle = `rgba(${hexToRgb(color)},0.08)`;
    roundRect(ctx, mx, my, cw, 76, 14);
    ctx.fill();
    ctx.strokeStyle = `rgba(${hexToRgb(color)},0.3)`;
    ctx.lineWidth = 1;
    roundRect(ctx, mx, my, cw, 76, 14);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '12px DM Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(m.label.toUpperCase(), mx + 16, my + 24);
    ctx.fillStyle = lightenHex(color, 0.2);
    ctx.font = 'bold 22px DM Sans, sans-serif';
    ctx.fillText(m.value, mx + 16, my + 56);
  });

  ctx.globalAlpha = 1;

  // ────────────────────────────────────
  // Phase 4 : CTA (t 0.90→1)
  // ────────────────────────────────────
  const ctaPhase = Math.max(0, Math.min(1, (t - 0.90) / 0.10));
  ctx.globalAlpha = easeOut(ctaPhase);

  ctx.strokeStyle = `rgba(${hexToRgb(color)},0.25)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, H - 120); ctx.lineTo(W - 60, H - 120);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = 'bold 28px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('simfinly.com', W / 2, H - 80);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '16px DM Sans, sans-serif';
  ctx.fillText('Calculs gratuits · Sans inscription · 100 % confidentiel', W / 2, H - 50);

  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
}

// ─── Utilitaires couleur ───────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

function lightenHex(hex, amount) {
  const h = hex.replace('#', '');
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + Math.round(255 * amount));
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + Math.round(255 * amount));
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ─── Composant principal ──────────────────────────────────────────────────────
// Props:
//   simulatorName  string             — "Indépendance financière FIRE"
//   emoji          string             — "🔥"
//   chartData      [{t, value}]       — points mensuels (t = années décimales)
//   targetValue    number|null        — ligne cible optionnelle
//   metrics        [{label, value}]   — 2-4 métriques clés
//   color          string             — couleur accent (défaut or)
//   ageActuel      number|null        — si fourni, axe X affiche l'âge
//   disabled       boolean
export default function VideoExport({
  simulatorName = 'Simulation',
  emoji = '📊',
  chartData,
  targetValue,
  metrics = [],
  color = '#b8934a',
  ageActuel,
  disabled,
}) {
  const canvasRef = useRef(null);
  const recRef    = useRef(null);
  const rafRef    = useRef(null);
  const chunksRef = useRef([]);

  const [state, setState] = useState('idle');

  const stopAll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
  }, []);

  const startRecording = useCallback(async () => {
    if (!canvasRef.current || disabled) return;
    setState('recording');
    chunksRef.current = [];

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const stream = canvas.captureStream(30);

    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
    recRef.current = rec;

    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      setState('processing');
      const blob = new Blob(chunksRef.current, { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `simulation-${simulatorName.toLowerCase().replace(/\s+/g, '-')}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setState('idle');
    };

    rec.start();

    const DURATION = 7000;
    const start    = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const tt      = Math.min(elapsed / DURATION, 1);

      drawFrame(ctx, { t: tt, simulatorName, emoji, chartData, targetValue, metrics, color, ageActuel });

      if (tt < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rec.stop();
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [disabled, simulatorName, emoji, chartData, targetValue, metrics, color, ageActuel]);

  const isSupported = typeof MediaRecorder !== 'undefined';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <canvas ref={canvasRef} width={720} height={1280} style={{ display: 'none' }} />

      {isSupported && (
        <button
          onClick={state === 'recording' ? stopAll : startRecording}
          disabled={state === 'processing' || disabled}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px',
            background: state === 'recording' ? 'rgba(239,68,68,0.12)' : 'var(--card-bg)',
            border: `1px solid ${state === 'recording' ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
            borderRadius: 10,
            color: state === 'recording' ? '#ef4444' : 'var(--text-secondary)',
            fontSize: 12, fontFamily: "'DM Sans', sans-serif",
            cursor: state === 'processing' ? 'wait' : 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (state === 'idle') { e.currentTarget.style.borderColor = 'var(--gold-mid)'; e.currentTarget.style.color = 'var(--gold)'; } }}
          onMouseLeave={e => { if (state === 'idle') { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
        >
          {state === 'recording' && <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />}
          {state === 'processing' ? '⏳ Génération…' :
           state === 'recording'  ? '⏹ Arrêter'      :
           '🎬 Reel'}
        </button>
      )}

      {state === 'idle' && isSupported && !disabled && (
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
          9:16 · Reels / Stories
        </span>
      )}
    </div>
  );
}
