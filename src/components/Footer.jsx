import { useState, useEffect } from "react";
import { Link, LocaleLink, useLocation } from "../lib/router.jsx";
import { NAV_GROUPS } from "./Navbar.jsx";
import SideAds from "./SideAds.jsx";
import { GLOSSARY } from "../data/glossaire.js";
import { GUIDES } from "../data/guides.js";
import { ROUTE_META } from "../../api/_routes.js";
import { useTranslation } from "../i18n/index.js";

// Catégories de blog correspondant à la catégorie d'un simulateur (ROUTE_META.cat).
const BLOG_CATS_FOR_SIM = {
  Retraite: ["Retraite"], Immobilier: ["Immobilier"], "Impôts": ["Fiscalité"],
  Finances: ["Finances", "Épargne", "FIRE", "Budget"], FIRE: ["FIRE"], Budget: ["Budget"],
};

// Cache module : on ne récupère les articles qu'une fois par session de navigation.
let _articlesCache = null;
let _articlesPromise = null;
function loadArticles() {
  if (_articlesCache) return Promise.resolve(_articlesCache);
  if (!_articlesPromise) {
    _articlesPromise = fetch("/api/articles")
      .then(r => r.json())
      .then(d => { _articlesCache = Array.isArray(d) ? d : []; return _articlesCache; })
      .catch(() => { _articlesCache = []; return _articlesCache; });
  }
  return _articlesPromise;
}

// Sélectionne jusqu'à 6 simulateurs liés : d'abord ceux de la même catégorie que
// la page courante, complétés par d'autres si besoin. Améliore le maillage interne
// (SEO) et la découverte.
function relatedSimulators(pathname) {
  const group = NAV_GROUPS.find(g => g.items.some(i => i.path === pathname));
  if (!group) return [];
  const siblings = group.items.filter(i => i.path !== pathname);
  const others = NAV_GROUPS.flatMap(g => g.items).filter(
    i => i.path !== pathname && !siblings.some(s => s.path === i.path)
  );
  return [...siblings, ...others].slice(0, 6);
}

function RelatedSimulators() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  if (!pathname.startsWith("/simulateurs/")) return null;
  const related = relatedSimulators(pathname);
  if (related.length === 0) return null;
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto 36px", padding: "0 24px" }} aria-label={t("sections.relatedSimulators")}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        {t("sections.relatedSimulators")}
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {related.map(item => (
          <Link key={item.path} to={item.path} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px", borderRadius: 12, textDecoration: "none",
            background: "var(--card-bg)", border: "1px solid var(--border)",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }} aria-hidden="true">{item.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{item.subtitle}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Termes du lexique pertinents pour la page simulateur courante : déduits du
// champ `sims` de chaque entrée du glossaire. Améliore la pédagogie et le SEO
// (maillage interne vers le lexique) sans toucher à chaque page.
function RelatedTerms() {
  const { pathname } = useLocation();
  const { t: tr } = useTranslation();
  if (!pathname.startsWith("/simulateurs/")) return null;
  const terms = GLOSSARY.filter(t => (t.sims || []).includes(pathname)).slice(0, 8);
  if (terms.length === 0) return null;
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto 36px", padding: "0 24px" }} aria-label={tr("sections.usefulDefinitions")}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        {tr("sections.usefulDefinitions")}
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {terms.map(t => (
          <Link key={t.slug} to={`/lexique/${t.slug}`} title={t.short} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 20, textDecoration: "none",
            background: "var(--card-bg)", border: "1px solid var(--border)",
            color: "var(--text)", fontSize: 13, transition: "border-color 0.2s, color 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
          >
            {t.term}
          </Link>
        ))}
        <Link to="/lexique" style={{
          display: "inline-flex", alignItems: "center",
          padding: "8px 14px", borderRadius: 20, textDecoration: "none",
          background: "transparent", border: "1px dashed var(--border-gold)",
          color: "var(--gold)", fontSize: 13,
        }}>
          {tr("sections.allLexique")}
        </Link>
      </div>
    </section>
  );
}

// Guides thématiques incluant la page simulateur courante.
function RelatedGuides() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  if (!pathname.startsWith("/simulateurs/")) return null;
  const guides = GUIDES.filter(g => (g.sims || []).includes(pathname)).slice(0, 4);
  if (guides.length === 0) return null;
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto 36px", padding: "0 24px" }} aria-label={t("sections.relatedGuides")}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        {t("sections.relatedGuides")}
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {guides.map(g => (
          <Link key={g.slug} to={`/guides/${g.slug}`} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 12, textDecoration: "none",
            background: "var(--card-bg)", border: "1px solid var(--border)", transition: "border-color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <span style={{ fontSize: "1.4rem", flexShrink: 0 }} aria-hidden="true">{g.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{g.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Articles de blog liés à la thématique de la page simulateur courante.
function RelatedArticles() {
  const { pathname } = useLocation();
  const [articles, setArticles] = useState([]);
  const onSim = pathname.startsWith("/simulateurs/");
  const cat = ROUTE_META[pathname]?.cat;
  const blogCats = BLOG_CATS_FOR_SIM[cat] || [];

  useEffect(() => {
    if (!onSim || blogCats.length === 0) { setArticles([]); return; }
    let alive = true;
    loadArticles().then(list => {
      if (alive) setArticles(list.filter(a => blogCats.includes(a.category)).slice(0, 3));
    });
    return () => { alive = false; };
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const { t } = useTranslation();
  if (!onSim || articles.length === 0) return null;
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto 36px", padding: "0 24px" }} aria-label={t("sections.readOnBlog")}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        {t("sections.readOnBlog")}
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {articles.map(a => (
          <Link key={a.slug} to={`/blog/${a.slug}`} style={{
            display: "block", padding: "14px 16px", borderRadius: 12, textDecoration: "none",
            background: "var(--card-bg)", border: "1px solid var(--border)", transition: "border-color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <div style={{ fontSize: 11, color: "var(--gold-mid)", marginBottom: 6 }}>{a.category}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>{a.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Footer() {
  const { t, locale } = useTranslation();
  const isEn = locale === "en";
  return (
    <>
    <SideAds />
    <RelatedSimulators />
    <RelatedGuides />
    <RelatedTerms />
    <RelatedArticles />
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "28px 24px 40px",
      marginTop: 60,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo-mark.svg" alt="" width={24} height={24} style={{ display: "block", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)" }}>
            simfinly.com
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {!isEn && (
            <>
              <Link to="/guides" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
                {t("nav.guides")}
              </Link>
              <Link to="/blog" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
                {t("nav.blog")}
              </Link>
              <Link to="/lexique" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
                {t("nav.lexique")}
              </Link>
              <Link to="/a-propos" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
                {t("nav.apropos")}
              </Link>
              <Link to="/methodologie" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
                {t("nav.methodologie")}
              </Link>
              <Link to="/widgets" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
                {t("nav.widgets")}
              </Link>
            </>
          )}
          <LocaleLink to="/mentions-legales" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            {t("nav.mentionsLegales")}
          </LocaleLink>
          <LocaleLink to="/politique-de-confidentialite" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            {t("nav.confidentialite")}
          </LocaleLink>
          <a href="mailto:contact@simfinly.com" style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none", letterSpacing: "0.04em" }}>
            {t("nav.contact")}
          </a>
        </nav>
        <p style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
          {t("footer.rights")}
        </p>
      </div>
    </footer>
    </>
  );
}
