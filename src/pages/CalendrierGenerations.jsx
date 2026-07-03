import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { getAgeLegal, getDureeRequise, AGE_TAUX_PLEIN_AUTOMATIQUE } from "../data/baremesRetraite.js";

// Table générée depuis src/data/baremesRetraite.js (source unique) — reflète
// le calendrier ACTUELLEMENT EN VIGUEUR, y compris le gel de la réforme Borne
// 2023 pour les générations 1964-1968 décidé par la LFSS 2026 (promulguée le
// 16/12/2025, effective au 1er septembre 2026, jusqu'au 1er janvier 2028).
// Sources : lassuranceretraite.fr, service-public.fr, Décret n° 2023-436.
function ageLabel(age) {
  const ans = Math.floor(age);
  const mois = Math.round((age - ans) * 12);
  return mois > 0 ? `${ans} ans ${mois} mois` : `${ans} ans`;
}
function dureeLabel(duree) {
  return `${duree} trim. (${(duree / 4).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ans)`;
}
const TAUX_PLEIN_AUTO = `${AGE_TAUX_PLEIN_AUTOMATIQUE} ans`;

const TABLE = [
  { naissance: "Avant 1955", ageLegal: ageLabel(getAgeLegal(1954)), duree: dureeLabel(getDureeRequise(1954)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1955–1957",  ageLegal: ageLabel(getAgeLegal(1956)), duree: dureeLabel(getDureeRequise(1956)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1958–1960",  ageLegal: ageLabel(getAgeLegal(1959)), duree: dureeLabel(getDureeRequise(1959)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1961 (1er janv.–31 août)", ageLegal: ageLabel(getAgeLegal(1961, 6)), duree: dureeLabel(getDureeRequise(1961, 6)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1961 (1er sept.–31 déc.)", ageLegal: ageLabel(getAgeLegal(1961, 10)), duree: dureeLabel(getDureeRequise(1961, 10)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1962",       ageLegal: ageLabel(getAgeLegal(1962)), duree: dureeLabel(getDureeRequise(1962)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1963",       ageLegal: ageLabel(getAgeLegal(1963)), duree: dureeLabel(getDureeRequise(1963)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1964",       ageLegal: ageLabel(getAgeLegal(1964)), duree: dureeLabel(getDureeRequise(1964)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1965",       ageLegal: ageLabel(getAgeLegal(1965, 10)), duree: dureeLabel(getDureeRequise(1965, 10)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1966",       ageLegal: ageLabel(getAgeLegal(1966)), duree: dureeLabel(getDureeRequise(1966)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1967",       ageLegal: ageLabel(getAgeLegal(1967)), duree: dureeLabel(getDureeRequise(1967)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1968",       ageLegal: ageLabel(getAgeLegal(1968)), duree: dureeLabel(getDureeRequise(1968)), taux: TAUX_PLEIN_AUTO },
  { naissance: "1969 et après", ageLegal: ageLabel(getAgeLegal(1969)), duree: dureeLabel(getDureeRequise(1969)), taux: TAUX_PLEIN_AUTO, highlight: true },
];

export default function CalendrierGenerations() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Âge de départ à la retraite par année de naissance 2026 — tableau complet | simfinly.com";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Tableau complet des âges de départ à la retraite et de la durée de cotisation par génération (1955–1968+). Réformes 2010, 2014 et 2023 expliquées. Données officielles CNAV et COR.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = "https://www.simfinly.com/retraite/calendrier-generations";

    const ld = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Âge de départ à la retraite par année de naissance 2026",
      description: "Tableau officiel des âges légaux de départ à la retraite, durée de cotisation et âge du taux plein automatique pour toutes les générations nées entre 1955 et 1968, après les réformes de 2010, 2014 et 2023.",
      url: "https://www.simfinly.com/retraite/calendrier-generations",
      author: { "@type": "Organization", name: "Simfinly", url: "https://www.simfinly.com" },
      publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: "https://www.simfinly.com/logo-mark.svg" } },
      dateModified: "2026-06",
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.simfinly.com/retraite/calendrier-generations" },
    };
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "À quel âge puis-je partir à la retraite si je suis né en 1965 ?", acceptedAnswer: { "@type": "Answer", text: "Si vous êtes né entre avril et décembre 1965, votre âge légal de départ est de 63 ans (calendrier gelé par la LFSS 2026). Vous avez besoin de 171 trimestres pour bénéficier du taux plein. À défaut, le taux plein automatique s'applique à 67 ans quel que soit votre nombre de trimestres." } },
        { "@type": "Question", name: "Combien de trimestres faut-il pour les nés en 1968 ?", acceptedAnswer: { "@type": "Answer", text: "Les personnes nées en 1968 doivent valider 172 trimestres pour obtenir le taux plein, avec un âge légal de départ fixé à 63 ans et 9 mois (calendrier gelé par la LFSS 2026 jusqu'au 1er janvier 2028). Sans 172 trimestres, une décote de 0,625 % par trimestre manquant s'applique (plafonnée à 12,5 %), jusqu'au taux plein automatique à 67 ans." } },
        { "@type": "Question", name: "Quelle est la différence entre âge légal et taux plein automatique ?", acceptedAnswer: { "@type": "Answer", text: "L'âge légal (62 à 64 ans selon génération) est le plus tôt auquel vous pouvez partir, mais votre pension peut être réduite par une décote si vous n'avez pas vos trimestres. L'âge du taux plein automatique, fixé à 67 ans pour toutes les générations, est l'âge à partir duquel aucune décote n'est appliquée, quel que soit votre nombre de trimestres." } },
        { "@type": "Question", name: "La réforme des retraites 2023 s'applique-t-elle encore telle quelle en 2026 ?", acceptedAnswer: { "@type": "Answer", text: "Non : la loi de financement de la Sécurité sociale pour 2026 a gelé la montée en charge de la réforme Borne 2023 pour les générations nées entre 1964 et 1968, pour les retraites prenant effet à compter du 1er septembre 2026, et ce jusqu'au 1er janvier 2028. Les générations 1964 et 1965 (jusqu'à mars) gagnent sur l'âge légal et la durée requise ; les générations 1966 à 1968 ne gagnent que 3 mois sur l'âge légal." } },
      ],
    };
    const breadcrumbLd = {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.simfinly.com/" },
        { "@type": "ListItem", position: 2, name: "Retraite", item: "https://www.simfinly.com/retraite/a-40-ans" },
        { "@type": "ListItem", position: 3, name: "Calendrier des générations" },
      ],
    };

    ["calgen-article-ld", "calgen-faq-ld", "calgen-bc-ld"].forEach(id => document.getElementById(id)?.remove());
    [[ld, "calgen-article-ld"], [faqLd, "calgen-faq-ld"], [breadcrumbLd, "calgen-bc-ld"]].forEach(([data, id]) => {
      const s = document.createElement("script"); s.id = id; s.type = "application/ld+json";
      s.textContent = JSON.stringify(data); document.head.appendChild(s);
    });
    return () => ["calgen-article-ld", "calgen-faq-ld", "calgen-bc-ld"].forEach(id => document.getElementById(id)?.remove());
  }, []);

  const th = { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "2px solid var(--border)", background: "var(--bg)", position: "sticky", top: 0 };
  const td = (highlight) => ({ padding: "10px 14px", fontSize: 13, borderBottom: "1px solid var(--border)", background: highlight ? "rgba(var(--primary-rgb,59,130,246),0.06)" : "var(--card)", color: "var(--text)" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>

        <nav aria-label="Fil d'Ariane" style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 24 }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <Link to="/retraite/a-40-ans" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Retraite</Link>
          {" · "}
          <span>Calendrier des générations</span>
        </nav>

        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "var(--primary)", background: "rgba(var(--primary-rgb,59,130,246),0.08)", padding: "4px 12px", borderRadius: 20, marginBottom: 14, letterSpacing: "0.05em" }}>
            Données officielles · Réforme 2023
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 14 }}>
            Âge de départ à la retraite par année de naissance
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 680 }}>
            Tableau complet des âges légaux de départ, durées de cotisation requises et âges du taux plein automatique pour toutes les générations, après les réformes de 2010, 2014 et 2023.
          </p>
        </div>

        {/* Tableau principal */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid var(--border)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={th}>Année de naissance</th>
                  <th style={th}>Âge légal</th>
                  <th style={th}>Durée requise</th>
                  <th style={th}>Taux plein auto.</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...td(row.highlight), fontWeight: row.highlight ? 700 : 400 }}>{row.naissance}</td>
                    <td style={{ ...td(row.highlight), fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: row.highlight ? "var(--primary)" : "var(--text)" }}>{row.ageLegal}</td>
                    <td style={td(row.highlight)}>{row.duree}</td>
                    <td style={td(row.highlight)}>{row.taux}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 10 }}>
            Sources : lassuranceretraite.fr, service-public.fr, loi n° 2023-270 du 14 avril 2023. Pour les générations 1964-1968, le tableau reflète le gel temporaire décidé par la loi de financement de la Sécurité sociale 2026 (effective au 1er septembre 2026, jusqu'au 1er janvier 2028).
          </p>
        </section>

        {/* Explication des réformes */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
            Les 3 grandes réformes qui ont changé votre retraite
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { annee: "2010 — Réforme Woerth", couleur: "var(--text-secondary)", impact: "Passage de l'âge légal de 60 à 62 ans. Touche les générations nées à partir du 1er juillet 1951. La durée de cotisation reste à 162 trimestres pour les nés en 1952-1957, puis monte progressivement." },
              { annee: "2014 — Réforme Touraine", couleur: "var(--warning)", impact: "Augmentation progressive de la durée de cotisation : de 166 trimestres (nés en 1955) à 172 trimestres (nés en 1973). Pas de changement de l'âge légal. Les générations nées en 1960-1967 sont particulièrement impactées (+1 à +6 trimestres)." },
              { annee: "2023 — Réforme Borne", couleur: "var(--negative)", impact: "Relèvement progressif de l'âge légal de 62 à 64 ans à raison de +3 mois par génération, à partir des nés en septembre 1961. Les nés en 1969 et après travaillent jusqu'à 64 ans avec 172 trimestres. C'est la réforme la plus contestée depuis 1995." },
              { annee: "2026 — Gel temporaire (LFSS 2026)", couleur: "var(--warning)", impact: "La loi de financement de la Sécurité sociale 2026 gèle la montée en charge de la réforme Borne pour les générations 1964-1968, à compter du 1er septembre 2026 et jusqu'au 1er janvier 2028. Ce n'est pas une abrogation : la trajectoire vers 64 ans reprendra ensuite, sauf nouvelle loi." },
            ].map(r => (
              <div key={r.annee} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 16 }}>
                <div style={{ flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: r.couleur, minWidth: 140 }}>{r.annee}</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>{r.impact}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Décote / Surcote */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            Décote et surcote : l'impact sur votre pension
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--negative)", marginBottom: 8 }}>Décote</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                <strong>−0,625 % par trimestre manquant</strong> (plafonné à −12,5 % max, soit 20 trimestres). S'applique si vous partez avant d'avoir vos trimestres et avant 67 ans. Définitive — elle ne disparaît pas avec le temps.
              </div>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--positive)", marginBottom: 8 }}>Surcote</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                <strong>+1,25 % par trimestre supplémentaire</strong> travaillé après le taux plein et après l'âge légal. Sans plafond. Chaque trimestre de surcote augmente définitivement la pension CNAV.
              </div>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 8 }}>Taux plein auto.</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                À <strong>67 ans</strong>, pour toutes les générations, aucune décote n'est appliquée, même sans trimestres suffisants. C'est le filet de sécurité pour les carrières incomplètes.
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
            Questions fréquentes
          </h2>
          {[
            { q: "À quel âge puis-je partir à la retraite si je suis né en 1965 ?", a: "Si vous êtes né entre avril et décembre 1965, votre âge légal est 63 ans (calendrier gelé par la LFSS 2026). Vous avez besoin de 171 trimestres pour le taux plein. Sans ces trimestres, le taux plein automatique s'applique à 67 ans." },
            { q: "Les nés en 1968 doivent-ils partir à 64 ans ?", a: "Non, pas encore : la LFSS 2026 gèle leur âge légal à 63 ans et 9 mois jusqu'au 1er janvier 2028 (au lieu de 64 ans prévus par la réforme Borne 2023). Avec 172 trimestres à cet âge, ils touchent le taux plein (50 % du SAM). Avant, la décote s'applique." },
            { q: "Qu'est-ce que le taux plein automatique à 67 ans ?", a: "C'est l'âge, identique pour toutes les générations depuis 2010, à partir duquel aucune décote n'est appliquée, quel que soit votre nombre de trimestres. Utile pour les personnes ayant des carrières hachées (années d'études longues, parentalité, chômage). Mais attention : le montant de pension reste calculé sur votre SAM — avoir peu de trimestres ne réduit que via la proratisation, pas la décote." },
            { q: "Comment savoir si je suis concerné par la réforme 2023 ?", a: "Si vous êtes né avant septembre 1961 : vos droits sont calculés sous les règles antérieures (62 ans, réformes 2010/2014). Si vous êtes né à partir de septembre 1961 : la réforme 2023 décale progressivement votre âge légal, jusqu'à un palier définitif de 64 ans pour les nés à partir de 1969. Pour les générations 1964 à 1968, ce palier est temporairement gelé (LFSS 2026, jusqu'au 1er janvier 2028) : consultez votre relevé individuel sur info-retraite.fr pour votre date précise." },
          ].map((item, i) => (
            <details key={i} style={{ marginBottom: 10, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px" }}>
              <summary style={{ fontWeight: 600, fontSize: 14, cursor: "pointer", color: "var(--text)", listStyle: "none" }}>
                {item.q}
              </summary>
              <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.75, color: "var(--text-secondary)" }}>{item.a}</p>
            </details>
          ))}
        </section>

        {/* CTA */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
            Et votre retraite à vous ?
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 20px" }}>
            Le tableau donne les règles générales. Votre situation précise (trimestres validés, carrière longue, multi-régimes) peut changer significativement le résultat.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/simulateurs/cnav" style={{ padding: "11px 22px", borderRadius: 10, background: "var(--primary)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Simuler ma pension CNAV →
            </Link>
            <Link to="/simulateurs/trimestres" style={{ padding: "11px 22px", borderRadius: 10, background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Vérifier mes trimestres
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
