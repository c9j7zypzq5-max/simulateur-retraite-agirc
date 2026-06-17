import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "../lib/router.js";
import { useSimHistory } from "../hooks/useSimHistory.js";
import SimIcon from "../data/simIcons.jsx";
import CurrencySelect from "./CurrencySelect.jsx";
import { CURRENCY_AWARE_ROUTES } from "../i18n/currencyRoutes.js";
import { Landmark, House, Receipt, Wallet, Clock, Newspaper, BookOpen, Library } from "lucide-react";

// Icône Lucide par catégorie de navigation (cohérence avec les icônes simulateurs).
const GROUP_ICONS = { retraite: Landmark, immobilier: House, impots: Receipt, finances: Wallet, "vie-temps": Clock };

function relativeDate(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000);
  if (d > 0) return `il y a ${d}j`;
  if (h > 0) return `il y a ${h}h`;
  if (m > 0) return `il y a ${m} min`;
  return "à l'instant";
}

/* ── iOS toggle (réutilisé dans la barre et le drawer) ── */
function IosToggle({ theme, setTheme, compact = false }) {
  const isDark = theme === "dark";
  const track = {
    width: 54, height: 28, minHeight: 28, borderRadius: 14, padding: 0, border: "none",
    background: isDark ? "rgba(25,40,90,0.6)" : "rgba(255,210,80,0.2)",
    cursor: "pointer", position: "relative", flexShrink: 0,
    boxShadow: isDark
      ? "inset 0 1px 3px rgba(0,0,50,0.5), 0 0 0 1px rgba(80,120,210,0.22), 0 0 12px rgba(30,80,200,0.1)"
      : "inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(210,160,40,0.45), 0 0 10px rgba(210,160,40,0.08)",
    transition: "background 0.3s ease, box-shadow 0.3s ease",
  };
  const knob = {
    position: "absolute", top: 3, left: isDark ? 3 : 29,
    width: 22, height: 22, borderRadius: "50%",
    background: isDark ? "linear-gradient(145deg,#1c2f66,#2b4396)" : "linear-gradient(145deg,#f8d050,#e89010)",
    boxShadow: isDark ? "0 1px 6px rgba(40,80,200,0.4)" : "0 1px 6px rgba(240,160,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, userSelect: "none",
    transition: "left 0.28s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, box-shadow 0.35s ease",
  };
  const btn = (
    <button
      onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      role="switch" aria-checked={isDark}
      style={track}
    >
      <div style={knob}>{isDark ? "🌙" : "☀️"}</div>
    </button>
  );
  if (compact) return btn;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" }}>
      <span style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>
        {isDark ? "Mode sombre" : "Mode clair"}
      </span>
      {btn}
    </div>
  );
}

/* ── Données de navigation regroupées par catégorie ── */
const ALL_ITEMS = [
  { path: "/simulateurs/synthese-retraite",    icon: "🧮", title: "Synthèse retraite",      subtitle: "Tous régimes cumulés" },
  { path: "/simulateurs/agirc-arrco",          icon: "🏆", title: "Agirc-Arrco",           subtitle: "Retraite complémentaire" },
  { path: "/simulateurs/cnav",                 icon: "🏛",  title: "CNAV",                  subtitle: "Régime général" },
  { path: "/simulateurs/fonction-publique",    icon: "⚖️", title: "Fonction publique",      subtitle: "Retraite statutaire" },
  { path: "/simulateurs/independants",         icon: "💼", title: "Indépendants / TNS",     subtitle: "SSI + RCI" },
  { path: "/simulateurs/ircantec",             icon: "🏢", title: "IRCANTEC",               subtitle: "Agents non-titulaires" },
  { path: "/simulateurs/retraite-progressive", icon: "📅", title: "Retraite progressive",   subtitle: "Mi-temps + pension" },
  { path: "/simulateurs/cnavpl",               icon: "👨‍⚕️", title: "Professions libérales", subtitle: "CIPAV / base SSI" },
  { path: "/simulateurs/msa",                  icon: "🌾", title: "Retraite agricole MSA",  subtitle: "Exploitants & salariés" },
  { path: "/simulateurs/per",                  icon: "💼", title: "Plan Épargne Retraite",  subtitle: "PER — déduction fiscale" },
];

export const NAV_GROUPS = [
  {
    id: "retraite", icon: "🏦", label: "Retraite",
    items: ALL_ITEMS,
  },
  { id: "immobilier", icon: "🏡", label: "Immobilier", items: [
    { path: "/simulateurs/emprunt-immobilier",  icon: "🏠", title: "Emprunt immobilier",  subtitle: "Mensualités & capacité" },
    { path: "/simulateurs/rendement-locatif",   icon: "📊", title: "Rendement locatif",   subtitle: "Rentabilité brute & nette" },
    { path: "/simulateurs/ptz",                 icon: "🏡", title: "Prêt à Taux Zéro",     subtitle: "PTZ primo-accédant" },
  ] },
  { id: "impots", icon: "📋", label: "Impôts", items: [
    { path: "/simulateurs/impot-revenu",             icon: "📋", title: "Impôt sur le revenu",    subtitle: "TMI & taux moyen" },
    { path: "/simulateurs/plus-value-immobiliere",   icon: "📈", title: "Plus-value immobilière", subtitle: "IR + prélèvements sociaux" },
  ] },
  { id: "finances", icon: "💰", label: "Finances", items: [
    { path: "/simulateurs/budget",  icon: "📊", title: "Budget 50/30/20",             subtitle: "Répartition & épargne" },
    { path: "/simulateurs/epargne", icon: "💰", title: "Épargne & intérêts composés", subtitle: "Capitalisation long terme" },
    { path: "/simulateurs/fire",    icon: "🔥", title: "Indépendance financière",     subtitle: "Règle des 25x / 4%" },
    { path: "/simulateurs/salaire",     icon: "💼", title: "Salaire Net/Brut & Carrière", subtitle: "Projection & pouvoir d'achat" },
    { path: "/simulateurs/patrimoine",  icon: "💎", title: "Patrimoine global",            subtitle: "Financier + immo + retraite" },
    { path: "/simulateurs/comparateur", icon: "📊", title: "Comparateur d'actifs",          subtitle: "ETF, actions, crypto…" },
    { path: "/simulateurs/assurance-vie", icon: "🛡️", title: "Assurance-vie",               subtitle: "Rendement & fiscalité" },
    { path: "/simulateurs/credit-conso",  icon: "💳", title: "Crédit conso",                 subtitle: "Mensualité & coût total" },
  ] },
  { id: "vie-temps", icon: "⏳", label: "Vie & Temps", items: [
    { path: "/simulateurs/cout-en-heures",  icon: "⏰", title: "Prix en heures de vie", subtitle: "Le vrai coût des choses" },
    { path: "/simulateurs/vie-en-semaines", icon: "📅", title: "Ma vie en semaines",    subtitle: "Visualiser le temps" },
  ] },
];

export default function Navbar({ theme, setTheme }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    NAV_GROUPS.forEach(g => { init[g.id] = g.items.some(i => i.path === pathname); });
    return init;
  });

  const [openCat, setOpenCat] = useState(null);   // barre catégories desktop
  const catBarRef = useRef(null);

  const onSim = pathname.startsWith("/simulateurs/");
  const showCurrency = CURRENCY_AWARE_ROUTES.has(pathname);
  const current = ALL_ITEMS.find(i => i.path === pathname);

  const [history, setHistory] = useState([]);
  const { getHistory, removeEntry, clearHistory } = useSimHistory();

  const close = useCallback(() => setDrawerOpen(false), []);
  const toggleGroup = useCallback((id) => setOpenGroups(prev => ({ ...prev, [id]: !prev[id] })), []);

  useEffect(() => {
    const next = {};
    NAV_GROUPS.forEach(g => { next[g.id] = g.items.some(i => i.path === pathname); });
    setOpenGroups(next);
    setOpenCat(null);
  }, [pathname]);

  // Ferme le menu de catégories desktop au clic extérieur / Échap.
  useEffect(() => {
    if (!openCat) return;
    const onDown = e => { if (catBarRef.current && !catBarRef.current.contains(e.target)) setOpenCat(null); };
    const onKey = e => { if (e.key === "Escape") setOpenCat(null); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [openCat]);

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
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: theme === "dark" ? "rgba(6,14,28,0.92)" : "rgba(250,246,239,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        height: 56,
        /* 3 zones : gauche / centre absolu / droite */
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px 0 4px",
      }}>
        {/* Gauche : hamburger + breadcrumb desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, zIndex: 1 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir la navigation"
            aria-expanded={drawerOpen}
            style={{
              background: "transparent", border: "none",
              color: "var(--text)", cursor: "pointer",
              padding: "10px 12px", borderRadius: 8,
              display: "flex", flexDirection: "column", gap: 5,
              alignItems: "center", justifyContent: "center",
              flexShrink: 0, minHeight: 44,
            }}
          >
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
          </button>

          {/* Breadcrumb — desktop uniquement (masqué sur mobile via .nav-center) */}
          <div className="nav-center">
            {onSim ? (
              <Link to="/" style={{
                fontSize: 12, color: "var(--text-secondary)", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 20,
                border: "1px solid var(--border)", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--border-gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                ← Tous les simulateurs
              </Link>
            ) : (
              <span style={{ fontSize: 12, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
                Données officielles 2026
              </span>
            )}
          </div>
        </div>

        {/* Centre : logo toujours centré (position absolute) */}
        <Link to="/" style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none", zIndex: 0,
        }}>
          <img src="/logo-mark.svg" alt="" width={26} height={26} style={{ display: "block", flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.15rem", fontWeight: 700,
            color: "var(--gold)",
            letterSpacing: "0.02em", whiteSpace: "nowrap",
          }}>simfinly.com</span>
        </Link>

        {/* Droite : sélecteur devise (simulateurs universels) + toggle thème */}
        <div style={{ zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          {showCurrency && <CurrencySelect compact />}
          <IosToggle theme={theme} setTheme={setTheme} compact />
        </div>
      </nav>

      {/* ── Barre de catégories — desktop uniquement ── */}
      <div ref={catBarRef} className="desktop-catbar" style={{
        position: "sticky", top: 56, zIndex: 90,
        background: theme === "dark" ? "rgba(6,14,28,0.92)" : "rgba(250,246,239,0.94)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "center", gap: 2 }}>
          {NAV_GROUPS.map(group => {
            const GI = GROUP_ICONS[group.id];
            const active = openCat === group.id;
            const hasCurrent = group.items.some(i => i.path === pathname);
            return (
              <div key={group.id} style={{ position: "relative" }}>
                <button
                  onClick={() => setOpenCat(active ? null : group.id)}
                  aria-expanded={active} aria-haspopup="true"
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    color: active || hasCurrent ? "var(--gold)" : "var(--text-secondary)",
                    borderBottom: `2px solid ${active || hasCurrent ? "var(--gold)" : "transparent"}`,
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { if (!active && !hasCurrent) e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={e => { if (!active && !hasCurrent) e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  {GI && <GI size={15} />}
                  {group.label}
                  <span style={{ fontSize: 9, opacity: 0.6, transform: active ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                </button>
                {active && (
                  <div role="menu" style={{
                    position: "absolute", top: "100%", left: 0, marginTop: 1, zIndex: 95,
                    background: "var(--card-bg)", border: "1px solid var(--border-gold)",
                    borderRadius: 12, padding: 8, minWidth: 280,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                  }}>
                    {group.items.map(item => {
                      const isCurrent = pathname === item.path;
                      return (
                        <Link key={item.path} to={item.path} role="menuitem" onClick={() => setOpenCat(null)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                            borderRadius: 9, textDecoration: "none",
                            background: isCurrent ? "rgba(184,147,74,0.1)" : "transparent",
                          }}
                          onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = "rgba(184,147,74,0.06)"; }}
                          onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{ width: 22, display: "flex", flexShrink: 0, color: isCurrent ? "var(--gold)" : "var(--text-secondary)" }}>
                            <SimIcon path={item.path} size={18} />
                          </span>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: "block", fontSize: 13, fontWeight: isCurrent ? 500 : 400, color: isCurrent ? "var(--gold)" : "var(--text)" }}>{item.title}</span>
                            <span style={{ display: "block", fontSize: 11, color: "var(--text-secondary)" }}>{item.subtitle}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
        aria-label="Navigation principale"
        aria-hidden={!drawerOpen}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 300,
          width: 290,
          background: theme === "dark" ? "#0a1628" : "#faf6ef",
          borderRight: "1px solid var(--border)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* En-tête drawer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px 0 20px", height: 56, flexShrink: 0,
          borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)" }}>
            Navigation
          </span>
          <button
            onClick={close}
            aria-label="Fermer la navigation"
            style={{
              background: "transparent", border: "none",
              color: "var(--text-secondary)", fontSize: "1.1rem",
              cursor: "pointer", padding: "4px 8px", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 44, minWidth: 44,
            }}
          >✕</button>
        </div>

        {/* Indicateur de page actuelle */}
        {current && (
          <div style={{
            padding: "10px 20px 12px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(184,147,74,0.06)",
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 7 }}>
              Page actuelle
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--gold)", display: "flex" }}><SimIcon path={current.path} size={22} /></span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--gold)" }}>{current.title}</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)" }}>{current.subtitle}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation groupée */}
        <nav style={{ padding: "8px 10px", flex: 1 }} aria-label="Simulateurs disponibles">

          {/* Lien Accueil */}
          <Link
            to="/"
            onClick={close}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 9,
              textDecoration: "none", marginBottom: 6,
              background: pathname === "/" ? "rgba(184,147,74,0.1)" : "transparent",
              border: `1px solid ${pathname === "/" ? "var(--border-gold)" : "transparent"}`,
            }}
            onMouseEnter={e => { if (pathname !== "/") e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (pathname !== "/") e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pathname === "/" ? "var(--gold)" : "var(--text-secondary)" }}><House size={18} /></span>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: pathname === "/" ? 500 : 400, color: pathname === "/" ? "var(--gold)" : "var(--text)" }}>Accueil</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Tous les simulateurs</div>
            </div>
            {pathname === "/" && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--gold)" }}>●</span>}
          </Link>

          {/* Guides */}
          <Link
            to="/guides"
            onClick={close}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 9,
              textDecoration: "none", marginBottom: 6,
              background: pathname.startsWith("/guides") ? "rgba(184,147,74,0.1)" : "transparent",
              border: `1px solid ${pathname.startsWith("/guides") ? "var(--border-gold)" : "transparent"}`,
            }}
            onMouseEnter={e => { if (!pathname.startsWith("/guides")) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!pathname.startsWith("/guides")) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pathname.startsWith("/guides") ? "var(--gold)" : "var(--text-secondary)" }}><Library size={18} /></span>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: pathname.startsWith("/guides") ? 500 : 400, color: pathname.startsWith("/guides") ? "var(--gold)" : "var(--text)" }}>Guides</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Parcours par thématique</div>
            </div>
            {pathname.startsWith("/guides") && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--gold)" }}>●</span>}
          </Link>

          {/* Blog */}
          <Link
            to="/blog"
            onClick={close}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 9,
              textDecoration: "none", marginBottom: 6,
              background: pathname === "/blog" || pathname.startsWith("/blog/") ? "rgba(184,147,74,0.1)" : "transparent",
              border: `1px solid ${pathname === "/blog" || pathname.startsWith("/blog/") ? "var(--border-gold)" : "transparent"}`,
            }}
            onMouseEnter={e => { if (!pathname.startsWith("/blog")) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!pathname.startsWith("/blog")) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pathname.startsWith("/blog") ? "var(--gold)" : "var(--text-secondary)" }}><Newspaper size={18} /></span>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: pathname.startsWith("/blog") ? 500 : 400, color: pathname.startsWith("/blog") ? "var(--gold)" : "var(--text)" }}>Blog</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Articles & guides financiers</div>
            </div>
            {pathname.startsWith("/blog") && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--gold)" }}>●</span>}
          </Link>

          {/* Lexique */}
          <Link
            to="/lexique"
            onClick={close}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 9,
              textDecoration: "none", marginBottom: 6,
              background: pathname.startsWith("/lexique") ? "rgba(184,147,74,0.1)" : "transparent",
              border: `1px solid ${pathname.startsWith("/lexique") ? "var(--border-gold)" : "transparent"}`,
            }}
            onMouseEnter={e => { if (!pathname.startsWith("/lexique")) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!pathname.startsWith("/lexique")) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pathname.startsWith("/lexique") ? "var(--gold)" : "var(--text-secondary)" }}><BookOpen size={18} /></span>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: pathname.startsWith("/lexique") ? 500 : 400, color: pathname.startsWith("/lexique") ? "var(--gold)" : "var(--text)" }}>Lexique</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Définitions des termes financiers</div>
            </div>
            {pathname.startsWith("/lexique") && <span style={{ marginLeft: "auto", fontSize: 8, color: "var(--gold)" }}>●</span>}
          </Link>

          {/* Groupes de catégories */}
          {NAV_GROUPS.map(group => {
            const isOpen = openGroups[group.id];
            return (
              <div key={group.id} style={{ marginBottom: 6 }}>
                {/* En-tête de catégorie — cliquable */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 10px 6px", width: "100%",
                    background: "transparent", border: "none", cursor: "pointer",
                    opacity: group.comingSoon ? 0.5 : 1,
                    borderRadius: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ display: "flex", alignItems: "center", color: isOpen ? "var(--gold)" : "var(--text-secondary)" }}>{(() => { const GI = GROUP_ICONS[group.id]; return GI ? <GI size={16} /> : group.icon; })()}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: isOpen ? "var(--gold)" : "var(--text-secondary)",
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
                        Bientôt
                      </span>
                    )}
                    <span style={{
                      fontSize: "0.7rem", color: "var(--text-secondary)", userSelect: "none",
                      display: "inline-block",
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                      lineHeight: 1,
                    }}>
                      ›
                    </span>
                  </div>
                </button>

                {/* Items avec animation max-height */}
                <div style={{
                  overflow: "hidden",
                  maxHeight: isOpen ? "520px" : "0",
                  transition: "max-height 0.28s ease",
                }}>
                  {group.items.map(item => {
                    const isCurrent = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={close}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "8px 10px 8px 14px", borderRadius: 9,
                          textDecoration: "none", marginBottom: 2,
                          background: isCurrent ? "rgba(184,147,74,0.1)" : "transparent",
                          border: `1px solid ${isCurrent ? "var(--border-gold)" : "transparent"}`,
                        }}
                        onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isCurrent ? "var(--gold)" : "var(--text-secondary)" }}><SimIcon path={item.path} size={18} /></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: "0.86rem", fontWeight: isCurrent ? 500 : 400,
                            color: isCurrent ? "var(--gold)" : "var(--text)",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "0.71rem", color: "var(--text-secondary)" }}>{item.subtitle}</div>
                        </div>
                        {isCurrent && <span style={{ fontSize: 8, color: "var(--gold)", flexShrink: 0 }}>●</span>}
                      </Link>
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
                Simulations sauvegardées
              </span>
              <button
                onClick={() => { clearHistory(); setHistory([]); }}
                style={{ fontSize: 10, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
              >
                Effacer
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
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                    {entry.label}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-secondary)", flexShrink: 0, marginLeft: 6 }}>
                    {relativeDate(entry.savedAt)}
                  </span>
                </Link>
                <button
                  onClick={() => { removeEntry(entry.id); setHistory(h => h.filter(e => e.id !== entry.id)); }}
                  style={{ fontSize: 11, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "4px", flexShrink: 0 }}
                  aria-label="Supprimer"
                >✕</button>
              </div>
            ))}
            <Link to="/mes-simulations" onClick={close} style={{ display: "block", textAlign: "center", fontSize: 11, color: "var(--gold)", textDecoration: "none", padding: "8px 0 4px" }}>
              Tout voir →
            </Link>
          </div>
        )}

        {/* Footer : devise (si simulateur universel) + toggle thème */}
        <div style={{ padding: "14px 20px 18px", borderTop: "1px solid var(--border)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {showCurrency && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>Devise</span>
              <CurrencySelect compact />
            </div>
          )}
          <IosToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>
    </>
  );
}
