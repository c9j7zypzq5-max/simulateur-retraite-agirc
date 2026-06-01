import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { track } from '@vercel/analytics';
import ShareBar from '../../components/ShareBar.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import ComparisonVideoExport from '../../components/ComparisonVideoExport.jsx';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import AdUnit from '../../components/AdUnit.jsx';
import { ASSET_PRESETS, ASSET_COLORS } from '../../data/assetPresets.js';
import { SimulateurHeader, fmtEur } from '../../components/ui.jsx';

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const CURRENT_YEAR = 2025;
const MIN_YEAR = 1990;

function fmtPct(v) { return `${v >= 0 ? '+' : ''}${v.toFixed(1)} %`; }
function fmtK(v) {
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(2).replace('.',',')} M€`;
  if (v >= 1_000)     return `${(v/1_000).toFixed(1).replace('.',',')} k€`;
  return `${Math.round(v)} €`;
}

// ── Calcul de la performance normalisée ────────────────────────────────────────
function calcPerf(rawData, assets, montant) {
  const computed = {};
  for (const asset of assets) {
    const raw = rawData[asset.ticker];
    if (!raw || raw.error || !Array.isArray(raw) || raw.length < 2) continue;
    const base = raw[0].close;
    if (!base || base <= 0) continue;
    computed[asset.ticker] = raw.map(p => ({
      date:  p.date,
      value: montant * (p.close / base),
      pct:   ((p.close / base) - 1) * 100,
    }));
  }
  return computed;
}

function calcMetrics(computed, assets, montant) {
  return assets
    .map(asset => {
      const pts = computed[asset.ticker];
      if (!pts || pts.length < 2) return null;
      const last    = pts[pts.length - 1];
      const years   = pts.length / 12;
      const tot     = ((last.value / montant) - 1) * 100;
      const cagr    = years > 0.5 ? (Math.pow(last.value / montant, 1 / years) - 1) * 100 : tot;
      return { ...asset, totalReturn: tot, cagr, finalValue: last.value, nPts: pts.length };
    })
    .filter(Boolean)
    .sort((a, b) => b.totalReturn - a.totalReturn);
}

function buildVideoChartData(computed, fromDate, toDate) {
  const fromMs = new Date(fromDate.year, fromDate.month - 1, 1).getTime();
  const toMs   = new Date(toDate.year,   toDate.month - 1,   1).getTime();
  const span   = toMs - fromMs || 1;
  const result = {};
  for (const [ticker, series] of Object.entries(computed)) {
    result[ticker] = series.map(p => {
      const [y, m] = p.date.split('-').map(Number);
      const ms = new Date(y, m - 1, 1).getTime();
      return { t: Math.max(0, Math.min(1, (ms - fromMs) / span)), value: p.value };
    });
  }
  return result;
}

// ── SVG multi-courbes ─────────────────────────────────────────────────────────
function ComparisonChart({ computed, assets, montant }) {
  if (!computed || Object.keys(computed).length === 0) return null;

  const PAD = { top: 20, right: 70, bottom: 36, left: 68 };
  const W = 620, H = 300;
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  // Collect all points (sorted by date)
  const allDates = [...new Set(
    Object.values(computed).flatMap(s => s.map(p => p.date))
  )].sort();

  if (allDates.length < 2) return null;

  const allValues = Object.values(computed).flatMap(s => s.map(p => p.value));
  const rawMax = Math.max(...allValues, montant) * 1.06;
  const rawMin = Math.min(...allValues, montant) * 0.94;

  const x = idx  => PAD.left + (idx / (allDates.length - 1)) * iW;
  const y = val  => PAD.top  + iH - ((val - rawMin) / (rawMax - rawMin)) * iH;

  const yTicks = [0.2, 0.4, 0.6, 0.8, 1.0].map(f => rawMin + (rawMax - rawMin) * f);
  const xStep  = Math.max(1, Math.ceil(allDates.length / 6));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'min(280px, 52vw)', display: 'block', overflow: 'visible' }}
      aria-label="Graphique de comparaison des actifs"
    >
      {/* Grille Y */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} stroke="var(--border)" strokeWidth="1" />
          <text x={PAD.left - 4} y={y(v) + 4} textAnchor="end" fontSize="8.5" fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
            {fmtK(v)}
          </text>
        </g>
      ))}

      {/* Ligne de référence (montant initial) */}
      {(() => {
        const refY = y(montant);
        if (refY < PAD.top || refY > H - PAD.bottom) return null;
        return (
          <line x1={PAD.left} y1={refY} x2={W - PAD.right} y2={refY}
            stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4,3" />
        );
      })()}

      {/* Courbes */}
      {assets.map((asset, i) => {
        const series = computed[asset.ticker];
        if (!series) return null;
        const color = asset.color;

        const polyPts = series
          .map(p => {
            const idx = allDates.indexOf(p.date);
            return idx >= 0 ? `${x(idx).toFixed(1)},${y(p.value).toFixed(1)}` : null;
          })
          .filter(Boolean)
          .join(' ');

        const lastPt = series[series.length - 1];
        const lastIdx = allDates.indexOf(lastPt?.date ?? '');
        const lx = lastIdx >= 0 ? x(lastIdx) : null;
        const ly = lastPt ? y(lastPt.value) : null;

        return (
          <g key={asset.ticker}>
            <polyline points={polyPts} fill="none" stroke={color} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
            {lx != null && ly != null && (
              <>
                <circle cx={lx} cy={ly} r="4" fill={color} />
                <text x={W - PAD.right + 4} y={ly + 4} fontSize="9" fill={color}
                  fontFamily="DM Sans, sans-serif">
                  {asset.emoji} {fmtPct(lastPt.pct)}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Axes */}
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="var(--border)" strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top}         x2={PAD.left}      y2={H - PAD.bottom} stroke="var(--border)" strokeWidth="1" />

      {/* Labels X */}
      {allDates
        .filter((_, i) => i % xStep === 0 || i === allDates.length - 1)
        .map(date => {
          const idx = allDates.indexOf(date);
          const [yr, mo] = date.split('-');
          const label = mo === '01' ? yr : (idx === 0 || idx === allDates.length - 1 ? `${MONTHS_FR[parseInt(mo)-1]} ${yr}` : '');
          return label ? (
            <text key={date} x={x(idx)} y={H - 4} textAnchor="middle" fontSize="8.5"
              fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
              {label}
            </text>
          ) : null;
        })}
    </svg>
  );
}

// ── Tableau de comparaison ────────────────────────────────────────────────────
function MetricsTable({ metrics, montant }) {
  if (!metrics || metrics.length === 0) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left',  padding: '10px 0',  color: 'var(--text-secondary)', fontWeight: 600 }}>Actif</th>
            <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Retour total</th>
            <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>CAGR/an</th>
            <th style={{ textAlign: 'right', padding: '10px 0',  color: 'var(--text-secondary)', fontWeight: 600 }}>Valeur finale</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => {
            const perfColor = m.totalReturn >= 0 ? '#22c55e' : '#ef4444';
            return (
              <tr key={m.ticker} style={{
                borderBottom: '1px solid var(--border)',
                background: i === 0 ? `rgba(${m.color ? hexToRgbSafe(m.color) : '184,147,74'},0.05)` : 'transparent',
              }}>
                <td style={{ padding: '12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color || '#b8934a', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: 'var(--text)', fontWeight: i === 0 ? 600 : 400 }}>
                        {m.emoji} {m.label || m.ticker}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{m.ticker}</div>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'right', padding: '12px 8px', color: perfColor, fontWeight: 600 }}>
                  {fmtPct(m.totalReturn)}
                </td>
                <td style={{ textAlign: 'right', padding: '12px 8px', color: 'var(--text-secondary)' }}>
                  {fmtPct(m.cagr)}
                </td>
                <td style={{ textAlign: 'right', padding: '12px 0', color: m.color || 'var(--gold)', fontWeight: 500 }}>
                  {fmtK(m.finalValue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6 }}>
        {metrics[0] ? `🏆 Meilleure performance : ${metrics[0].emoji} ${metrics[0].label || metrics[0].ticker} (+${metrics[0].totalReturn.toFixed(1)} %)` : ''}
      </p>
    </div>
  );
}

function hexToRgbSafe(hex) {
  try {
    const h = hex.replace('#','');
    return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
  } catch { return '184,147,74'; }
}

// ── Sélecteur d'actifs ────────────────────────────────────────────────────────
function AssetRow({ asset, idx, onChange, onRemove, canRemove }) {
  const [query, setQuery] = useState(asset.ticker);
  const [open, setOpen]   = useState(false);
  const inputRef = useRef(null);

  const matches = useMemo(() => {
    if (!query) return ASSET_PRESETS;
    const q = query.toLowerCase();
    return ASSET_PRESETS.filter(p =>
      p.ticker.toLowerCase().includes(q) ||
      p.label.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  function selectPreset(preset) {
    setQuery(preset.ticker);
    onChange({ ...asset, ticker: preset.ticker, label: preset.label, emoji: preset.emoji });
    setOpen(false);
  }

  function commitQuery() {
    const match = ASSET_PRESETS.find(p => p.ticker.toLowerCase() === query.toLowerCase());
    if (match) {
      onChange({ ...asset, ticker: match.ticker, label: match.label, emoji: match.emoji });
    } else if (query.trim()) {
      onChange({ ...asset, ticker: query.trim().toUpperCase(), label: query.trim().toUpperCase(), emoji: '📈' });
    }
    setOpen(false);
  }

  const color = ASSET_COLORS[idx % ASSET_COLORS.length];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      {/* Pastille couleur */}
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />

      {/* Input avec suggestions */}
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={e => { if (e.key === 'Enter') { commitQuery(); inputRef.current?.blur(); } }}
          placeholder="Ticker ou nom (ex: AAPL, MSCI World…)"
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 9,
            background: 'var(--input-bg)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: 'var(--input-shadow)',
          }}
        />
        {open && matches.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: 'var(--card-bg)', border: '1px solid var(--border-gold)',
            borderRadius: 10, zIndex: 100, maxHeight: 220, overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}>
            {matches.map(p => (
              <button
                key={p.ticker}
                onMouseDown={() => selectPreset(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '8px 12px', background: 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: '1px solid var(--border)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--input-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ fontSize: 16 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{p.ticker} — {p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Supprimer */}
      {canRemove && (
        <button
          onClick={onRemove}
          title="Supprimer cet actif"
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, flexShrink: 0,
          }}
        >×</button>
      )}
    </div>
  );
}

// ── Sélecteur de date ─────────────────────────────────────────────────────────
function DateSelect({ label, value, onChange }) {
  const years  = [];
  for (let y = CURRENT_YEAR; y >= MIN_YEAR; y--) years.push(y);

  const selStyle = {
    padding: '6px 8px', borderRadius: 8,
    background: 'var(--input-bg)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
  };

  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <select value={value.month} onChange={e => onChange({ ...value, month: parseInt(e.target.value) })} style={selStyle}>
          {MONTHS_FR.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={value.year} onChange={e => onChange({ ...value, year: parseInt(e.target.value) })} style={selStyle}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────────
export default function Comparateur() {
  const [theme, setTheme] = useTheme();

  const [assets, setAssets] = useState([
    { id: 0, ticker: '^GSPC',   label: 'S&P 500',          emoji: '🇺🇸', color: ASSET_COLORS[0] },
    { id: 1, ticker: 'IWDA.AS', label: 'MSCI World (IWDA)', emoji: '🌍', color: ASSET_COLORS[1] },
  ]);

  const [fromDate, setFromDate] = useState({ year: 2015, month: 1 });
  const [toDate,   setToDate]   = useState({ year: 2024, month: 12 });
  const [montant,  setMontant]  = useState(10000);

  const [rawData,  setRawData]  = useState({});
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const resultsRef = useRef(null);

  useEffect(() => {
    document.title = 'Comparateur d\'actifs 2025 — ETF, actions, crypto — mesimulateurs.fr';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Comparez la performance historique d\'ETF, actions et cryptos sur n\'importe quelle période. Données réelles Yahoo Finance. Gratuit, sans inscription.');
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr/simulateurs/comparateur';
    track('simulator_view', { name: 'comparateur' });
    if (!sessionStorage.getItem('tracked_comparateur')) {
      sessionStorage.setItem('tracked_comparateur', '1');
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'comparateur' }) }).catch(() => {});
    }
  }, []);

  // Fetch avec debounce
  useEffect(() => {
    const validAssets = assets.filter(a => a.ticker.trim());
    if (validAssets.length === 0) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrors({});
      try {
        const tickers = validAssets.map(a => a.ticker).join(',');
        const from = `${fromDate.year}-${String(fromDate.month).padStart(2, '0')}`;
        const to   = `${toDate.year}-${String(toDate.month).padStart(2, '0')}`;
        const resp = await fetch(`/api/prices?tickers=${encodeURIComponent(tickers)}&from=${from}&to=${to}`);
        if (!resp.ok) throw new Error(`Erreur serveur HTTP ${resp.status}`);
        const json = await resp.json();

        // Séparer erreurs et données valides
        const errs = {};
        const clean = {};
        for (const [ticker, val] of Object.entries(json)) {
          if (val?.error) errs[ticker] = val.error;
          else clean[ticker] = val;
        }
        setErrors(errs);
        setRawData(clean);
      } catch (e) {
        setErrors({ _global: e.message });
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [assets, fromDate, toDate]);

  const assetsWithColors = useMemo(
    () => assets.map((a, i) => ({ ...a, color: ASSET_COLORS[i % ASSET_COLORS.length] })),
    [assets]
  );

  const computed = useMemo(
    () => Object.keys(rawData).length > 0 ? calcPerf(rawData, assetsWithColors, montant) : {},
    [rawData, assetsWithColors, montant]
  );

  const metrics = useMemo(
    () => calcMetrics(computed, assetsWithColors, montant),
    [computed, assetsWithColors, montant]
  );

  const videoChartData = useMemo(
    () => buildVideoChartData(computed, fromDate, toDate),
    [computed, fromDate, toDate]
  );

  const hasResult  = Object.keys(computed).length >= 1;
  const totalYears = toDate.year - fromDate.year + (toDate.month - fromDate.month) / 12;
  const fromLabel  = `${MONTHS_FR[fromDate.month - 1]} ${fromDate.year}`;
  const toLabel    = `${MONTHS_FR[toDate.month - 1]} ${toDate.year}`;

  const addAsset = useCallback(() => {
    if (assets.length >= 5) return;
    const nextId = Date.now();
    const preset = ASSET_PRESETS.find(p => !assets.some(a => a.ticker === p.ticker));
    setAssets(prev => [
      ...prev,
      { id: nextId, ticker: preset?.ticker || '', label: preset?.label || '', emoji: preset?.emoji || '📈', color: ASSET_COLORS[prev.length % ASSET_COLORS.length] },
    ]);
  }, [assets]);

  const updateAsset = useCallback((id, updated) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updated, color: a.color } : a));
  }, []);

  const removeAsset = useCallback((id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif", color: 'var(--text)' }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px 60px' }}>
        <SimulateurHeader
          icon="📊"
          badge="Finances · Données réelles"
          title="Comparateur d'actifs"
          desc="Comparez la performance historique d'actions, ETF et cryptomonnaies sur n'importe quelle période. Données réelles, résultats instantanés."
        />

        {/* Bandeau features */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, background: 'rgba(184,147,74,0.07)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '12px 20px', marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          {['✓ Jusqu\'à 5 actifs simultanés', '✓ Données Yahoo Finance', '✓ Investissement normalisé', '✓ CAGR & retour total'].map((t, i) => (
            <span key={i} style={{ whiteSpace: 'nowrap' }}>{t}</span>
          ))}
        </div>

        {/* Formulaire */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 28px', boxShadow: 'var(--card-shadow)', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 20, fontWeight: 400 }}>
            Actifs à comparer
          </h2>

          {assets.map((asset, idx) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              idx={idx}
              onChange={upd => updateAsset(asset.id, upd)}
              onRemove={() => removeAsset(asset.id)}
              canRemove={assets.length > 1}
            />
          ))}

          {assets.length < 5 && (
            <button
              onClick={addAsset}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 9,
                border: '1px solid var(--border-gold)',
                background: 'rgba(184,147,74,0.06)',
                color: 'var(--gold-mid)', fontSize: 12, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", marginBottom: 8,
              }}
            >+ Ajouter un actif ({assets.length}/5)</button>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />

          {/* Période */}
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 20, fontWeight: 400 }}>
            Période
          </h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            <DateSelect label="Date de début" value={fromDate} onChange={setFromDate} />
            <DateSelect label="Date de fin"   value={toDate}   onChange={setToDate}   />
          </div>

          {/* Montant */}
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 16, fontWeight: 400 }}>
            Investissement initial
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="number"
              value={montant}
              min={100}
              max={10_000_000}
              onChange={e => setMontant(Math.max(1, parseFloat(e.target.value) || 0))}
              style={{
                width: 140, padding: '8px 12px', borderRadius: 9,
                background: 'var(--input-bg)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>€ investis au départ (normalisé pour tous les actifs)</span>
          </div>
        </div>

        {/* Erreurs */}
        {Object.keys(errors).length > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
            {errors._global && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>⚠️ {errors._global}</p>}
            {Object.entries(errors).filter(([k]) => k !== '_global').map(([ticker, err]) => (
              <p key={ticker} style={{ color: '#ef4444', fontSize: 13, margin: '4px 0' }}>
                ⚠️ <strong>{ticker}</strong> : {err}
              </p>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
            <p style={{ fontSize: 14 }}>Chargement des données…</p>
            <p style={{ fontSize: 12, opacity: 0.6 }}>Yahoo Finance · données historiques mensuelles</p>
          </div>
        )}

        {/* Résultats */}
        {!loading && hasResult && (
          <div
            ref={resultsRef}
            style={{ background: 'linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))', border: '1px solid var(--border-gold)', borderRadius: 20, padding: '28px 28px', marginBottom: 20, boxShadow: 'var(--card-shadow)' }}
          >
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 20, fontWeight: 400 }}>
              Performance — {fromLabel} → {toLabel} ({totalYears.toFixed(1)} ans)
            </h2>

            {/* Graphique */}
            <div style={{ marginBottom: 24 }}>
              <ComparisonChart computed={computed} assets={assetsWithColors} montant={montant} />
            </div>

            {/* Tableau métriques */}
            <MetricsTable metrics={metrics} montant={montant} />

            {/* Note */}
            <div role="note" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 16px', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 16 }}>
              ⚠️ <strong>Données historiques.</strong> Les performances passées ne garantissent pas les performances futures. Données Yahoo Finance (prix ajustés). Calculs hors fiscalité, frais de gestion et inflation.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
              <ComparisonVideoExport
                assets={assetsWithColors}
                chartData={videoChartData}
                fromLabel={fromLabel}
                toLabel={toLabel}
                startYear={fromDate.year}
                endYear={toDate.year}
                totalYears={Math.max(1, totalYears)}
                montantInitial={montant}
                metrics={metrics}
                disabled={!hasResult}
              />
              <ShareBar
                params={{ montant }}
                resultsRef={resultsRef}
                name="comparateur"
                showDownload
              />
            </div>
          </div>
        )}

        {/* État vide */}
        {!loading && !hasResult && Object.keys(errors).length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 28px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 14, marginBottom: 6 }}>Sélectionnez vos actifs et validez votre période</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>Les données Yahoo Finance seront chargées automatiquement</p>
          </div>
        )}

        <div style={{ margin: '24px 0' }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px,4vw,26px)', fontWeight: 600, color: 'var(--text)', marginBottom: 24 }}>
            À propos de ce comparateur
          </h2>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Comment lire les résultats ?</h3>
            <p style={{ marginBottom: 16 }}>Tous les actifs sont <strong>normalisés</strong> : peu importe leur prix réel, chaque actif part de votre montant initial au même moment. Cela permet une comparaison équitable. Si vous investissez 10 000 € et que le S&P 500 affiche +150 %, cela signifie que vos 10 000 € seraient devenus 25 000 €.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: 'var(--text)', marginTop: 20, marginBottom: 10 }}>Qu'est-ce que le CAGR ?</h3>
            <p style={{ marginBottom: 16 }}>Le <strong>CAGR</strong> (Compound Annual Growth Rate) est le taux de croissance annuel composé. C'est la métrique la plus pertinente pour comparer des actifs sur des durées différentes. Un CAGR de 10 % signifie que votre investissement a crû de 10 % par an en moyenne sur toute la période, effets composés inclus.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: 'var(--text)', marginTop: 20, marginBottom: 10 }}>Attention au biais du rétrospectif</h3>
            <p>Choisir une période favorable à un actif (ex: Bitcoin de 2020 à 2021) peut créer une illusion de performance. Préférez des périodes longues (10+ ans) et incluez des marchés baissiers pour avoir une image réaliste du risque.</p>
          </div>
        </div>

        <div style={{ margin: '24px 0' }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}
