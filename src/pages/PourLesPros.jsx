import { track } from "@vercel/analytics";
import { useTheme } from "../hooks/useTheme.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useTranslation } from "../i18n/index.js";
import { LocaleLink } from "../lib/router.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

// Vitrine B2B : vend les widgets embarquables et le créateur de simulateur
// no-code (app.simfinly.com) au trafic entreprise de simfinly.com. Page
// prérendue et indexable (SEO longue traîne « calculateur de devis pour site
// web », « simulateur sur mesure sans code »). Deux chemins : widgets gratuits
// prêts à l'emploi (interne) et builder sur mesure (app.simfinly.com).

const APP = "https://app.simfinly.com";
const appUrl = (path, campaign) =>
  `${APP}${path}?utm_source=simfinly&utm_medium=referral&utm_campaign=${campaign}`;

const CONTENT = {
  fr: {
    kicker: "Simfinly for Business",
    h1: "Des calculateurs et simulateurs pour votre entreprise",
    intro: "Intégrez un simulateur à votre marque sur votre site en quelques minutes : calculateur de devis, capacité d'emprunt, estimateur de ROI, simulateur financier. Sans une ligne de code, aux barèmes français 2026, avec capture de leads intégrée. Deux options selon votre besoin : nos widgets gratuits prêts à l'emploi, ou votre calculateur sur mesure créé avec le Builder.",
    valueTitle: "Pourquoi Simfinly pour votre site",
    values: [
      { icon: "🧩", title: "Sans code", desc: "Choisissez un modèle, personnalisez champs et calculs, publiez. Intégration par simple iframe — aucune compétence technique requise." },
      { icon: "🎨", title: "À votre marque", desc: "Couleurs, logo, textes : le calculateur ressemble à votre site, pas au nôtre. L'offre payante retire toute mention Simfinly." },
      { icon: "🎯", title: "Capture de leads", desc: "Exigez l'email avant d'afficher le résultat, recevez chaque soumission par webhook ou notification, exportez en CSV." },
      { icon: "🇫🇷", title: "Barèmes français 2026", desc: "Frais de notaire, capacité d'emprunt, cotisations, fiscalité : les modèles s'appuient sur les référentiels officiels à jour." },
    ],
    pathsTitle: "Deux façons de démarrer",
    paths: [
      {
        badge: "Gratuit",
        title: "Widgets prêts à l'emploi",
        desc: "Intégrez l'un de nos simulateurs existants (épargne, prêt immobilier, FIRE, budget…) par un simple copier-coller d'iframe. Idéal pour enrichir un article ou une page produit.",
        cta: "Voir les widgets gratuits",
        to: "/widgets",
        internal: true,
        campaign: "prowidgets",
      },
      {
        badge: "Sur mesure",
        title: "Créez le vôtre avec le Builder",
        desc: "Un calculateur entièrement personnalisé, à votre marque, avec vos formules et la capture de leads. Partez d'un modèle par métier et publiez en un clic. Gratuit pour démarrer.",
        cta: "Créer mon calculateur",
        to: appUrl("/essai", "prostudio"),
        internal: false,
        campaign: "prostudio",
      },
    ],
    useCasesTitle: "Pensé pour votre métier",
    useCases: [
      { icon: "🏦", title: "Courtiers & banques", desc: "Capacité d'emprunt, mensualités, assurance : qualifiez vos prospects avant le premier rendez-vous." },
      { icon: "🏠", title: "Agences immobilières", desc: "Frais de notaire, rendement locatif, budget d'achat directement sur vos annonces." },
      { icon: "💼", title: "Conseillers & CGP", desc: "Simulateurs retraite, PER, fiscalité pour illustrer vos recommandations et générer des leads qualifiés." },
      { icon: "🔧", title: "Artisans & BTP", desc: "Calculateurs de devis instantanés : le visiteur estime son projet, vous récupérez son contact." },
      { icon: "🧮", title: "Freelances & agences", desc: "TJM, coût d'un salarié, ROI : des outils interactifs qui font rester vos visiteurs plus longtemps." },
      { icon: "📊", title: "Éditeurs & médias", desc: "Enrichissez vos articles finances d'un simulateur crédible, sans mobiliser votre équipe technique." },
    ],
    finalTitle: "Prêt à équiper votre site ?",
    finalDesc: "Créez votre premier calculateur gratuitement, ou parlez-nous de votre projet pour une intégration sur mesure.",
    finalCta: "Créer mon calculateur",
    finalCta2: "Réserver une démo",
    modelsCta: "Voir tous les modèles par métier",
    breadcrumbHome: "Accueil",
    breadcrumbPros: "Pour les pros",
  },
  en: {
    kicker: "Simfinly for Business",
    h1: "Calculators and simulators for your business",
    intro: "Embed a branded calculator on your website in minutes: quote calculator, borrowing capacity, ROI estimator, financial simulator. No code, on French 2026 rates, with built-in lead capture. Two options depending on your need: our free ready-made widgets, or your custom calculator built with the Builder.",
    valueTitle: "Why Simfinly for your website",
    values: [
      { icon: "🧩", title: "No code", desc: "Pick a template, customise fields and formulas, publish. Embed with a simple iframe — no technical skills required." },
      { icon: "🎨", title: "Your brand", desc: "Colours, logo, copy: the calculator looks like your site, not ours. Paid plans remove any Simfinly mention." },
      { icon: "🎯", title: "Lead capture", desc: "Require an email before showing the result, get every submission by webhook or notification, export to CSV." },
      { icon: "🇫🇷", title: "French 2026 rates", desc: "Notary fees, borrowing capacity, contributions, taxation: templates rely on up-to-date official references." },
    ],
    pathsTitle: "Two ways to get started",
    paths: [
      {
        badge: "Free",
        title: "Ready-made widgets",
        desc: "Embed one of our existing calculators (savings, mortgage, FIRE, budget…) by copy-pasting an iframe. Perfect to enrich an article or a product page.",
        cta: "See the free widgets",
        to: "/widgets",
        internal: true,
        campaign: "prowidgets",
      },
      {
        badge: "Custom",
        title: "Build your own with the Builder",
        desc: "A fully custom, branded calculator with your formulas and lead capture. Start from a template by industry and publish in one click. Free to start.",
        cta: "Build my calculator",
        to: appUrl("/essai", "prostudio"),
        internal: false,
        campaign: "prostudio",
      },
    ],
    useCasesTitle: "Built for your industry",
    useCases: [
      { icon: "🏦", title: "Brokers & banks", desc: "Borrowing capacity, monthly payments, insurance: qualify leads before the first meeting." },
      { icon: "🏠", title: "Real-estate agencies", desc: "Notary fees, rental yield, purchase budget right on your listings." },
      { icon: "💼", title: "Advisors & wealth managers", desc: "Retirement, savings and tax simulators to illustrate your advice and generate qualified leads." },
      { icon: "🔧", title: "Trades & construction", desc: "Instant quote calculators: the visitor estimates their project, you capture their contact." },
      { icon: "🧮", title: "Freelancers & agencies", desc: "Day rate, cost of an employee, ROI: interactive tools that keep visitors longer." },
      { icon: "📊", title: "Publishers & media", desc: "Enrich your finance articles with a credible simulator, without mobilising your tech team." },
    ],
    finalTitle: "Ready to equip your website?",
    finalDesc: "Create your first calculator for free, or tell us about your project for a custom integration.",
    finalCta: "Build my calculator",
    finalCta2: "Book a demo",
    modelsCta: "See all templates by industry",
    breadcrumbHome: "Home",
    breadcrumbPros: "For business",
  },
};

function Card({ children }) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" }}>
      {children}
    </div>
  );
}

export default function PourLesPros() {
  const [theme, setTheme] = useTheme();
  const { locale } = useTranslation();
  const c = CONTENT[locale] || CONTENT.fr;
  usePageMeta(
    locale === "en" ? "Calculators & Simulators for Business — No-Code Widgets | Simfinly"
                    : "Calculateurs & simulateurs pour entreprise — widgets sans code | simfinly.com",
    c.intro.slice(0, 155)
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk',sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 64px" }}>
        <Breadcrumbs items={[
          { label: c.breadcrumbHome, to: locale === "en" ? "/en" : "/" },
          { label: c.breadcrumbPros },
        ]} />

        {/* Hero */}
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 700, marginTop: 8 }}>
          {c.kicker}
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "8px 0 16px" }}>
          {c.h1}
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 760, marginBottom: 26 }}>
          {c.intro}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 }}>
          <a
            href={appUrl("/essai", "prohero")}
            onClick={() => track("builder_cta_click", { from: "pour-les-pros-hero" })}
            style={{ background: "var(--primary)", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 15, borderRadius: 10, padding: "13px 26px" }}
          >
            {c.finalCta} →
          </a>
          <LocaleLink to="/widgets" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: 15, borderRadius: 10, padding: "13px 22px", border: "1px solid rgba(43,92,230,0.35)" }}>
            {c.paths[0].cta}
          </LocaleLink>
        </div>

        {/* Value props */}
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 600, margin: "0 0 18px" }}>{c.valueTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: 48 }}>
          {c.values.map(v => (
            <Card key={v.title}>
              <div style={{ fontSize: 26, marginBottom: 8 }} aria-hidden>{v.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>{v.desc}</div>
            </Card>
          ))}
        </div>

        {/* Deux chemins */}
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 600, margin: "0 0 18px" }}>{c.pathsTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 48 }}>
          {c.paths.map(p => (
            <div key={p.title} style={{ background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 18, padding: "24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary)", background: "var(--card-bg)", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "3px 11px" }}>{p.badge}</span>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, flex: 1 }}>{p.desc}</div>
              {p.internal
                ? <LocaleLink to={p.to} style={{ fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>{p.cta} →</LocaleLink>
                : <a href={p.to} onClick={() => track("builder_cta_click", { from: `pour-les-pros-${p.campaign}` })} style={{ fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>{p.cta} →</a>}
            </div>
          ))}
        </div>

        {/* Cas d'usage par métier */}
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 600, margin: "0 0 18px" }}>{c.useCasesTitle}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: 48 }}>
          {c.useCases.map(u => (
            <Card key={u.title}>
              <div style={{ fontSize: 24, marginBottom: 8 }} aria-hidden>{u.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{u.title}</div>
              <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>{u.desc}</div>
            </Card>
          ))}
        </div>

        {/* CTA final */}
        <div style={{ background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "30px 28px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>{c.finalTitle}</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 560, margin: "0 auto 20px" }}>{c.finalDesc}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={appUrl("/essai", "profinal")}
              onClick={() => track("builder_cta_click", { from: "pour-les-pros-final" })}
              style={{ background: "var(--primary)", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 15, borderRadius: 10, padding: "13px 26px" }}
            >
              {c.finalCta} →
            </a>
            <LocaleLink to="/contact" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: 15, borderRadius: 10, padding: "13px 22px", border: "1px solid rgba(43,92,230,0.35)" }}>
              {c.finalCta2}
            </LocaleLink>
          </div>
          <div style={{ marginTop: 16 }}>
            <a href={appUrl("/modeles", "promodels")} onClick={() => track("builder_cta_click", { from: "pour-les-pros-models" })} style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              {c.modelsCta} →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
