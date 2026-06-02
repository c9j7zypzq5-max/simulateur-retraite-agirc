import { useState, useRef } from 'react';
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
    const LOGO_R = 11, LOGO_GAP = 7, VS_SEP = '  vs  ';
    let hFontSize = 24;
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
    while (computeW() > W - 70 && hFontSize > 12) {
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
    let subtitle = `${fmtFull(montantInitial)} investis en ${fromLabel}`;
    if (periodicAmt > 0) subtitle += `  ·  + ${fmtK(periodicAmt)}${FREQ_FR[periodicFreq] || '/mois'}`;
    let sFontSize = 16;
    ctx.font = `${sFontSize}px DM Sans, sans-serif`;
    while (ctx.measureText(subtitle).width > W - 80 && sFontSize > 9) {
      sFontSize--;
      ctx.font = `${sFontSize}px DM Sans, sans-serif`;
    }
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.textAlign = 'center';
    ctx.fillText(subtitle, W / 2, BOX_TOP + 96);
  }

  // ── Chart area
  const CX = 50, CY = 168, CW = W - 50 - 96, CH = 696;

  const chartPhase    = Math.max(0, Math.min(1, t / 0.92));
  const chartProgress = Math.pow(chartPhase, 0.45);
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
        const prev = raw[nextIdx - 1], next = raw[nextIdx];
        const alpha = (maxT - prev.t) / Math.max(next.t - prev.t, 0.0001);
        investedPts = [...visible, { t: maxT, value: prev.value + (next.value - prev.value) * alpha }];
      } else {
        investedPts = visible;
      }
    }
  }

  const allVisible = Object.values(tickerPts).flat();
  if (investedPts) allVisible.push(...investedPts);

  if (allVisible.length >= 2) {
    const rawYMax = Math.max(...allVisible.map(p => p.value), montantInitial) * 1.18;
    const rawYMin = Math.min(...allVisible.map(p => p.value), montantInitial) * 0.88;

    const st = stateRef.current;
    if (!st.initDone) {
      st.smoothYMax = rawYMax; st.smoothYMin = rawYMin;
      st.smoothXW = totalYears > 0 ? Math.min(1, 1 / totalYears) : 1;
      st.initDone = true;
    }
    st.smoothYMax += (rawYMax - st.smoothYMax) * 0.05;
    st.smoothYMin += (rawYMin - st.smoothYMin) * 0.05;
    const yMax = st.smoothYMax, yMin = st.smoothYMin;

    const currentFrac = Math.max(...allVisible.map(p => p.t), 0);
    const initXW      = totalYears > 0 ? Math.min(1, 1 / totalYears) : 1;
    const targetXW    = Math.min(1, Math.max(initXW, currentFrac * 1.18));
    st.smoothXW += (targetXW - st.smoothXW) * 0.04;
    const xWindow = Math.min(1, st.smoothXW);

    const cx = frac => CX + (frac / Math.max(xWindow, 0.001)) * CW;
    const cy = v    => CY + CH - ((v - yMin) / Math.max(yMax - yMin, 1)) * CH;

    const baseY = cy(montantInitial);
    if (baseY >= CY - 2 && baseY <= CY + CH + 2) {
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
      let started = false;
      visPts.forEach(p => {
        const px = cx(p.t), py = cy(p.value);
        if (px < CX - 5 || px > CX + CW + 5) return;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      const last = visPts[visPts.length - 1];
      const lx = cx(last.t), ly = cy(last.value);
      if (lx >= CX && lx <= CX + CW) {
        const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 10 + idx * 1.6);
        ctx.fillStyle = `rgba(${hexToRgb(color)},${0.15 + 0.12 * pulse})`;
        ctx.beginPath(); ctx.arc(lx, ly, 10 + 3 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = lightenHex(color, 0.2);
        ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();

        let labelY = Math.max(CY + 22, Math.min(CY + CH - 22, ly));
        for (const prev of tipPositions) {
          if (Math.abs(labelY - prev) < 46) labelY = prev + 46;
        }
        tipPositions.push(labelY);
        const lbX = CX + CW + 10;
        ctx.textAlign = 'left';
        ctx.font = 'bold 16px DM Sans, sans-serif';
        ctx.fillStyle = lightenHex(color, 0.15);
        ctx.fillText(fmtFull(last.value), lbX, labelY);
        ctx.font = '12px DM Sans, sans-serif';
        ctx.fillStyle = `rgba(${hexToRgb(color)},0.8)`;
        if (curve.isInvested) {
          ctx.fillText('investi', lbX, labelY + 16);
        } else {
          const perfPct = ((last.value / montantInitial) - 1) * 100;
          ctx.fillText(`${perfPct >= 0 ? '+' : ''}${perfPct.toFixed(1)}%`, lbX, labelY + 16);
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CX, CY); ctx.lineTo(CX, CY + CH);
    ctx.moveTo(CX, CY + CH); ctx.lineTo(CX + CW, CY + CH);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '11px DM Sans, sans-serif'; ctx.textAlign = 'right';
    for (const f of [0.25, 0.5, 0.75, 1.0]) {
      const val = yMin + (yMax - yMin) * f;
      const yy  = cy(val);
      if (yy < CY + 10 || yy > CY + CH - 10) continue;
      ctx.fillText(fmtK(val), CX - 4, yy + 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CX, yy); ctx.lineTo(CX + CW, yy); ctx.stroke();
    }

    ctx.font = '12px DM Sans, sans-serif'; ctx.textAlign = 'center';
    const yearsRange = endYear - startYear;
    for (let yr = startYear; yr <= endYear; yr++) {
      const frac = yearsRange > 0 ? (yr - startYear) / yearsRange : 0;
      if (frac > xWindow + 0.02) break;
      const px = cx(frac);
      if (px >= CX && px <= CX + CW) {
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillText(String(yr), px, CY + CH + 22);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, CY); ctx.lineTo(px, CY + CH); ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    const PANEL_TOP = CY + CH + 28;
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(CX, PANEL_TOP); ctx.lineTo(W - 34, PANEL_TOP); ctx.stroke();

    const ROW_H = 52, MAX_NAME_W = 330;

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const pts   = tickerPts[asset.ticker];
      const color = asset.color;
      const rowY  = PANEL_TOP + 16 + i * ROW_H;
      const logo  = logoImages?.[asset.ticker];

      drawLogoInCircle(ctx, logo, CX + 10, rowY + 10, 10, color, asset.label || asset.ticker);

      const assetName = asset.label || asset.ticker;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = '15px DM Sans, sans-serif'; ctx.textAlign = 'left';
      let nameText = assetName;
      if (ctx.measureText(nameText).width > MAX_NAME_W) {
        while (ctx.measureText(nameText + '…').width > MAX_NAME_W && nameText.length > 1) nameText = nameText.slice(0, -1);
        nameText += '…';
      }
      ctx.fillText(nameText, CX + 24, rowY + 14);

      if (pts && pts.length >= 1) {
        const last   = pts[pts.length - 1];
        const pct    = ((last.value / montantInitial) - 1) * 100;
        const pctClr = pct >= 0 ? '#4ade80' : '#f87171';
        const valStr = fmtFull(last.value);
        ctx.fillStyle = lightenHex(color, 0.1);
        ctx.font = 'bold 22px DM Sans, sans-serif';
        ctx.fillText(valStr, CX + 24, rowY + 37);
        const vw = ctx.measureText(valStr).width;
        ctx.fillStyle = pctClr;
        ctx.font = 'bold 14px DM Sans, sans-serif';
        ctx.fillText(`${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, CX + 24 + vw + 8, rowY + 37);
      }
    }

    if (investedPts && investedPts.length >= 1) {
      const last = investedPts[investedPts.length - 1];
      const rowY = PANEL_TOP + 16 + assets.length * ROW_H;
      drawLogoInCircle(ctx, null, CX + 10, rowY + 10, 10, INVESTED_COLOR, '€');
      ctx.fillStyle = 'rgba(200,215,235,0.55)';
      ctx.font = '15px DM Sans, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Capital investi', CX + 24, rowY + 14);
      ctx.fillStyle = lightenHex(INVESTED_COLOR, 0.1);
      ctx.font = 'bold 22px DM Sans, sans-serif';
      ctx.fillText(fmtFull(last.value), CX + 24, rowY + 37);
    }

    const MONTHS_S = ['Jan.','Fév.','Mars','Avr.','Mai','Juin','Juil.','Août','Sep.','Oct.','Nov.','Déc.'];
    const sMonth = startMonth || 1;
    const startTotalMo   = startYear * 12 + sMonth - 1;
    const currentTotalMo = Math.round(startTotalMo + maxT * totalYears * 12);
    const curYear  = Math.floor(currentTotalMo / 12);
    const curMoIdx = currentTotalMo % 12;

    const dX = W - 38, dY = PANEL_TOP + 22;
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.font = '11px DM Sans, sans-serif';
    ctx.fillText('Date en cours', dX, dY);
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = 'bold 22px DM Sans, sans-serif';
    ctx.fillText(MONTHS_S[curMoIdx], dX, dY + 28);
    ctx.fillStyle = '#b8934a'; ctx.font = 'bold 40px DM Sans, sans-serif';
    ctx.fillText(String(curYear), dX, dY + 72);
  }

  {
    const BH = 56;
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(4,10,22,0.97)';
    ctx.fillRect(0, H - BH, W, BH);
    ctx.strokeStyle = 'rgba(184,147,74,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(40, H - BH); ctx.lineTo(W - 40, H - BH); ctx.stroke();
    ctx.fillStyle = '#b8934a'; ctx.font = 'bold 20px DM Sans, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('mesimulateurs.fr', W / 2, H - BH + 35);
  }

  const outroPhase = Math.max(0, Math.min(1, (t - 0.92) / 0.08));
  if (outroPhase > 0) {
    ctx.globalAlpha = easeOut(outroPhase) * 0.92;
    ctx.fillStyle = '#060e1c'; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = easeOut(outroPhase);

    ctx.fillStyle = '#b8934a'; ctx.font = 'bold 30px DM Sans, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Résultats de votre simulation', W / 2, 108);
    ctx.fillStyle = 'rgba(255,255,255,0.42)'; ctx.font = '15px DM Sans, sans-serif';
    let outroSub = `${fromLabel} → ${toLabel}  ·  ${fmtK(montantInitial)} investis`;
    if (periodicAmt > 0) outroSub += `  +  ${fmtK(periodicAmt)}${FREQ_FR[periodicFreq] || '/mois'}`;
    ctx.fillText(outroSub, W / 2, 140);

    const n      = Math.min(metrics.length, 5);
    const cardH  = n <= 2 ? 185 : n === 3 ? 158 : n === 4 ? 132 : 110;
    const cardGap = 10;
    const totalH = n * cardH + (n - 1) * cardGap;
    let cardY = Math.max(160, (H - 200 - totalH) / 2);

    metrics.slice(0, 5).forEach((m, i) => {
      const my        = cardY + i * (cardH + cardGap);
      const color     = m.color || '#b8934a';
      const perf      = m.totalReturn;
      const perfColor = perf >= 0 ? '#22c55e' : '#ef4444';

      ctx.fillStyle = `rgba(${hexToRgb(color)},0.08)`;
      roundRect(ctx, 36, my, W - 72, cardH, 16); ctx.fill();
      ctx.strokeStyle = `rgba(${hexToRgb(color)},0.4)`; ctx.lineWidth = 1;
      roundRect(ctx, 36, my, W - 72, cardH, 16); ctx.stroke();

      const mx = 68, midY = my + cardH / 2;
      const logo = logoImages?.[m.ticker];
      drawLogoInCircle(ctx, logo, mx, midY - 18, 14, color, m.label || m.ticker);

      ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.font = 'bold 19px DM Sans, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(m.label || m.ticker, mx + 20, midY - 6);

      ctx.fillStyle = perfColor;
      ctx.font = `bold ${cardH >= 158 ? 28 : 23}px DM Sans, sans-serif`;
      ctx.fillText(`${perf >= 0 ? '+' : ''}${perf.toFixed(1)} %`, mx + 20, midY + 24);

      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '13px DM Sans, sans-serif';
      ctx.fillText(`CAGR: ${m.cagr >= 0 ? '+' : ''}${m.cagr.toFixed(1)} %/an`, mx + 20, midY + 44);

      ctx.textAlign = 'right';
      ctx.fillStyle = lightenHex(color, 0.12);
      ctx.font = `bold ${cardH >= 158 ? 25 : 21}px DM Sans, sans-serif`;
      ctx.fillText(fmtK(m.finalValue), W - 50, midY + 24);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '13px DM Sans, sans-serif';
      ctx.fillText('valeur finale', W - 50, midY + 44);
    });

    const brandY = H - 130;
    ctx.strokeStyle = 'rgba(184,147,74,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, brandY); ctx.lineTo(W - 40, brandY); ctx.stroke();
    ctx.fillStyle = '#b8934a'; ctx.font = 'bold 32px DM Sans, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('mesimulateurs.fr', W / 2, brandY + 46);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '15px DM Sans, sans-serif';
    ctx.fillText('Calculs gratuits · Sans inscription · 100 % confidentiel', W / 2, brandY + 74);
    ctx.globalAlpha = 1;
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ExportModal({ onClose, onLaunch }) {
  const [dur, setDur] = useState(70);
  const font = "'DM Sans', sans-serif";

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d1a30', border: '1px solid rgba(184,147,74,0.45)',
          borderRadius: 16, padding: '24px 28px', width: 340, maxWidth: '90vw',
          fontFamily: font, boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
        }}
      >
        <h3 style={{ color: '#b8934a', fontSize: 16, margin: '0 0 18px', fontWeight: 700 }}>
          🎬 Exporter en vidéo
        </h3>

        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Durée
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {DURATION_OPTIONS.map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '8px 12px', borderRadius: 8,
                background: dur === opt.value ? 'rgba(184,147,74,0.12)' : 'transparent',
                border: `1px solid ${dur === opt.value ? 'rgba(184,147,74,0.4)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio" name="dur" value={opt.value}
                checked={dur === opt.value}
                onChange={() => setDur(opt.value)}
                style={{ accentColor: '#b8934a' }}
              />
              <span style={{ color: dur === opt.value ? '#e8c47e' : 'rgba(255,255,255,0.65)', fontSize: 13, flex: 1 }}>
                {opt.label}
              </span>
              {opt.recommended && (
                <span style={{
                  fontSize: 10, color: '#b8934a',
                  border: '1px solid rgba(184,147,74,0.4)', borderRadius: 4,
                  padding: '1px 6px',
                }}>
                  recommandé
                </span>
              )}
            </label>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '0 0 22px', lineHeight: 1.5 }}>
          Format : WebM VP9 · 720×1280 · 9:16 · Reels / TikTok
          <br />La génération se fait en temps réel dans votre navigateur.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, color: 'rgba(255,255,255,0.5)',
              padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontFamily: font,
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => onLaunch(dur)}
            style={{
              background: 'rgba(184,147,74,0.18)', border: '1px solid rgba(184,147,74,0.5)',
              borderRadius: 8, color: '#e8c47e',
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
}) {
  const { recState, startRecording: ctxStartRecording, stop } = useVideoRecording();
  const [showModal, setShowModal] = useState(false);

  const stateRef  = useRef({ smoothYMax: 0, smoothYMin: 0, smoothXW: 0, initDone: false });
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

  const handleLaunch = async (durationSec) => {
    setShowModal(false);
    stateRef.current = { smoothYMax: 0, smoothYMin: 0, smoothXW: 0, initDone: false };

    // Preload logos (max 3s each)
    logoRef.current = {};
    await Promise.all(assets.map(async (asset) => {
      const domain = TICKER_LOGO[asset.ticker];
      if (!domain) return;
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve; img.onerror = resolve;
          img.src = `https://logo.clearbit.com/${domain}`;
          setTimeout(resolve, 3000);
        });
        if (img.naturalWidth > 0) logoRef.current[asset.ticker] = img;
      } catch {}
    }));

    const filename = `comparateur-${fromLabel.replace(/\s/g,'-')}-${toLabel.replace(/\s/g,'-')}.webm`;
    const lbl = assets.map(a => a.label || a.ticker).join(' vs ');

    ctxStartRecording({ drawFnRef, duration: durationSec * 1000, filename, label: lbl });
  };

  const isSupported = typeof MediaRecorder !== 'undefined';
  const isRecording = recState === 'recording';
  const isProcessing = recState === 'processing';

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
            {isProcessing ? '⏳ Génération…' : isRecording ? '⏹ Arrêter' : '🎬 Reel vidéo'}
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
