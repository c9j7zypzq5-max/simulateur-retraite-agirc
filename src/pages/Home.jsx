import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import SimIcon from "../data/simIcons.jsx";
import { prefetchRoute } from "../utils/prefetch.js";
import { GLOSSARY } from "../data/glossaire.js";
import { Search, X } from "lucide-react";

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const SIMULATEURS = [
  // Retraite
  { path: "/simulateurs/synthese-retraite", icon: "🧮", title: "Synthèse retraite tous régimes", desc: "Additionnez les pensions de tous vos régimes (CNAV, Agirc-Arrco, fonction publique, indépendants, IRCANTEC, MSA, CIPAV) pour estimer votre retraite totale brute, nette et votre taux de remplacement.", tag: "Retraite · Polypensionnés", categories: ["Retraite"], badges: ["new"], available: true },
  { path: "/simulateurs/agirc-arrco", icon: "🏆", title: "Retraite complémentaire Agirc-Arrco", desc: "Calculez vos points et estimez votre pension nette mensuelle. Intègre bonus-malus, GMP cadres, revalorisation projetée et comparateur de scénarios.", tag: "Retraite · Salariés privés", categories: ["Retraite"], badges: ["popular", "updated"], featured: true, available: true },
  { path: "/simulateurs/cnav", icon: "🏛", title: "Régime général CNAV", desc: "Estimez votre pension de base en fonction de vos trimestres validés, de votre salaire annuel moyen et de votre âge de départ.", tag: "Retraite · Salariés", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/fonction-publique", icon: "⚖️", title: "Retraite Fonction publique", desc: "Calculez votre pension selon votre indice majoré, votre durée de service, vos bonifications et votre catégorie (sédentaire ou active).", tag: "Retraite · Fonctionnaires", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/independants", icon: "💼", title: "Indépendants & TNS", desc: "Simulez votre retraite si vous êtes artisan, commerçant ou profession libérale — régime de base SSI et complémentaire.", tag: "Retraite · Indépendants", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/ircantec", icon: "🏢", title: "Complémentaire IRCANTEC", desc: "Pour les agents non-titulaires de la fonction publique et élus locaux. Estimez vos points IRCANTEC et votre pension complémentaire.", tag: "Retraite · Contractuels publics", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/retraite-progressive", icon: "📅", title: "Retraite progressive", desc: "Envisagez-vous de réduire votre activité avant la retraite complète ? Simulez la pension partielle et l'impact sur votre future pension définitive.", tag: "Retraite · Tous régimes", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/cnavpl", icon: "👨‍⚕️", title: "Professions libérales (CIPAV)", desc: "Estimez votre retraite de base SSI et votre complémentaire CIPAV si vous exercez une profession libérale non réglementée.", tag: "Retraite · Libéraux", categories: ["Retraite"], badges: ["new"], available: true },
  { path: "/simulateurs/msa", icon: "🌾", title: "Retraite agricole MSA", desc: "Calculez votre retraite de base MSA et votre retraite complémentaire obligatoire (RCO) en tant qu'exploitant ou salarié agricole.", tag: "Retraite · Agriculture", categories: ["Retraite"], badges: ["new"], available: true },
  { path: "/simulateurs/per", icon: "💼", title: "Plan d'Épargne Retraite (PER)", desc: "Estimez l'économie d'impôt de vos versements PER, l'effort net et le capital projeté à la retraite selon votre TMI et votre horizon.", tag: "Retraite · Épargne", categories: ["Retraite"], badges: ["new"], available: true },
  // Immobilier
  { path: "/simulateurs/emprunt-immobilier", icon: "🏠", title: "Emprunt immobilier", desc: "Calculez vos mensualités, votre capacité d'emprunt, le coût total du crédit et votre taux d'endettement. Inclut frais de notaire, primo-accédant et tableau d'amortissement.", tag: "Immobilier", categories: ["Immobilier"], badges: ["new"], available: true },
  { path: "/simulateurs/rendement-locatif", icon: "📊", title: "Rendement locatif", desc: "Évaluez la rentabilité brute et nette d'un investissement locatif selon les charges, la fiscalité et les frais de gestion.", tag: "Immobilier", categories: ["Immobilier"], badges: ["new"], available: true },
  { path: "/simulateurs/ptz", icon: "🏡", title: "Prêt à Taux Zéro (PTZ)", desc: "Estimez votre PTZ primo-accédant : éligibilité, tranche de revenus, quotité et montant finançable selon votre zone et la composition du foyer. Barème 2025.", tag: "Immobilier", categories: ["Immobilier"], badges: ["new"], available: true },
  // Impôts
  { path: "/simulateurs/impot-revenu", icon: "📋", title: "Impôt sur le revenu", desc: "Estimez votre IR net, votre tranche marginale d'imposition (TMI) et votre taux moyen selon votre situation familiale.", tag: "Impôts", categories: ["Impôts"], badges: ["new"], available: true },
  { path: "/simulateurs/plus-value-immobiliere", icon: "📈", title: "Plus-value immobilière", desc: "Calculez l'imposition de la plus-value lors de la vente d'un bien immobilier selon la durée de détention et les abattements applicables.", tag: "Impôts", categories: ["Impôts"], badges: ["new"], available: true },
  // Finances
  { path: "/simulateurs/budget", icon: "📊", title: "Budget & Épargne 50/30/20", desc: "Répartissez votre budget mensuel selon la règle d'or. Donut chart animé, jauges en temps réel et conseils personnalisés selon votre taux d'épargne.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/salaire", icon: "💼", title: "Salaire Net/Brut & Évolution de carrière", desc: "Calculez votre salaire net, projetez son évolution sur des décennies et visualisez l'impact de l'inflation sur votre pouvoir d'achat réel.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/epargne", icon: "💰", title: "Épargne & intérêts composés", desc: "Projetez la croissance de votre épargne sur le long terme grâce aux intérêts composés et aux versements réguliers.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/fire", icon: "🔥", title: "Indépendance financière (FIRE)", desc: "Calculez le patrimoine nécessaire pour vivre de vos investissements et estimez à quel âge vous atteindrez la liberté financière. Courbe de projection incluse.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/patrimoine", icon: "💎", title: "Patrimoine global", desc: "Consolidez l'ensemble de votre patrimoine — financier, immobilier et retraite — pour visualiser votre richesse nette et sa répartition par classe d'actifs.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/comparateur", icon: "📊", title: "Comparateur d'actifs", desc: "Comparez la performance historique d'ETF, actions et cryptos sur la période de votre choix : volatilité, drawdown et rendement annualisé.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/assurance-vie", icon: "🛡️", title: "Assurance-vie", desc: "Projetez la croissance de votre contrat et la fiscalité des gains au rachat : avantage des 8 ans, abattement, PFU et prélèvements sociaux.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/credit-conso", icon: "💳", title: "Crédit à la consommation", desc: "Calculez la mensualité, le coût total et les intérêts de votre crédit conso à partir du TAEG et de la durée. Tableau d'amortissement inclus.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  // Vie & Temps
  { path: "/simulateurs/cout-en-heures", icon: "⏰", title: "Le vrai prix en heures de vie", desc: "Convertissez n'importe quel achat en heures de travail réelles. Quel est le vrai coût de ce restaurant, de cette voiture, de cet abonnement ?", tag: "Vie & Temps", categories: ["Vie & Temps"], badges: ["new"], available: true },
  { path: "/simulateurs/vie-en-semaines", icon: "📅", title: "Ma vie en semaines", desc: "Visualisez l'intégralité de votre vie sous forme de grille — une case par semaine. Combien vous en reste-t-il ? Combien d'étés, de week-ends, de visites ?", tag: "Vie & Temps", categories: ["Vie & Temps"], badges: ["new"], available: true },
];

const FILTERS = ["Tous", "Retraite", "Immobilier", "Impôts", "Finances", "Vie & Temps"];

// ── Animated counter via requestAnimationFrame ────────────────────────────────
function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf, timeout;
    timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(ease * target));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return value;
}

// ── Gold particles (SVG pur, CSS animé) ──────────────────────────────────────
const PARTICLES = [
  { cx: "8%",  cy: "15%", r: 2.5, dur: "18s", dx: "30px", dy: "20px" },
  { cx: "18%", cy: "60%", r: 1.8, dur: "22s", dx: "-20px", dy: "35px" },
  { cx: "30%", cy: "30%", r: 2,   dur: "25s", dx: "15px",  dy: "-25px" },
  { cx: "45%", cy: "80%", r: 1.5, dur: "20s", dx: "-25px", dy: "15px" },
  { cx: "55%", cy: "10%", r: 2.2, dur: "28s", dx: "20px",  dy: "30px" },
  { cx: "65%", cy: "50%", r: 1.6, dur: "16s", dx: "-15px", dy: "-20px" },
  { cx: "72%", cy: "25%", r: 2.8, dur: "23s", dx: "25px",  dy: "20px" },
  { cx: "80%", cy: "70%", r: 1.4, dur: "19s", dx: "-30px", dy: "10px" },
  { cx: "88%", cy: "40%", r: 2,   dur: "26s", dx: "10px",  dy: "-30px" },
  { cx: "92%", cy: "85%", r: 1.7, dur: "21s", dx: "-20px", dy: "25px" },
  { cx: "12%", cy: "90%", r: 2.1, dur: "24s", dx: "35px",  dy: "-15px" },
  { cx: "38%", cy: "55%", r: 1.9, dur: "17s", dx: "-10px", dy: "30px" },
  { cx: "58%", cy: "75%", r: 1.3, dur: "29s", dx: "20px",  dy: "-20px" },
];

function Particles() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
    >
      <defs>
        {PARTICLES.map((p, i) => (
          <style key={i}>{`
            @keyframes drift-${i} {
              0%   { transform: translate(0, 0) scale(1); opacity: 0.5; }
              33%  { transform: translate(${p.dx}, ${p.dy}) scale(1.3); opacity: 0.8; }
              66%  { transform: translate(calc(${p.dx} * -0.5), calc(${p.dy} * 0.7)) scale(0.9); opacity: 0.4; }
              100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            }
          `}</style>
        ))}
      </defs>
      {PARTICLES.map((p, i) => (
        <circle
          key={i}
          cx={p.cx} cy={p.cy} r={p.r}
          fill="rgba(184,147,74,0.55)"
          style={{ animation: `drift-${i} ${p.dur} ease-in-out infinite`, animationDelay: `${(i * 1.3).toFixed(1)}s` }}
        />
      ))}
    </svg>
  );
}

function BadgePill({ type }) {
  const styles = {
    popular: { bg: "rgba(184,147,74,0.12)", color: "var(--gold)", border: "1px solid rgba(184,147,74,0.35)" },
    updated: { bg: "rgba(99,102,241,0.12)",  color: "#818cf8",    border: "1px solid rgba(99,102,241,0.25)" },
    new:     { bg: "rgba(34,197,94,0.12)",   color: "#4ade80",    border: "1px solid rgba(34,197,94,0.25)" },
  };
  const labels = { popular: "★ Populaire", updated: "Mis à jour 2026", new: "Nouveau" };
  const s = styles[type] || {};
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.06em", background: s.bg, color: s.color, border: s.border }}>
      {labels[type]}
    </span>
  );
}

function getCachedScores() {
  try {
    const cached = JSON.parse(localStorage.getItem('sim_scores_cache') || 'null');
    if (cached && Date.now() - cached.ts < 10 * 60 * 1000) return cached.data;
  } catch {}
  return null;
}

// ── Sliding filter indicator ──────────────────────────────────────────────────
function useIsMobile(breakpoint = 480) {
  const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return mobile;
}

function FilterBar({ activeFilter, setActiveFilter }) {
  const refs = useRef({});
  const barRef = useRef(null);
  const isMobile = useIsMobile(480);
  // indicator tracks {left, top, width, height} relative to barRef
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    if (isMobile) return;
    const el = refs.current[activeFilter];
    const bar = barRef.current;
    if (!el || !bar) return;
    const barRect = bar.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    setIndicator({
      left:   elRect.left   - barRect.left,
      top:    elRect.top    - barRect.top,
      width:  elRect.width,
      height: elRect.height,
    });
  }, [activeFilter, isMobile]);

  return (
    <div ref={barRef} style={{ position: "relative", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      {/* Sliding indicator — desktop uniquement, suit exactement le bouton actif */}
      {!isMobile && (
        <div style={{
          position: "absolute",
          top: indicator.top,
          left: indicator.left,
          width: indicator.width,
          height: indicator.height,
          background: "rgba(184,147,74,0.1)",
          border: "1px solid var(--border-gold)",
          borderRadius: 20,
          transition: "left 0.3s cubic-bezier(0.4,0,0.2,1), top 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: "none",
          zIndex: 0,
        }} />
      )}
      <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginRight: 4, position: "relative", zIndex: 1 }}>Filtrer :</span>
      {FILTERS.map(f => {
        const isActive = activeFilter === f;
        return (
          <button
            key={f}
            ref={el => { refs.current[f] = el; }}
            onClick={() => setActiveFilter(f)}
            style={{
              // Sur mobile : background direct sur le bouton actif ; sur desktop : géré par l'indicateur
              background: isMobile && isActive ? "rgba(184,147,74,0.1)" : "transparent",
              border: `1px solid ${isActive ? (isMobile ? "var(--border-gold)" : "transparent") : "var(--border)"}`,
              color: isActive ? "var(--gold)" : "var(--text-secondary)",
              padding: "9px 16px", borderRadius: 20, fontSize: "0.8rem",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.2s, border-color 0.2s, background 0.2s",
              position: "relative", zIndex: 1,
            }}>
            {f}
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useTheme();
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [query, setQuery] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("q") || ""; } catch { return ""; }
  });
  const [scores, setScores] = useState({});
  const [totalViews, setTotalViews] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [articles, setArticles] = useState([]);

  const simCount = useCountUp(SIMULATEURS.length, 900, 200);
  const displayedViews = useCountUp(totalViews, 1200, 600);

  useEffect(() => {
    document.title = "Simfinly.com — Simulateurs gratuits retraite, immobilier, finances";
    document.querySelector('meta[name="description"]')?.setAttribute("content", `Simulez votre retraite, emprunt immobilier, impôts, épargne et liberté financière. ${SIMULATEURS.length} simulateurs gratuits, calculs en temps réel, sans inscription.`);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;

    const cached = getCachedScores();
    if (cached) {
      setScores(cached);
      const total = Object.values(cached).reduce((a, b) => a + b, 0);
      setTotalViews(total);
    }
    fetch('/api/scores')
      .then(r => r.json())
      .then(data => {
        setScores(data);
        localStorage.setItem('sim_scores_cache', JSON.stringify({ ts: Date.now(), data }));
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        setTotalViews(total);
      })
      .catch(() => {});

    // Articles du blog (pour la recherche globale).
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => {});

    // Trigger card cascade after a short delay
    const t = setTimeout(() => setCardsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const nq = norm(query.trim());
  const matchesQuery = s => !nq || norm(`${s.title} ${s.tag} ${s.desc} ${s.categories.join(" ")}`).includes(nq);

  const filtered = SIMULATEURS.filter(s =>
    (activeFilter === "Tous" || s.categories.includes(activeFilter)) && matchesQuery(s)
  );

  // Pas de carte « à la une » pendant une recherche → résultats homogènes.
  const featured = nq ? null : filtered.find(s => s.featured);
  const regular = [...filtered.filter(s => s !== featured)].sort(
    (a, b) => (scores[b.path.split('/').pop()] || 0) - (scores[a.path.split('/').pop()] || 0)
  );

  const allCards = [featured, ...regular].filter(Boolean);

  // Recherche globale : termes du lexique + articles de blog correspondants.
  const lexMatches = nq
    ? GLOSSARY.filter(t => norm(`${t.term} ${t.full} ${t.short} ${(t.aliases || []).join(" ")}`).includes(nq)).slice(0, 8)
    : [];
  const artMatches = nq
    ? articles.filter(a => norm(`${a.title} ${a.intro || ""} ${a.category || ""}`).includes(nq)).slice(0, 6)
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      {/* ── Hero ── */}
      <section className="hero-section" style={{ padding: "72px 24px 56px", textAlign: "center", maxWidth: 860, margin: "0 auto", position: "relative" }}>
        <Particles />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)", color: "var(--gold)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 20, marginBottom: 28 }}>
            <span style={{ opacity: 0.7 }}>✦</span> Retraite · Immobilier · Impôts · Finances <span style={{ opacity: 0.7 }}>✦</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,5vw,3.4rem)", fontWeight: 700, lineHeight: 1.15, color: "var(--text)", marginBottom: 20 }}>
            Simulez vos grandes décisions<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>en toute clarté</em>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
            Des simulateurs gratuits, précis et pédagogiques pour vos décisions financières importantes — retraite, investissement immobilier, fiscalité et épargne.
          </p>
          <div className="hero-stats" style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[
              { v: simCount, l: "simulateurs actifs", suffix: "" },
              { v: "30 s", l: "pour une première estimation", suffix: "" },
              { v: "100 %", l: "gratuit & sans inscription", suffix: "" },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <strong style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--gold)" }}>
                  {v}
                </strong>
                <small style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{l}</small>
              </div>
            ))}
          </div>

          {/* Visitor counter */}
          {totalViews > 0 && (
            <div style={{ marginTop: 32, display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--text-secondary)", background: "rgba(184,147,74,0.06)", border: "1px solid var(--border)", padding: "6px 16px", borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80", animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span><strong style={{ color: "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}>{displayedViews.toLocaleString("fr-FR")}</strong> simulations réalisées</span>
            </div>
          )}
        </div>
      </section>

      {/* Pulse animation for live dot */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.4); }
        }
      `}</style>

      {/* ── AdSense ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto 24px", padding: "0 24px" }}>
        <AdUnit slot="auto" format="auto" />
      </div>

      {/* ── Recherche ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto 18px", padding: "0 24px" }}>
        <div style={{ position: "relative", maxWidth: 540, margin: "0 auto" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex", pointerEvents: "none" }}>
            <Search size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un simulateur (retraite, PTZ, impôt, FIRE…)"
            aria-label="Rechercher un simulateur"
            style={{
              width: "100%", padding: "13px 44px", borderRadius: 14,
              background: "var(--input-bg)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
              boxShadow: "var(--input-shadow)", outline: "none",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--gold-mid)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Effacer la recherche"
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", padding: 8, minHeight: 0 }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="filter-bar" style={{ maxWidth: 1280, margin: "0 auto 36px", padding: "0 24px" }}>
        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      </div>

      {/* ── Grid ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto 0", padding: "0 24px 64px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          Simulateurs disponibles
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div className="sim-grid">
          {allCards.map((sim, index) => (
            sim.featured
              ? <FeaturedCard key={sim.path} sim={sim} index={0} visible={cardsVisible} />
              : <SimCard key={sim.path} sim={sim} index={index} visible={cardsVisible} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px 0", fontSize: 15 }}>
            {nq ? `Aucun simulateur ne correspond à « ${query.trim()} ».` : "Aucun simulateur dans cette catégorie pour l'instant."}
          </p>
        )}

        {/* Résultats lexique (recherche globale) */}
        {nq && lexMatches.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              Dans le lexique
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {lexMatches.map(t => (
                <Link key={t.slug} to={`/lexique/${t.slug}`} title={t.short} style={{
                  padding: "8px 14px", borderRadius: 20, textDecoration: "none",
                  background: "var(--card-bg)", border: "1px solid var(--border)",
                  color: "var(--text)", fontSize: 13,
                }}>
                  {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Résultats blog (recherche globale) */}
        {nq && artMatches.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              Dans le blog
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {artMatches.map(a => (
                <Link key={a.slug} to={`/blog/${a.slug}`} style={{
                  display: "block", textDecoration: "none",
                  background: "var(--card-bg)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "16px 18px", color: "var(--text)",
                }}>
                  <div style={{ fontSize: 11, color: "var(--gold-mid)", marginBottom: 6 }}>{a.category}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>{a.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function FeaturedCard({ sim, index, visible }) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 80;

  return (
    <Link to={sim.path} className="sim-featured" style={{
      background: "linear-gradient(145deg,rgba(184,147,74,0.07),var(--card-bg))",
      border: "1px solid var(--border-gold)",
      borderRadius: 14, padding: 28,
      display: "flex", gap: 20, alignItems: "flex-start",
      textDecoration: "none",
      position: "relative", overflow: "hidden",
      transition: `
        transform 0.35s cubic-bezier(0.4,0,0.2,1),
        box-shadow 0.35s cubic-bezier(0.4,0,0.2,1),
        opacity 0.5s ease ${delay}ms,
        translate 0.5s ease ${delay}ms
      `,
      opacity: visible ? 1 : 0,
      translate: visible ? "0 0" : "0 24px",
      transform: hovered
        ? "perspective(800px) rotateY(3deg) translateY(-2px)"
        : "perspective(800px) rotateY(0deg) translateY(0)",
      boxShadow: hovered
        ? "0 12px 40px rgba(184,147,74,0.2), 0 4px 12px rgba(0,0,0,0.15)"
        : "none",
    }}
      onMouseEnter={() => { setHovered(true); prefetchRoute(sim.path); }}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 54, height: 54, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", background: "rgba(184,147,74,0.12)", border: "1px solid var(--border-gold)", flexShrink: 0 }}><SimIcon path={sim.path} size={28} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {sim.badges.map(b => <BadgePill key={b} type={b} />)}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{sim.title}</h3>
        <p style={{ fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>{sim.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "var(--chip-bg)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 10 }}>{sim.tag}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--gold)" }}>Simuler maintenant →</span>
        </div>
      </div>
    </Link>
  );
}

function SimCard({ sim, index, visible }) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 80;

  return (
    <Link to={sim.path} style={{
      background: "var(--card-bg)",
      border: `1px solid ${hovered ? "var(--border-gold)" : "var(--border)"}`,
      borderRadius: 14, padding: 28,
      display: "flex", flexDirection: "column", gap: 16,
      textDecoration: "none",
      position: "relative", overflow: "hidden",
      transition: `
        border-color 0.25s,
        transform 0.35s cubic-bezier(0.4,0,0.2,1),
        box-shadow 0.35s cubic-bezier(0.4,0,0.2,1),
        opacity 0.5s ease ${delay}ms,
        translate 0.5s ease ${delay}ms
      `,
      opacity: visible ? 1 : 0,
      translate: visible ? "0 0" : "0 24px",
      transform: hovered
        ? "perspective(800px) rotateY(3deg) translateY(-2px)"
        : "perspective(800px) rotateY(0deg) translateY(0)",
      boxShadow: hovered
        ? "0 12px 40px rgba(184,147,74,0.15), 0 4px 12px rgba(0,0,0,0.12)"
        : "none",
    }}
      onMouseEnter={() => { setHovered(true); prefetchRoute(sim.path); }}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)" }}><SimIcon path={sim.path} size={24} /></div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {sim.badges.map(b => <BadgePill key={b} type={b} />)}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{sim.title}</h3>
        <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{sim.desc}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "var(--chip-bg)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 10 }}>{sim.tag}</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--gold)" }}>Simuler →</span>
      </div>
    </Link>
  );
}
