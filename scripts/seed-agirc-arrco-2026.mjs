#!/usr/bin/env node
// Publie l'article "Retraite Agirc-Arrco 2026" via /api/publish-article.
// Rédigé par la routine blog automatique (Claude Code, 2026-06-27).
//
// Usage :
//   CRON_SECRET=xxx node scripts/seed-agirc-arrco-2026.mjs
//   PUBLISH_BASE_URL=https://www.simfinly.com CRON_SECRET=xxx node scripts/seed-agirc-arrco-2026.mjs

const BASE   = process.env.PUBLISH_BASE_URL || process.env.BASE_URL || "https://www.simfinly.com";
const SECRET = process.env.CRON_SECRET || process.env.PUBLISH_SECRET || "";

const ARTICLE = {
  title:    "Retraite Agirc-Arrco 2026 : comprendre et optimiser vos points",
  slug:     "retraite-agirc-arrco-2026-comprendre-points-optimiser",
  category: "Retraite",
  readTime: 9,
  intro:
    "Le régime Agirc-Arrco verse en 2026 des pensions complémentaires à plus de 13 millions de retraités. " +
    "Comprendre comment vos points s'accumulent — et comment éviter les pénalités — peut représenter plusieurs centaines d'euros par mois.",
  content: `<h2>Qu'est-ce que l'Agirc-Arrco ?</h2>
<p>Depuis la fusion de 2019, <strong>Agirc-Arrco</strong> est le régime de retraite complémentaire obligatoire commun à l'ensemble des salariés du secteur privé — cadres comme non-cadres. Il vient s'ajouter à la retraite de base versée par la Sécurité sociale (CNAV) et représente en moyenne <strong>30 à 40 % du revenu total de retraite</strong> d'un ancien salarié. En 2026, le régime gère plus de 80 milliards d'euros de prestations annuelles.</p>
<p>Le fonctionnement repose sur un système de <strong>points</strong> : tout au long de votre carrière, vos cotisations achètent des points. À la retraite, le total de points accumulés est multiplié par la <em>valeur de service</em> pour calculer votre pension annuelle complémentaire.</p>

<h2>Comment se calculent vos points ?</h2>
<p>Chaque année, vos cotisations génèrent des points selon la formule :</p>
<p><strong>Points acquis = Salaire brut × Taux contractuel / Prix d'achat du point</strong></p>
<p>Un mécanisme souvent mal compris : le régime applique un <em>taux d'appel</em> de 127 % du taux contractuel. Concrètement, vous cotisez davantage que ce que le taux officiel annonce, mais seule la base contractuelle génère réellement des points (les 27 % supplémentaires financent la solidarité du régime). En 2025-2026, les valeurs de référence publiées par l'Agirc-Arrco sont :</p>
<ul>
<li><strong>Prix d'achat du point</strong> : environ 17,53 € (révisé chaque novembre par le conseil d'administration)</li>
<li><strong>Valeur de service du point</strong> : environ 1,4387 € (montant versé pour chaque point à la retraite)</li>
</ul>
<p>Exemple concret : un salarié non-cadre gagnant 40 000 € bruts par an cotise au taux contractuel de 6,20 % sur la Tranche 1 (sous le PASS). Cela lui rapporte environ <strong>141 points par an</strong>. Après 40 ans de carrière à ce niveau de salaire, il cumule près de <strong>5 640 points</strong>, soit une pension complémentaire de l'ordre de <strong>812 € par mois</strong> — un apport considérable en complément de la retraite CNAV.</p>

<h2>Les coefficients qui amplifient ou réduisent votre pension</h2>
<p>La date de départ à la retraite modifie directement le montant versé via deux coefficients aux effets opposés :</p>
<ul>
<li><strong>Coefficient de solidarité (−10 %)</strong> : si vous partez à la retraite dès l'obtention de votre taux plein CNAV, votre pension Agirc-Arrco subit une réduction de <strong>10 % pendant 3 ans</strong>. Ce malus, instauré en 2019, vise à inciter les salariés à prolonger leur activité. Pour un pensionné touchant 800 €/mois, cela représente une perte de 80 €/mois — soit 2 880 € sur trois ans.</li>
<li><strong>Coefficient majorant (+10 %)</strong> : si vous différez votre départ d'<em>un an</em> après l'âge du taux plein, votre pension est majorée de <strong>10 % à vie</strong>. La majoration monte à +20 % pour 2 ans, +30 % pour 3 ans. Ce bonus est permanent et cumulatif.</li>
</ul>
<p>L'écart entre partir immédiatement (malus de −10 % pendant 3 ans) et décaler d'un an (bonus de +10 % à vie) représente donc 20 points de différence à court terme. Sur une pension de 800 €, cela signifie 160 €/mois de différence la première année.</p>
<p>Des <strong>cas d'exonération du coefficient de solidarité</strong> existent : bénéficiaires de l'ASPA, personnes invalides, aidants familiaux reconnus, porteurs du compte épargne-temps liquidé, ou salariés nés avant le 1er janvier 1957. La réforme des retraites de 2023 a modifié les âges légaux, rendant cette mécanique encore plus stratégique selon votre génération.</p>

<h2>Stratégies pour maximiser votre pension complémentaire</h2>
<p>Quelques décisions concrètes permettent d'améliorer significativement votre Agirc-Arrco :</p>
<ul>
<li><strong>Décaler d'un an après le taux plein</strong> : vous évitez le malus de −10 % et décrochez le bonus de +10 %, soit 20 % d'écart sur la pension à court terme et 10 % de gain à vie. C'est souvent la décision la plus rentable accessible à tous.</li>
<li><strong>Vérifier votre relevé de carrière</strong> : des points peuvent manquer suite à des périodes de chômage non indemnisé, de temps partiel mal déclaré, ou d'expatriation. Connectez-vous à votre espace Mon Compte Retraite sur agirc-arrco.fr pour identifier et corriger d'éventuelles anomalies.</li>
<li><strong>Analyser l'impact des rachats de trimestres</strong> : racheter des trimestres côté CNAV permet d'atteindre le taux plein plus tôt, mais n'augmente pas directement vos points Agirc-Arrco. L'intérêt dépend du montant du rachat, de votre espérance de vie et du gain sur le coefficient de solidarité.</li>
<li><strong>Compléter avec un PER</strong> : si votre estimation Agirc-Arrco reste insuffisante pour maintenir votre niveau de vie, les versements sur un Plan d'Épargne Retraite (déductibles de l'impôt) permettent de constituer un capital ou une rente complémentaire avec une fiscalité avantageuse.</li>
</ul>

<h2>Estimez votre retraite Agirc-Arrco avec le simulateur simfinly</h2>
<p>Calculer sa pension Agirc-Arrco à la main est complexe : les taux de cotisation varient selon les tranches de salaire (Tranche 1 sous le PASS, Tranche 2 entre 1 et 8 PASS pour les cadres), et les coefficients dépendent de l'année de naissance, de la durée de carrière validée et de la date de départ envisagée.</p>
<p>Le <strong>simulateur Agirc-Arrco de simfinly</strong> prend en compte votre salaire, votre statut (cadre ou non-cadre), votre historique de carrière et votre âge de départ envisagé pour estimer votre pension en quelques secondes — avec l'impact précis des coefficients de solidarité et majorants sur votre situation personnelle.</p>
<p>Testez-le dès maintenant pour savoir si reporter votre départ d'un an vaut réellement le bonus de 10 % — et combien cela représente concrètement dans votre cas.</p>`,
};

async function main() {
  console.log(`Publication de l'article "${ARTICLE.title}" sur ${BASE}…`);
  if (!SECRET) {
    console.warn("⚠️  CRON_SECRET non défini — la requête sera probablement refusée (401).");
  }

  try {
    const res = await fetch(`${BASE}/api/publish-article`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SECRET ? { Authorization: `Bearer ${SECRET}` } : {}),
      },
      body: JSON.stringify(ARTICLE),
    });
    const txt = await res.text();
    if (res.ok) {
      const data = JSON.parse(txt);
      console.log(`✅ Article publié : ${data.slug}`);
      console.log(`🔗 URL : ${data.url}`);
    } else {
      console.error(`❌ Erreur [${res.status}] : ${txt.slice(0, 300)}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Requête échouée : ${err.message}`);
    process.exit(1);
  }
}

main();
