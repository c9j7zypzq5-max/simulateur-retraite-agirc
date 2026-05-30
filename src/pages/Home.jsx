import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";

const SIMULATEURS = [
  {
    path: "/simulateurs/agirc-arrco",
    icon: "🏆",
    title: "Retraite complémentaire Agirc-Arrco",
    desc: "Calculez vos points et estimez votre pension nette mensuelle. Intègre bonus-malus, GMP cadres, revalorisation projetée et comparateur de scénarios.",
    tag: "Salariés privés",
    categories: ["Salariés", "Complémentaires"],
    badges: ["popular", "updated"],
    featured: true,
    available: true,
  },
  {
    path: "/simulateurs/cnav",
    icon: "🏛",
    title: "Régime général CNAV",
    desc: "Estimez votre pension de base en fonction de vos trimestres validés, de votre salaire annuel moyen et de votre âge de départ.",
    tag: "Salariés privés",
    categories: ["Salariés"],
    badges: ["new"],
    available: true,
  },
  {
    path: "/simulateurs/fonction-publique",
    icon: "⚖️",
    title: "Retraite Fonction publique",
    desc: "Calculez votre pension selon votre indice majoré, votre durée de service, vos bonifications et votre catégorie (sédentaire ou active).",
    tag: "Fonctionnaires",
    categories: ["Fonctionnaires"],
    badges: ["new"],
    available: true,
  },
  {
    path: "/simulateurs/independants",
    icon: "💼",
    title: "Indépendants & TNS",
    desc: "Simulez votre retraite si vous êtes artisan, commerçant ou profession libérale — régime de base SSI et complémentaire.",
    tag: "Indépendants",
    categories: ["Indépendants"],
    badges: ["new"],
    available: true,
  },
  {
    path: "/simulateurs/ircantec",
    icon: "🏢",
    title: "Complémentaire IRCANTEC",
    desc: "Pour les agents non-titulaires de la fonction publique et élus locaux. Estimez vos points IRCANTEC et votre pension complémentaire.",
    tag: "Contractuels publics",
    categories: ["Complémentaires", "Fonctionnaires"],
    badges: [],
    available: true,
  },
  {
    path: "/simulateurs/retraite-progressive",
    icon: "📅",
    title: "Retraite progressive",
    desc: "Envisagez-vous de réduire votre activité avant la retraite complète ? Simulez la pension partielle et l'impact sur votre future pension définitive.",
    tag: "Tous régimes",
    categories: ["Salariés", "Fonctionnaires", "Indépendants"],
    badges: ["new"],
    available: true,
  },
];

const COMING_SOON = [
  {
    icon: "👨‍⚕️",
    title: "Professions libérales (CNAVPL)",
    desc: "Médecins, avocats, architectes — simulateur adapté aux régimes CARMF, CNBF, CIPAV…",
    tag: "Libéraux",
  },
  {
    icon: "🌾",
    title: "Agriculteurs (MSA)",
    desc: "Estimez votre retraite de base et complémentaire selon le régime agricole de la MSA.",
    tag: "Agriculture",
  },
  {
    icon: "🌍",
    title: "Expatriés & carrières mixtes",
    desc: "Simulation multi-régimes pour les carrières à cheval sur plusieurs pays ou statuts.",
    tag: "Multi-régimes",
  },
];

const FILTERS = ["Tous", "Salariés", "Fonctionnaires", "Indépendants", "Complémentaires"];

function BadgePill({ type }) {
  const styles = {
    popular:  { bg: "rgba(184,147,74,0.12)", color: "var(--gold)", border: "1px solid rgba(184,147,74,0.35)" },
    updated:  { bg: "rgba(99,102,241,0.12)",  color: "#818cf8",    border: "1px solid rgba(99,102,241,0.25)" },
    new:      { bg: "rgba(34,197,94,0.12)",   color: "#4ade80",    border: "1px solid rgba(34,197,94,0.25)" },
  };
  const labels = { popular: "★ Populaire", updated: "Mis à jour 2026", new: "Nouveau" };
  const s = styles[type] || {};
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.06em", background: s.bg, color: s.color, border: s.border }}>
      {labels[type]}
    </span>
  );
}

export default function Home() {
  const [theme, setTheme] = useTheme();
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    document.title = "mesimulateurs.fr — Simulateurs de retraite gratuits";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "6 simulateurs de retraite gratuits et pédagogiques : Agirc-Arrco, CNAV, Fonction publique, Indépendants, IRCANTEC, Retraite progressive. Données officielles 2026.");
  }, []);

  const filtered = activeFilter === "Tous"
    ? SIMULATEURS
    : SIMULATEURS.filter(s => s.categories.includes(activeFilter));

  const featured = filtered.find(s => s.featured);
  const regular  = filtered.filter(s => !s.featured);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      {/* ── Hero ── */}
      <section style={{ padding: "72px 24px 56px", textAlign: "center", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)", color: "var(--gold)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 20, marginBottom: 28 }}>
          <span style={{ opacity: 0.7 }}>✦</span> Données officielles 2026 <span style={{ opacity: 0.7 }}>✦</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,5vw,3.4rem)", fontWeight: 700, lineHeight: 1.15, color: "var(--text)", marginBottom: 20 }}>
          Simulez votre retraite<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>en toute clarté</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
          Des simulateurs gratuits, précis et pédagogiques pour estimer votre future pension selon votre régime — salarié, fonctionnaire, indépendant ou cadre.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[
            { v: "6", l: "simulateurs disponibles" },
            { v: "30 s", l: "pour une première estimation" },
            { v: "100 %", l: "gratuit & sans inscription" },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <strong style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--gold)" }}>{v}</strong>
              <small style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{l}</small>
            </div>
          ))}
        </div>
      </section>

      {/* ── AdSense ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 24px", padding: "0 24px" }}>
        <AdUnit slot="auto" format="auto" />
      </div>

      {/* ── Filter bar ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 36px", padding: "0 24px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginRight: 4 }}>Filtrer :</span>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{
              background: activeFilter === f ? "rgba(184,147,74,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeFilter === f ? "var(--border-gold)" : "var(--border)"}`,
              color: activeFilter === f ? "var(--gold)" : "var(--text-secondary)",
              padding: "7px 16px", borderRadius: 20, fontSize: "0.8rem",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 0", padding: "0 24px 64px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          Simulateurs disponibles
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {featured && (
            <FeaturedCard sim={featured} />
          )}
          {regular.map(sim => (
            <SimCard key={sim.path} sim={sim} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px 0", fontSize: 15 }}>
            Aucun simulateur dans cette catégorie pour l'instant.
          </p>
        )}

        {/* Coming soon */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: "48px 0 24px", display: "flex", alignItems: "center", gap: 12 }}>
          Bientôt disponibles
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {COMING_SOON.map(s => (
            <div key={s.title} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, opacity: 0.55, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)" }}>{s.icon}</div>
                <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.06em", background: "rgba(148,163,184,0.1)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Bientôt</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 10, alignSelf: "flex-start" }}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "var(--border)", maxWidth: 1100, margin: "0 auto 48px" }} />

      {/* ── CTA Newsletter ── */}
      <section style={{ maxWidth: 700, margin: "0 auto 64px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.04))", border: "1px solid var(--border-gold)", borderRadius: 18, padding: "44px 40px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Restez informé des évolutions</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.65 }}>
            Revalorisation des pensions, nouveaux simulateurs, changements législatifs — recevez une synthèse mensuelle claire et sans jargon.
          </p>
          <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto 12px", flexWrap: "wrap", justifyContent: "center" }}>
            <input type="email" placeholder="votre@email.fr"
              style={{ flex: 1, minWidth: 200, background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)", padding: "11px 16px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none" }} />
            <button style={{ background: "linear-gradient(135deg,#b8934a,#e8c06a)", color: "#060e1c", border: "none", padding: "11px 22px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              S'abonner
            </button>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Gratuit · Désabonnement en un clic · Aucune publicité</p>
        </div>
      </section>

      {/* ── AdSense ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 24px", padding: "0 24px" }}>
        <AdUnit slot="auto" format="auto" />
      </div>

      <Footer />
    </div>
  );
}

function FeaturedCard({ sim }) {
  return (
    <Link to={sim.path} style={{
      background: "linear-gradient(145deg,rgba(184,147,74,0.07),var(--card-bg))",
      border: "1px solid var(--border-gold)",
      borderRadius: 14, padding: 28,
      display: "flex", gap: 20, alignItems: "flex-start",
      textDecoration: "none",
      transition: "transform 0.2s, box-shadow 0.25s",
      gridColumn: "span 2",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(184,147,74,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ width: 54, height: 54, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", background: "rgba(184,147,74,0.12)", border: "1px solid var(--border-gold)", flexShrink: 0 }}>{sim.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {sim.badges.map(b => <BadgePill key={b} type={b} />)}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{sim.title}</h3>
        <p style={{ fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>{sim.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 10 }}>{sim.tag}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--gold)" }}>Simuler maintenant →</span>
        </div>
      </div>
    </Link>
  );
}

function SimCard({ sim }) {
  return (
    <Link to={sim.path} style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 14, padding: 28,
      display: "flex", flexDirection: "column", gap: 16,
      textDecoration: "none",
      position: "relative", overflow: "hidden",
      transition: "border-color 0.25s, background 0.25s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)" }}>{sim.icon}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {sim.badges.map(b => <BadgePill key={b} type={b} />)}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{sim.title}</h3>
        <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{sim.desc}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 10 }}>{sim.tag}</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--gold)" }}>Simuler →</span>
      </div>
    </Link>
  );
}
