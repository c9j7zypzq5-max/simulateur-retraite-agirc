import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";
import { useTranslation } from "../i18n/index.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { GLOSSARY } from "../data/glossaire.js";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function TermCard({ entry, isEn }) {
  const [hovered, setHovered] = useState(false);
  const view = isEn ? entry.en : entry;
  return (
    <Link
      to={isEn ? `/en/glossary/${entry.slug}` : `/lexique/${entry.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", textDecoration: "none",
        background: "var(--surface)", border: `1px solid ${hovered ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 12, padding: "18px 20px",
        boxShadow: hovered ? "0 6px 20px rgba(43,92,230,0.12)" : "var(--card-shadow)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>
        {view.term}
      </div>
      {view.full !== view.term && (
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontStyle: "italic" }}>{view.full}</div>
      )}
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-secondary)", margin: 0 }}>{view.short}</p>
    </Link>
  );
}

export default function Lexique() {
  const [theme, setTheme] = useTheme();
  const { locale } = useTranslation();
  const isEn = locale === 'en';
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);

  useEffect(() => {
    document.title = isEn
      ? "Financial glossary — clear definitions | simfinly.com"
      : "Lexique financier — définitions claires | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content", isEn
      ? "Glossary of personal finance terms: compound interest, FIRE, savings rate, DTI ratio, rental yield, 4% rule… Simple definitions, linked to our free calculators."
      : "Lexique des termes de finances personnelles : TAEG, PTZ, PER, TMI, FIRE, assurance-vie, Agirc-Arrco… Des définitions simples, reliées à nos simulateurs gratuits.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = isEn ? 'https://www.simfinly.com/en/glossary' : 'https://www.simfinly.com/lexique';
  }, [isEn]);

  const source = useMemo(() => isEn ? GLOSSARY.filter(t => t.en) : GLOSSARY, [isEn]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return source;
    return source.filter(t => {
      const view = isEn ? t.en : t;
      return view.term.toLowerCase().includes(q) ||
        view.full.toLowerCase().includes(q) ||
        view.short.toLowerCase().includes(q) ||
        (t.aliases || []).some(a => a.toLowerCase().includes(q));
    });
  }, [q, source, isEn]);

  const byLetter = useMemo(() => {
    const groups = {};
    for (const t of filtered) {
      const letter = (isEn ? t.en.term : t.term)[0].toUpperCase();
      (groups[letter] ||= []).push(t);
    }
    return groups;
  }, [filtered, isEn]);

  const presentLetters = new Set(Object.keys(byLetter));
  const letters = ALL_LETTERS.filter(l => presentLetters.has(l));

  function scrollToLetter(letter) {
    setActiveLetter(letter);
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk',sans-serif", color: "var(--text)" }}>
      <style>{`
        .lexique-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
        @media (max-width: 600px) { .lexique-grid { grid-template-columns: 1fr; } }
      `}</style>

      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "44px 0 26px", animation: "fadeUp .5s ease both" }}>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(28px,5vw,36px)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", margin: "0 0 12px" }}>
            {isEn ? "Financial glossary" : "Lexique financier"}
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: "0 0 22px" }}>
            {isEn
              ? `${source.length} personal finance terms, clearly defined.`
              : `${GLOSSARY.length} termes de retraite, immobilier et fiscalité, définis clairement.`}
          </p>
          {/* Search bar */}
          <div style={{ display: "flex", alignItems: "center", background: "var(--surface)", border: `1.5px solid ${searchFocused ? "var(--primary)" : "var(--border)"}`, borderRadius: 13, padding: "12px 18px", maxWidth: 460, margin: "0 auto", gap: 10, boxShadow: searchFocused ? "0 0 0 3px rgba(43,92,230,0.12)" : "none", transition: "border-color 0.15s, box-shadow 0.15s" }}>
            <Search size={18} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={isEn ? "Search a term (FIRE, DTI, DCA…)" : "Rechercher un terme (TMI, GMP, décote…)"}
              aria-label={isEn ? "Search a term" : "Rechercher un terme"}
              style={{
                flex: 1, border: "none", background: "transparent",
                color: "var(--text)", fontSize: 16,
                fontFamily: "'Hanken Grotesk',sans-serif", outline: "none",
              }}
            />
          </div>
        </div>

        {/* Alphabet pills */}
        {!q && (
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
            {ALL_LETTERS.map(letter => {
              const present = presentLetters.has(letter);
              const active = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => present && scrollToLetter(letter)}
                  disabled={!present}
                  aria-label={isEn ? `Go to letter ${letter}` : `Aller à la lettre ${letter}`}
                  style={{
                    width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Space Grotesk',sans-serif", fontSize: 13,
                    fontWeight: active ? 700 : present ? 600 : 500,
                    borderRadius: 8, cursor: present ? "pointer" : "default",
                    background: active ? "var(--primary)" : present ? "var(--bg)" : "var(--surface)",
                    color: active ? "#fff" : present ? "var(--text-secondary)" : "var(--border)",
                    border: `1px solid ${active ? "var(--primary)" : present ? "var(--border)" : "var(--border)"}`,
                    opacity: present ? 1 : 0.45,
                    transition: "all 0.15s",
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-secondary)", fontSize: 14 }}>
            {isEn ? `No term matches "${query}".` : `Aucun terme ne correspond à « ${query} ».`}
          </div>
        ) : (
          letters.map(letter => (
            <section key={letter} style={{ marginBottom: 36 }}>
              <h2
                id={`letter-${letter}`}
                style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, color: "var(--primary)", marginBottom: 14, scrollMarginTop: 80 }}
              >
                {letter}
              </h2>
              <div className="lexique-grid">
                {byLetter[letter].map(entry => <TermCard key={entry.slug} entry={entry} isEn={isEn} />)}
              </div>
            </section>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
