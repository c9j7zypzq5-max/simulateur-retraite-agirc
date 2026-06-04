import { useState, useRef, useEffect } from 'react';
import { useVideoRecording } from '../contexts/VideoRecordingContext';

// Ticker → domaine Clearbit pour logo
const TICKER_LOGO = {
  '^GSPC':     'spglobal.com',
  '^IXIC':     'nasdaq.com',
  '^DJI':      'dowjones.com',
  '^FCHI':     'euronext.com',
  '^GDAXI':    'deutsche-boerse.com',
  '^STOXX50E': 'stoxx.com',
  'IWDA.AS':   'blackrock.com',
  'CSPX.L':    'blackrock.com',
  'EUNL.DE':   'blackrock.com',
  'VEUR.AS':   'vanguard.com',
  'VWCE.DE':   'vanguard.com',
  'VTI':       'vanguard.com',
  'VEA':       'vanguard.com',
  'SPY':       'ssga.com',
  'QQQ':       'invesco.com',
  'AAPL':      'apple.com',
  'MSFT':      'microsoft.com',
  'GOOGL':     'google.com',
  'GOOG':      'google.com',
  'AMZN':      'amazon.com',
  'META':      'meta.com',
  'TSLA':      'tesla.com',
  'NVDA':      'nvidia.com',
  'NFLX':      'netflix.com',
  'ORCL':      'oracle.com',
  'AMD':       'amd.com',
  'INTC':      'intel.com',
  'IBM':       'ibm.com',
  'JPM':       'jpmorganchase.com',
  'BAC':       'bankofamerica.com',
  'GS':        'goldmansachs.com',
  'MC.PA':     'lvmh.com',
  'TTE.PA':    'totalenergies.com',
  'OR.PA':     'loreal.com',
  'SAN.PA':    'sanofi.com',
  'SAF.PA':    'safran-group.com',
  'AIR.PA':    'airbus.com',
  'BNP.PA':    'bnpparibas.com',
  'SU.PA':     'se.com',
  'RI.PA':     'pernod-ricard.com',
  'DSY.PA':    'dassault-systemes.com',
  'CAP.PA':    'capgemini.com',
  'GC=F':      'gold.org',
};

const FREQ_FR        = { monthly: '/mois', quarterly: '/trimestre', semi: '/semestre', annual: '/an' };
const INVESTED_COLOR = '#8eb8d6';

const DURATION_OPTIONS = [
  { value: 15, label: '15 s — aperçu rapide' },
  { value: 30, label: '30 s — version courte' },
  { value: 60, label: '1 min — standard' },
  { value: 70, label: '1 min 10 — complet', recommended: true },
];

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

function lightenHex(hex, amt) {
  const h = hex.replace('#', '');
  const r = Math.min(255, parseInt(h.slice(0,2),16) + Math.round(255*amt));
  const g = Math.min(255, parseInt(h.slice(2,4),16) + Math.round(255*amt));
  const b = Math.min(255, parseInt(h.slice(4,6),16) + Math.round(255*amt));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function fmtK(v) {
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1).replace('.',',')} M€`;
  if (v >= 1_000)     return `${Math.round(v/1000)} k€`;
  return `${Math.round(v)} €`;
}

function fmtFull(v) {
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(2).replace('.',',')} M€`;
  return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
}

// Picks the nice number from candidates closest to target.
function niceNearest(target) {
  const candidates = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1_000, 2_000, 5_000,
    10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000];
  return candidates.reduce((best, c) =>
    Math.abs(c - target) < Math.abs(best - target) ? c : best, candidates[0]);
}

// Alpha for a gridline at ordinal `ord` (tickValue / baseInterval) given the
// current pixel spacing between adjacent ticks. Odd ordinals fade first, then
// multiples-of-2, then multiples-of-4 — a smooth relay so density stays comfortable.
function tickAlpha(ord, pixPerTick) {
  if (ord === 0) return 1;
  let depth = 0, n = Math.abs(ord);
  while (n % 2 === 0) { depth++; n = Math.floor(n / 2); }
  const effective = pixPerTick * Math.pow(2, depth);
  return Math.min(1, Math.max(0, (effective - 30) / 30));
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
  ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
  ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath();
}

function drawLogoInCircle(ctx, img, cx, cy, r, color, letter) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (img && img.naturalWidth > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.clip();
    const pad = r * 0.08;
    ctx.drawImage(img, cx - r + pad, cy - r + pad, (r - pad) * 2, (r - pad) * 2);
  } else {
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = `rgba(${hexToRgb(color)},0.8)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  if (!img || img.naturalWidth === 0) {
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.max(8, Math.round(r * 0.88))}px DM Sans, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter.charAt(0).toUpperCase(), cx, cy);
    ctx.textBaseline = 'alphabetic';
  }
}

// Marque mesimulateurs.fr dessinée au canvas (carré navy + barres or + courbe)
function drawBrandMark(ctx, x, y, s) {
  // s = côté du carré ; (x,y) = coin haut-gauche
  const r = s * 0.22;
  ctx.save();
  ctx.fillStyle = '#163a6e';
  roundRect(ctx, x, y, s, s, r);
  ctx.fill();
  // Barres ascendantes
  ctx.fillStyle = '#f5c01f';
  const bw = s * 0.125, base = y + s * 0.80;
  const bx = [0.195, 0.367, 0.539, 0.711];
  const bh = [0.19, 0.28, 0.39, 0.50];
  bx.forEach((fx, i) => {
    const h = s * bh[i];
    roundRect(ctx, x + s * fx, base - h, bw, h, bw * 0.32);
    ctx.fill();
  });
  // Courbe blanche
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1, s * 0.047);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x + s * 0.17, y + s * 0.70);
  ctx.bezierCurveTo(x + s * 0.37, y + s * 0.66, x + s * 0.52, y + s * 0.44, x + s * 0.82, y + s * 0.26);
  ctx.stroke();
  ctx.restore();
}

// ─── drawFrame ────────────────────────────────────────────────────────────────
function drawFrame(ctx, {
  t, chartData, assets, montantInitial, totalYears, startYear, startMonth, endYear,
  fromLabel, toLabel, metrics, stateRef,
  periodicAmt, periodicFreq, showPeriodicInChart, logoImages,
}) {
  const W = 720, H = 1280;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#060e1c');
  bg.addColorStop(0.6, '#0e1e3a');
  bg.addColorStop(1, '#0b1528');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(100,120,180,0.04)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= W; gx += 60) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
  for (let gy = 0; gy <= H; gy += 60) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }

  // ── Header
  const BOX_TOP = 26, BOX_H = 126;
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(184,147,74,0.1)';
  roundRect(ctx, 28, BOX_TOP, W - 56, BOX_H, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(184,147,74,0.4)';
  ctx.lineWidth = 1;
  roundRect(ctx, 28, BOX_TOP, W - 56, BOX_H, 28);
  ctx.stroke();

  {
    const LOGO_R = 13, LOGO_GAP = 8, VS_SEP = '  vs  ';
    let hFontSize = 30;
    ctx.font = `bold ${hFontSize}px DM Sans, sans-serif`;

    const computeW = () => {
      let w = 0;
      assets.forEach((a, i) => {
        w += LOGO_R * 2 + LOGO_GAP;
        w += ctx.measureText(a.label || a.ticker).width;
        if (i < assets.length - 1) w += ctx.measureText(VS_SEP).width;
      });
      return w;
    };
    while (computeW() > W - 64 && hFontSize > 15) {
      hFontSize--;
      ctx.font = `bold ${hFontSize}px DM Sans, sans-serif`;
    }

    const totalW = computeW();
    let hx = Math.round(W / 2 - totalW / 2);
    const textY  = BOX_TOP + 54;
    const logoCY = textY - Math.round(hFontSize * 0.38);

    assets.forEach((a, i) => {
      const logo = logoImages?.[a.ticker];
      drawLogoInCircle(ctx, logo, hx + LOGO_R, logoCY, LOGO_R, a.color, a.label || a.ticker);
      hx += LOGO_R * 2 + LOGO_GAP;

      ctx.font = `bold ${hFontSize}px DM Sans, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#b8934a';
      ctx.fillText(a.label || a.ticker, hx, textY);
      hx += ctx.measureText(a.label || a.ticker).width;

      if (i < assets.length - 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText(VS_SEP, hx, textY);
        hx += ctx.measureText(VS_SEP).width;
      }
    });
  }

  {
    let subtitle;
    if (montantInitial > 0) {
      subtitle = `${fmtFull(montantInitial)} investis en ${fromLabel}`;
      if (periodicAmt > 0) subtitle += `  ·  + ${fmtK(periodicAmt)}${FREQ_FR[periodicFreq] || '/mois'}`;
    } else {
      subtitle = `DCA ${fmtK(periodicAmt)}${FREQ_FR[periodicFreq] || '/mois'} depuis ${fromLabel}`;
    }
    let sFontSize = 20;
    ctx.font = `${sFontSize}px DM Sans, sans-serif`;
    while (ctx.measureText(subtitle).width > W - 72 && sFontSize > 12) {
      sFontSize--;
      ctx.font = `${sFontSize}px DM Sans, sans-serif`;
    }
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText(subtitle, W / 2, BOX_TOP + 98);
  }

  // ── Chart area
  const CX = 50, CY = 168, CW = W - 50 - 96, CH = 696;

  const chartPhase    = Math.max(0, Math.min(1, t / 0.92));
  // Révélation linéaire (vitesse constante) : sur les longues périodes, un
  // exposant < 1 front-chargeait l'animation (la pente quasi infinie en t=0
  // faisait « sauter » l'axe X de plusieurs années dès le début). En linéaire,
  // les courbes et les dates avancent à rythme constant, sans bond initial.
  const chartProgress = chartPhase;
  const maxT = chartProgress;

  const tickerPts = {};
  for (const [ticker, pts] of Object.entries(chartData)) {
    if (ticker === '__invested__') continue;
    if (!Array.isArray(pts) || pts.length < 2) continue;
    const visible = pts.filter(p => p.t <= maxT);
    if (visible.length < 1) { tickerPts[ticker] = [pts[0]]; continue; }
    const nextIdx = pts.findIndex(p => p.t > maxT);
    if (nextIdx > 0) {
      const prev = pts[nextIdx - 1], next = pts[nextIdx];
      const alpha = (maxT - prev.t) / Math.max(next.t - prev.t, 0.0001);
      tickerPts[ticker] = [...visible, { t: maxT, value: prev.value + (next.value - prev.value) * alpha }];
    } else {
      tickerPts[ticker] = visible;
    }
  }

  let investedPts = null;
  if (showPeriodicInChart && Array.isArray(chartData['__invested__']) && chartData['__invested__'].length >= 2) {
    const raw = chartData['__invested__'];
    const visible = raw.filter(p => p.t <= maxT);
    if (visible.length >= 1) {
      const nextIdx = raw.findIndex(p => p.t > maxT);
      if (nextIdx > 0) {
        const prev = raw[nextIdx - 1];
        investedPts = [...visible, { t: maxT, value: prev.value }];
      } else {
        investedPts = visible;
      }
    }
  }

  const allVisible = Object.values(tickerPts).flat();
  if (investedPts) allVisible.push(...investedPts);

  if (allVisible.length >= 2) {
    const st = stateRef.current;
    // Nice Y scale from visible data — recalibrates as the curve grows.
    // targetYMax jumps in discrete steps (3-5 ticks); smoothYMax lerps toward it
    // so the transition is fluid while labels stay on clean round values.
    const currentMax = Math.max(...allVisible.map(p => p.value), montantInitial);
    const currentMin = Math.min(...allVisible.map(p => p.value), montantInitial);
    if (!st.initDone) {
      // base interval ≈ 10% of initial investment, snapped to a nice number
      st.baseInterval = niceNearest(montantInitial > 0 ? montantInitial / 10 : 1000);
      st.smoothYMax = currentMax + Math.max(st.baseInterval * 0.6, (currentMax - currentMin) * 0.12);
      st.smoothYMin = Math.max(0, currentMin - st.baseInterval * 0.5);
      st.initDone = true;
    }
    const interval = st.baseInterval;
    // Marge en haut du graphique : au moins une demi-graduation, et au moins 12 %
    // de l'amplitude visible — pour que la courbe la plus haute (logo + montant au
    // bout) ne colle jamais au bord supérieur.
    const targetYMax = currentMax + Math.max(interval * 0.6, (currentMax - currentMin) * 0.12);
    const targetYMin = Math.max(0, currentMin - (currentMax - currentMin) * 0.05);
    st.smoothYMax += (targetYMax - st.smoothYMax) * 0.04;
    st.smoothYMin += (targetYMin - st.smoothYMin) * 0.04;
    const yMax = st.smoothYMax, yMin = st.smoothYMin;

    // Pointe de la courbe épinglée juste à l'intérieur du bord droit : la fenêtre
    // dépasse la fraction révélée d'un facteur RIGHT_HEADROOM, ce qui laisse une
    // marge constante à droite pour que l'étiquette du montant tienne toujours à
    // droite de la pointe sans déborder. La révélation reste linéaire (vitesse
    // constante) et la fenêtre n'est pas plafonnée à 1, pour garder cette marge
    // jusqu'à la fin. Petit plancher pour éviter une division par zéro.
    const RIGHT_HEADROOM = 1.13;
    const currentFrac = Math.max(...allVisible.map(p => p.t), 0);
    const xWindow = Math.max(currentFrac * RIGHT_HEADROOM, 0.0001);

    const cx = frac => CX + (frac / Math.max(xWindow, 0.001)) * CW;
    const cy = v    => CY + CH - ((v - yMin) / Math.max(yMax - yMin, 1)) * CH;

    const baseY = cy(montantInitial);
    if (montantInitial > 0 && baseY >= CY - 2 && baseY <= CY + CH + 2) {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.setLineDash([6, 5]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CX, baseY); ctx.lineTo(CX + CW, baseY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px DM Sans, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(fmtK(montantInitial), CX + 4, baseY - 4);
      ctx.globalAlpha = 1;
    }

    const curves = [
      ...assets.map((a, i) => ({ ...a, pts: tickerPts[a.ticker], isInvested: false, idx: i })),
      ...(investedPts ? [{ ticker: '__invested__', label: 'Capital investi', color: INVESTED_COLOR, pts: investedPts, isInvested: true, idx: assets.length }] : []),
    ];

    const tipPositions = [];

    for (const curve of curves) {
      const pts = curve.pts;
      if (!pts || pts.length < 2) continue;
      const { color, idx } = curve;
      const visPts = pts.filter(p => p.t <= xWindow + 0.005);
      if (visPts.length < 2) continue;

      ctx.globalAlpha = 0.06 + idx * 0.01;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx(visPts[0].t), cy(yMin));
      visPts.forEach(p => {
        const px = cx(p.t);
        if (px >= CX - 2 && px <= CX + CW + 2) ctx.lineTo(px, cy(p.value));
      });
      ctx.lineTo(cx(visPts[visPts.length-1].t), cy(yMin));
      ctx.closePath(); ctx.fill();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.setLineDash([]);
      ctx.beginPath();
      let started = false, prevStepY = 0;
      visPts.forEach(p => {
        const px = cx(p.t), py = cy(p.value);
        if (px < CX - 5 || px > CX + CW + 5) return;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else if (curve.isInvested) { ctx.lineTo(px, prevStepY); ctx.lineTo(px, py); }
        else ctx.lineTo(px, py);
        prevStepY = py;
      });
      ctx.stroke();

      const last = visPts[visPts.length - 1];
      const lx = cx(last.t), ly = cy(last.value);
      if (lx >= CX && lx <= CX + CW) {
        const tipLogo   = curve.isInvested ? null : logoImages?.[curve.ticker];
        const tipLetter = (curve.label || curve.ticker || '?');
        const R = 14;

        // Static glow ring — pulsing caused flickering when tips overlap at start
        ctx.fillStyle = `rgba(${hexToRgb(color)},0.22)`;
        ctx.beginPath(); ctx.arc(lx, ly, R + 6, 0, Math.PI * 2); ctx.fill();

        // Logo de l'actif au tip de la courbe
        drawLogoInCircle(ctx, tipLogo, lx, ly, R, color, tipLetter);

        // Montant collé directement au logo (valeur + %, sur deux lignes)
        const valStr = fmtFull(last.value);
        const tipPct = montantInitial > 0 ? (last.value / montantInitial - 1) * 100 : null;
        const subStr = curve.isInvested
          ? 'investi'
          : tipPct !== null ? `${tipPct >= 0 ? '+' : ''}${tipPct.toFixed(1)}%` : '';

        ctx.font = 'bold 19px DM Sans, sans-serif';
        const valW = ctx.measureText(valStr).width;
        const GAP = 8;
        // Si le logo est trop près du bord droit, on place le texte à gauche
        const placeLeft = lx + R + GAP + valW > W - 8;

        let labelY = Math.max(CY + 20, Math.min(CY + CH - 20, ly));
        for (const prev of tipPositions) {
          if (Math.abs(labelY - prev) < 46) labelY = prev + 46;
        }
        tipPositions.push(labelY);

        ctx.textAlign = placeLeft ? 'right' : 'left';
        const textX = placeLeft ? lx - R - GAP : lx + R + GAP;

        ctx.font = 'bold 19px DM Sans, sans-serif';
        ctx.fillStyle = lightenHex(color, 0.15);
        ctx.fillText(valStr, textX, labelY - 3);
        ctx.font = 'bold 14px DM Sans, sans-serif';
        ctx.fillStyle = `rgba(${hexToRgb(color)},0.9)`;
        ctx.fillText(subStr, textX, labelY + 15);
      }
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CX, CY); ctx.lineTo(CX, CY + CH);
    ctx.moveTo(CX, CY + CH); ctx.lineTo(CX + CW, CY + CH);
    ctx.stroke();

    // Fixed-interval gridlines — values never change, density adapts via alpha
    ctx.font = '15px DM Sans, sans-serif'; ctx.textAlign = 'right';
    const pixPerTick = (interval / Math.max(yMax - yMin, 1)) * CH;
    const firstTick = Math.ceil(yMin / interval) * interval;
    const lastTick  = Math.ceil(yMax / interval) * interval;
    for (let v = firstTick; v <= lastTick + interval * 0.01; v += interval) {
      const tickVal = Math.round(v);
      const yy = cy(tickVal);
      if (yy < CY - 10 || yy > CY + CH + 10) continue;
      const ord = Math.round(tickVal / interval);
      const alpha = tickAlpha(ord, pixPerTick);
      if (alpha < 0.02) continue;
      const inChart = yy >= CY + 10 && yy <= CY + CH - 10;
      if (inChart) {
        // Même couleur/opacité que les dates de l'axe X (rgba 0.35, sans atténuation)
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillText(fmtK(tickVal), CX - 5, yy + 5);
      }
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CX, yy); ctx.lineTo(CX + CW, yy); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Axe X : même comportement que l'axe Y — graduations annuelles à intervalle
    // fixe dont la densité s'adapte (estompage en relais via tickAlpha) quand les
    // années se resserrent, au lieu d'afficher brutalement chaque année.
    ctx.font = '15px DM Sans, sans-serif'; ctx.textAlign = 'center';
    const yearsRange = endYear - startYear;
    const pixPerYear = yearsRange > 0 ? (1 / yearsRange / Math.max(xWindow, 0.001)) * CW : CW;
    for (let yr = startYear; yr <= endYear; yr++) {
      const frac = yearsRange > 0 ? (yr - startYear) / yearsRange : 0;
      if (frac > xWindow + 0.02) break;
      const px = cx(frac);
      if (px < CX || px > CX + CW) continue;
      const ord = yr - startYear;
      const alpha = tickAlpha(ord, pixPerYear);
      if (alpha < 0.02) continue;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText(String(yr), px, CY + CH + 24);
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, CY); ctx.lineTo(px, CY + CH); ctx.stroke();
    }

    ctx.globalAlpha = 1;
    const PANEL_TOP = CY + CH + 28;
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(CX, PANEL_TOP); ctx.lineTo(W - 34, PANEL_TOP); ctx.stroke();

    const MAX_NAME_W = 320;
    const nRows = assets.length + (investedPts && investedPts.length >= 1 ? 1 : 0);
    // Hauteur de ligne adaptative pour rester au-dessus de la barre de marque
    const ROW_H = Math.max(46, Math.min(64, Math.floor((H - 56 - (PANEL_TOP + 18)) / Math.max(nRows, 1))));
    const LOGO_R = 12;

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const pts   = tickerPts[asset.ticker];
      const color = asset.color;
      const rowY  = PANEL_TOP + 14 + i * ROW_H;
      const logo  = logoImages?.[asset.ticker];

      drawLogoInCircle(ctx, logo, CX + LOGO_R, rowY + 12, LOGO_R, color, asset.label || asset.ticker);
      const tx = CX + LOGO_R * 2 + 8;

      const assetName = asset.label || asset.ticker;
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '19px DM Sans, sans-serif'; ctx.textAlign = 'left';
      let nameText = assetName;
      if (ctx.measureText(nameText).width > MAX_NAME_W) {
        while (ctx.measureText(nameText + '…').width > MAX_NAME_W && nameText.length > 1) nameText = nameText.slice(0, -1);
        nameText += '…';
      }
      ctx.fillText(nameText, tx, rowY + 12);

      if (pts && pts.length >= 1) {
        const last   = pts[pts.length - 1];
        const pct    = montantInitial > 0 ? (last.value / montantInitial - 1) * 100 : null;
        const pctClr = pct === null || pct >= 0 ? '#4ade80' : '#f87171';
        const valStr = fmtFull(last.value);
        ctx.fillStyle = lightenHex(color, 0.1);
        ctx.font = 'bold 28px DM Sans, sans-serif';
        ctx.fillText(valStr, tx, rowY + 40);
        const vw = ctx.measureText(valStr).width;
        if (pct !== null) {
          ctx.fillStyle = pctClr;
          ctx.font = 'bold 18px DM Sans, sans-serif';
          ctx.fillText(`${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, tx + vw + 10, rowY + 40);
        }
      }
    }

    if (investedPts && investedPts.length >= 1) {
      const last = investedPts[investedPts.length - 1];
      const rowY = PANEL_TOP + 14 + assets.length * ROW_H;
      drawLogoInCircle(ctx, null, CX + LOGO_R, rowY + 12, LOGO_R, INVESTED_COLOR, '€');
      const tx = CX + LOGO_R * 2 + 8;
      ctx.fillStyle = 'rgba(200,215,235,0.6)';
      ctx.font = '19px DM Sans, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Capital investi', tx, rowY + 12);
      ctx.fillStyle = lightenHex(INVESTED_COLOR, 0.1);
      ctx.font = 'bold 28px DM Sans, sans-serif';
      ctx.fillText(fmtFull(last.value), tx, rowY + 40);
    }

    const MONTHS_S = ['Jan.','Fév.','Mars','Avr.','Mai','Juin','Juil.','Août','Sep.','Oct.','Nov.','Déc.'];
    const sMonth = startMonth || 1;
    const startTotalMo   = startYear * 12 + sMonth - 1;
    const currentTotalMo = Math.round(startTotalMo + maxT * totalYears * 12);
    const curYear  = Math.floor(currentTotalMo / 12);
    const curMoIdx = currentTotalMo % 12;

    const dX = W - 38, dY = PANEL_TOP + 24;
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '14px DM Sans, sans-serif';
    ctx.fillText('Date en cours', dX, dY);
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 28px DM Sans, sans-serif';
    ctx.fillText(MONTHS_S[curMoIdx], dX, dY + 32);
    ctx.fillStyle = '#b8934a'; ctx.font = 'bold 50px DM Sans, sans-serif';
    ctx.fillText(String(curYear), dX, dY + 84);
  }

  {
    const BH = 56;
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(4,10,22,0.97)';
    ctx.fillRect(0, H - BH, W, BH);
    ctx.strokeStyle = 'rgba(184,147,74,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(40, H - BH); ctx.lineTo(W - 40, H - BH); ctx.stroke();
    // Marque + wordmark, centrés ensemble
    ctx.font = 'bold 24px DM Sans, sans-serif';
    const txt = 'mesimulateurs.fr';
    const tw = ctx.measureText(txt).width;
    const markS = 32, gap = 10;
    const groupW = markS + gap + tw;
    const gx = W / 2 - groupW / 2;
    const cy = H - BH + 28;
    drawBrandMark(ctx, gx, cy - markS / 2, markS);
    ctx.fillStyle = '#b8934a'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(txt, gx + markS + gap, cy + 1);
    ctx.textBaseline = 'alphabetic';
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const FORMAT_OPTIONS = [
  { value: 'mp4',  label: 'MP4 H.264',         desc: 'TikTok / iPhone',        recommended: true },
  { value: 'webm', label: 'WebM VP9',           desc: 'Téléchargement rapide',  recommended: false },
];

function ExportModal({ onClose, onLaunch }) {
  const [dur, setDur] = useState(70);
  const [fmt, setFmt] = useState('mp4');
  const font = "'DM Sans', sans-serif";

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border-gold)',
          borderRadius: 16, padding: '24px 28px', width: 340, maxWidth: '90vw',
          fontFamily: font, boxShadow: 'var(--card-shadow, 0 12px 40px rgba(0,0,0,0.5))',
        }}
      >
        <h3 style={{ color: 'var(--gold-mid)', fontSize: 16, margin: '0 0 18px', fontWeight: 700 }}>
          🎬 Exporter en vidéo
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: 11, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Durée
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {DURATION_OPTIONS.map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8,
                background: dur === opt.value ? 'var(--border-gold)' : 'transparent',
                border: `1px solid ${dur === opt.value ? 'var(--border-gold)' : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio" name="dur" value={opt.value}
                checked={dur === opt.value}
                onChange={() => setDur(opt.value)}
                style={{ accentColor: 'var(--gold-mid)' }}
              />
              <span style={{ color: dur === opt.value ? 'var(--gold)' : 'var(--text)', fontSize: 13, flex: 1 }}>
                {opt.label}
              </span>
              {opt.recommended && (
                <span style={{
                  fontSize: 10, color: 'var(--gold-mid)',
                  border: '1px solid var(--border-gold)', borderRadius: 4,
                  padding: '1px 6px',
                }}>
                  recommandé
                </span>
              )}
            </label>
          ))}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: 11, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Format
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {FORMAT_OPTIONS.map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8,
                background: fmt === opt.value ? 'var(--border-gold)' : 'transparent',
                border: `1px solid ${fmt === opt.value ? 'var(--border-gold)' : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio" name="fmt" value={opt.value}
                checked={fmt === opt.value}
                onChange={() => setFmt(opt.value)}
                style={{ accentColor: 'var(--gold-mid)' }}
              />
              <span style={{ color: fmt === opt.value ? 'var(--gold)' : 'var(--text)', fontSize: 13, flex: 1 }}>
                {opt.label}
                <span style={{ color: 'var(--text-secondary)', fontSize: 11, marginLeft: 6 }}>
                  — {opt.desc}
                </span>
              </span>
              {opt.recommended && (
                <span style={{
                  fontSize: 10, color: 'var(--gold-mid)',
                  border: '1px solid var(--border-gold)', borderRadius: 4,
                  padding: '1px 6px',
                }}>
                  recommandé
                </span>
              )}
            </label>
          ))}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: 11, margin: '0 0 22px', lineHeight: 1.5 }}>
          720×1280 · 9:16 · Reels / TikTok
          {fmt === 'mp4' && <><br />MP4 : enregistrement temps réel + conversion ffmpeg (≈ 5-15 s).</>}
          {fmt === 'webm' && <><br />WebM : téléchargement direct après enregistrement.</>}
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text-secondary)',
              padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontFamily: font,
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => onLaunch(dur, fmt)}
            style={{
              background: 'var(--border-gold)', border: '1px solid var(--gold-mid)',
              borderRadius: 8, color: 'var(--gold)',
              padding: '8px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: font,
            }}
          >
            ▶ Lancer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Composant ────────────────────────────────────────────────────────────────
export default function ComparisonVideoExport({
  assets = [],
  chartData = {},
  fromLabel = '',
  toLabel = '',
  startYear = 2015,
  startMonth = 1,
  endYear = 2024,
  totalYears = 9,
  montantInitial = 10000,
  metrics = [],
  disabled = false,
  periodicAmt = 0,
  periodicFreq = 'monthly',
  showPeriodicInChart = false,
  autoLaunchDuration = null,
  autoLaunchFormat = 'mp4',
}) {
  const { recState, startRecording: ctxStartRecording, stop } = useVideoRecording();
  const [showModal, setShowModal] = useState(false);

  const stateRef  = useRef({ smoothXW: 0, smoothYMin: 0, baseInterval: 1000, initDone: false });
  const logoRef   = useRef({});
  const drawFnRef = useRef(null);

  // Always keep drawFnRef.current pointing to a function with the latest closure values.
  // Assigning in render body (not useEffect) ensures it's fresh every render.
  drawFnRef.current = (ctx, t) => {
    drawFrame(ctx, {
      t, chartData, assets, montantInitial, totalYears, startYear, startMonth, endYear,
      fromLabel, toLabel, metrics, stateRef, periodicAmt, periodicFreq, showPeriodicInChart,
      logoImages: logoRef.current,
    });
  };

  const handleLaunch = async (durationSec, format) => {
    setShowModal(false);
    stateRef.current = { smoothXW: 0, smoothYMin: 0, baseInterval: 1000, initDone: false };

    // Preload logos (max 3s each)
    logoRef.current = {};
    await Promise.all(assets.map(async (asset) => {
      const domain = TICKER_LOGO[asset.ticker];
      if (!domain) return;
      try {
        const img = new Image();
        // Proxy same-origin : évite de "tainter" le canvas (sinon MediaRecorder
        // planterait) et contourne la fermeture de l'API Clearbit publique.
        await new Promise((resolve) => {
          img.onload = resolve; img.onerror = resolve;
          img.src = `/api/logo?domain=${encodeURIComponent(domain)}`;
          setTimeout(resolve, 4500);
        });
        if (img.naturalWidth > 0) logoRef.current[asset.ticker] = img;
      } catch {}
    }));

    const FREQ_SLUG = { monthly: 'par-mois', quarterly: 'par-trim', semi: 'par-sem', annual: 'par-an' };
    const slugify = s => s.toLowerCase().replace(/[éèêë]/g,'e').replace(/[àâä]/g,'a').replace(/[ùûü]/g,'u').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const amtFmt = v => v >= 1_000_000 ? `${Math.round(v/1_000_000)}M` : v >= 1_000 ? `${Math.round(v/1000)}k` : String(Math.round(v));
    const slugParts = [];
    if (montantInitial > 0) slugParts.push(amtFmt(montantInitial));
    if (periodicAmt > 0) slugParts.push(`${amtFmt(periodicAmt)}_${FREQ_SLUG[periodicFreq] || 'par-mois'}`);
    slugParts.push(assets.map(a => slugify(a.label || a.ticker).slice(0, 12)).join('-'));
    slugParts.push(`${startYear}_${endYear}`);
    const slug = slugParts.join('_');
    const lbl  = assets.map(a => a.label || a.ticker).join(' vs ');

    ctxStartRecording({ drawFnRef, duration: durationSec * 1000, filename: slug, label: lbl, format });
  };

  // Auto-lancement piloté par l'URL (?video=NN&format=mp4) : démarre
  // l'enregistrement dès que les données du graphique sont prêtes. Utilisé par la
  // génération automatisée de vidéos (scripts/tiktok). Ne se déclenche qu'une fois.
  const autoLaunchedRef = useRef(false);
  useEffect(() => {
    if (autoLaunchedRef.current) return;
    if (!autoLaunchDuration || autoLaunchDuration <= 0) return;
    // Logs tracés (préfixe [tiktok]) : la génération automatisée capture la console
    // du navigateur pour diagnostiquer pourquoi l'enregistrement ne démarre pas.
    if (disabled) { console.log('[tiktok] auto-launch en attente : bouton désactivé (données pas encore prêtes)'); return; }
    if (!chartData || Object.keys(chartData).length === 0) { console.log('[tiktok] auto-launch en attente : chartData vide'); return; }
    console.log('[tiktok] auto-launch armé (démarrage dans 1.2 s)', { duration: autoLaunchDuration, format: autoLaunchFormat });
    // Le garde est posé DANS le timeout (et non avant) : sous React.StrictMode le
    // double-montage en dev annule ce timer via le cleanup, et il faut pouvoir le
    // re-programmer au remontage. Sans ça, l'auto-lancement ne partirait jamais en dev.
    const id = setTimeout(() => {
      if (autoLaunchedRef.current) return;
      autoLaunchedRef.current = true;
      console.log('[tiktok] auto-launch : démarrage de l’enregistrement');
      handleLaunch(autoLaunchDuration, autoLaunchFormat || 'mp4');
    }, 1200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLaunchDuration, autoLaunchFormat, disabled, chartData]);

  const isSupported   = typeof MediaRecorder !== 'undefined';
  const isRecording   = recState === 'recording';
  const isConverting  = recState === 'converting';
  const isProcessing  = recState === 'processing' || isConverting;

  const font = "'DM Sans', sans-serif";

  const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
    background: isRecording ? 'rgba(239,68,68,0.12)' : 'var(--card-bg)',
    border: `1px solid ${isRecording ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
    borderRadius: 10, color: isRecording ? '#ef4444' : 'var(--text-secondary)',
    fontSize: 12, fontFamily: font,
    cursor: isProcessing ? 'wait' : (disabled ? 'not-allowed' : 'pointer'),
    transition: 'all 0.2s', opacity: disabled ? 0.5 : 1,
  };

  return (
    <>
      {showModal && (
        <ExportModal onClose={() => setShowModal(false)} onLaunch={handleLaunch} />
      )}
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        {isSupported && (
          <button
            onClick={() => {
              if (disabled || isProcessing) return;
              if (isRecording) { stop(); return; }
              setShowModal(true);
            }}
            disabled={isProcessing || disabled}
            style={btnStyle}
            onMouseEnter={e => { if (!isRecording && !disabled) { e.currentTarget.style.borderColor = 'var(--gold-mid)'; e.currentTarget.style.color = 'var(--gold)'; } }}
            onMouseLeave={e => { if (!isRecording) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
          >
            {isRecording && <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', flexShrink: 0 }} />}
            {isConverting ? '⚙️ Conversion…' : isProcessing ? '⏳ Génération…' : isRecording ? '⏹ Arrêter' : '🎬 Reel vidéo'}
          </button>
        )}
        {!isRecording && !isProcessing && isSupported && !disabled && (
          <span style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
            9:16 · Reels / TikTok
          </span>
        )}
      </div>
    </>
  );
}
