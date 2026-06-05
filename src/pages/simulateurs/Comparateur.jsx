import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { track } from '@vercel/analytics';
import ShareBar from '../../components/ShareBar.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import ComparisonVideoExport from '../../components/ComparisonVideoExport.jsx';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import AdUnit from '../../components/AdUnit.jsx';
import JsonLd from '../../components/JsonLd.jsx';
import { downloadCSV, downloadXLSX } from '../../utils/export.js';
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

const FREQ_MONTHS = { monthly: 1, quarterly: 3, semi: 6, annual: 12 };

// ── Cache des prix Yahoo (mémoire + localStorage avec TTL) ──────────────────────
// Les données sont des cours historiques mensuels, quasi immuables : on évite de
// relancer un fetch /api/prices pour une combinaison tickers+période déjà chargée,
// y compris entre deux sessions (rechargement de page).
const PRICE_CACHE_TTL    = 24 * 60 * 60 * 1000; // 24 h
const PRICE_CACHE_PREFIX = 'cmp_prices_v1:';
const priceMemCache = new Map();

function readPriceCache(key) {
  if (priceMemCache.has(key)) return priceMemCache.get(key);
  try {
    const raw = localStorage.getItem(PRICE_CACHE_PREFIX + key);
    if (raw) {
      const { ts, payload } = JSON.parse(raw);
      if (Date.now() - ts < PRICE_CACHE_TTL) {
        priceMemCache.set(key, payload);
        return payload;
      }
      localStorage.removeItem(PRICE_CACHE_PREFIX + key);
    }
  } catch { /* localStorage indisponible */ }
  return null;
}

function writePriceCache(key, payload) {
  priceMemCache.set(key, payload);
  try {
    // Purge les entrées périmées pour limiter l'occupation du quota.
    for (const k of Object.keys(localStorage)) {
      if (!k.startsWith(PRICE_CACHE_PREFIX)) continue;
      try {
        const { ts } = JSON.parse(localStorage.getItem(k));
        if (Date.now() - ts > PRICE_CACHE_TTL) localStorage.removeItem(k);
      } catch { localStorage.removeItem(k); }
    }
    localStorage.setItem(PRICE_CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), payload }));
  } catch { /* quota dépassé : le cache mémoire suffit */ }
}

// ── Calcul de la performance normalisée ────────────────────────────────────────
function calcPerf(rawData, assets, montant, periodicAmt, periodicFreq, reinvestDivs) {
  const freqMos = FREQ_MONTHS[periodicFreq] || 1;
  const computed = {};

  for (const asset of assets) {
    const raw = rawData[asset.ticker];
    if (!raw || raw.error || !Array.isArray(raw) || raw.length < 2) continue;

    // Prix selon mode réinvestissement : adjClose (avec dividendes) ou close (sans)
    const getPrice = p => reinvestDivs
      ? (p.adjClose ?? p.close ?? 0)
      : (p.close    ?? p.adjClose ?? 0);

    // Aussi calculer la série sans réinvestissement pour afficher les intérêts
    const getPriceNoReinvest = p => (p.close ?? p.adjClose ?? 0);

    const base = getPrice(raw[0]);
    if (!base || base <= 0) continue;

    let shares         = montant / base;
    let invested       = montant;
    let sharesNoReinv  = montant / (getPriceNoReinvest(raw[0]) || base);

    computed[asset.ticker] = raw.map((p, idx) => {
      const price        = getPrice(p) || base;
      const priceNoReinv = getPriceNoReinvest(p) || price;

      if (idx > 0 && periodicAmt > 0 && idx % freqMos === 0) {
        shares        += periodicAmt / price;
        sharesNoReinv += periodicAmt / priceNoReinv;
        invested      += periodicAmt;
      }

      const value        = shares * price;
      const valueNoReinv = sharesNoReinv * priceNoReinv;

      return {
        date:      p.date,
        value,
        invested,
        interest:  Math.max(0, value - valueNoReinv),  // gain lié aux dividendes réinvestis
        pct:       ((value / montant) - 1) * 100,
      };
    });
  }
  return computed;
}

function calcMetrics(computed, assets, montant) {
  return assets
    .map(asset => {
      const pts = computed[asset.ticker];
      if (!pts || pts.length < 2) return null;
      const last      = pts[pts.length - 1];
      const totalInv  = last.invested ?? montant;
      const years     = pts.length / 12;
      const tot       = ((last.value / totalInv) - 1) * 100;
      const cagr      = years > 0.5 ? (Math.pow(last.value / totalInv, 1 / years) - 1) * 100 : tot;
      return { ...asset, totalReturn: tot, cagr, finalValue: last.value, totalInvested: totalInv, nPts: pts.length };
    })
    .filter(Boolean)
    .sort((a, b) => b.totalReturn - a.totalReturn);
}

function buildVideoChartData(computed, fromDate, toDate, periodicAmt, showInvestedInVideo) {
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
  if (periodicAmt > 0 && showInvestedInVideo) {
    const firstSeries = Object.values(computed)[0];
    if (firstSeries) {
      result['__invested__'] = firstSeries.map(p => {
        const [y, m] = p.date.split('-').map(Number);
        const ms = new Date(y, m - 1, 1).getTime();
        return { t: Math.max(0, Math.min(1, (ms - fromMs) / span)), value: p.invested };
      });
    }
  }
  return result;
}

// ── Construction des données d'export (CSV / XLSX) ──────────────────────────────
// Table "large" : une ligne par date, une colonne de valeur (€) par actif.
function buildSeriesRows(computed, assets) {
  const allDates = [...new Set(
    Object.values(computed).flatMap(s => s.map(p => p.date))
  )].sort();
  const byTicker = {};
  for (const a of assets) {
    const s = computed[a.ticker];
    if (s) byTicker[a.ticker] = Object.fromEntries(s.map(p => [p.date, p.value]));
  }
  return allDates.map(date => {
    const row = { Date: date };
    for (const a of assets) {
      if (!byTicker[a.ticker]) continue;
      const v = byTicker[a.ticker][date];
      row[`${a.label || a.ticker} (€)`] = v != null ? Math.round(v) : '';
    }
    return row;
  });
}

function buildMetricsRows(metrics) {
  return (metrics || []).map(m => ({
    Actif: m.label || m.ticker,
    Ticker: m.ticker,
    'Retour total (%)': Number(m.totalReturn.toFixed(1)),
    'CAGR (%/an)': Number(m.cagr.toFixed(1)),
    'Capital investi (€)': Math.round(m.totalInvested),
    'Valeur finale (€)': Math.round(m.finalValue),
  }));
}

// ── SVG multi-courbes ─────────────────────────────────────────────────────────
function ComparisonChart({ computed, assets, montant, showPeriodicInChart, showInterest, displayMode = 'euros' }) {
  if (!computed || Object.keys(computed).length === 0) return null;

  const PAD = { top: 20, right: 70, bottom: 36, left: 68 };
  const W = 620, H = 300;
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  // En base 100, on rapporte chaque valeur à l'investissement initial (départ = 100).
  const base100 = displayMode === 'base100';
  const disp    = v => base100 ? (montant > 0 ? (v / montant) * 100 : 0) : v;
  const refVal  = base100 ? 100 : montant;
  const fmtAxis = base100 ? (v => Math.round(v)) : fmtK;

  // Collect all points (sorted by date)
  const allDates = [...new Set(
    Object.values(computed).flatMap(s => s.map(p => p.date))
  )].sort();

  if (allDates.length < 2) return null;

  const allValues = Object.values(computed).flatMap(s => s.map(p => disp(p.value)));
  const rawMax = Math.max(...allValues, refVal) * 1.06;
  const rawMin = Math.min(...allValues, refVal) * 0.94;

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
            {fmtAxis(v)}
          </text>
        </g>
      ))}

      {/* Ligne de référence (montant initial / base 100) */}
      {(() => {
        const refY = y(refVal);
        if (refY < PAD.top || refY > H - PAD.bottom) return null;
        return (
          <line x1={PAD.left} y1={refY} x2={W - PAD.right} y2={refY}
            stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4,3" />
        );
      })()}

      {/* Ligne "capital investi" (DCA) */}
      {showPeriodicInChart && (() => {
        const refSeries = Object.values(computed)[0];
        if (!refSeries) return null;
        const pts = refSeries
          .map(p => {
            const idx = allDates.indexOf(p.date);
            return idx >= 0 ? `${x(idx).toFixed(1)},${y(disp(p.invested ?? montant)).toFixed(1)}` : null;
          })
          .filter(Boolean)
          .join(' ');
        return (
          <polyline points={pts} fill="none" stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5" strokeDasharray="5,4" />
        );
      })()}

      {/* Aires intérêts/dividendes réinvestis */}
      {showInterest && assets.map((asset) => {
        const series = computed[asset.ticker];
        if (!series) return null;
        const color = asset.color;
        const pts = series.map(p => {
          const idx = allDates.indexOf(p.date);
          if (idx < 0) return null;
          return { x: x(idx), yTop: y(disp(p.value)), yBot: y(disp(p.value - (p.interest ?? 0))) };
        }).filter(Boolean);
        if (pts.length < 2) return null;
        const top   = pts.map(p => `${p.x.toFixed(1)},${p.yTop.toFixed(1)}`).join(' ');
        const botRev = [...pts].reverse().map(p => `${p.x.toFixed(1)},${p.yBot.toFixed(1)}`).join(' ');
        return (
          <polygon key={`int-${asset.ticker}`}
            points={`${top} ${botRev}`}
            fill={color} fillOpacity="0.12" stroke="none" />
        );
      })}

      {/* Courbes */}
      {assets.map((asset, i) => {
        const series = computed[asset.ticker];
        if (!series) return null;
        const color = asset.color;

        const polyPts = series
          .map(p => {
            const idx = allDates.indexOf(p.date);
            return idx >= 0 ? `${x(idx).toFixed(1)},${y(disp(p.value)).toFixed(1)}` : null;
          })
          .filter(Boolean)
          .join(' ');

        const lastPt = series[series.length - 1];
        const lastIdx = allDates.indexOf(lastPt?.date ?? '');
        const lx = lastIdx >= 0 ? x(lastIdx) : null;
        const ly = lastPt ? y(disp(lastPt.value)) : null;

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
  const hasDCA = metrics.some(m => m.totalInvested > montant + 0.01);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left',  padding: '10px 0',  color: 'var(--text-secondary)', fontWeight: 600 }}>Actif</th>
            <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Retour total</th>
            <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>CAGR/an</th>
            {hasDCA && <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Capital investi</th>}
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
                {hasDCA && (
                  <td style={{ textAlign: 'right', padding: '12px 8px', color: 'var(--text-secondary)' }}>
                    {fmtK(m.totalInvested ?? montant)}
                  </td>
                )}
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
  const [query,      setQuery]      = useState(asset.ticker);
  const [open,       setOpen]       = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const inputRef   = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.length < 2) { setApiResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const r    = await fetch(`/api/ticker-search?q=${encodeURIComponent(query)}`);
        const data = await r.json();
        setApiResults(Array.isArray(data) ? data : []);
      } catch { setApiResults([]); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const matches = useMemo(() => {
    const q = query.toLowerCase();
    const local = !query ? ASSET_PRESETS : ASSET_PRESETS.filter(p =>
      p.ticker.toLowerCase().includes(q) ||
      p.label.toLowerCase().includes(q)
    );
    const remote = apiResults
      .filter(r => !local.some(l => l.ticker === r.ticker))
      .map(r => ({ ticker: r.ticker, label: r.label, emoji: '📈', desc: `${r.exchange} · ${r.type}` }));
    return [...local, ...remote].slice(0, 10);
  }, [query, apiResults]);

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
          aria-label={`Actif ${idx + 1} : ticker ou nom`}
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
          aria-label="Supprimer cet actif"
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

  // DCA
  const [periodicAmt,         setPeriodicAmt]         = useState(0);
  const [periodicFreq,        setPeriodicFreq]        = useState('monthly');
  const [showPeriodicInChart, setShowPeriodicInChart] = useState(true);

  // Réinvestissement & intérêts
  const [reinvestDivs,  setReinvestDivs]  = useState(true);
  const [showInterest,  setShowInterest]  = useState(false);

  // Mode d'affichage du graphique : 'euros' (valeur du portefeuille) ou
  // 'base100' (indice base 100 — plus lisible pour comparer des actifs de prix
  // très différents).
  const [displayMode, setDisplayMode] = useState('euros');

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

  // Fetch avec debounce + cache
  useEffect(() => {
    const validAssets = assets.filter(a => a.ticker.trim());
    if (validAssets.length === 0) return;

    const tickers = validAssets.map(a => a.ticker).join(',');
    const from = `${fromDate.year}-${String(fromDate.month).padStart(2, '0')}`;
    const to   = `${toDate.year}-${String(toDate.month).padStart(2, '0')}`;
    const cacheKey = `${tickers}|${from}|${to}`;

    // Cache hit : restitution immédiate, sans réseau ni debounce.
    const cached = readPriceCache(cacheKey);
    if (cached) {
      setErrors(cached.errors);
      setRawData(cached.data);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrors({});
      try {
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
        // Ne mémorise que si au moins un actif a renvoyé des données.
        if (Object.keys(clean).length) writePriceCache(cacheKey, { errors: errs, data: clean });
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
    () => Object.keys(rawData).length > 0
      ? calcPerf(rawData, assetsWithColors, montant, periodicAmt, periodicFreq, reinvestDivs)
      : {},
    [rawData, assetsWithColors, montant, periodicAmt, periodicFreq, reinvestDivs]
  );

  const metrics = useMemo(
    () => calcMetrics(computed, assetsWithColors, montant),
    [computed, assetsWithColors, montant]
  );

  const videoChartData = useMemo(
    () => buildVideoChartData(computed, fromDate, toDate, periodicAmt, periodicAmt > 0 && showPeriodicInChart),
    [computed, fromDate, toDate, periodicAmt, showPeriodicInChart]
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

  const exportBaseName = `comparateur-${fromDate.year}-${toDate.year}`;

  const best = metrics && metrics.length > 0 ? metrics[0] : null;
  const report = {
    title: "Comparateur de placements",
    highlight: {
      label: "Meilleure performance",
      value: best ? `${best.label || best.ticker} · ${fmtPct(best.totalReturn)}` : "—",
    },
    params: [
      { label: "Montant investi", value: montant ? fmtEur(montant) : "—" },
      { label: "Période", value: `${fromLabel} → ${toLabel}` },
      { label: "Durée", value: `${totalYears.toFixed(1)} ans` },
      ...(periodicAmt > 0 ? [{ label: "Versement périodique", value: `${fmtEur(periodicAmt)} (${periodicFreq === 'monthly' ? 'mensuel' : periodicFreq})` }] : []),
    ],
    results: best ? metrics.slice(0, 5).map((m, i) => ({
      label: `${i + 1}. ${m.label || m.ticker}`,
      value: `${fmtPct(m.totalReturn)} · ${fmtEur(Math.round(m.finalValue))}`,
      strong: i === 0,
    })) : [],
    notes: best ? [
      `Sur la période, ${best.label || best.ticker} affiche la meilleure performance (${fmtPct(best.totalReturn)}, soit ${fmtPct(best.cagr)}/an).`,
    ] : undefined,
  };

  const handleExportCSV = useCallback(() => {
    const rows = buildSeriesRows(computed, assetsWithColors);
    if (rows.length) downloadCSV(rows, `${exportBaseName}.csv`);
    track('comparateur_export', { format: 'csv' });
  }, [computed, assetsWithColors, exportBaseName]);

  const handleExportXLSX = useCallback(() => {
    const sheets = [
      { name: 'Valeurs (€)', rows: buildSeriesRows(computed, assetsWithColors) },
      { name: 'Métriques',   rows: buildMetricsRows(metrics) },
    ];
    downloadXLSX(sheets, `${exportBaseName}.xlsx`);
    track('comparateur_export', { format: 'xlsx' });
  }, [computed, assetsWithColors, metrics, exportBaseName]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif", color: 'var(--text)' }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Comparateur d'actifs — ETF, actions, crypto",
        "url": "https://www.mesimulateurs.fr/simulateurs/comparateur",
        "description": "Comparez la performance historique d'ETF, actions et cryptomonnaies sur n'importe quelle période : retour total, CAGR, base 100. Données Yahoo Finance.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
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

          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 20px' }} />

          {/* DCA */}
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 16, fontWeight: 400 }}>
            Versements périodiques (DCA)
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <input
              type="number"
              value={periodicAmt}
              min={0}
              max={1_000_000}
              placeholder="0"
              onChange={e => setPeriodicAmt(Math.max(0, parseFloat(e.target.value) || 0))}
              style={{
                width: 110, padding: '8px 12px', borderRadius: 9,
                background: 'var(--input-bg)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>€</span>
            <select
              value={periodicFreq}
              onChange={e => setPeriodicFreq(e.target.value)}
              disabled={periodicAmt === 0}
              style={{
                padding: '8px 10px', borderRadius: 9,
                background: 'var(--input-bg)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                cursor: periodicAmt === 0 ? 'not-allowed' : 'pointer',
                opacity: periodicAmt === 0 ? 0.5 : 1,
              }}
            >
              <option value="monthly">chaque mois</option>
              <option value="quarterly">chaque trimestre</option>
              <option value="semi">chaque semestre</option>
              <option value="annual">chaque année</option>
            </select>
          </div>
          {periodicAmt > 0 && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={showPeriodicInChart}
                onChange={e => setShowPeriodicInChart(e.target.checked)}
                style={{ accentColor: 'var(--gold)', width: 14, height: 14 }}
              />
              Afficher le capital investi dans le graphique
            </label>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

          {/* Réinvestissement & intérêts */}
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 14, fontWeight: 400 }}>
            Dividendes & intérêts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={reinvestDivs}
                onChange={e => setReinvestDivs(e.target.checked)}
                style={{ accentColor: 'var(--gold)', width: 14, height: 14 }}
              />
              <span>Réinvestir les dividendes <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>(prix ajustés — adjClose)</span></span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showInterest}
                onChange={e => setShowInterest(e.target.checked)}
                disabled={!reinvestDivs}
                style={{ accentColor: 'var(--gold)', width: 14, height: 14, cursor: !reinvestDivs ? 'not-allowed' : 'pointer' }}
              />
              <span style={{ opacity: !reinvestDivs ? 0.45 : 1 }}>Afficher les intérêts/dividendes générés <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>(zone colorée sur le graphique)</span></span>
            </label>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', margin: 0, fontWeight: 400 }}>
                Performance — {fromLabel} → {toLabel} ({totalYears.toFixed(1)} ans)
              </h2>
              {/* Sélecteur d'échelle : euros absolus vs base 100 */}
              <div role="group" aria-label="Échelle du graphique" style={{ display: 'flex', background: 'var(--input-bg)', borderRadius: 9, padding: 3, gap: 2 }}>
                {[
                  { id: 'euros',   label: '€ valeur' },
                  { id: 'base100', label: 'Base 100' },
                ].map(opt => {
                  const active = displayMode === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setDisplayMode(opt.id)}
                      aria-pressed={active}
                      style={{
                        padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                        background: active ? 'rgba(184,147,74,0.25)' : 'transparent',
                        color: active ? 'var(--gold)' : 'var(--text-secondary)',
                        fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                      }}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Graphique */}
            <div style={{ marginBottom: 24 }}>
              <ComparisonChart
                computed={computed}
                assets={assetsWithColors}
                montant={montant}
                showPeriodicInChart={periodicAmt > 0 && showPeriodicInChart}
                showInterest={showInterest && reinvestDivs}
                displayMode={displayMode}
              />
              {displayMode === 'base100' && (
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
                  Base 100 : chaque actif part de 100 au début de la période. Une valeur de 150 = +50 %.
                </p>
              )}
            </div>

            {/* Tableau métriques */}
            <MetricsTable metrics={metrics} montant={montant} />

            {/* Note */}
            <div role="note" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 16px', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 16 }}>
              ⚠️ <strong>Données historiques.</strong> Les performances passées ne garantissent pas les performances futures. Données Yahoo Finance (prix ajustés). Calculs hors fiscalité, frais de gestion et inflation.
            </div>

            {/* Export des données */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Exporter les données :</span>
              {[
                { label: '↓ CSV',  onClick: handleExportCSV },
                { label: '↓ Excel', onClick: handleExportXLSX },
              ].map(btn => (
                <button key={btn.label} onClick={btn.onClick}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 9,
                    border: '1px solid var(--border-gold)',
                    background: 'rgba(184,147,74,0.06)',
                    color: 'var(--gold-mid)', fontSize: 12, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,147,74,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(184,147,74,0.06)'}
                >{btn.label}</button>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
              {__VIDEO_ENABLED__ ? (
                <ComparisonVideoExport
                  assets={assetsWithColors}
                  chartData={videoChartData}
                  fromLabel={fromLabel}
                  toLabel={toLabel}
                  startYear={fromDate.year}
                  startMonth={fromDate.month}
                  endYear={toDate.year}
                  totalYears={Math.max(1, totalYears)}
                  montantInitial={montant}
                  metrics={metrics}
                  disabled={!hasResult}
                  periodicAmt={periodicAmt}
                  periodicFreq={periodicFreq}
                  showPeriodicInChart={periodicAmt > 0 && showPeriodicInChart}
                />
              ) : <div />}
              <ShareBar
                params={{ montant }}
                resultsRef={resultsRef}
                report={report}
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
