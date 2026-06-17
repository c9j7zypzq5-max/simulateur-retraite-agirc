#!/usr/bin/env node
// Publie une série d'articles de fond dans le blog via l'endpoint
// /api/publish-article (stockage Redis). Les acronymes (TAEG, PER, FIRE…) seront
// auto-liés au lexique côté front, et une image Pexels est ajoutée par catégorie.
//
// Usage :
//   CRON_SECRET=xxx node scripts/seed-articles.mjs
//   PUBLISH_BASE_URL=https://www.simfinly.com CRON_SECRET=xxx node scripts/seed-articles.mjs
//
// Idempotent : republier écrase l'article de même slug (pas de doublon).

const BASE = process.env.PUBLISH_BASE_URL || process.env.BASE_URL || "https://www.simfinly.com";
const SECRET = process.env.CRON_SECRET || process.env.PUBLISH_SECRET || "";

const ARTICLES = [
  {
    title: "Intérêts composés : le vrai moteur de votre épargne",
    slug: "interets-composes-moteur-epargne",
    category: "Épargne",
    readTime: 6,
    intro: "Pourquoi commencer tôt change tout : on décortique l'effet boule de neige des intérêts composés, et comment la capitalisation construit un patrimoine sur le long terme.",
    content: `<h2>Qu'est-ce que les intérêts composés ?</h2>
<p>Les <strong>intérêts composés</strong> désignent le mécanisme par lequel les gains d'une période s'ajoutent au capital et produisent à leur tour des gains. Contrairement aux intérêts simples, l'argent travaille sur une base qui grossit chaque année : c'est l'effet « boule de neige ».</p>
<p>Sur quelques années, la différence paraît modeste. Sur vingt ou trente ans, elle devient spectaculaire — c'est pourquoi <strong>commencer tôt</strong> compte souvent davantage que les sommes versées.</p>
<h2>Un exemple concret</h2>
<p>Imaginez 200 € placés chaque mois à 5 % par an. Au bout de 10 ans, vous avez versé 24 000 € mais votre capital dépasse 31 000 €. À 30 ans, vous avez versé 72 000 € pour un capital d'environ 166 000 €. Les deux tiers proviennent des intérêts, pas de votre effort.</p>
<ul>
<li><strong>Le temps</strong> est votre meilleur allié : chaque année gagnée démultiplie le résultat final.</li>
<li><strong>La régularité</strong> prime sur le market timing : des versements automatiques évitent d'attendre le « bon moment ».</li>
<li><strong>La capitalisation</strong> (réinvestir les intérêts et dividendes) entretient la dynamique.</li>
</ul>
<h2>Attention à l'inflation</h2>
<p>Un rendement nominal n'a de sens qu'après déduction de l'inflation. Visez un <em>rendement réel</em> positif : un placement à 3 % avec 2 % d'inflation ne vous enrichit réellement que de 1 %. Les supports investis en actions (via un ETF, par exemple) ont historiquement mieux protégé le pouvoir d'achat sur le long terme que les livrets, au prix d'une volatilité plus élevée.</p>
<h2>Passez à la pratique</h2>
<p>Le plus instructif reste de tester avec vos propres chiffres. Faites varier la durée, le montant mensuel et le rendement dans le simulateur d'épargne de simfinly.com pour visualiser l'impact des intérêts composés sur votre projet.</p>`,
  },
  {
    title: "Crédit immobilier : comprendre le TAEG et le taux d'endettement",
    slug: "credit-immobilier-taeg-taux-endettement",
    category: "Immobilier",
    readTime: 6,
    intro: "Avant de signer, deux indicateurs résument l'essentiel de votre prêt : le TAEG, qui mesure son coût réel, et le taux d'endettement, qui conditionne son acceptation.",
    content: `<h2>Le TAEG, seul taux qui compte pour comparer</h2>
<p>Le <strong>TAEG</strong> (Taux Annuel Effectif Global) agrège tout ce que coûte un crédit : le taux nominal, l'assurance emprunteur, les frais de dossier et de garantie. C'est le seul indicateur qui permet de comparer objectivement deux offres, car un taux d'appel bas peut masquer des frais élevés.</p>
<p>La loi encadre son niveau via le <em>taux d'usure</em>, plafond révisé régulièrement par la Banque de France. Tout prêt au-dessus est illégal.</p>
<h2>Le taux d'endettement : la porte d'entrée</h2>
<p>Le <strong>taux d'endettement</strong> rapporte vos mensualités de crédit à vos revenus nets. Les banques le plafonnent en principe à 35 % (assurance comprise), conformément aux règles du HCSF. Au-delà, le dossier est généralement refusé.</p>
<ul>
<li>Augmenter votre <strong>apport</strong> réduit le montant emprunté et rassure la banque.</li>
<li>Allonger la durée baisse la mensualité mais gonfle le coût total des intérêts.</li>
<li>Le « reste à vivre » et la stabilité des revenus pèsent aussi dans la décision.</li>
</ul>
<h2>N'oubliez pas les frais annexes</h2>
<p>Les <em>frais de notaire</em> représentent environ 7 à 8 % du prix dans l'ancien et 2 à 3 % dans le neuf. Pensez aussi au PTZ si vous êtes primo-accédant : ce prêt sans intérêt peut compléter votre financement sous conditions de ressources.</p>
<h2>Simulez votre projet</h2>
<p>Estimez votre mensualité, votre capacité d'emprunt et le coût total avec le simulateur d'emprunt immobilier de simfinly.com, puis vérifiez votre éligibilité au PTZ.</p>`,
  },
  {
    title: "PER ou assurance-vie : où placer pour préparer sa retraite ?",
    slug: "per-ou-assurance-vie-retraite",
    category: "Retraite",
    readTime: 7,
    intro: "Les deux enveloppes sont complémentaires plutôt que concurrentes. On compare l'avantage fiscal du PER à la souplesse de l'assurance-vie pour bâtir un complément de retraite.",
    content: `<h2>Deux logiques fiscales différentes</h2>
<p>Le <strong>PER</strong> (Plan d'Épargne Retraite) offre un avantage à l'entrée : les versements sont déductibles du revenu imposable, dans la limite d'un plafond lié au PASS. L'économie dépend de votre <em>TMI</em> : 1 000 € versés à une tranche de 30 % font économiser 300 € d'impôt. En contrepartie, l'épargne est bloquée jusqu'à la retraite (sauf cas de déblocage) et imposée à la sortie.</p>
<p>L'<strong>assurance-vie</strong> ne donne pas d'avantage à l'entrée, mais sa fiscalité devient très douce après 8 ans, avec un abattement annuel sur les gains et des retraits libres à tout moment.</p>
<h2>Comment choisir ?</h2>
<ul>
<li><strong>TMI élevée (30 % et plus)</strong> : le PER est souvent gagnant, car la déduction immédiate est forte et votre tranche baissera probablement à la retraite.</li>
<li><strong>Besoin de souplesse</strong> : l'assurance-vie permet de récupérer son épargne quand on veut, utile pour un projet à moyen terme.</li>
<li><strong>Transmission</strong> : l'assurance-vie reste un outil privilégié grâce à ses abattements spécifiques.</li>
</ul>
<h2>Le bon réflexe : les combiner</h2>
<p>Beaucoup d'épargnants utilisent le PER pour défiscaliser une partie de leurs revenus et l'assurance-vie pour la liquidité et la transmission. Au sein de chaque enveloppe, on dose <em>fonds en euros</em> (sécurité) et <em>unités de compte</em> (potentiel de rendement) selon son horizon et sa tolérance au risque.</p>
<h2>Estimez l'impact</h2>
<p>Calculez l'économie d'impôt et le capital projeté de vos versements avec le simulateur PER de simfinly.com, et comparez avec une projection en assurance-vie.</p>`,
  },
  {
    title: "FIRE en France : la règle des 4 % à l'épreuve du réel",
    slug: "fire-france-regle-4-pourcent",
    category: "FIRE",
    readTime: 7,
    intro: "Atteindre l'indépendance financière repose sur une idée simple — 25 fois ses dépenses annuelles — mais son application en France mérite quelques ajustements.",
    content: `<h2>D'où vient la règle des 4 % ?</h2>
<p>Le mouvement <strong>FIRE</strong> (Financial Independence, Retire Early) vise à constituer un capital permettant de vivre de ses placements. La fameuse <em>règle des 4 %</em>, issue de l'étude Trinity, suggère qu'on peut retirer 4 % de son portefeuille la première année, puis ajuster à l'inflation, avec une forte probabilité de ne pas l'épuiser sur 30 ans.</p>
<p>Concrètement, cela revient à viser un capital d'environ <strong>25 fois vos dépenses annuelles</strong>. Pour 24 000 € de dépenses par an, l'objectif est de 600 000 €.</p>
<h2>Les ajustements français</h2>
<ul>
<li><strong>Horizon plus long</strong> : viser une retraite très anticipée implique parfois 40 ou 50 ans de retraits, ce qui invite à un taux plus prudent (3 à 3,5 %).</li>
<li><strong>Fiscalité</strong> : intégrez les prélèvements sociaux et l'imposition des plus-values dans vos retraits nets.</li>
<li><strong>Enveloppes</strong> : le PEA et l'assurance-vie réduisent la fiscalité sur le long terme.</li>
</ul>
<h2>Le levier décisif : le taux d'épargne</h2>
<p>Plus que le rendement, c'est votre <strong>taux d'épargne</strong> qui détermine la vitesse vers l'indépendance. Épargner 50 % de ses revenus permet, en théorie, d'atteindre la liberté financière en une quinzaine d'années. Les <em>intérêts composés</em> et la <em>diversification</em> (via des ETF, par exemple) font le reste.</p>
<h2>Tracez votre trajectoire</h2>
<p>Estimez l'âge auquel vous atteindrez votre objectif et l'effort d'épargne nécessaire avec le simulateur FIRE de simfinly.com.</p>`,
  },
];

async function main() {
  console.log(`Publication de ${ARTICLES.length} articles sur ${BASE}…`);
  for (const a of ARTICLES) {
    try {
      const res = await fetch(`${BASE}/api/publish-article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(SECRET ? { Authorization: `Bearer ${SECRET}` } : {}),
        },
        body: JSON.stringify(a),
      });
      const txt = await res.text();
      console.log(`  [${res.status}] ${a.slug} — ${txt.slice(0, 160)}`);
    } catch (err) {
      console.error(`  [ERR] ${a.slug} — ${err.message}`);
    }
  }
  console.log("Terminé.");
}

main();
