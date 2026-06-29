import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";

const BASE = "https://www.simfinly.com";

const STATS = [
  { value: "54 %", label: "Taux de réversion CNAV", note: "De la pension brute du défunt" },
  { value: "60 %", label: "Taux Agirc-Arrco", note: "De la pension complémentaire" },
  { value: "55 ans", label: "Âge minimum", note: "Pour la réversion CNAV" },
  { value: "4,7 M", label: "Bénéficiaires", note: "En France (85 % de femmes)" },
];

const FAQ = [
  {
    q: "Qui a droit à la pension de réversion en France ?",
    a: "Le conjoint survivant marié (ou ex-conjoint si non remarié) a droit à la pension de réversion CNAV. Pour l'Agirc-Arrco, le droit s'ouvre également aux partenaires de PACS (depuis 2020 pour certaines caisses). Le concubinage ne donne pas droit à la réversion.",
  },
  {
    q: "Quel est le montant de la pension de réversion en 2026 ?",
    a: "La pension de réversion CNAV est égale à 54 % de la pension de base du défunt, sous condition de ressources. La réversion Agirc-Arrco est de 60 % de la pension complémentaire, sans condition de ressources. Au total, la pension de réversion peut représenter 50–60 % de la retraite totale du défunt.",
  },
  {
    q: "Y a-t-il un plafond de ressources pour la réversion CNAV ?",
    a: "Oui. En 2026, vos ressources annuelles ne doivent pas dépasser 23 441 € (personne seule) ou 37 506 € (en couple, si vous vous êtes remarié). Si vous dépassez ce plafond, votre réversion CNAV est réduite ou supprimée. La réversion Agirc-Arrco n'a pas de plafond de ressources.",
  },
  {
    q: "La pension de réversion est-elle imposable ?",
    a: "Oui, la pension de réversion est imposable comme une pension de retraite ordinaire. Elle bénéficie de l'abattement de 10 % sur les pensions (plafonné à 3 752 €/an en 2026). Elle est également soumise à la CSG (8,3 %) et à la CRDS (0,5 %), sauf si vos revenus sont inférieurs au plafond d'exonération.",
  },
  {
    q: "Peut-on cumuler la réversion avec sa propre retraite ?",
    a: "Oui, depuis 2011, le cumul pension de réversion + propre retraite est possible sans limite pour la réversion Agirc-Arrco. Pour la réversion CNAV, le cumul est possible mais la condition de ressources prend en compte l'ensemble de vos revenus (y compris votre propre retraite).",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Pension de réversion 2026 : calcul, conditions et droits — guide complet",
    description: "Tout savoir sur la pension de réversion 2026 : taux (54 % CNAV, 60 % Agirc-Arrco), conditions d'âge et de ressources, délais et cumul avec sa propre retraite.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/retraite/calcul-pension-reversion`,
    datePublished: "2026-01-20",
    dateModified: "2026-06-01",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/retraite/calcul-pension-reversion`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Simulateurs retraite", item: `${BASE}/simulateurs/pension-reversion` },
      { "@type": "ListItem", position: 3, name: "Calcul pension de réversion 2026", item: `${BASE}/retraite/calcul-pension-reversion` },
    ],
  },
];

export default function GuidePensionReversion() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Pension de réversion 2026 — calcul, taux et conditions | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Guide complet sur la pension de réversion 2026 : taux 54 % (CNAV), 60 % (Agirc-Arrco), plafond de ressources, conditions d'âge et simulateur gratuit.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/retraite/calcul-pension-reversion`;
  }, []);

  const s = {
    page: { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" },
    wrap: { maxWidth: 820, margin: "0 auto", padding: "0 20px 80px" },
    breadcrumb: { display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "var(--text-secondary)", padding: "20px 0 0", flexWrap: "wrap" },
    hero: { padding: "32px 0 24px" },
    badge: { display: "inline-block", background: "var(--positive-soft)", color: "var(--positive)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14 },
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,4.5vw,36px)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", margin: "0 0 14px", letterSpacing: "-0.02em" },
    sub: { fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 28px" },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 36, boxShadow: "0 2px 12px rgba(43,92,230,.25)" },
    stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 40 },
    stat: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" },
    statVal: { fontSize: 22, fontWeight: 700, color: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
    statNote: { fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", margin: "36px 0 14px", lineHeight: 1.3 },
    body: { fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" },
    table: { width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14 },
    th: { background: "var(--primary-soft)", color: "var(--primary)", fontWeight: 600, padding: "10px 16px", textAlign: "left", borderBottom: "2px solid var(--border-gold)" },
    td: { padding: "10px 16px", borderBottom: "1px solid var(--border)", color: "var(--text)" },
    infoBox: { background: "var(--positive-soft)", border: "1px solid var(--positive)", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
    warnBox: { background: "var(--negative-soft)", border: "1px solid var(--negative)", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
    faqSection: { marginTop: 48 },
    faqH2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", marginBottom: 20 },
    faqItem: { borderBottom: "1px solid var(--border)", padding: "20px 0" },
    faqQ: { fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10 },
    faqA: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 },
    ctaBox: { background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 14, padding: "28px 32px", marginTop: 48, textAlign: "center" },
    ctaBoxTitle: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 },
    ctaBoxSub: { fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 },
  };

  return (
    <div style={s.page}>
      {schemas.map((sc, i) => <JsonLd key={i} data={sc} />)}
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={s.wrap}>
        {/* Breadcrumb */}
        <nav style={s.breadcrumb} aria-label="Fil d'Ariane">
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          <span>›</span>
          <Link to="/simulateurs/pension-reversion" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Pension de réversion</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }}>Calcul et conditions 2026</span>
        </nav>

        {/* Hero */}
        <div style={s.hero}>
          <span style={s.badge}>Réversion</span>
          <h1 style={s.h1}>Pension de réversion 2026 : calcul, taux et conditions</h1>
          <p style={s.sub}>
            La pension de réversion permet au conjoint survivant de percevoir une partie de la retraite du défunt.
            Taux, conditions d'âge, plafond de ressources, délai : voici tout ce qu'il faut savoir.
          </p>
          <Link to="/simulateurs/pension-reversion" style={s.cta}>
            💞 Calculer ma pension de réversion
          </Link>
        </div>

        {/* Stats */}
        <div style={s.stats}>
          {STATS.map((st, i) => (
            <div key={i} style={s.stat}>
              <div style={s.statVal}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
              <div style={s.statNote}>{st.note}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <h2 style={s.h2}>Qu'est-ce que la pension de réversion ?</h2>
        <div style={s.body}>
          <p>La pension de réversion est une prestation versée au conjoint survivant d'un assuré décédé. Elle correspond à une fraction de la retraite que le défunt percevait ou aurait perçue. En France, il existe plusieurs pensions de réversion cumulables :</p>
          <ul>
            <li>La réversion du <strong>régime général (CNAV)</strong> pour les salariés du privé</li>
            <li>La réversion de l'<strong>Agirc-Arrco</strong> pour la retraite complémentaire</li>
            <li>Les réversions des <strong>régimes spéciaux</strong> (fonctionnaires, professions libérales, etc.)</li>
          </ul>
          <p>Environ 4,7 millions de personnes en bénéficient en France, à 85 % des femmes.</p>
        </div>

        <h2 style={s.h2}>Conditions pour bénéficier de la réversion CNAV</h2>
        <div style={s.body}>
          <div style={s.warnBox}>
            <strong>⚠️ Important :</strong> La réversion CNAV est réservée aux conjoints <strong>mariés</strong>. Le PACS et le concubinage ne donnent pas droit à la réversion CNAV. En revanche, les ex-conjoints divorcés non remariés peuvent en bénéficier (sous conditions).
          </div>
          <p>Pour obtenir la réversion CNAV en 2026 :</p>
          <ul>
            <li><strong>Âge minimum :</strong> 55 ans (abaissé à 51 ans si le défunt est décédé avant 2009)</li>
            <li><strong>Lien matrimonial :</strong> être marié(e) ou avoir été marié(e) (divorcé(e) non remarié(e))</li>
            <li><strong>Ressources :</strong> ne pas dépasser 23 441 €/an (seul) ou 37 506 €/an (en couple)</li>
          </ul>
          <p>Il n'y a pas de condition de durée de mariage, ni d'obligation que le défunt ait été à la retraite au moment du décès.</p>
        </div>

        <h2 style={s.h2}>Taux et montant de la réversion en 2026</h2>
        <div style={s.body}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Régime</th>
                <th style={s.th}>Taux de réversion</th>
                <th style={s.th}>Conditions de ressources</th>
                <th style={s.th}>Âge minimum</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["CNAV (salarié privé)", "54 %", "Oui — 23 441 €/an (seul)", "55 ans"],
                ["Agirc-Arrco", "60 %", "Non", "Pas d'âge minimum"],
                ["IRCANTEC (agents pub.)", "50 %", "Non", "Pas d'âge minimum"],
                ["Fonction publique (CNRACL)", "50 %", "Non", "Pas d'âge minimum"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <div style={s.infoBox}>
            <strong>💡 Exemple :</strong> Si votre conjoint décédé percevait 1 800 €/mois de retraite totale (1 100 € CNAV + 700 € Agirc-Arrco), vous pouvez percevoir :<br />
            • CNAV : 1 100 × 54 % = <strong>594 €/mois</strong> (sous condition de ressources)<br />
            • Agirc-Arrco : 700 × 60 % = <strong>420 €/mois</strong> (sans condition)<br />
            • Total possible : <strong>1 014 €/mois</strong>
          </div>
        </div>

        <h2 style={s.h2}>Le plafond de ressources CNAV en détail</h2>
        <div style={s.body}>
          <p>Le plafond de ressources 2026 pour la réversion CNAV est calculé sur l'ensemble de vos revenus, y compris votre propre retraite. Si vos ressources dépassent le plafond, la réversion est réduite proportionnellement — elle n'est pas simplement supprimée :</p>
          <p style={{ background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "14px 20px", fontWeight: 600, color: "var(--text)" }}>
            Réversion nette = Réversion théorique − (Dépassement du plafond × 1,3)
          </p>
          <p style={{ marginTop: 16 }}>Exemple : plafond 23 441 €/an, vos ressources = 26 000 €/an (dépassement = 2 559 €). Réversion réduite de 2 559 × 1,3 = 3 327 €/an.</p>
          <p>Les ressources prises en compte : pensions de retraite, revenus d'activité, revenus du patrimoine, allocations chômage, indemnités journalières. La réversion Agirc-Arrco que vous percevez est exclue du calcul du plafond CNAV.</p>
        </div>

        <h2 style={s.h2}>Délai et démarches pour demander la réversion</h2>
        <div style={s.body}>
          <ul>
            <li><strong>CNAV :</strong> Faire la demande auprès de la CNAV ou d'une CARSAT. Le versement prend effet au 1er du mois suivant le 55e anniversaire ou la demande, selon ce qui est le plus tardif. Délai de traitement moyen : 3 à 6 mois.</li>
            <li><strong>Agirc-Arrco :</strong> Contacter l'Agirc-Arrco ou utiliser le formulaire en ligne. Aucun âge minimum. Versement rétroactif possible dans certains cas.</li>
            <li><strong>Documents à fournir :</strong> Acte de décès, acte de mariage (et éventuellement jugement de divorce), relevé d'identité bancaire, justificatif d'identité, justificatifs de ressources (avis d'imposition).</li>
          </ul>
          <div style={s.infoBox}>
            <strong>💡 Bon à savoir :</strong> La demande de réversion CNAV peut être faite jusqu'à 3 ans après le décès sans perte de droits (versement rétroactif sur 3 ans). Au-delà, seule la période non prescrite est versée.
          </div>
        </div>

        <h2 style={s.h2}>Réversion et remariage</h2>
        <div style={s.body}>
          <p>Si vous vous remariez ou vous pacsez après le décès :</p>
          <ul>
            <li><strong>CNAV :</strong> Le remariage entraîne la suppression de la réversion CNAV. En cas de nouveau divorce ou veuvage, vous pouvez la retrouver.</li>
            <li><strong>Agirc-Arrco :</strong> Le remariage n'entraîne <em>pas</em> la suppression de la réversion complémentaire (règle modifiée en 2019).</li>
          </ul>
        </div>

        {/* FAQ */}
        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur la pension de réversion</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{q}</div>
              <div style={s.faqA}>{a}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={s.ctaBox}>
          <div style={s.ctaBoxTitle}>Estimez votre pension de réversion gratuitement</div>
          <p style={s.ctaBoxSub}>
            Renseignez la pension du défunt et vos ressources pour calculer le montant auquel vous avez droit, CNAV et Agirc-Arrco inclus.
          </p>
          <Link to="/simulateurs/pension-reversion" style={{ ...s.cta, marginBottom: 0 }}>
            Lancer le simulateur →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
