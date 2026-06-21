import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import SimIcon from "../data/simIcons.jsx";
import { prefetchRoute } from "../utils/prefetch.js";
import { GLOSSARY } from "../data/glossaire.js";
import { Search, X, LayoutGrid, Clock, ShieldCheck } from "lucide-react";
import { useTranslation } from "../i18n/index.js";
import { LocaleLink } from "../lib/router.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useIsMobile } from "../hooks/useIsMobile.js";

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ── FR simulators (full list) ────────────────────────────────────────────────
const SIMULATEURS_FR = [
  // Retraite
  { path: "/simulateurs/synthese-retraite", title: "Synthèse retraite tous régimes", desc: "Additionnez les pensions de tous vos régimes (CNAV, Agirc-Arrco, fonction publique, indépendants, IRCANTEC, MSA, CIPAV) pour estimer votre retraite totale brute, nette et votre taux de remplacement.", tag: "Retraite · Polypensionnés", categories: ["Retraite"], badges: ["new"], available: true },
  { path: "/simulateurs/agirc-arrco", title: "Retraite complémentaire Agirc-Arrco", desc: "Calculez vos points et estimez votre pension nette mensuelle. Intègre bonus-malus, GMP cadres, revalorisation projetée et comparateur de scénarios.", tag: "Retraite · Salariés privés", categories: ["Retraite"], badges: ["popular", "updated"], featured: true, available: true },
  { path: "/simulateurs/cnav", title: "Régime général CNAV", desc: "Estimez votre pension de base en fonction de vos trimestres validés, de votre salaire annuel moyen et de votre âge de départ.", tag: "Retraite · Salariés", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/fonction-publique", title: "Retraite Fonction publique", desc: "Calculez votre pension selon votre indice majoré, votre durée de service, vos bonifications et votre catégorie (sédentaire ou active).", tag: "Retraite · Fonctionnaires", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/independants", title: "Indépendants & TNS", desc: "Simulez votre retraite si vous êtes artisan, commerçant ou profession libérale — régime de base SSI et complémentaire.", tag: "Retraite · Indépendants", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/ircantec", title: "Complémentaire IRCANTEC", desc: "Pour les agents non-titulaires de la fonction publique et élus locaux. Estimez vos points IRCANTEC et votre pension complémentaire.", tag: "Retraite · Contractuels publics", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/retraite-progressive", title: "Retraite progressive", desc: "Envisagez-vous de réduire votre activité avant la retraite complète ? Simulez la pension partielle et l'impact sur votre future pension définitive.", tag: "Retraite · Tous régimes", categories: ["Retraite"], badges: [], available: true },
  { path: "/simulateurs/cnavpl", title: "Professions libérales (CIPAV)", desc: "Estimez votre retraite de base SSI et votre complémentaire CIPAV si vous exercez une profession libérale non réglementée.", tag: "Retraite · Libéraux", categories: ["Retraite"], badges: ["new"], available: true },
  { path: "/simulateurs/msa", title: "Retraite agricole MSA", desc: "Calculez votre retraite de base MSA et votre retraite complémentaire obligatoire (RCO) en tant qu'exploitant ou salarié agricole.", tag: "Retraite · Agriculture", categories: ["Retraite"], badges: ["new"], available: true },
  { path: "/simulateurs/per", title: "Plan d'Épargne Retraite (PER)", desc: "Estimez l'économie d'impôt de vos versements PER, l'effort net et le capital projeté à la retraite selon votre TMI et votre horizon.", tag: "Retraite · Épargne", categories: ["Retraite"], badges: ["new"], available: true },
  // Immobilier
  { path: "/simulateurs/emprunt-immobilier", title: "Emprunt immobilier", desc: "Calculez vos mensualités, votre capacité d'emprunt, le coût total du crédit et votre taux d'endettement. Inclut frais de notaire, primo-accédant et tableau d'amortissement.", tag: "Immobilier", categories: ["Immobilier"], badges: ["new"], available: true },
  { path: "/simulateurs/rendement-locatif", title: "Rendement locatif", desc: "Évaluez la rentabilité brute et nette d'un investissement locatif selon les charges, la fiscalité et les frais de gestion.", tag: "Immobilier", categories: ["Immobilier"], badges: ["new"], available: true },
  { path: "/simulateurs/ptz", title: "Prêt à Taux Zéro (PTZ)", desc: "Estimez votre PTZ primo-accédant : éligibilité, tranche de revenus, quotité et montant finançable selon votre zone et la composition du foyer. Barème 2025.", tag: "Immobilier", categories: ["Immobilier"], badges: ["new"], available: true },
  // Impôts
  { path: "/simulateurs/impot-revenu", title: "Impôt sur le revenu", desc: "Estimez votre IR net, votre tranche marginale d'imposition (TMI) et votre taux moyen selon votre situation familiale.", tag: "Impôts", categories: ["Impôts"], badges: ["new"], available: true },
  { path: "/simulateurs/plus-value-immobiliere", title: "Plus-value immobilière", desc: "Calculez l'imposition de la plus-value lors de la vente d'un bien immobilier selon la durée de détention et les abattements applicables.", tag: "Impôts", categories: ["Impôts"], badges: ["new"], available: true },
  // Finances
  { path: "/simulateurs/budget", title: "Budget & Épargne 50/30/20", desc: "Répartissez votre budget mensuel selon la règle d'or. Donut chart animé, jauges en temps réel et conseils personnalisés selon votre taux d'épargne.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/salaire", title: "Salaire Net/Brut & Évolution de carrière", desc: "Calculez votre salaire net, projetez son évolution sur des décennies et visualisez l'impact de l'inflation sur votre pouvoir d'achat réel.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/epargne", title: "Épargne & intérêts composés", desc: "Projetez la croissance de votre épargne sur le long terme grâce aux intérêts composés et aux versements réguliers.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/fire", title: "Indépendance financière (FIRE)", desc: "Calculez le patrimoine nécessaire pour vivre de vos investissements et estimez à quel âge vous atteindrez la liberté financière. Courbe de projection incluse.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/patrimoine", title: "Patrimoine global", desc: "Consolidez l'ensemble de votre patrimoine — financier, immobilier et retraite — pour visualiser votre richesse nette et sa répartition par classe d'actifs.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/comparateur", title: "Comparateur d'actifs", desc: "Comparez la performance historique d'ETF, actions et cryptos sur la période de votre choix : volatilité, drawdown et rendement annualisé.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/assurance-vie", title: "Assurance-vie", desc: "Projetez la croissance de votre contrat et la fiscalité des gains au rachat : avantage des 8 ans, abattement, PFU et prélèvements sociaux.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  { path: "/simulateurs/credit-conso", title: "Crédit à la consommation", desc: "Calculez la mensualité, le coût total et les intérêts de votre crédit conso à partir du TAEG et de la durée. Tableau d'amortissement inclus.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
  // Vie & Temps
  { path: "/simulateurs/cout-en-heures", title: "Le vrai prix en heures de vie", desc: "Convertissez n'importe quel achat en heures de travail réelles. Quel est le vrai coût de ce restaurant, de cette voiture, de cet abonnement ?", tag: "Vie & Temps", categories: ["Vie & Temps"], badges: ["new"], available: true },
  { path: "/simulateurs/vie-en-semaines", title: "Ma vie en semaines", desc: "Visualisez l'intégralité de votre vie sous forme de grille — une case par semaine. Combien vous en reste-t-il ? Combien d'étés, de week-ends, de visites ?", tag: "Vie & Temps", categories: ["Vie & Temps"], badges: ["new"], available: true },
  // Outils
  { path: "/outils/qr-code", title: "Générateur de QR code", desc: "Créez un QR code personnalisé : vos couleurs, le texte ou lien de votre choix, et votre logo ou un emoji au centre. Téléchargement PNG haute résolution, sans inscription.", tag: "Outils", categories: ["Outils"], badges: ["new"], available: true },
  // Patrimoine & Juridique
  { path: "/simulateurs/succession", title: "Droits de succession", desc: "Calculez les droits de succession selon le lien de parenté, l'actif net transmis et les donations antérieures. Barème officiel 2025 : enfants, conjoint, frères/sœurs. Stratégies de réduction incluses.", tag: "Patrimoine", categories: ["Patrimoine"], badges: ["new"], available: true },
  { path: "/simulateurs/divorce", title: "Divorce & Partage de patrimoine", desc: "Estimez le partage du patrimoine commun, la pension alimentaire et la prestation compensatoire selon votre régime matrimonial. Barème indicatif Ministère de la Justice 2022.", tag: "Patrimoine · Famille", categories: ["Patrimoine"], badges: ["new"], available: true },
  { path: "/simulateurs/freelance-vs-salarie", title: "Freelance vs Salarié", desc: "Comparez votre revenu net disponible selon votre statut : salarié, micro-entrepreneur BIC, micro-BNC ou portage salarial. Charges sociales, IR 2025 et comparatif complet.", tag: "Finances", categories: ["Finances"], badges: ["new"], available: true },
];

// ── EN simulators (universal subset, English content) ────────────────────────
const SIMULATEURS_EN = [
  { path: "/simulateurs/fire", title: "FIRE Calculator", desc: "Calculate the net worth you need to live off your investments and the age at which you reach financial independence. Based on the 4% rule with Lean/Coast/Fat FIRE milestones.", tag: "Finance · FIRE", categories: ["Finance"], badges: ["popular"], featured: true, available: true },
  { path: "/simulateurs/epargne", title: "Compound Interest Calculator", desc: "Project how your savings grow over time with compound interest and regular monthly contributions. See the final balance for any interest rate, duration and savings effort.", tag: "Finance · Savings", categories: ["Finance"], badges: ["new"], available: true },
  { path: "/simulateurs/budget", title: "50/30/20 Budget Calculator", desc: "Split your monthly income with the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Real-time donut chart, gauges and personalised tips.", tag: "Finance · Personal Finance", categories: ["Finance"], badges: ["new"], available: true },
  { path: "/simulateurs/patrimoine", title: "Net Worth Calculator", desc: "Consolidate your financial assets, real estate and retirement savings to see your total net worth and how it breaks down by asset class.", tag: "Finance · Wealth", categories: ["Finance"], badges: ["new"], available: true },
  { path: "/simulateurs/comparateur", title: "Asset Comparison Tool", desc: "Compare the historical performance of ETFs, stocks and cryptocurrencies over any period from real data. Total return, CAGR, and a base-100 index for clean comparisons.", tag: "Finance · Investing", categories: ["Finance"], badges: ["new"], available: true },
  { path: "/simulateurs/credit-conso", title: "Personal Loan Calculator", desc: "Calculate monthly payments, total cost, and total interest of a personal loan. Includes optional insurance and a full amortization schedule.", tag: "Finance · Credit", categories: ["Finance"], badges: ["new"], available: true },
  { path: "/simulateurs/cout-en-heures", title: "Cost in Hours of Work", desc: "Turn any purchase into real hours of your life. Based on your salary, discover the true cost of a product or subscription expressed in time rather than money.", tag: "Finance · Time", categories: ["Finance"], badges: ["new"], available: true },
  { path: "/outils/qr-code", title: "QR Code Generator", desc: "Create a custom QR code: choose your colors, enter any text or URL, add a logo or emoji in the center. High-resolution PNG download, no sign-up required.", tag: "Tools · Free", categories: ["Tools"], badges: ["new"], available: true },
];

const FILTERS_FR = ["Tous", "Retraite", "Immobilier", "Impôts", "Finances", "Vie & Temps", "Patrimoine", "Outils"];
const FILTERS_EN = ["All", "Finance", "Tools"];

const TXT = {
  fr: {
    docTitle: "Simfinly.com — Simulateurs gratuits retraite, immobilier, finances",
    docDesc: (n) => `Simulez votre retraite, emprunt immobilier, impôts, épargne et liberté financière. ${n} simulateurs gratuits, calculs en temps réel, sans inscription.`,
    heroBadge: "Retraite · Immobilier · Impôts · Finances",
    heroTitle: "Simulez vos grandes décisions",
    heroEm: "en toute clarté",
    heroDesc: "Des simulateurs gratuits, précis et pédagogiques pour vos décisions financières importantes — retraite, investissement immobilier, fiscalité et épargne.",
    stat1Label: "simulateurs actifs",
    stat2: "30 s",
    stat2Label: "pour une première estimation",
    stat3: "100 %",
    stat3Label: "gratuit & sans inscription",
    simCountFmt: (n) => n.toLocaleString("fr-FR"),
    simCountLabel: "simulations réalisées",
    searchPlaceholder: "Rechercher un simulateur (retraite, PTZ, impôt, FIRE…)",
    searchAriaLabel: "Rechercher un simulateur",
    clearSearch: "Effacer la recherche",
    filterPrefix: "Filtrer :",
    gridTitle: "Simulateurs disponibles",
    emptyQuery: (q) => `Aucun simulateur ne correspond à « ${q} ».`,
    emptyCategory: "Aucun simulateur dans cette catégorie pour l'instant.",
    lexiqueSection: "Dans le lexique",
    blogSection: "Dans le blog",
    ctaFeatured: "Simuler maintenant →",
    ctaCard: "Simuler →",
    badgePopular: "★ Populaire",
    badgeUpdated: "Mis à jour 2026",
    badgeNew: "Nouveau",
    defaultFilter: "Tous",
  },
  en: {
    docTitle: "Simfinly.com — Free Financial Calculators",
    docDesc: (n) => `Free online financial calculators: compound interest, FIRE, budget 50/30/20, net worth, personal loan, and more. ${n} calculators, instant results, no sign-up.`,
    heroBadge: "Finance · FIRE · Budget · Savings",
    heroTitle: "Make better financial decisions",
    heroEm: "with free calculators",
    heroDesc: "Free, instant, and educational financial calculators — compound interest, FIRE, budget planning, net worth, and more. No sign-up required.",
    stat1Label: "free calculators",
    stat2: "30 s",
    stat2Label: "to get your first result",
    stat3: "100%",
    stat3Label: "free, no sign-up",
    simCountFmt: (n) => n.toLocaleString("en-US"),
    simCountLabel: "calculations completed",
    searchPlaceholder: "Search a calculator (FIRE, savings, budget, loan…)",
    searchAriaLabel: "Search a calculator",
    clearSearch: "Clear search",
    filterPrefix: "Filter:",
    gridTitle: "Available calculators",
    emptyQuery: (q) => `No calculator found for "${q}".`,
    emptyCategory: "No calculator in this category yet.",
    lexiqueSection: null,
    blogSection: null,
    ctaFeatured: "Open calculator →",
    ctaCard: "Calculate →",
    badgePopular: "★ Popular",
    badgeUpdated: "Updated 2026",
    badgeNew: "New",
    defaultFilter: "All",
  },
};

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
    <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
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
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(43,92,230,0.25)"
          style={{ animation: `drift-${i} ${p.dur} ease-in-out infinite`, animationDelay: `${(i * 1.3).toFixed(1)}s` }} />
      ))}
    </svg>
  );
}

function BadgePill({ type, txt }) {
  const styles = {
    popular: { bg: "rgba(184,147,74,0.12)", color: "var(--gold)", border: "1px solid rgba(184,147,74,0.35)" },
    updated: { bg: "rgba(99,102,241,0.12)",  color: "#818cf8",    border: "1px solid rgba(99,102,241,0.25)" },
    new:     { bg: "rgba(34,197,94,0.12)",   color: "#4ade80",    border: "1px solid rgba(34,197,94,0.25)" },
  };
  const labels = { popular: txt.badgePopular, updated: txt.badgeUpdated, new: txt.badgeNew };
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

function FilterBar({ activeFilter, setActiveFilter, filters, filterPrefix }) {
  const refs = useRef({});
  const barRef = useRef(null);
  const isMobile = useIsMobile(480);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    if (isMobile) return;
    const el = refs.current[activeFilter];
    const bar = barRef.current;
    if (!el || !bar) return;
    const barRect = bar.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    setIndicator({ left: elRect.left - barRect.left, top: elRect.top - barRect.top, width: elRect.width, height: elRect.height });
  }, [activeFilter, isMobile]);

  return (
    <div ref={barRef} style={{ position: "relative", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      {!isMobile && (
        <div style={{
          position: "absolute", top: indicator.top, left: indicator.left, width: indicator.width, height: indicator.height,
          background: "var(--primary)", borderRadius: 20,
          transition: "left 0.3s cubic-bezier(0.4,0,0.2,1), top 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: "none", zIndex: 0,
        }} />
      )}
      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "0.82rem", color: "var(--text-secondary)", marginRight: 4, position: "relative", zIndex: 1 }}>{filterPrefix}</span>
      {filters.map(f => {
        const isActive = activeFilter === f;
        return (
          <button key={f} ref={el => { refs.current[f] = el; }} onClick={() => setActiveFilter(f)}
            style={{
              background: isActive ? (isMobile ? "var(--primary)" : "transparent") : "var(--surface)",
              border: `1.5px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
              color: isActive ? "#fff" : "var(--text-secondary)",
              padding: "6px 16px", borderRadius: 20, fontSize: 13,
              cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500,
              transition: "color 0.2s, border-color 0.2s, background 0.2s", position: "relative", zIndex: 1,
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
  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;
  useAuth();

  const SIMULATEURS = locale === 'en' ? SIMULATEURS_EN : SIMULATEURS_FR;
  const FILTERS = locale === 'en' ? FILTERS_EN : FILTERS_FR;

  const [activeFilter, setActiveFilter] = useState(txt.defaultFilter);
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
    document.title = txt.docTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", txt.docDesc(SIMULATEURS.length));
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;

    const cached = getCachedScores();
    if (cached) {
      setScores(cached);
      setTotalViews(Object.values(cached).reduce((a, b) => a + b, 0));
    }
    fetch('/api/scores')
      .then(r => r.json())
      .then(data => {
        setScores(data);
        localStorage.setItem('sim_scores_cache', JSON.stringify({ ts: Date.now(), data }));
        setTotalViews(Object.values(data).reduce((a, b) => a + b, 0));
      })
      .catch(() => {});

    if (locale === 'fr') {
      fetch('/api/articles')
        .then(r => r.json())
        .then(data => setArticles(Array.isArray(data) ? data : []))
        .catch(() => {});
    }

    const t = setTimeout(() => setCardsVisible(true), 100);
    return () => clearTimeout(t);
  }, [locale]);

  // Reset filter when locale changes
  useEffect(() => {
    setActiveFilter(txt.defaultFilter);
  }, [locale, txt.defaultFilter]);

  const nq = norm(query.trim());
  const matchesQuery = s => !nq || norm(`${s.title} ${s.tag} ${s.desc} ${s.categories.join(" ")}`).includes(nq);

  const filtered = SIMULATEURS.filter(s =>
    (activeFilter === txt.defaultFilter || s.categories.includes(activeFilter)) && matchesQuery(s)
  );

  const featured = nq ? null : filtered.find(s => s.featured);
  const regular = [...filtered.filter(s => s !== featured)].sort(
    (a, b) => (scores[b.path.split('/').pop()] || 0) - (scores[a.path.split('/').pop()] || 0)
  );

  const allCards = [featured, ...regular].filter(Boolean);

  const lexMatches = (locale === 'fr' && nq)
    ? GLOSSARY.filter(t => norm(`${t.term} ${t.full} ${t.short} ${(t.aliases || []).join(" ")}`).includes(nq)).slice(0, 8)
    : [];
  const artMatches = (locale === 'fr' && nq)
    ? articles.filter(a => norm(`${a.title} ${a.intro || ""} ${a.category || ""}`).includes(nq)).slice(0, 6)
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)", overflowX: "clip" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      {/* ── Hero ── */}
      <section className="hero-section" style={{ padding: "72px 24px 56px", textAlign: "center", maxWidth: 860, margin: "0 auto", position: "relative" }}>
        <Particles />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 8, maxWidth: "100%", background: "rgba(43,92,230,0.08)", border: "1px solid rgba(43,92,230,0.2)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.5, padding: "6px 14px", borderRadius: 20, marginBottom: 24 }}>
            <span style={{ opacity: 0.7 }}>✦</span> {txt.heroBadge} <span style={{ opacity: 0.7 }}>✦</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.15, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.02em" }}>
            {txt.heroTitle}<br /><em style={{ fontStyle: "italic", color: "var(--primary)" }}>{txt.heroEm}</em>
          </h1>
          <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "clamp(16px, 2vw, 18px)", color: "var(--text-secondary)", fontWeight: 400, lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
            {txt.heroDesc}
          </p>
          <div className="hero-stats" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {[
              { v: simCount, l: txt.stat1Label, Icon: LayoutGrid },
              { v: txt.stat2, l: txt.stat2Label, Icon: Clock },
              { v: txt.stat3, l: txt.stat3Label, Icon: ShieldCheck },
            ].map(({ v, l, Icon }) => (
              <div key={l} style={{ textAlign: "center", background: "var(--surface)", borderRadius: 14, border: "1px solid var(--border)", padding: "18px 24px", boxShadow: "var(--card-shadow)", minWidth: 130 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "var(--primary-soft)", color: "var(--primary)" }}>
                    <Icon size={18} />
                  </span>
                </div>
                <strong style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--primary)", lineHeight: 1.1 }}>{v}</strong>
                <small style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 12, color: "var(--text-secondary)" }}>{l}</small>
              </div>
            ))}
          </div>
          {totalViews > 0 && (
            <div style={{ marginTop: 32, display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--text-secondary)", background: "var(--surface)", border: "1px solid var(--border)", padding: "6px 16px", borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80", animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span><strong style={{ color: "var(--text)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem" }}>{txt.simCountFmt(displayedViews)}</strong> {txt.simCountLabel}</span>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.4); }
        }
      `}</style>

      <div className="home-pad" style={{ maxWidth: 1280, margin: "0 auto 24px", padding: "0 24px" }}>
        <AdUnit slot="auto" format="auto" />
      </div>

      {/* ── Recherche ── */}
      <div className="home-pad" style={{ maxWidth: 1280, margin: "0 auto 18px", padding: "0 24px" }}>
        <div style={{ position: "relative", maxWidth: 540, margin: "0 auto" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex", pointerEvents: "none" }}>
            <Search size={18} />
          </span>
          <input
            type="search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder={txt.searchPlaceholder} aria-label={txt.searchAriaLabel}
            style={{ width: "100%", padding: "12px 44px", borderRadius: 12, background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)", fontSize: 15, fontFamily: "'Hanken Grotesk', sans-serif", outline: "none" }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,92,230,0.12)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label={txt.clearSearch}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", padding: 8, minHeight: 0 }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="filter-bar home-pad" style={{ maxWidth: 1280, margin: "0 auto 36px", padding: "0 24px" }}>
        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} filters={FILTERS} filterPrefix={txt.filterPrefix} />
      </div>

      {/* ── Grid ── */}
      <section className="home-pad" style={{ maxWidth: 1280, margin: "0 auto 0", padding: "0 24px 64px" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          {txt.gridTitle}
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div className="sim-grid">
          {allCards.map((sim, index) => (
            sim.featured
              ? <FeaturedCard key={sim.path} sim={sim} index={0} visible={cardsVisible} txt={txt} />
              : <SimCard key={sim.path} sim={sim} index={index} visible={cardsVisible} txt={txt} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px 0", fontSize: 15 }}>
            {nq ? txt.emptyQuery(query.trim()) : txt.emptyCategory}
          </p>
        )}

        {/* Résultats lexique (FR only) */}
        {txt.lexiqueSection && nq && lexMatches.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              {txt.lexiqueSection}
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {lexMatches.map(t => (
                <Link key={t.slug} to={`/lexique/${t.slug}`} title={t.short} style={{ padding: "8px 14px", borderRadius: 20, textDecoration: "none", background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13 }}>
                  {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Résultats blog (FR only) */}
        {txt.blogSection && nq && artMatches.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              {txt.blogSection}
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: 14 }}>
              {artMatches.map(a => (
                <Link key={a.slug} to={`/blog/${a.slug}`} style={{ display: "block", textDecoration: "none", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px", color: "var(--text)" }}>
                  <div style={{ fontSize: 11, color: "var(--gold-mid)", marginBottom: 6 }}>{a.category}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>{a.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Pro CTA removed */}

      <Footer />
    </div>
  );
}

function FeaturedCard({ sim, index, visible, txt }) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 80;
  return (
    <LocaleLink to={sim.path} className="sim-featured" style={{
      background: "var(--primary-soft)",
      border: `1px solid ${hovered ? "var(--primary)" : "var(--border-gold)"}`, borderRadius: 14, padding: 28,
      display: "flex", gap: 20, alignItems: "flex-start", textDecoration: "none",
      position: "relative", overflow: "hidden",
      transition: `transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease ${delay}ms, translate 0.5s ease ${delay}ms`,
      opacity: visible ? 1 : 0, translate: visible ? "0 0" : "0 24px",
      transform: hovered ? "perspective(800px) rotateY(3deg) translateY(-2px)" : "perspective(800px) rotateY(0deg) translateY(0)",
      boxShadow: hovered ? "0 4px 16px rgba(15,24,40,0.1)" : "0 1px 3px rgba(15,24,40,0.06)",
    }}
      onMouseEnter={() => { setHovered(true); prefetchRoute(sim.path); }}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 54, height: 54, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", background: "rgba(43,92,230,0.15)", border: "1px solid rgba(43,92,230,0.3)", flexShrink: 0 }}>
        <SimIcon path={sim.path} size={28} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {sim.badges.map(b => <BadgePill key={b} type={b} txt={txt} />)}
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{sim.title}</h3>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>{sim.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "var(--chip-bg)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 10 }}>{sim.tag}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--primary)" }}>{txt.ctaFeatured}</span>
        </div>
      </div>
    </LocaleLink>
  );
}

function SimCard({ sim, index, visible, txt }) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 80;
  return (
    <LocaleLink to={sim.path} style={{
      background: "var(--surface)",
      border: `1.5px solid ${hovered ? "var(--primary)" : "var(--border)"}`,
      borderRadius: 14, padding: "20px",
      display: "flex", flexDirection: "column", gap: 16,
      textDecoration: "none", position: "relative", overflow: "hidden",
      transition: `border-color 0.2s, transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease ${delay}ms, translate 0.5s ease ${delay}ms`,
      opacity: visible ? 1 : 0, translate: visible ? "0 0" : "0 24px",
      transform: hovered ? "translateY(-4px)" : "translateY(0)",
      boxShadow: hovered ? "0 8px 28px rgba(43,92,230,0.18)" : "var(--card-shadow)",
    }}
      onMouseEnter={() => { setHovered(true); prefetchRoute(sim.path); }}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", background: "rgba(43,92,230,0.08)", border: "1px solid rgba(43,92,230,0.15)" }}>
          <SimIcon path={sim.path} size={24} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {sim.badges.map(b => <BadgePill key={b} type={b} txt={txt} />)}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{sim.title}</h3>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{sim.desc}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "var(--chip-bg, var(--bg))", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 10 }}>{sim.tag}</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--primary)" }}>{txt.ctaCard}</span>
      </div>
    </LocaleLink>
  );
}
