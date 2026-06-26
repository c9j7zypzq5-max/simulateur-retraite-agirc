import { useParams, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";
import { FaqSection } from "../components/ui.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

const METIERS = {
  fonctionnaire: {
    icon: "🏛️",
    title: "Retraite du fonctionnaire",
    subtitle: "Régime spécial · Fonction publique d'État, territoriale et hospitalière",
    metaTitle: "Retraite fonctionnaire 2026 — âge, calcul, taux et pension nette",
    metaDesc: "Calculez votre pension de retraite fonctionnaire : traitement de référence, taux de liquidation, décote, surcote et RAFP. Guide complet 2026.",
    intro: "Les fonctionnaires (État, territoriale, hospitalière) bénéficient d'un régime spécial de retraite géré par le SRE (service des retraites de l'État) ou la CNRACL. La pension est calculée sur le traitement indiciaire brut, hors primes, avec un taux maximum de 75 %.",
    simulateurPath: "/simulateurs/fonction-publique",
    simulateurLabel: "Simulateur Retraite Fonction Publique",
    stats: [
      { label: "Âge légal", value: "64 ans", note: "(catégorie active : 59 ans)" },
      { label: "Taux maximum", value: "75 %", note: "du traitement indiciaire brut" },
      { label: "Durée requise", value: "172 trimestres", note: "pour les nés en 1965+" },
      { label: "Surcote", value: "+1,25 %", note: "par trimestre supplémentaire" },
    ],
    sections: [
      {
        title: "Comment est calculée la pension d'un fonctionnaire ?",
        content: `La pension de retraite d'un fonctionnaire est calculée selon la formule :\n\n**Pension brute = Traitement indiciaire × Taux de liquidation × Coefficient de proratisation**\n\nLe taux de liquidation dépend du nombre de trimestres validés rapporté à la durée requise (172 trimestres pour les nés après 1964), plafonné à 75 %. Une décote de 0,625 % par trimestre manquant et une surcote de 1,25 % par trimestre supplémentaire peuvent s'appliquer.\n\nLes primes ne sont pas prises en compte dans la pension de base. Elles alimentent en revanche le RAFP (Retraite Additionnelle de la Fonction Publique).`,
      },
      {
        title: "Quelle est la différence entre catégorie active et sédentaire ?",
        content: `Les agents de **catégorie active** exercent des métiers à risques reconnus (policiers, pompiers, infirmiers hospitaliers, agents pénitentiaires…). Ils bénéficient d'un droit à départ à 59 ans au lieu de 64 ans.\n\nLes agents de **catégorie sédentaire** (enseignants, administratifs…) sont soumis aux mêmes règles que le régime général depuis la réforme 2023.`,
      },
      {
        title: "Qu'est-ce que le RAFP ?",
        content: `Le RAFP (Retraite Additionnelle de la Fonction Publique) est un régime par points obligatoire pour tous les fonctionnaires. Il prend en compte les primes et indemnités à hauteur de 20 % du traitement brut. La pension RAFP s'ajoute à la pension principale, mais reste modeste (quelques dizaines d'euros par mois pour une carrière complète).`,
      },
    ],
    faq: [
      { q: "À quel âge un fonctionnaire peut-il partir à la retraite ?", a: "Depuis la réforme 2023, l'âge légal est progressivement relevé à 64 ans pour les agents sédentaires nés à partir de 1968. Les agents de catégorie active (policiers, pompiers, infirmiers hospitaliers) conservent un avantage de 5 ans : ils peuvent partir dès 59 ans." },
      { q: "Comment sont calculés les trimestres dans la fonction publique ?", a: "Dans le régime de la fonction publique, on parle de «trimestres de services effectifs». Un trimestre est validé par 90 jours de service. Les congés maladie, maternité, formation sont généralement assimilés à des services. Les périodes de temps partiel sont comptabilisées au prorata." },
      { q: "Les enseignants sont-ils catégorie sédentaire ou active ?", a: "Les enseignants sont classés en catégorie sédentaire depuis 2023. Ils partent donc à 64 ans comme les agents du régime général. En contrepartie, ils bénéficient d'une prime spécifique (ISOE) intégrée dans le régime RAFP." },
      { q: "Puis-je cumuler pension fonctionnaire et activité privée ?", a: "Oui, le cumul emploi-retraite est possible pour les fonctionnaires dans les mêmes conditions que le régime général. Depuis 2024, une reprise d'activité après liquidation peut ouvrir droit à une seconde liquidation et donc à une surcote supplémentaire." },
      { q: "Mon conjoint a droit à quelle pension de réversion ?", a: "Le conjoint survivant d'un fonctionnaire a droit à 50 % de la pension principale, sans condition de ressources ni d'âge minimum. Cette pension de réversion fonctionnaire est plus avantageuse que celle du régime général (54 % avec plafond de ressources)." },
    ],
  },

  infirmiere: {
    icon: "🏥",
    title: "Retraite infirmière",
    subtitle: "CNAV · FPH (catégorie active) · Secteur libéral (CARPIMKO)",
    metaTitle: "Retraite infirmière 2026 — CNAV, FPH ou CARPIMKO : âge et calcul",
    metaDesc: "Guide complet pour la retraite des infirmières et infirmiers : hôpital public (catégorie active 59 ans), secteur libéral (CARPIMKO) ou salariat privé (CNAV).",
    intro: "La retraite d'une infirmière dépend de son statut : hospitalière publique (FPH, catégorie active, départ à 59 ans), libérale (CARPIMKO), ou salariée du secteur privé (CNAV + Agirc-Arrco). Chaque régime a ses propres règles d'âge, de calcul et de taux de remplacement.",
    simulateurPath: "/simulateurs/cnav",
    simulateurLabel: "Simulateur Retraite CNAV",
    stats: [
      { label: "FPH (publique)", value: "59 ans", note: "catégorie active hospitalière" },
      { label: "Secteur privé", value: "64 ans", note: "régime général CNAV" },
      { label: "CARPIMKO", value: "67 ans", note: "ou 62 ans avec carrière complète" },
      { label: "Taux remplacement", value: "~50-65 %", note: "selon le régime et la carrière" },
    ],
    sections: [
      {
        title: "Infirmière hospitalière (FPH) : catégorie active",
        content: `Les infirmiers et infirmières exerçant à l'hôpital public font partie de la **catégorie active** de la Fonction Publique Hospitalière (FPH). Ils bénéficient d'un départ anticipé à 59 ans (au lieu de 64 ans pour la catégorie sédentaire), sous réserve d'avoir accompli au moins 17 ans de services actifs.\n\nLa pension est calculée sur le traitement indiciaire brut selon les règles FPH (taux max 75 %). Les heures supplémentaires et primes n'entrent pas dans le calcul de la pension de base.`,
      },
      {
        title: "Infirmière libérale : régime CARPIMKO",
        content: `Les infirmiers libéraux cotisent à la **CARPIMKO** (Caisse Autonome de Retraite et de Prévoyance des Infirmiers). Ce régime comprend :\n- Une retraite de base (régime de droit commun avec la CNAVPL)\n- Une retraite complémentaire par points (CARPIMKO)\n- Un régime invalidité-décès\n\nL'âge de départ à taux plein est 67 ans (ou 62 ans avec la durée d'assurance complète). Le taux de remplacement est généralement inférieur à celui du régime général pour les revenus modestes.`,
      },
      {
        title: "Infirmière salariée du secteur privé : CNAV + Agirc-Arrco",
        content: `Les infirmières employées en cliniques privées, EHPAD ou structures associatives cotisent au régime général (**CNAV**) et au régime complémentaire **Agirc-Arrco**. L'âge légal est 64 ans, le taux de remplacement net oscille entre 55 % et 70 % selon la durée de carrière et le niveau de salaire.`,
      },
    ],
    faq: [
      { q: "À quel âge part à la retraite une infirmière à l'hôpital public ?", a: "Une infirmière de la FPH (Fonction Publique Hospitalière) est classée en catégorie active. Elle peut partir dès 59 ans si elle a accompli au moins 17 ans de services actifs. Sans cette condition, elle doit attendre 64 ans comme les agents sédentaires." },
      { q: "Comment fonctionne la retraite CARPIMKO pour les infirmiers libéraux ?", a: "La CARPIMKO est le régime de retraite des infirmiers libéraux. Elle comprend un régime de base (aligné sur la CNAVPL), une retraite complémentaire par points et une couverture invalidité. Les cotisations sont calculées sur le revenu professionnel. L'âge du taux plein est 67 ans ou 62 ans avec la durée requise." },
      { q: "Une infirmière peut-elle cumuler plusieurs régimes de retraite ?", a: "Oui, si une infirmière a exercé successivement en tant que libérale puis hospitalière (ou inversement), elle cumule des droits dans chaque régime. Chaque caisse calcule une pension proportionnelle aux années cotisées." },
      { q: "Les nuits et week-ends donnent-ils des avantages retraite ?", a: "Dans la FPH, les services de nuit et les astreintes donnent droit à des bonifications de durée d'assurance. Une « nuit » (entre 21h et 6h) équivaut à 1 trimestre pour 90 nuits travaillées dans certains régimes. Ces règles varient selon la catégorie et la période de carrière." },
    ],
  },

  enseignant: {
    icon: "📚",
    title: "Retraite enseignant",
    subtitle: "Éducation nationale · Catégorie sédentaire · RAFP",
    metaTitle: "Retraite enseignant 2026 — âge, calcul de la pension et RAFP",
    metaDesc: "Simulez la retraite d'un enseignant (professeur des écoles, collège, lycée, université) : âge légal 64 ans, taux max 75 %, calcul sur l'indice brut et RAFP.",
    intro: "Les enseignants de l'Éducation nationale (professeurs des écoles, certifiés, agrégés, PRAG, maîtres de conférences) relèvent de la Fonction Publique d'État en catégorie sédentaire. Ils partent à 64 ans avec un taux maximum de 75 % de leur traitement indiciaire brut.",
    simulateurPath: "/simulateurs/fonction-publique",
    simulateurLabel: "Simulateur Retraite Fonction Publique",
    stats: [
      { label: "Âge légal", value: "64 ans", note: "nés après 1968 (réforme 2023)" },
      { label: "Taux maximum", value: "75 %", note: "du traitement indiciaire brut" },
      { label: "Durée requise", value: "172 trimestres", note: "pour les nés en 1965+" },
      { label: "RAFP", value: "≈ 20–80 €/mois", note: "selon carrière et primes" },
    ],
    sections: [
      {
        title: "Comment est calculée la pension d'un enseignant ?",
        content: `La pension d'un enseignant est calculée sur son **traitement indiciaire brut** (indice majoré × valeur du point d'indice), sans inclure les primes (ISOE, HSA, HSE, prime REP+…).\n\nFormule : **Traitement brut × Taux de liquidation**\n\nOù le taux de liquidation = (trimestres validés / 172) × 75 %, dans la limite de 75 %. Une décote de 0,625 % par trimestre manquant et une surcote de 1,25 % par trimestre excédentaire s'appliquent dans certains cas.`,
      },
      {
        title: "Pourquoi les primes ne comptent-elles pas ?",
        content: `C'est l'une des principales différences entre les enseignants et le secteur privé : **aucune prime** (ISOE, heures supplémentaires, prime REP+, prime de directeur…) n'entre dans le calcul de la pension de base.\n\nEn contrepartie, une partie de ces primes est prélevée et versée au **RAFP** (Retraite Additionnelle de la Fonction Publique), qui génère une petite pension complémentaire par points. Pour un enseignant avec 35 ans de carrière, le RAFP représente environ 20 à 80 €/mois selon le volume de primes.`,
      },
      {
        title: "Enseignant du privé sous contrat : quelles règles ?",
        content: `Les enseignants du secteur privé sous contrat (enseignement catholique, laïque ou sous contrat simple) cotisent au **régime général CNAV** et à **Agirc-Arrco**, pas à la FPE. Ils partent à 64 ans selon les règles du régime général. Leur taux de remplacement est calculé sur le salaire moyen des 25 meilleures années.`,
      },
    ],
    faq: [
      { q: "À quel âge un professeur des écoles peut-il partir à la retraite ?", a: "Depuis la réforme 2023, l'âge légal est progressivement porté à 64 ans pour les enseignants nés à partir de 1968. Les générations précédentes bénéficient de règles transitoires. Il est possible de partir avant si vous avez commencé à travailler tôt (dispositif carrières longues)." },
      { q: "Un enseignant agrégé a-t-il une meilleure retraite ?", a: "L'agrégé bénéficie d'un indice de traitement plus élevé qu'un certifié, ce qui augmente mécaniquement sa pension de base. Pour un agrégé hors classe en fin de carrière, l'indice majoré peut dépasser 900, contre environ 750 pour un certifié hors classe." },
      { q: "Les années de stages et vacations comptent-elles pour la retraite ?", a: "Les années effectuées en tant que contractuel ou vacataire avant la titularisation peuvent être rachetées ou reconnues sous conditions. Les stages de fonctionnaire sont pris en compte dès lors que des cotisations ont été versées au régime de retraite de l'État." },
      { q: "Un professeur des universités (MCF, PR) suit-il les mêmes règles ?", a: "Les maîtres de conférences (MCF) et professeurs des universités relèvent également de la Fonction Publique d'État, en catégorie sédentaire. Les règles de calcul de la pension sont identiques. Leur traitement indiciaire de référence est généralement plus élevé qu'un enseignant du secondaire." },
      { q: "Peut-on racheter des années d'études pour améliorer sa pension ?", a: "Oui, les fonctionnaires peuvent racheter jusqu'à 3 ans d'études supérieures validées par un diplôme, afin d'augmenter leur durée d'assurance. Le rachat se fait via une demande auprès du service des retraites de l'État. Le coût varie selon l'âge et le traitement au moment de la demande." },
    ],
  },

  agriculteur: {
    icon: "🌾",
    title: "Retraite agriculteur",
    subtitle: "MSA · Régime des non-salariés agricoles",
    metaTitle: "Retraite agriculteur 2026 — MSA, calcul de la pension et revalorisation",
    metaDesc: "Guide complet sur la retraite des agriculteurs exploitants et salariés agricoles : MSA, pension de retraite complémentaire obligatoire (RCO), âge légal et taux plein.",
    intro: "Les agriculteurs exploitants et salariés agricoles relèvent de la MSA (Mutualité Sociale Agricole), guichet unique pour l'ensemble de leur protection sociale. Le régime de retraite agricole a été profondément réformé pour relever les pensions des exploitants, souvent parmi les plus faibles de France.",
    simulateurPath: "/simulateurs/msa",
    simulateurLabel: "Simulateur Retraite MSA",
    stats: [
      { label: "Âge légal", value: "64 ans", note: "(62 ans pour carrières longues)" },
      { label: "Pension min. exploitant", value: "≈ 1 130 €/mois", note: "avec carrière complète (2026)" },
      { label: "RCO", value: "Obligatoire", note: "depuis 2003 pour exploitants" },
      { label: "Durée requise", value: "172 trimestres", note: "nés en 1965+" },
    ],
    sections: [
      {
        title: "Le régime MSA : base et complémentaire obligatoire (RCO)",
        content: `Le régime de retraite des non-salariés agricoles comprend deux niveaux :\n\n1. **La retraite de base** : calculée en points comme le régime général, à partir des revenus professionnels cotisés.\n2. **La Retraite Complémentaire Obligatoire (RCO)** : régime par points créé en 2003 pour les exploitants, afin de relever le niveau des pensions. La RCO est financée par des cotisations obligatoires.\n\nLes salariés agricoles cotisent également à **l'Agirc-Arrco** pour leur retraite complémentaire, comme les salariés du privé.`,
      },
      {
        title: "Les réformes pour améliorer les petites retraites agricoles",
        content: `La loi Chassaigne (2021) a revalorisé les petites pensions des exploitants agricoles à 85 % du SMIC net, soit environ 1 035 € par mois, pour une carrière complète.\n\nUne seconde loi a étendu ces mesures aux conjoints collaborateurs et aux aides familiaux, longtemps exclus du bénéfice de la revalorisation. En 2026, la pension minimale d'un exploitant avec 40 ans de carrière avoisine 1 130 €/mois.`,
      },
      {
        title: "Particularités des salariés agricoles",
        content: `Les salariés agricoles (ouvriers, employés de coopératives, saisonniers avec statut MSA) suivent des règles proches du régime général :\n- Retraite de base via la MSA (équivalent CNAV)\n- Retraite complémentaire via Agirc-Arrco\n- Mêmes âges légaux que le régime général (64 ans)\n\nLes travailleurs saisonniers cumulant moins de 150 heures par trimestre peuvent avoir des lacunes dans leur durée d'assurance.`,
      },
    ],
    faq: [
      { q: "Un agriculteur peut-il partir avant 64 ans ?", a: "Oui, dans les mêmes conditions que le régime général : dispositif carrières longues (début d'activité avant 20 ans et durée cotisée suffisante), invalidité, ou handicap reconnu. Les exploitants ayant commencé jeunes en agriculture familiale peuvent souvent partir à 60 ou 62 ans." },
      { q: "Comment sont calculés les points de retraite MSA pour un exploitant ?", a: "Les points de retraite de base MSA sont calculés sur le revenu professionnel agricole (bénéfice agricole). Chaque année, une cotisation assise sur ce revenu génère un nombre de points. La pension annuelle = nombre de points × valeur du point. La RCO fonctionne de manière similaire avec son propre barème." },
      { q: "Mon conjoint qui travaille sur l'exploitation a-t-il des droits à la retraite ?", a: "Oui. Depuis 1999, les conjoints collaborateurs doivent obligatoirement s'affilier à la MSA et cotiser pour la retraite. Le statut de conjoint collaborateur a été réformé : il ne peut désormais être exercé que 5 ans, après quoi le conjoint doit opter pour le statut de co-exploitant ou d'associé." },
      { q: "Qu'est-ce que la Retraite Complémentaire Obligatoire (RCO) agricole ?", a: "La RCO est un régime par points créé en 2003 pour les non-salariés agricoles. Les exploitants et certains conjoints y cotisent obligatoirement. Elle vient compléter la retraite de base, dont le montant était historiquement très faible. Après 40 ans de carrière, la RCO représente environ 200 à 300 €/mois selon le niveau de cotisation." },
      { q: "Les années passées comme aide familial avant installation comptent-elles ?", a: "Les périodes travaillées en tant qu'aide familial (avant 2003) peuvent être prises en compte sous conditions : elles doivent avoir donné lieu à cotisations (ou être rachetées). Depuis la loi Chassaigne, ces périodes anciennes sont mieux reconnues dans le calcul des droits à la revalorisation minimale." },
    ],
  },
};

function ProfessionStats({ stats }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, margin: "24px 0" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 22, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{s.label}</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{s.note}</div>
        </div>
      ))}
    </div>
  );
}

function ProfessionSection({ title, content }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(17px, 3vw, 21px)", fontWeight: 600, color: "var(--text)", marginBottom: 14, lineHeight: 1.3 }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.85, color: "var(--text-secondary)" }}>
        {content.split("\n").map((line, i) => {
          if (!line.trim()) return <br key={i} />;
          // Bold markdown
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} style={{ marginBottom: 10 }}>
              {parts.map((part, j) =>
                part.startsWith("**") ? <strong key={j} style={{ color: "var(--text)" }}>{part.slice(2, -2)}</strong> : part
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function RetraiteMetier() {
  const { metier } = useParams();
  const [theme, setTheme] = useTheme();
  const data = METIERS[metier];

  usePageMeta(
    data ? data.metaTitle : "Retraite par métier — simfinly.com",
    data ? data.metaDesc : "Guides retraite par métier : fonctionnaire, infirmière, enseignant, agriculteur."
  );

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <Navbar theme={theme} setTheme={setTheme} />
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28 }}>Profession introuvable</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Ce guide métier n'existe pas encore.</p>
          <Link to="/" style={{ color: "var(--gold)", textDecoration: "none" }}>← Accueil</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://www.simfinly.com/retraite/${metier}`;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.metaTitle,
    description: data.metaDesc,
    url: canonicalUrl,
    author: { "@type": "Organization", name: "Simfinly", url: "https://www.simfinly.com" },
    publisher: { "@type": "Organization", name: "Simfinly", url: "https://www.simfinly.com", logo: { "@type": "ImageObject", url: "https://www.simfinly.com/og-image.webp" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.simfinly.com/" },
      { "@type": "ListItem", position: 2, name: "Retraite par métier", item: "https://www.simfinly.com/retraite/fonctionnaire" },
      { "@type": "ListItem", position: 3, name: data.title },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <JsonLd data={faqLd} />
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <Navbar theme={theme} setTheme={setTheme} />

      <main id="main-content" style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <span style={{ color: "var(--text)" }}>Retraite par métier</span>
          {" · "}
          <span style={{ color: "var(--text)" }}>{data.title}</span>
        </nav>

        {/* En-tête */}
        <div style={{ padding: "20px 0 8px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,147,74,0.1)", border: "1px solid rgba(184,147,74,0.25)", borderRadius: 20, padding: "4px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 15 }}>{data.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.07em" }}>GUIDE RETRAITE · 2026</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 600, color: "var(--text)", lineHeight: 1.2, marginBottom: 10 }}>
            {data.title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>{data.subtitle}</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-secondary)", borderLeft: "3px solid var(--gold)", paddingLeft: 16, margin: "16px 0 0" }}>
            {data.intro}
          </p>
        </div>

        {/* Stats clés */}
        <ProfessionStats stats={data.stats} />

        {/* CTA simulateur */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.1),rgba(232,192,106,0.04))", border: "1px solid var(--border-gold)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 4 }}>Passez à la pratique</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{data.simulateurLabel}</div>
          </div>
          <Link to={data.simulateurPath} style={{ padding: "10px 22px", borderRadius: 10, flexShrink: 0, background: "rgba(184,147,74,0.2)", color: "var(--gold)", border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
            Lancer le simulateur →
          </Link>
        </div>

        {/* Sections de contenu */}
        {data.sections.map((s, i) => (
          <ProfessionSection key={i} title={s.title} content={s.content} />
        ))}

        {/* FAQ */}
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
            Questions fréquentes
          </h2>
          <FaqSection items={data.faq} />
        </div>

        {/* Liens vers d'autres métiers */}
        <div style={{ marginTop: 40, padding: "20px 24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>Autres guides retraite par métier</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {Object.entries(METIERS).filter(([k]) => k !== metier).map(([k, m]) => (
              <Link key={k} to={`/retraite/${k}`} style={{ fontSize: 13, color: "var(--gold)", textDecoration: "none", padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border-gold)", background: "rgba(184,147,74,0.07)" }}>
                {m.icon} {m.title}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
