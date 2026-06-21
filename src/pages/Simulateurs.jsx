import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import SimIcon from "../data/simIcons.jsx";
import { NAV_GROUPS } from "../components/Navbar.jsx";
import { Link } from "../lib/router.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { Search, X } from "lucide-react";

// Flatten all simulators from NAV_GROUPS into a searchable list
function buildSimList(groups) {
  const seen = new Set();
  const list = [];
  for (const group of groups) {
    for (const item of group.items) {
      if (!seen.has(item.path)) {
        seen.add(item.path);
        list.push({ ...item, category: group.label, categoryId: group.id });
      }
    }
  }
  return list;
}

const ALL_SIMS = buildSimList(NAV_GROUPS);
const CATEGORIES = ["Tous", ...NAV_GROUPS.map(g => g.label)];

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Simulateurs() {
  const [theme, setTheme] = useTheme();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [query, setQuery] = useState("");

  usePageMeta(
    "Tous les simulateurs financiers | simfinly.com",
    "Accédez à tous les simulateurs gratuits simfinly : retraite, immobilier, impôts, épargne, budget, FIRE et outils. Calculs en temps réel, sans inscription."
  );

  // Canonical meta tag
  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = "https://www.simfinly.com/simulateurs";
  }, []);

  const filtered = useMemo(() => {
    let list = ALL_SIMS;
    if (activeCategory !== "Tous") {
      list = list.filter(s => s.category === activeCategory);
    }
    if (query.trim()) {
      const q = norm(query.trim());
      list = list.filter(s =>
        norm(s.title).includes(q) || norm(s.subtitle || "").includes(q)
      );
    }
    return list;
  }, [activeCategory, query]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: "inline-block",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--primary)",
            background: "var(--primary-soft)", borderRadius: 20,
            padding: "4px 12px", marginBottom: 14,
          }}>
            Simulateurs gratuits
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(26px, 5vw, 40px)",
            fontWeight: 700, color: "var(--text)",
            marginBottom: 10, lineHeight: 1.2,
          }}>
            Tous les simulateurs
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 560 }}>
            {ALL_SIMS.length} simulateurs gratuits pour vos décisions financières — retraite, immobilier, impôts, épargne et plus.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20, maxWidth: 480 }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-secondary)", display: "flex", pointerEvents: "none",
          }}>
            <Search size={16} />
          </span>
          <input
            type="search"
            placeholder="Rechercher un simulateur…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "11px 38px 11px 40px",
              border: "1px solid var(--border)",
              borderRadius: 12, background: "var(--surface)",
              color: "var(--text)", fontSize: 14,
              fontFamily: "'Hanken Grotesk', sans-serif",
              outline: "none", transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = "var(--primary)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--text-secondary)", display: "flex", alignItems: "center",
                padding: 4,
              }}
              aria-label="Effacer la recherche"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32,
        }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 16px", borderRadius: 20,
                  border: isActive ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: isActive ? "var(--primary)" : "var(--surface)",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--text)"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results count when filtering */}
        {(query || activeCategory !== "Tous") && (
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
            {filtered.length === 0
              ? "Aucun simulateur trouvé"
              : `${filtered.length} simulateur${filtered.length > 1 ? "s" : ""}`}
            {query && <span> pour «&nbsp;<strong style={{ color: "var(--text)" }}>{query}</strong>&nbsp;»</span>}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
            color: "var(--text-secondary)",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "var(--text)", marginBottom: 8 }}>
              Aucun résultat
            </div>
            <div style={{ fontSize: 14 }}>Essayez un autre mot-clé ou changez de catégorie.</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {filtered.map(sim => (
              <SimCard key={sim.path} sim={sim} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function SimCard({ sim }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={sim.path}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 14,
        textDecoration: "none",
        transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
        boxShadow: hovered
          ? "0 8px 24px rgba(43,92,230,0.10)"
          : "0 1px 4px rgba(15,24,40,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        color: "var(--text)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon + category */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 44, height: 44, borderRadius: 12,
          background: hovered ? "var(--primary-soft)" : "var(--surface)",
          color: hovered ? "var(--primary)" : "var(--text-secondary)",
          transition: "background 0.18s, color 0.18s",
          flexShrink: 0,
        }}>
          <SimIcon path={sim.path} size={22} />
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--text-secondary)",
          background: "var(--surface)", borderRadius: 8,
          padding: "3px 8px", border: "1px solid var(--border)",
        }}>
          {sim.category}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 15, fontWeight: 600,
        color: hovered ? "var(--primary)" : "var(--text)",
        marginBottom: 6, lineHeight: 1.3,
        transition: "color 0.18s",
      }}>
        {sim.title}
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, flex: 1,
      }}>
        {sim.subtitle}
      </div>

      {/* CTA arrow */}
      <div style={{
        marginTop: 14,
        fontSize: 12, fontWeight: 500,
        color: hovered ? "var(--primary)" : "var(--text-secondary)",
        transition: "color 0.18s",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        Accéder au simulateur <span style={{ fontSize: 14 }}>→</span>
      </div>
    </Link>
  );
}
