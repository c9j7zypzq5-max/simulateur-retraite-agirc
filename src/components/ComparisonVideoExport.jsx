import { useState, useRef, useCallback } from 'react';

const DURATION = 70_000; // 70 secondes

function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function easeOut(t)   { return 1 - Math.pow(1-t, 3); }

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

const FREQ_FR = { monthly: '/mois', quarterly: '/trimestre', semi: '/semestre', annual: '/an' };

// ─── drawFrame ────────────────────────────────────────────────────────────────
function drawFrame(ctx, {
  t, chartData, assets, montantInitial, totalYears, startYear, startMonth, endYear,
  fromLabel, toLabel, metrics, stateRef, periodicAmt, periodicFreq, showPeriodicInChart,
}) {
  const W = 720, H = 1280;

  // ── Background
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

  // ── Header 2 lignes (boîte plus haute)
  const BOX_TOP = 26, BOX_H = 108;
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(184,147,74,0.1)';
  roundRect(ctx, 28, BOX_TOP, W - 56, BOX_H, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(184,147,74,0.4)';
  ctx.lineWidth = 1;
  roundRect(ctx, 28, BOX_TOP, W - 56, BOX_H, 28);
  ctx.stroke();

  // Ligne 1 : noms des actifs "S&P 500  vs  MSCI World"
  const headerTitle = assets.map(a => `${a.emoji || ''} ${a.label || a.ticker}`).join('  vs  ');
  let hFontSize = 20;
  ctx.font = `bold ${hFontSize}px DM Sans, sans-serif`;
  while (ctx.measureText(headerTitle).width > W - 80 && hFontSize > 11) {
    hFontSize--;
    ctx.font = `bold ${hFontSize}px DM Sans, sans-serif`;
  }
  ctx.fillStyle = '#b8934a';
  ctx.textAlign = 'center';
  ctx.fillText(headerTitle, W/2, BOX_TOP + 42);

  // Ligne 2 : "10 000 € investis en Jan. 2015 · + 200 €/mois"
  let subtitle = `${fmtFull(montantInitial)} investis en ${fromLabel}`;
  if (periodicAmt > 0) subtitle += `  ·  + ${fmtK(periodicAmt)}${FREQ_FR[periodicFreq] || '/mois'}`;
  let sFontSize = 14;
  ctx.font = `${sFontSize}px DM Sans, sans-serif`;
  while (ctx.measureText(subtitle).width > W - 90 && sFontSize > 9) {
    sFontSize--;
    ctx.font = `${sFontSize}px DM Sans, sans-serif`;
  }
  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  ctx.fillText(subtitle, W/2, BOX_TOP + 72);

  // ── Chart area (plus grand)
  // CX=50, CY=154, CW=574 (marge droite 96px pour tip labels), CH=710
  const CX = 50, CY = 154, CW = W - 50 - 96, CH = 710;
  // chart bottom = 864

  const chartPhase    = Math.max(0, Math.min(1, t / 0.92));
  const chartProgress = Math.pow(chartPhase, 0.45);
  const maxT = chartProgress;

  // Points visibles par actif (t-based, sync parfaite)
  const tickerPts = {};
  for (const [ticker, pts] of Object.entries(chartData)) {
    if (ticker === '__invested__') continue;
    if (!Array.isArray(pts) || pts.length < 2) continue;
    const visible = pts.filter(p => p.t <= maxT);
    if (visible.length < 1) { tickerPts[ticker] = [pts[0]]; continue; }
    const nextIdx = pts.findIndex(p => p.t > maxT);
    if (nextIdx > 0) {
      const prev = pts[nextIdx - 1];
      const next = pts[nextIdx];
      const alpha = (maxT - prev.t) / Math.max(next.t - prev.t, 0.0001);
      tickerPts[ticker] = [...visible, { t: maxT, value: prev.value + (next.value - prev.value) * alpha }];
    } else {
      tickerPts[ticker] = visible;
    }
  }

  // Série capital investi (DCA)
  let investedPts = null;
  if (showPeriodicInChart && Array.isArray(chartData['__invested__']) && chartData['__invested__'].length >= 2) {
    const raw = chartData['__invested__'];
    const visible = raw.filter(p => p.t <= maxT);
    if (visible.length >= 1) {
      const nextIdx = raw.findIndex(p => p.t > maxT);
      if (nextIdx > 0) {
        const prev = raw[nextIdx - 1];
        const next = raw[nextIdx];
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
    // ── Y axis lissé
    const rawYMax = Math.max(...allVisible.map(p => p.value), montantInitial) * 1.18;
    const rawYMin = Math.min(...allVisible.map(p => p.value), montantInitial) * 0.88;

    const st = stateRef.current;
    if (!st.initDone) {
      st.smoothYMax = rawYMax;
      st.smoothYMin = rawYMin;
      st.smoothXW   = totalYears > 0 ? Math.min(1, 1 / totalYears) : 1;
      st.initDone   = true;
    }
    st.smoothYMax += (rawYMax - st.smoothYMax) * 0.05;
    st.smoothYMin += (rawYMin - st.smoothYMin) * 0.05;
    const yMax = st.smoothYMax;
    const yMin = st.smoothYMin;

    const currentFrac = Math.max(...allVisible.map(p => p.t), 0);
    const initXW      = totalYears > 0 ? Math.min(1, 1 / totalYears) : 1;
    const targetXW    = Math.min(1, Math.max(initXW, currentFrac * 1.18));
    st.smoothXW += (targetXW - st.smoothXW) * 0.04;
    const xWindow = Math.min(1, st.smoothXW);

    const cx = frac => CX + (frac / Math.max(xWindow, 0.001)) * CW;
    const cy = v    => CY + CH - ((v - yMin) / Math.max(yMax - yMin, 1)) * CH;

    // Ligne de base (montant initial)
    const baseY = cy(montantInitial);
    if (baseY >= CY - 2 && baseY <= CY + CH + 2) {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CX, baseY); ctx.lineTo(CX + CW, baseY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(fmtK(montantInitial), CX + 4, baseY - 4);
      ctx.globalAlpha = 1;
    }

    // ── Courbes des actifs
    const tipPositions = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const pts   = tickerPts[asset.ticker];
      if (!pts || pts.length < 2) continue;
      const color = asset.color;
      const visPts = pts.filter(p => p.t <= xWindow + 0.005);
      if (visPts.length < 2) continue;

      // Aire
      ctx.globalAlpha = 0.06 + i * 0.01;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx(visPts[0].t), cy(yMin));
      visPts.forEach(p => {
        const px = cx(p.t);
        if (px >= CX - 2 && px <= CX + CW + 2) ctx.lineTo(px, cy(p.value));
      });
      ctx.lineTo(cx(visPts[visPts.length-1].t), cy(yMin));
      ctx.closePath();
      ctx.fill();

      // Ligne
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap  = 'round';
      ctx.beginPath();
      let started = false;
      visPts.forEach(p => {
        const px = cx(p.t), py = cy(p.value);
        if (px < CX - 5 || px > CX + CW + 5) return;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Point pulsant au tip
      const last = visPts[visPts.length - 1];
      const lx = cx(last.t), ly = cy(last.value);
      if (lx >= CX && lx <= CX + CW) {
        const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 10 + i * 1.6);
        ctx.fillStyle = `rgba(${hexToRgb(color)},${0.15 + 0.12 * pulse})`;
        ctx.beginPath(); ctx.arc(lx, ly, 10 + 3 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = lightenHex(color, 0.2);
        ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.fill();

        // Label valeur + % à droite du graphique
        const perfPct = ((last.value / montantInitial) - 1) * 100;
        const perfStr = (perfPct >= 0 ? '+' : '') + perfPct.toFixed(1) + '%';
        const valStr  = fmtFull(last.value);
        let labelY = Math.max(CY + 22, Math.min(CY + CH - 22, ly));
        for (const prev of tipPositions) {
          if (Math.abs(labelY - prev) < 46) labelY = prev + 46;
        }
        tipPositions.push(labelY);
        const lbX = CX + CW + 10;
        ctx.font = 'bold 16px DM Sans, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = lightenHex(color, 0.15);
        ctx.fillText(valStr, lbX, labelY);
        ctx.font = '13px DM Sans, sans-serif';
        ctx.fillStyle = `rgba(${hexToRgb(color)},0.85)`;
        ctx.fillText(perfStr, lbX, labelY + 16);
      }
    }

    // ── Ligne capital investi (DCA) dans le graphique
    if (investedPts && investedPts.length >= 2) {
      const visPts = investedPts.filter(p => p.t <= xWindow + 0.005);
      if (visPts.length >= 2) {
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = 'rgba(200,210,230,0.85)';
        ctx.setLineDash([8, 5]);
        ctx.lineWidth = 1.8;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        let started = false;
        visPts.forEach(p => {
          const px = cx(p.t), py = cy(p.value);
          if (px < CX - 5 || px > CX + CW + 5) return;
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
    }

    // ── Axes
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CX, CY); ctx.lineTo(CX, CY + CH);
    ctx.moveTo(CX, CY + CH); ctx.lineTo(CX + CW, CY + CH);
    ctx.stroke();

    // ── Ticks Y
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    for (const f of [0.25, 0.5, 0.75, 1.0]) {
      const val = yMin + (yMax - yMin) * f;
      const yy  = cy(val);
      if (yy < CY + 10 || yy > CY + CH - 10) continue;
      ctx.fillText(fmtK(val), CX - 4, yy + 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(CX, yy); ctx.lineTo(CX + CW, yy); ctx.stroke();
    }

    // ── Labels X (années)
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '12px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    const yearsRange = endYear - startYear;
    for (let yr = startYear; yr <= endYear; yr++) {
      const frac = yearsRange > 0 ? (yr - startYear) / yearsRange : 0;
      if (frac > xWindow + 0.02) break;
      const px = cx(frac);
      if (px >= CX && px <= CX + CW) {
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillText(String(yr), px, CY + CH + 22);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, CY); ctx.lineTo(px, CY + CH); ctx.stroke();
      }
    }

    // ── Bottom panel : légende (gauche) + date (droite)
    ctx.globalAlpha = 1;
    const PANEL_TOP = CY + CH + 28;

    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(CX, PANEL_TOP); ctx.lineTo(W - 34, PANEL_TOP); ctx.stroke();

    const ROW_H = 52;
    const MAX_NAME_W = 330;

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const pts   = tickerPts[asset.ticker];
      const color = asset.color;
      const rowY  = PANEL_TOP + 16 + i * ROW_H;

      // Dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(CX + 8, rowY + 10, 7, 0, Math.PI * 2);
      ctx.fill();

      // Nom de l'actif (tronqué si trop long)
      const assetName = asset.emoji
        ? `${asset.emoji} ${asset.label || asset.ticker}`
        : (asset.label || asset.ticker);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = '15px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      let nameText = assetName;
      if (ctx.measureText(nameText).width > MAX_NAME_W) {
        while (ctx.measureText(nameText + '…').width > MAX_NAME_W && nameText.length > 1) {
          nameText = nameText.slice(0, -1);
        }
        nameText += '…';
      }
      ctx.fillText(nameText, CX + 22, rowY + 14);

      // Valeur + pourcentage (plus grand)
      if (pts && pts.length >= 1) {
        const last   = pts[pts.length - 1];
        const pct    = ((last.value / montantInitial) - 1) * 100;
        const pctClr = pct >= 0 ? '#4ade80' : '#f87171';
        const valStr = fmtFull(last.value);

        ctx.fillStyle = lightenHex(color, 0.1);
        ctx.font = 'bold 22px DM Sans, sans-serif';
        ctx.fillText(valStr, CX + 22, rowY + 37);

        const vw = ctx.measureText(valStr).width;
        ctx.fillStyle = pctClr;
        ctx.font = 'bold 14px DM Sans, sans-serif';
        ctx.fillText(`${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, CX + 22 + vw + 8, rowY + 37);
      }
    }

    // ── Capital investi dans la légende (si DCA activé)
    if (investedPts && investedPts.length >= 1) {
      const last = investedPts[investedPts.length - 1];
      const rowY = PANEL_TOP + 16 + assets.length * ROW_H;

      // Tiret pointillé (indicateur visuel)
      ctx.strokeStyle = 'rgba(200,210,230,0.65)';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(CX + 2, rowY + 10);
      ctx.lineTo(CX + 18, rowY + 10);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(200,210,230,0.45)';
      ctx.font = '13px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Capital investi', CX + 24, rowY + 14);

      ctx.fillStyle = 'rgba(200,210,230,0.8)';
      ctx.font = 'bold 19px DM Sans, sans-serif';
      ctx.fillText(fmtFull(last.value), CX + 24, rowY + 35);
    }

    // ── Date courante (droite du panel)
    const MONTHS_S = ['Jan.','Fév.','Mars','Avr.','Mai','Juin','Juil.','Août','Sep.','Oct.','Nov.','Déc.'];
    const sMonth = startMonth || 1;
    const startTotalMo    = startYear * 12 + sMonth - 1;
    const currentTotalMo  = Math.round(startTotalMo + maxT * totalYears * 12);
    const curYear  = Math.floor(currentTotalMo / 12);
    const curMoIdx = currentTotalMo % 12;

    const dX = W - 38;
    const dY = PANEL_TOP + 22;
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.fillText('Date en cours', dX, dY);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 22px DM Sans, sans-serif';
    ctx.fillText(MONTHS_S[curMoIdx], dX, dY + 28);
    ctx.fillStyle = '#b8934a';
    ctx.font = 'bold 40px DM Sans, sans-serif';
    ctx.fillText(String(curYear), dX, dY + 72);
  }

  // ── Branding permanent
  {
    const BH = 56;
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(4,10,22,0.97)';
    ctx.fillRect(0, H - BH, W, BH);
    ctx.strokeStyle = 'rgba(184,147,74,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(40, H - BH); ctx.lineTo(W - 40, H - BH); ctx.stroke();
    ctx.fillStyle = '#b8934a';
    ctx.font = 'bold 20px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('mesimulateurs.fr', W / 2, H - BH + 35);
  }

  // ── Outro (t 0.92→1.00)
  const outroPhase = Math.max(0, Math.min(1, (t - 0.92) / 0.08));
  if (outroPhase > 0) {
    ctx.globalAlpha = easeOut(outroPhase) * 0.92;
    ctx.fillStyle = '#060e1c';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = easeOut(outroPhase);

    ctx.fillStyle = '#b8934a';
    ctx.font = 'bold 22px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Résultats de votre simulation', W/2, 100);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.fillText(`${fromLabel} → ${toLabel}  ·  ${fmtK(montantInitial)} investis`, W/2, 128);

    const n      = Math.min(metrics.length, 5);
    const cardH  = n <= 2 ? 170 : n === 3 ? 145 : n === 4 ? 122 : 104;
    const cardGap = 10;
    const totalH = n * cardH + (n - 1) * cardGap;
    let cardY = Math.max(155, (H - 200 - totalH) / 2);

    metrics.slice(0, 5).forEach((m, i) => {
      const my    = cardY + i * (cardH + cardGap);
      const color = m.color || '#b8934a';
      const perf  = m.totalReturn;
      const perfColor = perf >= 0 ? '#22c55e' : '#ef4444';

      ctx.fillStyle = `rgba(${hexToRgb(color)},0.08)`;
      roundRect(ctx, 36, my, W - 72, cardH, 16);
      ctx.fill();
      ctx.strokeStyle = `rgba(${hexToRgb(color)},0.4)`;
      ctx.lineWidth = 1;
      roundRect(ctx, 36, my, W - 72, cardH, 16);
      ctx.stroke();

      const mx = 62;
      const midY = my + cardH / 2;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(mx, midY - 12, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'bold 16px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      const name = m.emoji ? `${m.emoji} ${m.label || m.ticker}` : (m.label || m.ticker);
      ctx.fillText(name, mx + 18, midY - 6);

      ctx.fillStyle = perfColor;
      ctx.font = `bold ${cardH >= 145 ? 24 : 20}px DM Sans, sans-serif`;
      ctx.fillText(`${perf >= 0 ? '+' : ''}${perf.toFixed(1)} %`, mx + 18, midY + 18);

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '12px DM Sans, sans-serif';
      ctx.fillText(`CAGR: ${m.cagr >= 0 ? '+' : ''}${m.cagr.toFixed(1)} %/an`, mx + 18, midY + 36);

      ctx.textAlign = 'right';
      ctx.fillStyle = lightenHex(color, 0.12);
      ctx.font = `bold ${cardH >= 145 ? 22 : 18}px DM Sans, sans-serif`;
      ctx.fillText(fmtK(m.finalValue), W - 50, midY + 18);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '11px DM Sans, sans-serif';
      ctx.fillText('valeur finale', W - 50, midY + 36);
    });

    const brandY = H - 130;
    ctx.strokeStyle = 'rgba(184,147,74,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, brandY); ctx.lineTo(W-40, brandY); ctx.stroke();

    ctx.fillStyle = '#b8934a';
    ctx.font = 'bold 30px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('mesimulateurs.fr', W/2, brandY + 44);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '15px DM Sans, sans-serif';
    ctx.fillText('Calculs gratuits · Sans inscription · 100 % confidentiel', W/2, brandY + 72);

    ctx.globalAlpha = 1;
  }

  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
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
  const canvasRef  = useRef(null);
  const recRef     = useRef(null);
  const rafRef     = useRef(null);
  const chunksRef  = useRef([]);
  const stateRef   = useRef({ smoothYMax: 0, smoothYMin: 0, smoothXW: 0, initDone: false });

  const [state,    setState]    = useState('idle');
  const [progress, setProgress] = useState(0);

  const stopAll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
  }, []);

  const startRecording = useCallback(async () => {
    if (!canvasRef.current || disabled) return;
    setState('recording');
    setProgress(0);
    chunksRef.current = [];
    stateRef.current = { smoothYMax: 0, smoothYMin: 0, smoothXW: 0, initDone: false };

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const stream = canvas.captureStream(30);

    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    recRef.current = rec;

    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      setState('processing');
      const blob = new Blob(chunksRef.current, { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `comparateur-${fromLabel.replace(/\s/g,'-')}-${toLabel.replace(/\s/g,'-')}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      setState('idle');
    };

    rec.start();
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const tt = Math.min(elapsed / DURATION, 1);

      drawFrame(ctx, {
        t: tt, chartData, assets, montantInitial,
        totalYears, startYear, startMonth, endYear, fromLabel, toLabel,
        metrics, stateRef, periodicAmt, periodicFreq, showPeriodicInChart,
      });

      setProgress(Math.round(tt * 100));

      if (tt < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rec.stop();
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [disabled, chartData, assets, montantInitial, totalYears, startYear, startMonth, endYear, fromLabel, toLabel, metrics, periodicAmt, periodicFreq, showPeriodicInChart]);

  const isSupported = typeof MediaRecorder !== 'undefined';

  const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px',
    background: state === 'recording' ? 'rgba(239,68,68,0.12)' : 'var(--card-bg)',
    border: `1px solid ${state === 'recording' ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
    borderRadius: 10,
    color: state === 'recording' ? '#ef4444' : 'var(--text-secondary)',
    fontSize: 12, fontFamily: "'DM Sans', sans-serif",
    cursor: state === 'processing' ? 'wait' : (disabled ? 'not-allowed' : 'pointer'),
    transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <canvas ref={canvasRef} width={720} height={1280} style={{ display: 'none' }} />

      {isSupported && (
        <button
          onClick={state === 'recording' ? stopAll : startRecording}
          disabled={state === 'processing' || disabled}
          style={btnStyle}
          onMouseEnter={e => { if (state === 'idle' && !disabled) { e.currentTarget.style.borderColor = 'var(--gold-mid)'; e.currentTarget.style.color = 'var(--gold)'; } }}
          onMouseLeave={e => { if (state === 'idle') { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
        >
          {state === 'recording' && <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', flexShrink: 0 }} />}
          {state === 'processing' ? '⏳ Génération…' :
           state === 'recording'  ? '⏹ Arrêter'      :
           '🎬 Reel (1min10)'}
        </button>
      )}

      {state === 'idle' && isSupported && !disabled && (
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
          9:16 · 70 s · Reels / TikTok
        </span>
      )}
      {state === 'recording' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180 }}>
          <progress
            value={progress}
            max={100}
            style={{ width: '100%', height: 4, accentColor: '#b8934a' }}
          />
          <span style={{ fontSize: 10, color: '#ef4444', letterSpacing: '0.03em' }}>
            Enregistrement… {progress}% (1min10)
          </span>
        </div>
      )}
    </div>
  );
}
