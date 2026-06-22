import { useState, useEffect, useCallback, useRef } from "react";
import { Link, LocaleLink, useLocation, useLocale, useCountry } from "../lib/router.jsx";
import { useSimHistory } from "../hooks/useSimHistory.js";
import { useAuth } from "../hooks/useAuth.js";
import SimIcon from "../data/simIcons.jsx";
import CurrencySelect from "./CurrencySelect.jsx";
import CountrySwitch from "./CountrySwitch.jsx";
import { CURRENCY_AWARE_ROUTES } from "../i18n/currencyRoutes.js";
import { canonicalPath, localePath } from "../i18n/paths.js";
import { Landmark, House, Receipt, Wallet, Clock, Newspaper, BookOpen, Library, QrCode, User, LogIn } from "lucide-react";

const GROUP_ICONS = { retraite: Landmark, immobilier: House, impots: Receipt, finances: Wallet, "vie-temps": Clock, outils: QrCode };

const TXT_NAV = {
  fr: {
    openNav: "Ouvrir la navigation",
    closeNav: "Fermer la navigation",
    officialData: "Données officielles 2026",
    drawerTitle: "Navigation",
    navAriaLabel: "Navigation principale",
    simNavAriaLabel: "Simulateurs disponibles",
    currentPage: "Page actuelle",
    home: "Accueil",
    homeSubtitle: "Tous les simulateurs",
    backToAll: "← Tous les simulateurs",
    guidesSubtitle: "Parcours par thématique",
    blogSubtitle: "Articles & guides financiers",
    lexiqueSubtitle: "Définitions des termes financiers",
    savedSims: "Simulations sauvegardées",
    clearHistory: "Effacer",
    viewAll: "Tout voir →",
    login: "Connexion",
    account: "Mon compte",
    currency: "Devise",
    comingSoon: "Bientôt",
    deleteEntry: "Supprimer",
    relDate: (d, h, m) => d > 0 ? `il y a ${d}j` : h > 0 ? `il y a ${h}h` : m > 0 ? `il y a ${m} min` : "à l'instant",
  },
  en: {
    openNav: "Open navigation",
    closeNav: "Close navigation",
    officialData: "",
    drawerTitle: "Menu",
    navAriaLabel: "Main navigation",
    simNavAriaLabel: "Available calculators",
    currentPage: "Current page",
    home: "Home",
    homeSubtitle: "All calculators",
    backToAll: "← All calculators",
    guidesSubtitle: null,
    blogSubtitle: null,
    lexiqueSubtitle: null,
    savedSims: "Saved calculations",
    clearHistory: "Clear",
    viewAll: "See all →",
    login: "Sign in",
    account: "My account",
    currency: "Currency",
    comingSoon: "Soon",
    deleteEntry: "Remove",
    relDate: (d, h, m) => d > 0 ? `${d}d ago` : h > 0 ? `${h}h ago` : m > 0 ? `${m}min ago` : "just now",
  },
};

function relativeDate(iso, locale) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000);
  return (TXT_NAV[locale] ?? TXT_NAV.fr).relDate(d, h, m);
}

/* ── Données de navigation FR ── */
const ALL_ITEMS_FR = [
  { path: "/simulateurs/synthese-retraite",    title: "Synthèse retraite",      subtitle: "Tous régimes cumulés" },
  { path: "/simulateurs/agirc-arrco",          title: "Agirc-Arrco",            subtitle: "Retraite complémentaire" },
  { path: "/simulateurs/cnav",                 title: "CNAV",                   subtitle: "Régime général" },
  { path: "/simulateurs/fonction-publique",    title: "Fonction publique",       subtitle: "Retraite statutaire" },
  { path: "/simulateurs/independants",         title: "Indépendants / TNS",      subtitle: "SSI + RCI" },
  { path: "/simulateurs/ircantec",             title: "IRCANTEC",                subtitle: "Agents non-titulaires" },
  { path: "/simulateurs/retraite-progressive", title: "Retraite progressive",    subtitle: "Mi-temps + pension" },
  { path: "/simulateurs/cnavpl",               title: "Professions libérales",   subtitle: "CIPAV / base SSI" },
  { path: "/simulateurs/msa",                  title: "Retraite agricole MSA",   subtitle: "Exploitants & salariés" },
  { path: "/simulateurs/per",                  title: "Plan Épargne Retraite",   subtitle: "PER — déduction fiscale" },
];

export const NAV_GROUPS = [
  { id: "retraite",   icon: "🏦", label: "Retraite",    items: ALL_ITEMS_FR },
  { id: "immobilier", icon: "🏡", label: "Immobilier",  items: [
    { path: "/simulateurs/emprunt-immobilier",  title: "Emprunt immobilier",    subtitle: "Mensualités & capacité" },
    { path: "/simulateurs/rendement-locatif",   title: "Rendement locatif",     subtitle: "Rentabilité brute & nette" },
    { path: "/simulateurs/ptz",                 title: "Prêt à Taux Zéro",      subtitle: "PTZ primo-accédant" },
  ]},
  { id: "impots",     icon: "📋", label: "Impôts",      items: [
    { path: "/simulateurs/impot-revenu",           title: "Impôt sur le revenu",    subtitle: "TMI & taux moyen" },
    { path: "/simulateurs/plus-value-immobiliere", title: "Plus-value immobilière", subtitle: "IR + prélèvements sociaux" },
  ]},
  { id: "finances",   icon: "💰", label: "Finances",    items: [
    { path: "/simulateurs/budget",       title: "Budget 50/30/20",             subtitle: "Répartition & épargne" },
    { path: "/simulateurs/epargne",      title: "Épargne & intérêts composés", subtitle: "Capitalisation long terme" },
    { path: "/simulateurs/fire",         title: "Indépendance financière",     subtitle: "Règle des 25x / 4%" },
    { path: "/simulateurs/salaire",      title: "Salaire Net/Brut & Carrière", subtitle: "Projection & pouvoir d'achat" },
    { path: "/simulateurs/patrimoine",   title: "Patrimoine global",           subtitle: "Financier + immo + retraite" },
    { path: "/simulateurs/comparateur",  title: "Comparateur d'actifs",        subtitle: "ETF, actions, crypto…" },
    { path: "/simulateurs/assurance-vie",title: "Assurance-vie",               subtitle: "Rendement & fiscalité" },
    { path: "/simulateurs/credit-conso", title: "Crédit conso",                subtitle: "Mensualité & coût total" },
  ]},
  { id: "vie-temps",  icon: "⏳", label: "Vie & Temps", items: [
    { path: "/simulateurs/cout-en-heures",  title: "Prix en heures de vie", subtitle: "Le vrai coût des choses" },
    { path: "/simulateurs/vie-en-semaines", title: "Ma vie en semaines",    subtitle: "Visualiser le temps" },
  ]},
  { id: "outils",     icon: "🔧", label: "Outils",      items: [
    { path: "/outils/qr-code", title: "Générateur de QR code", subtitle: "Couleur, logo, texte libre" },
  ]},
];

/* ── Données de navigation Belgique ── */
const BE_NAV_GROUPS = [
  { id: "retraite", icon: "🏦", label: "Retraite", items: [
    { path: "/simulateurs/pension-legale", title: "Pension légale (ONSS)", subtitle: "1er pilier belge" },
  ]},
  { id: "impots", icon: "📋", label: "Fiscalité", items: [
    { path: "/simulateurs/impot-revenu",  title: "IPP — Impôt sur le revenu", subtitle: "Barème belge 2025" },
    { path: "/simulateurs/succession",     title: "Droits de succession",      subtitle: "Wallonie · Bruxelles" },
  ]},
  { id: "finances", icon: "💰", label: "Finances", items: [
    { path: "/simulateurs/budget",       title: "Budget 50/30/20",       subtitle: "Répartition & épargne" },
    { path: "/simulateurs/epargne",      title: "Épargne",               subtitle: "Intérêts composés" },
    { path: "/simulateurs/fire",         title: "Indépendance financière", subtitle: "Règle des 25x / 4%" },
    { path: "/simulateurs/patrimoine",   title: "Patrimoine global",      subtitle: "Actifs nets" },
    { path: "/simulateurs/comparateur",  title: "Comparateur d'actifs",   subtitle: "ETF, actions, crypto…" },
    { path: "/simulateurs/assurance-vie",title: "Assurance-vie",          subtitle: "Branche 21 / 23" },
    { path: "/simulateurs/credit-conso", title: "Crédit conso",           subtitle: "Mensualité & coût total" },
  ]},
  { id: "immobilier", icon: "🏡", label: "Immobilier", items: [
    { path: "/simulateurs/emprunt-immobilier", title: "Emprunt immobilier",  subtitle: "Mensualités & capacité" },
    { path: "/simulateurs/rendement-locatif",  title: "Rendement locatif",   subtitle: "Rentabilité nette" },
  ]},
  { id: "vie-temps", icon: "⏳", label: "Vie & Temps", items: [
    { path: "/simulateurs/cout-en-heures", title: "Prix en heures de vie", subtitle: "Le vrai coût des choses" },
  ]},
];

/* ── Données de navigation Suisse ── */
const CH_NAV_GROUPS = [
  { id: "retraite", icon: "🏦", label: "Retraite", items: [
    { path: "/simulateurs/lpp-deuxieme-pilier", title: "LPP / 2e pilier", subtitle: "Avoir & rente projetés" },
    { path: "/simulateurs/prevoyance-ch",       title: "Pilier 3a",        subtitle: "Épargne retraite déductible" },
  ]},
  { id: "impots", icon: "📋", label: "Fiscalité", items: [
    { path: "/simulateurs/impot-revenu-ch", title: "Impôt sur le revenu", subtitle: "Fédéral + cantonal (Vaud)" },
  ]},
];

/* ── Données de navigation EN (universal simulators only) ── */
const EN_NAV_GROUPS = [
  { id: "finances", icon: "💰", label: "Finance", items: [
    { path: "/simulateurs/fire",         title: "FIRE Calculator",       subtitle: "Financial independence" },
    { path: "/simulateurs/epargne",      title: "Compound Interest",     subtitle: "Savings growth" },
    { path: "/simulateurs/budget",       title: "50/30/20 Budget",       subtitle: "Needs, wants, savings" },
    { path: "/simulateurs/patrimoine",   title: "Net Worth",             subtitle: "Wealth tracker" },
    { path: "/simulateurs/comparateur",  title: "Asset Comparison",      subtitle: "ETFs, stocks, crypto" },
    { path: "/simulateurs/credit-conso", title: "Personal Loan",         subtitle: "Monthly payment & cost" },
    { path: "/simulateurs/cout-en-heures",title: "Cost in Work Hours",   subtitle: "True cost of things" },
  ]},
  { id: "outils", icon: "🔧", label: "Tools", items: [
    { path: "/outils/qr-code", title: "QR Code Generator", subtitle: "Color, logo, free text" },
  ]},
];

// ALL_ITEMS used for "current page" display (FR paths only, EN pages use canonical path)
const ALL_ITEMS = ALL_ITEMS_FR;

export default function Navbar({ theme, setTheme }) {
  const { pathname } = useLocation();
  const locale = useLocale();
  const country = useCountry();
  const txt = TXT_NAV[locale] ?? TXT_NAV.fr;
  const navGroups = locale === 'en' ? EN_NAV_GROUPS : country === 'be' ? BE_NAV_GROUPS : country === 'ch' ? CH_NAV_GROUPS : NAV_GROUPS;

  const { isPro, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    navGroups.forEach(g => { init[g.id] = g.items.some(i => i.path === pathname); });
    return init;
  });

  const [openCat, setOpenCat] = useState(null);
  const catBarRef = useRef(null);

  const [simsOpen, setSimsOpen] = useState(false);
  const simsRef = useRef(null);

  const canonPath = canonicalPath(pathname);
  const onSim = canonPath.startsWith("/simulateurs/");
  const showCurrency = CURRENCY_AWARE_ROUTES.has(canonPath);
  const current = ALL_ITEMS.find(i => i.path === canonPath);

  const [history, setHistory] = useState([]);
  const { getHistory, removeEntry, clearHistory } = useSimHistory();

  const close = useCallback(() => setDrawerOpen(false), []);
  const toggleGroup = useCallback((id) => setOpenGroups(prev => ({ ...prev, [id]: !prev[id] })), []);

  useEffect(() => {
    const next = {};
    navGroups.forEach(g => { next[g.id] = g.items.some(i => i.path === canonPath); });
    setOpenGroups(next);
    setOpenCat(null);
  }, [pathname]);

  useEffect(() => {
    if (!openCat) return;
    const onDown = e => { if (catBarRef.current && !catBarRef.current.contains(e.target)) setOpenCat(null); };
    const onKey = e => { if (e.key === "Escape") setOpenCat(null); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [openCat]);

  useEffect(() => {
    if (!simsOpen) return;
    const onDown = e => { if (simsRef.current && !simsRef.current.contains(e.target)) setSimsOpen(false); };
    const onKey = e => { if (e.key === "Escape") setSimsOpen(false); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [simsOpen]);

  useEffect(() => {
    if (drawerOpen) setHistory(getHistory());
  }, [drawerOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!drawerOpen) return;
    const handle = e => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [drawerOpen, close]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* ── Barre de navigation ── */}
      <nav ref={simsRef} style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(245,246,248,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          padding: "0 20px",
          height: 60,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {/* Hamburger (mobile only, hidden ≥900px via CSS class) */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label={txt.openNav}
            aria-expanded={drawerOpen}
            className="nav-hamburger"
            style={{
              background: "transparent", border: "none",
              color: "var(--text)", cursor: "pointer",
              padding: "8px", borderRadius: 8,
              display: "flex", flexDirection: "column", gap: 5,
              alignItems: "center", justifyContent: "center",
              flexShrink: 0, minHeight: 44, minWidth: 44,
            }}
          >
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
          </button>

          {/* Logo */}
          <LocaleLink to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>S</span>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>simfinly</span>
          </LocaleLink>

          {/* Desktop nav items (hidden on mobile) */}
          <div className="desktop-nav" style={{ alignItems: "center", gap: 2, marginLeft: 16 }}>
            {/* Simulateurs dropdown button */}
            <button
              onClick={() => setSimsOpen(v => !v)}
              aria-expanded={simsOpen}
              aria-haspopup="true"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
                color: simsOpen ? "var(--primary)" : "var(--text-secondary)",
                borderRadius: 8,
                transition: "color 0.15s",
              }}
              onMouseEnter={e => { if (!simsOpen) e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(15,24,40,0.04)"; }}
              onMouseLeave={e => { if (!simsOpen) e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
            >
              {locale === 'en' ? "Calculators" : "Simulateurs"}
              <span style={{ fontSize: 9, opacity: 0.7, transform: simsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
            </button>

            {/* Guides */}
            {locale !== 'en' && country === 'fr' && (
              <Link
                to="/guides"
                style={{
                  padding: "8px 12px", borderRadius: 8, textDecoration: "none",
                  fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
                  color: pathname.startsWith("/guides") ? "var(--primary)" : "var(--text-secondary)",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(15,24,40,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = pathname.startsWith("/guides") ? "var(--primary)" : "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
              >
                Guides
              </Link>
            )}

            {/* Blog (FR only) */}
            {locale !== 'en' && country === 'fr' && (
              <Link
                to="/blog"
                style={{
                  padding: "8px 12px", borderRadius: 8, textDecoration: "none",
                  fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
                  color: pathname.startsWith("/blog") ? "var(--primary)" : "var(--text-secondary)",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(15,24,40,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = pathname.startsWith("/blog") ? "var(--primary)" : "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
              >
                Blog
              </Link>
            )}

            {/* Lexique (FR only) */}
            {locale !== 'en' && country === 'fr' && (
              <Link
                to="/lexique"
                style={{
                  padding: "8px 12px", borderRadius: 8, textDecoration: "none",
                  fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
                  color: pathname.startsWith("/lexique") ? "var(--primary)" : "var(--text-secondary)",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(15,24,40,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = pathname.startsWith("/lexique") ? "var(--primary)" : "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
              >
                Lexique
              </Link>
            )}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {showCurrency && <div className="desktop-nav"><CurrencySelect compact /></div>}
            <div className="desktop-nav"><CountrySwitch compact /></div>
            {/* Connexion / compte */}
            <LocaleLink
              to={user ? "/compte" : "/connexion"}
              aria-label={user ? txt.account : txt.login}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 12px", borderRadius: 9, textDecoration: "none",
                border: "1px solid var(--border)", color: "var(--text)",
                fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13, fontWeight: 500,
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
            >
              {user ? <User size={16} /> : <LogIn size={16} />}
              <span className="nav-auth-label">{user ? txt.account : txt.login}</span>
              {isPro && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8,
                  background: "rgba(184,147,74,0.18)", color: "var(--gold)",
                  border: "1px solid rgba(184,147,74,0.35)", lineHeight: 1.4,
                }}>PRO</span>
              )}
            </LocaleLink>
          </div>
        </div>

        {/* Simulateurs dropdown panel */}
        {simsOpen && (
          <div role="menu" style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            boxShadow: "0 8px 24px rgba(15,24,40,0.1)",
          }}>
            <div style={{
              maxWidth: 1140, margin: "0 auto", padding: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}>
              {navGroups.map(group => (
                <div key={group.id}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", color: "var(--text-secondary)",
                    marginBottom: 8, padding: "0 8px",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                  }}>
                    {group.label}
                  </div>
                  {group.items.map(item => {
                    const isCurrent = canonPath === item.path;
                    return (
                      <LocaleLink
                        key={item.path}
                        to={item.path}
                        role="menuitem"
                        onClick={() => setSimsOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "7px 8px", borderRadius: 8, textDecoration: "none",
                          background: isCurrent ? "var(--primary-soft)" : "transparent",
                        }}
                        onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = "rgba(15,24,40,0.04)"; }}
                        onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{ color: isCurrent ? "var(--primary)" : "var(--text-secondary)", display: "flex", flexShrink: 0 }}>
                          <SimIcon path={item.path} size={16} />
                        </span>
                        <span style={{
                          fontSize: 13, fontWeight: isCurrent ? 600 : 400,
                          color: isCurrent ? "var(--primary)" : "var(--text)",
                          fontFamily: "'Hanken Grotesk', sans-serif",
                        }}>{item.title}</span>
                      </LocaleLink>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Overlay ── */}
      <div
        className="nav-overlay"
        onClick={close}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.55)",
          opacity: drawerOpen ? 1 : 0,
          visibility: drawerOpen ? "visible" : "hidden",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* ── Drawer ── */}
      <aside
        className="nav-drawer"
        aria-label={txt.navAriaLabel}
        aria-hidden={!drawerOpen}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 300,
          width: 300, maxWidth: "85vw",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* En-tête drawer : logo + fermeture */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px 0 16px", height: 60, flexShrink: 0,
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, background: "var(--surface)", zIndex: 2,
        }}>
          <LocaleLink to="/" onClick={close} style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, lineHeight: 1 }}>S</span>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>simfinly</span>
          </LocaleLink>
          <button
            onClick={close}
            aria-label={txt.closeNav}
            style={{
              background: "transparent", border: "none",
              color: "var(--text-secondary)", fontSize: "1.1rem",
              cursor: "pointer", padding: "4px 8px", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 44, minWidth: 44,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--hover-bg)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >✕</button>
        </div>

        {/* Indicateur de page actuelle (FR paths only) */}
        {current && locale === 'fr' && (
          <div style={{
            padding: "10px 20px 12px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(43,92,230,0.05)",
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 7 }}>
              {txt.currentPage}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--primary)", display: "flex" }}><SimIcon path={current.path} size={22} /></span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--primary)" }}>{current.title}</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)" }}>{current.subtitle}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ padding: "8px 10px", flex: 1 }} aria-label={txt.simNavAriaLabel}>

          {/* Lien Accueil */}
          <LocaleLink
            to="/"
            onClick={close}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 9,
              textDecoration: "none", marginBottom: 6,
              background: canonPath === "/" ? "rgba(43,92,230,0.08)" : "transparent",
              border: `1px solid ${canonPath === "/" ? "var(--primary-soft)" : "transparent"}`,
            }}
            onMouseEnter={e => { if (canonPath !== "/") e.currentTarget.style.background = "var(--hover-bg)"; }}
            onMouseLeave={e => { if (canonPath !== "/") e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: canonPath === "/" ? "var(--primary)" : "var(--text-secondary)" }}><House size={18} /></span>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: canonPath === "/" ? 500 : 400, color: canonPath === "/" ? "var(--primary)" : "var(--text)" }}>{txt.home}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{txt.homeSubtitle}</div>
            </div>
            {canonPath === "/" && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--primary)" }}>●</span>}
          </LocaleLink>

          {/* Guides / Blog / Lexique — masqués sur mobile */}
          <div className="drawer-secondary-links">
          {/* Guides (FR only) */}
          {txt.guidesSubtitle !== null && (
            <Link
              to="/guides" onClick={close}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 9,
                textDecoration: "none", marginBottom: 6,
                background: pathname.startsWith("/guides") ? "rgba(43,92,230,0.08)" : "transparent",
                border: `1px solid ${pathname.startsWith("/guides") ? "var(--primary-soft)" : "transparent"}`,
              }}
              onMouseEnter={e => { if (!pathname.startsWith("/guides")) e.currentTarget.style.background = "var(--hover-bg)"; }}
              onMouseLeave={e => { if (!pathname.startsWith("/guides")) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pathname.startsWith("/guides") ? "var(--primary)" : "var(--text-secondary)" }}><Library size={18} /></span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: pathname.startsWith("/guides") ? 500 : 400, color: pathname.startsWith("/guides") ? "var(--primary)" : "var(--text)" }}>Guides</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{txt.guidesSubtitle}</div>
              </div>
              {pathname.startsWith("/guides") && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--primary)" }}>●</span>}
            </Link>
          )}

          {/* Blog (FR only) */}
          {txt.blogSubtitle !== null && (
            <Link
              to="/blog" onClick={close}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 9,
                textDecoration: "none", marginBottom: 6,
                background: pathname === "/blog" || pathname.startsWith("/blog/") ? "rgba(43,92,230,0.08)" : "transparent",
                border: `1px solid ${pathname === "/blog" || pathname.startsWith("/blog/") ? "var(--primary-soft)" : "transparent"}`,
              }}
              onMouseEnter={e => { if (!pathname.startsWith("/blog")) e.currentTarget.style.background = "var(--hover-bg)"; }}
              onMouseLeave={e => { if (!pathname.startsWith("/blog")) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pathname.startsWith("/blog") ? "var(--primary)" : "var(--text-secondary)" }}><Newspaper size={18} /></span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: pathname.startsWith("/blog") ? 500 : 400, color: pathname.startsWith("/blog") ? "var(--primary)" : "var(--text)" }}>Blog</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{txt.blogSubtitle}</div>
              </div>
              {pathname.startsWith("/blog") && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--primary)" }}>●</span>}
            </Link>
          )}

          {/* Lexique (FR only) */}
          {txt.lexiqueSubtitle !== null && (
            <Link
              to="/lexique" onClick={close}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 9,
                textDecoration: "none", marginBottom: 6,
                background: pathname.startsWith("/lexique") ? "rgba(43,92,230,0.08)" : "transparent",
                border: `1px solid ${pathname.startsWith("/lexique") ? "var(--primary-soft)" : "transparent"}`,
              }}
              onMouseEnter={e => { if (!pathname.startsWith("/lexique")) e.currentTarget.style.background = "var(--hover-bg)"; }}
              onMouseLeave={e => { if (!pathname.startsWith("/lexique")) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pathname.startsWith("/lexique") ? "var(--primary)" : "var(--text-secondary)" }}><BookOpen size={18} /></span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: pathname.startsWith("/lexique") ? 500 : 400, color: pathname.startsWith("/lexique") ? "var(--primary)" : "var(--text)" }}>Lexique</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{txt.lexiqueSubtitle}</div>
              </div>
              {pathname.startsWith("/lexique") && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--primary)" }}>●</span>}
            </Link>
          )}

          </div>{/* /drawer-secondary-links */}

          {/* Groupes de catégories */}
          {navGroups.map(group => {
            const isOpen = openGroups[group.id];
            return (
              <div key={group.id} style={{ marginBottom: 6 }}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 10px 6px", width: "100%",
                    background: "transparent", border: "none", cursor: "pointer",
                    opacity: group.comingSoon ? 0.5 : 1,
                    borderRadius: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--hover-bg)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ display: "flex", alignItems: "center", color: isOpen ? "var(--primary)" : "var(--text-secondary)" }}>
                      {(() => { const GI = GROUP_ICONS[group.id]; return GI ? <GI size={16} /> : group.icon; })()}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: isOpen ? "var(--primary)" : "var(--text-secondary)",
                      transition: "color 0.2s ease",
                    }}>
                      {group.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {group.comingSoon && (
                      <span style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 8,
                        background: "rgba(148,163,184,0.12)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                        letterSpacing: "0.05em", textTransform: "uppercase",
                      }}>
                        {txt.comingSoon}
                      </span>
                    )}
                    <span style={{
                      fontSize: "0.7rem", color: "var(--text-secondary)", userSelect: "none",
                      display: "inline-block",
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                      lineHeight: 1,
                    }}>›</span>
                  </div>
                </button>

                <div style={{
                  overflow: "hidden",
                  maxHeight: isOpen ? "520px" : "0",
                  transition: "max-height 0.28s ease",
                }}>
                  {group.items.map(item => {
                    const isCurrent = canonPath === item.path;
                    return (
                      <LocaleLink
                        key={item.path}
                        to={item.path}
                        onClick={close}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "8px 10px 8px 14px", borderRadius: 9,
                          textDecoration: "none", marginBottom: 2,
                          background: isCurrent ? "rgba(43,92,230,0.08)" : "transparent",
                          border: `1px solid ${isCurrent ? "var(--primary-soft)" : "transparent"}`,
                        }}
                        onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = "var(--hover-bg)"; }}
                        onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isCurrent ? "var(--primary)" : "var(--text-secondary)" }}><SimIcon path={item.path} size={18} /></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: "0.86rem", fontWeight: isCurrent ? 500 : 400,
                            color: isCurrent ? "var(--primary)" : "var(--text)",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "0.71rem", color: "var(--text-secondary)" }}>{item.subtitle}</div>
                        </div>
                        {isCurrent && <span style={{ fontSize: 8, color: "var(--primary)", flexShrink: 0 }}>●</span>}
                      </LocaleLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Simulations sauvegardées */}
        {history.length > 0 && (
          <div style={{ borderTop: "1px solid var(--border)", padding: "10px 10px 4px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, padding: "0 2px" }}>
              <span style={{ fontSize: 9.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                {txt.savedSims}
              </span>
              <button
                onClick={() => { clearHistory(); setHistory([]); }}
                style={{ fontSize: 10, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
              >
                {txt.clearHistory}
              </button>
            </div>
            {history.slice(0, 4).map(entry => (
              <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Link
                  to={entry.shareUrl}
                  onClick={close}
                  style={{
                    flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "7px 10px", borderRadius: 8, textDecoration: "none",
                    background: "transparent", minWidth: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--hover-bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                    {entry.label}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-secondary)", flexShrink: 0, marginLeft: 6 }}>
                    {relativeDate(entry.savedAt, locale)}
                  </span>
                </Link>
                <button
                  onClick={() => { removeEntry(entry.id); setHistory(h => h.filter(e => e.id !== entry.id)); }}
                  style={{ fontSize: 11, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "4px", flexShrink: 0 }}
                  aria-label={txt.deleteEntry}
                >✕</button>
              </div>
            ))}
            <Link to="/mes-simulations" onClick={close} style={{ display: "block", textAlign: "center", fontSize: 11, color: "var(--primary)", textDecoration: "none", padding: "8px 0 4px" }}>
              {txt.viewAll}
            </Link>
          </div>
        )}

        {/* Footer du drawer : langue + devise */}
        <div style={{ padding: "14px 20px 18px", borderTop: "1px solid var(--border)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {showCurrency && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>{txt.currency}</span>
              <CurrencySelect compact />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>{locale === 'en' ? "Country" : "Pays"}</span>
            <CountrySwitch compact />
          </div>
        </div>
      </aside>
    </>
  );
}
