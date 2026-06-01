import { useState, useRef, useCallback } from "react";

// Formate un nombre en k€ / M€ pour le canvas
function fmtK(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')} M€`;
  if (v >= 1_000)     return `${Math.round(v / 1000)} k€`;
  return `${Math.round(v)} €`;
}

// Easing
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOut(t)   { return 1 - Math.pow(1 - t, 3); }

// ─── Rendu d'une frame sur canvas 720×1280 ────────────────────────────────────
function drawFrame(ctx, { t, projectionData, patrimoineCible, ageAtteinte, revenuMensuel, ageActuel }) {
  const W = 720, H = 1280;

  // ── Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#060e1c');
  bg.addColorStop(0.6, '#0e1e3a');
  bg.addColorStop(1, '#0b1528');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Grille décorative subtile
  ctx.strokeStyle = 'rgba(184,147,74,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // ────────────────────────────────────────────────────
  // Phase 1 : intro (t 0→0.12)
  // ────────────────────────────────────────────────────
  const intro = Math.min(1, t / 0.12);
  const introAlpha = easeOut(intro);

  // Badge "FIRE · Indépendance financière"
  ctx.globalAlpha = introAlpha;
  const badgeX = W / 2, badgeY = 140;
  ctx.fillStyle = 'rgba(239,68,68,0.15)';
  roundRect(ctx, badgeX - 160, badgeY - 22, 320, 44, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(239,68,68,0.5)';
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX - 160, badgeY - 22, 320, 44, 22);
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 18px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔥  Indépendance financière', badgeX, badgeY + 7);

  // Titre
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px DM Sans, sans-serif';
  ctx.fillText('Mon chemin vers', W / 2, 240);
  ctx.font = 'bold 52px DM Sans, sans-serif';
  ctx.fillStyle = '#b8934a';
  ctx.fillText('le FIRE', W / 2, 306);

  ctx.globalAlpha = 1;

  // ────────────────────────────────────────────────────
  // Phase 2 : courbe animée (t 0.10→0.80)
  // ────────────────────────────────────────────────────
  const chartPhase = Math.max(0, Math.min(1, (t - 0.10) / 0.70));
  const chartProgress = easeInOut(chartPhase);

  const chartX = 60, chartY = 380, chartW = W - 120, chartH = 480;
  const pts = projectionData || [];
  if (pts.length >= 2) {
    const maxP = Math.max(...pts.map(d => d.patrimoine), patrimoineCible || 0) * 1.08;
    const maxA = pts[pts.length - 1].annee || 1;

    const cx = a => chartX + (a / maxA) * chartW;
    const cy = p => chartY + chartH - (p / maxP) * chartH;

    // Ligne cible
    if (patrimoineCible) {
      ctx.globalAlpha = Math.min(1, chartPhase * 3) * 0.5;
      ctx.strokeStyle = '#b8934a';
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chartX, cy(patrimoineCible));
      ctx.lineTo(chartX + chartW, cy(patrimoineCible));
      ctx.stroke();
      ctx.setLineDash([]);

      // Label cible
      ctx.globalAlpha = Math.min(1, chartPhase * 3) * 0.8;
      ctx.fillStyle = '#b8934a';
      ctx.font = '13px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(fmtK(patrimoineCible), chartX + chartW, cy(patrimoineCible) - 6);
      ctx.globalAlpha = 1;
    }

    // Nombre de points à dessiner selon progression
    const maxIdx = Math.max(1, Math.floor(chartProgress * (pts.length - 1)));
    const visiblePts = pts.slice(0, maxIdx + 1);

    // Aire
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#b8934a';
    ctx.beginPath();
    ctx.moveTo(cx(pts[0].annee), chartY + chartH);
    visiblePts.forEach(d => ctx.lineTo(cx(d.annee), cy(d.patrimoine)));
    ctx.lineTo(cx(visiblePts[visiblePts.length - 1].annee), chartY + chartH);
    ctx.closePath();
    ctx.fill();

    // Ligne
    ctx.globalAlpha = 1;
    const grad = ctx.createLinearGradient(chartX, 0, chartX + chartW, 0);
    grad.addColorStop(0, '#b8934a');
    grad.addColorStop(1, '#e8c06a');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    visiblePts.forEach((d, i) => i === 0 ? ctx.moveTo(cx(d.annee), cy(d.patrimoine)) : ctx.lineTo(cx(d.annee), cy(d.patrimoine)));
    ctx.stroke();

    // Point animé en bout de ligne
    const last = visiblePts[visiblePts.length - 1];
    const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 12);
    ctx.fillStyle = `rgba(184,147,74,${0.15 + 0.1 * pulse})`;
    ctx.beginPath();
    ctx.arc(cx(last.annee), cy(last.patrimoine), 14 + 4 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8c06a';
    ctx.beginPath();
    ctx.arc(cx(last.annee), cy(last.patrimoine), 6, 0, Math.PI * 2);
    ctx.fill();

    // Compteur patrimoine actuel
    const currentPat = last.patrimoine;
    ctx.fillStyle = '#e8c06a';
    ctx.font = 'bold 30px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(fmtK(currentPat), chartX + chartW, chartY + chartH + 36);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px DM Sans, sans-serif';
    ctx.fillText('Patrimoine projeté', chartX + chartW, chartY + chartH + 56);

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartX, chartY); ctx.lineTo(chartX, chartY + chartH);
    ctx.moveTo(chartX, chartY + chartH); ctx.lineTo(chartX + chartW, chartY + chartH);
    ctx.stroke();

    // Labels âge axe X
    const ageStep = Math.ceil(maxA / 4);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    for (let a = 0; a <= maxA; a += ageStep) {
      const age = (ageActuel || 30) + a;
      ctx.fillText(`${age} ans`, cx(a), chartY + chartH + 20);
    }
  }

  // ────────────────────────────────────────────────────
  // Phase 3 : métriques finales (t 0.75→0.92)
  // ────────────────────────────────────────────────────
  const metricsPhase = Math.max(0, Math.min(1, (t - 0.75) / 0.17));
  const metricsAlpha = easeOut(metricsPhase);

  ctx.globalAlpha = metricsAlpha;
  const metrics = [
    { label: 'Âge FIRE',        value: ageAtteinte ? `${ageAtteinte} ans` : '—' },
    { label: 'Capital cible',   value: fmtK(patrimoineCible || 0) },
    { label: 'Revenu passif/mois', value: fmtK(revenuMensuel || 0) },
  ];
  const metY = 910;
  metrics.forEach((m, i) => {
    const mx = 60 + (i % 2) * (W / 2 - 40);
    const my = metY + Math.floor(i / 2) * 90;

    ctx.fillStyle = 'rgba(184,147,74,0.08)';
    roundRect(ctx, mx, my, W / 2 - 76, 76, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(184,147,74,0.3)';
    ctx.lineWidth = 1;
    roundRect(ctx, mx, my, W / 2 - 76, 76, 14);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '12px DM Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(m.label.toUpperCase(), mx + 16, my + 24);
    ctx.fillStyle = '#e8c06a';
    ctx.font = 'bold 22px DM Sans, sans-serif';
    ctx.fillText(m.value, mx + 16, my + 56);
  });

  // Métrique large si impair
  if (metrics.length % 2 !== 0) {
    const mx = 60;
    const my = metY + Math.floor((metrics.length - 1) / 2) * 90;
    const m = metrics[metrics.length - 1];
    ctx.fillStyle = 'rgba(184,147,74,0.08)';
    roundRect(ctx, mx, my, W - 120, 76, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(184,147,74,0.3)';
    ctx.lineWidth = 1;
    roundRect(ctx, mx, my, W - 120, 76, 14);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '12px DM Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(m.label.toUpperCase(), mx + 16, my + 24);
    ctx.fillStyle = '#e8c06a';
    ctx.font = 'bold 22px DM Sans, sans-serif';
    ctx.fillText(m.value, mx + 16, my + 56);
  }

  ctx.globalAlpha = 1;

  // ────────────────────────────────────────────────────
  // Phase 4 : CTA final (t 0.90→1)
  // ────────────────────────────────────────────────────
  const ctaPhase = Math.max(0, Math.min(1, (t - 0.90) / 0.10));
  ctx.globalAlpha = easeOut(ctaPhase);

  // Ligne séparatrice
  ctx.strokeStyle = 'rgba(184,147,74,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, H - 120); ctx.lineTo(W - 60, H - 120);
  ctx.stroke();

  // Logo
  ctx.fillStyle = '#b8934a';
  ctx.font = 'bold 28px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('mesimulateurs.fr', W / 2, H - 80);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '16px DM Sans, sans-serif';
  ctx.fillText('Calculs gratuits · Sans inscription · 100 % confidentiel', W / 2, H - 50);

  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
}

// Utilitaire arrondi de rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function VideoExport({ projectionData, patrimoineCible, ageAtteinte, revenuMensuel, ageActuel, disabled }) {
  const canvasRef  = useRef(null);
  const recRef     = useRef(null);
  const rafRef     = useRef(null);
  const chunksRef  = useRef([]);

  const [state, setState] = useState('idle'); // idle | recording | processing

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
      a.download = 'simulation-fire.webm';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setState('idle');
    };

    rec.start();

    const DURATION = 6000; // ms — ~6s pour ne pas peser trop lourd
    const start    = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const t       = Math.min(elapsed / DURATION, 1);

      drawFrame(ctx, {
        t, projectionData, patrimoineCible, ageAtteinte, revenuMensuel, ageActuel,
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rec.stop();
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [disabled, projectionData, patrimoineCible, ageAtteinte, revenuMensuel, ageActuel]);

  const isSupported = typeof MediaRecorder !== 'undefined';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      {/* Canvas caché utilisé pour le rendu */}
      <canvas
        ref={canvasRef}
        width={720}
        height={1280}
        style={{ display: 'none' }}
      />

      {!isSupported ? null : (
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
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            cursor: state === 'processing' ? 'wait' : 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (state === 'idle') {
              e.currentTarget.style.borderColor = 'var(--gold-mid)';
              e.currentTarget.style.color = 'var(--gold)';
            }
          }}
          onMouseLeave={e => {
            if (state === 'idle') {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          {state === 'recording'  && <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />}
          {state === 'processing' ? '⏳ Génération…'  :
           state === 'recording'  ? '⏹ Arrêter'      :
           '🎬 Exporter Reel'}
        </button>
      )}

      {state === 'idle' && isSupported && !disabled && (
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
          Vidéo 9:16 · Format Reels/Stories
        </span>
      )}
    </div>
  );
}
