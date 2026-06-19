import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { useTheme } from "../../hooks/useTheme.js";
import { useProfile } from "../../hooks/useProfile.js";
import { useSimHistory } from "../../hooks/useSimHistory.js";
import { downloadCSV, downloadXLSX } from "../../utils/export.js";
import JsonLd from "../../components/JsonLd.jsx";
import HistoricalReturnPicker from "../../components/HistoricalReturnPicker.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, Toggle, AccordionSection,
  Chip, ProgressBar, StatusBadge, useAnimatedNumber,
  SimulateurHeader, FaqItem,
} from "../../components/ui.jsx";
import { useMoney } from "../../i18n/CurrencyContext.jsx";
import { fmtCur, activeSymbol } from "../../i18n/currency.js";
import { useTranslation } from "../../i18n/index.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// ─── Translations ─────────────────────────────────────────────────────────────
const TXT = {
  fr: {
    docTitle: "Simulateur FIRE 2026 — Indépendance financière & Coast FIRE",
    docDesc: "Calculez à quel âge vous atteindrez l'indépendance financière : règle des 4 %, Coast FIRE, paliers Lean/Barista/Fat FIRE, taux d'épargne, fiscalité et projection année par année.",
    jsonLdName: "Simulateur FIRE — Indépendance financière",
    jsonLdDesc: "Calculez à quel âge vous atteindrez l'indépendance financière avec la règle des 4 %. Coast FIRE, paliers Lean/Fat/Barista, projection année par année.",
    badge: "Finances · Simulation 2026",
    headerTitle: "Indépendance financière (FIRE)",
    headerDesc: "À quel âge pourrez-vous vivre de vos investissements ? Capital cible, Coast FIRE, paliers Lean / Barista / Fat et trajectoire année par année.",
    reassurance: ["✓ Règle des 25x (SWR 4 %)", "✓ Coast FIRE & paliers", "✓ Taux d'épargne", "✓ Calcul 100 % local"],
    situationActuelle: "Situation actuelle",
    ageActuel: "Âge actuel",
    ageActuelHint: "Votre âge pour estimer l'âge d'atteinte FIRE",
    capitalActuel: "Capital actuel",
    capitalActuelHint: "Épargne + investissements (hors résidence principale)",
    epargneMensuelle: "Épargne mensuelle",
    epargneMensuelleHintAlt: "Montant réellement mis de côté chaque mois",
    revenuMensuel: "Revenu net mensuel (optionnel)",
    revenuMensuelHint: "Pour calculer votre taux d'épargne",
    tauxEpargneHint: (pct) => `Taux d'épargne : ${pct} % de vos revenus`,
    epargneAnnuelleHint: (amount) => `${amount} / an épargnés`,
    objectifFire: "Objectif FIRE",
    depensesAnnuelles: "Dépenses annuelles cibles",
    depensesAnnuellesHintAlt: "Vos dépenses estimées une fois à la retraite",
    depensesAnnuellesHint: (amount) => `soit ${amount} / mois (euros d'aujourd'hui)`,
    rendementAnnuel: "Rendement annuel espéré",
    rendementHint: "Rendement réel après inflation (portefeuille actions ~5 %)",
    rendementTooltip: "5 % réel = ~7 % nominal − 2 % inflation",
    tauxRetrait: "Taux de retrait sécurisé",
    tauxRetraitHint: "4 % recommandé (étude Trinity) · 3,5 % pour une retraite très longue",
    tauxRetraitTooltip: "3,5 % = très conservateur · 4 % = équilibré · 5 % = agressif",
    ageCoast: "Âge de retraite « classique » (Coast FIRE)",
    ageCoastHint: "Âge cible si vous laissez votre capital croître sans plus épargner",
    fiscaliteLabel: "Tenir compte de la fiscalité",
    fiscaliteDesc: "Majore le capital cible pour absorber l'impôt sur les retraits",
    impositionLabel: "Imposition effective sur les retraits",
    impositionHint: "PFU 30 % sur les gains → souvent ~10–17 % en effectif (PEA/assurance-vie réduisent ce taux)",
    impositionTooltip: "Seule la part de plus-value d'un retrait est taxée, pas le capital.",
    trajectoire: "Votre trajectoire FIRE",
    renseignezDepenses: "Renseignez vos dépenses annuelles pour démarrer.",
    objectifAtteint: "Objectif atteint ! 🎉",
    objectifAtteintDesc: "Votre patrimoine actuel peut déjà couvrir vos dépenses indéfiniment.",
    patrimoineCible: "Patrimoine cible",
    nonAtteint: (age) => `Non atteint avant ${age} ans avec ces paramètres. Augmentez l'épargne ou réduisez les dépenses cibles.`,
    ageAtteinteFire: "Âge d'atteinte FIRE",
    ansLabel: (n) => `dans ${n} ans`,
    versLabel: (date) => `vers ${date}`,
    patrimoineCibleLabel: "patrimoine cible",
    progressionFire: "Progression vers FIRE",
    courbeCroissance: "Courbe de croissance du patrimoine",
    ageFireChip: "Âge FIRE",
    anneesRestantes: "Années restantes",
    revenuPassifMensuel: "Revenu passif mensuel",
    capitalCible: "Capital cible",
    tauxEpargneChip: "Taux d'épargne",
    totalEpargne: "Total épargné",
    interetsGeneres: "Intérêts générés",
    retraitBrutVise: "Retrait brut visé",
    coastFireAtteint: (cap, age) => <>Avec <strong style={{ color: "var(--text)" }}>{cap}</strong> déjà investis, vous pouvez cesser d'épargner pour la retraite : la seule capitalisation atteindra votre objectif vers {age} ans.</>,
    coastFireManque: (amount, age) => <>Il vous faut <strong style={{ color: "var(--gold)" }}>{amount}</strong> investis aujourd'hui pour atteindre votre objectif à {age} ans <em>sans plus rien épargner</em>. Au-delà de ce palier, votre capital « roule en roue libre ».</>,
    versCoastFire: "Vers le Coast FIRE",
    paliers: "Vos paliers d'indépendance",
    disclaimer: "⚠️ Simulation indicative. Ne constitue pas un conseil en investissement. Les marchés financiers sont volatils et les rendements passés ne garantissent pas les rendements futurs. Calculs en euros d'aujourd'hui (rendement réel).",
    disclaimerStrong: "Simulation indicative.",
    sauvegarder: "Sauvegarder cette simulation",
    sauvegardee: "Sauvegardée",
    detailAnnuel: "Détail année par année",
    detailAnnuelSub: "Versements, intérêts et patrimoine cumulé",
    csvExportAge: "Âge",
    tauxEpargneTitre: "Le taux d'épargne, vrai moteur du FIRE",
    tauxEpargneSub: "Combien d'années selon la part que vous épargnez",
    regle25x: "Comprendre la règle des 25x",
    regle25xSub: "Math du taux de retrait sécurisé",
    regle25xP1: (amount, total) => <>La <strong>règle des 25x</strong> : votre patrimoine doit être égal à 25 fois vos dépenses annuelles pour soutenir un taux de retrait de 4 % à perpétuité.</>,
    regle25xP2: (dep, total) => <><strong>Exemple :</strong> {dep} / an × 25 = <strong>{total}</strong> de patrimoine cible.</>,
    regle25xP3: <>Cette règle repose sur l'<strong>étude Trinity (1998)</strong>, qui a analysé les marchés depuis 1926 et établi qu'un taux de 4 % résiste à 95 % des scénarios sur 30 ans.</>,
    sensibilite: "Sensibilité : impact du taux de retrait",
    sensibiliteSub: "Patrimoine cible selon différents taux",
    compareTitle: "⚖️ Comparer deux scénarios",
    compareSub: "Mesurez l'impact d'une variation clé côte à côte",
    aPropos: "À propos de ce simulateur",
    faqTitle: "Questions fréquentes — FIRE",
    ressources: "Ressources :",
    // MilestonesTable
    milesPalier: "Palier",
    milesCapital: "Capital requis",
    milesAtteint: "Atteint à",
    milesStatut: "Statut",
    milesReached: "Atteint",
    milesLointain: "Lointain",
    // YearTable
    yearAge: "Âge",
    yearVersements: "Versements",
    yearInterets: "Intérêts",
    yearPatrimoine: "Patrimoine",
    // SensibiliteTable
    sensTauxRetrait: "Taux retrait",
    sensPatrimoineCible: "Patrimoine cible",
    sensVs4: "vs 4 %",
    // SavingsRateTable
    savTauxEpargne: "Taux d'épargne",
    savAnnees: "Années avant l'indépendance",
    savVous: "← vous",
    savNote: "Hypothèses : rendement réel 5 %/an, retrait 4 %, en partant de zéro. Ce qui détermine l'âge de votre indépendance, ce n'est pas tant votre salaire que la ",
    savNoteStrong: "part que vous épargnez",
    savNoteSuffix: ".",
    // CompareSection
    compBtnLabel: "⚖️ Comparer deux scénarios",
    compBtnDesc: "Testez l'impact d'une variation d'épargne, de dépenses ou de rendement",
    compScenBTitle: "Scénario B — paramètres modifiés",
    compEpargne: "Épargne mensuelle",
    compDepenses: "Dépenses annuelles",
    compRendement: "Rendement",
    compMetrique: "Métrique",
    compScenA: "Scénario A",
    compScenB: "Scénario B",
    compFermer: "Fermer la comparaison",
    compAgeFire: "Âge FIRE",
    compAnneesRestantes: "Années restantes",
    compCapitalCible: "Capital cible",
    compRevenuMois: "Revenu passif / mois",
    // Report
    reportTitle: "Simulateur FIRE — Indépendance financière",
    reportHighlightLabel: (isAlreadyFire) => isAlreadyFire ? "Statut FIRE" : "Patrimoine cible (indépendance)",
    reportHighlightValue: (isAlreadyFire) => isAlreadyFire ? "FIRE déjà atteint" : null,
    reportAgeActuel: "Âge actuel",
    reportCapitalActuel: "Capital actuel",
    reportEpargneMensuelle: "Épargne mensuelle",
    reportDepenses: "Dépenses annuelles visées",
    reportRendement: "Rendement annuel réel",
    reportTauxRetrait: "Taux de retrait (SWR)",
    reportPatrimoineCible: "Patrimoine cible",
    reportAgeAtteinte: "Âge d'atteinte FIRE",
    reportAnneesRestantes: "Années restantes",
    reportRevenuPassif: "Revenu passif mensuel",
    reportTauxEpargne: "Taux d'épargne",
    reportNoteAlready: "Votre capital actuel couvre déjà vos dépenses au taux de retrait choisi.",
    reportNoteRegle: (rate, rateDecimal) => `Règle des ${rate} % : patrimoine cible = dépenses annuelles ÷ ${rateDecimal}.`,
    // historySaved
    historyLabelAlready: "FIRE déjà atteint 🎉",
    historyLabelAge: (age, amount) => `FIRE à ${age} ans · ${amount}`,
    historyLabelCible: (amount) => `Cible ${amount}`,
    // fireDateLabel
    fireDateLocale: "fr-FR",
    // GrowthCurve
    liberteFinanciere: "Liberté financière",
    ageAns: (age) => `${age} ans`,
    // MilestonesTable age cell
    milesAgeSuffix: (age) => `${age} ans`,
    milesAgeMax: "> 80 ans",
    // YearTable age cell
    yearAgeSuffix: (age) => `${age} ans`,
    // About section
    aboutH1: "La règle des 4 % et l'étude Trinity",
    aboutP1: "Le mouvement FIRE (Financial Independence, Retire Early) repose sur l'étude Trinity de 1998, qui a analysé la survie de portefeuilles d'investissement sur des périodes de 15 à 30 ans. Conclusion : un taux de retrait de 4 % par an sur un portefeuille diversifié actions/obligations a historiquement permis de ne jamais épuiser le capital sur 30 ans, avec un taux de succès supérieur à 95 %. Pour une retraite très anticipée (40 ans ou plus de retraits), beaucoup retiennent 3,25 à 3,5 % afin de se prémunir contre le risque de séquence des rendements — l'idée qu'une chute des marchés en début de retraite est bien plus dangereuse qu'une chute tardive.",
    aboutH2: "Le taux d'épargne, métrique reine",
    aboutP2: <>Contre-intuitivement, ce qui détermine la durée du chemin vers l'indépendance n'est pas tant le niveau de revenu que la <strong>part de ce revenu réellement épargnée</strong>. Une personne épargnant 50 % de ses revenus atteint l'indépendance en ~17 ans, contre ~37 ans à 20 % d'épargne, indépendamment du montant absolu. Augmenter son taux d'épargne agit à la fois en accélérant l'accumulation et en abaissant les dépenses cibles — donc le capital nécessaire.</>,
    aboutH3: "Coast FIRE : le point de bascule",
    aboutP3: "Le Coast FIRE désigne le moment où votre capital investi est suffisant pour atteindre, par la seule magie des intérêts composés, votre objectif FIRE à l'âge de la retraite classique — sans avoir besoin d'épargner un euro de plus. Une fois ce palier franchi, vous n'avez plus à mettre de côté pour la retraite : vous pouvez réduire votre temps de travail, changer pour un métier moins rémunérateur mais plus épanouissant, et simplement couvrir vos dépenses courantes.",
    aboutH4: "Les variantes : Lean, Fat et Barista FIRE",
    aboutP4: "Le Lean FIRE cible un train de vie frugal, avec un capital modeste mais une grande discipline budgétaire. Le Fat FIRE vise le confort sans contrainte, nécessitant un patrimoine nettement plus élevé. Le Barista FIRE est une approche hybride : on atteint une indépendance partielle et on conserve un emploi à temps partiel pour couvrir une partie des dépenses, laissant le portefeuille croître sans retrait total.",
    // Milestones desc
    baristaDesc: "Un mi-temps couvre l'autre moitié",
    leanDesc: "Train de vie frugal",
    fireDesc: "Indépendance complète (25×)",
    fatDesc: "Confort, sans contrainte",
    // FAQ
    faq: [
      { q: "Qu'est-ce que la règle des 25x ?", a: "La règle des 25x stipule que votre patrimoine de retraite doit être égal à 25 fois vos dépenses annuelles, ce qui correspond à un taux de retrait de 4 %/an. Exemple : 30 000 €/an de dépenses → 750 000 € de patrimoine cible." },
      { q: "Qu'est-ce que le Coast FIRE ?", a: "Le Coast FIRE est le montant que vous devez avoir investi aujourd'hui pour que, sans ajouter le moindre euro, la seule capitalisation suffise à atteindre votre objectif FIRE à l'âge de la retraite classique. Une fois ce palier franchi, vous pouvez cesser d'épargner pour la retraite : votre capital « roule en roue libre » jusqu'à l'objectif." },
      { q: "Barista, Lean, Fat FIRE : quelles différences ?", a: "Lean FIRE vise un train de vie frugal (capital moindre, grande discipline). Fat FIRE vise le confort sans contrainte (capital nettement plus élevé). Barista FIRE est hybride : un emploi à temps partiel couvre une partie des dépenses, ce qui réduit le capital nécessaire et laisse le portefeuille croître." },
      { q: "Quel est le taux de retrait sécurisé ?", a: "L'étude Trinity (1998) a conclu que 4 % est historiquement sûr sur 30 ans (probabilité de succès ~95 % avec un portefeuille actions/obligations). Pour une retraite anticipée longue (40+ ans), 3,25 à 3,5 % est plus prudent — c'est le « risque de séquence des rendements » : de mauvaises années en début de retraite font plus de dégâts." },
      { q: "Le rendement est-il avant ou après inflation ?", a: "Ce simulateur raisonne en rendement réel (après inflation) et en euros d'aujourd'hui. Un portefeuille d'actions diversifié a historiquement rapporté ~7 % nominal ; en retirant ~2 % d'inflation, on obtient ~5 % réel. Vos dépenses cibles restent donc exprimées en pouvoir d'achat actuel." },
      { q: "Et les impôts sur les revenus de placement ?", a: "Activez l'option fiscalité pour majorer le capital cible. En France, le PFU (« flat tax ») est de 31,4 % sur les gains depuis 2026 (12,8 % d'impôt + 18,6 % de prélèvements sociaux), mais comme seule la part de plus-value d'un retrait est taxée, le taux effectif sur un retrait est souvent de l'ordre de 10 à 18 %. Les enveloppes PEA et assurance-vie (après 8 ans) réduisent fortement cette charge." },
      { q: "Dois-je compter ma résidence principale ?", a: "Si elle n'est pas louée, elle ne génère pas de revenus passifs et ne devrait pas entrer dans le capital FIRE. En revanche, le fait d'être propriétaire réduit vos dépenses annuelles cibles (pas de loyer), ce qui abaisse mécaniquement le capital nécessaire." },
    ],
  },
  en: {
    docTitle: "FIRE Calculator — Financial Independence, Retire Early | Simfinly",
    docDesc: "Calculate the net worth you need to live off your investments and the age you reach financial independence. Based on the 4% rule with Lean/Coast/Fat FIRE milestones.",
    jsonLdName: "FIRE Calculator — Financial Independence, Retire Early",
    jsonLdDesc: "Calculate the net worth you need to live off your investments and the age you reach financial independence. Based on the 4% rule with Lean/Coast/Fat FIRE milestones.",
    badge: "Finance · 2026 Calculator",
    headerTitle: "Financial Independence, Retire Early (FIRE)",
    headerDesc: "At what age can you live off your investments? Target net worth, Coast FIRE, Lean / Barista / Fat milestones and year-by-year projection.",
    reassurance: ["✓ 25x rule (4% SWR)", "✓ Coast FIRE & milestones", "✓ Savings rate", "✓ 100% local calculation"],
    situationActuelle: "Current situation",
    ageActuel: "Current age",
    ageActuelHint: "Your age, used to estimate the age you reach FIRE",
    capitalActuel: "Current net worth",
    capitalActuelHint: "Savings + investments (excluding primary residence)",
    epargneMensuelle: "Monthly savings",
    epargneMensuelleHintAlt: "Amount actually set aside each month",
    revenuMensuel: "Net monthly income (optional)",
    revenuMensuelHint: "Used to calculate your savings rate",
    tauxEpargneHint: (pct) => `Savings rate: ${pct}% of your income`,
    epargneAnnuelleHint: (amount) => `${amount} / year saved`,
    objectifFire: "FIRE goal",
    depensesAnnuelles: "Target annual expenses",
    depensesAnnuellesHintAlt: "Your estimated spending once retired",
    depensesAnnuellesHint: (amount) => `i.e. ${amount} / month (today's money)`,
    rendementAnnuel: "Expected annual return",
    rendementHint: "Real return after inflation (equity portfolio ~5%)",
    rendementTooltip: "5% real = ~7% nominal − 2% inflation",
    tauxRetrait: "Safe withdrawal rate",
    tauxRetraitHint: "4% recommended (Trinity study) · 3.5% for a very long retirement",
    tauxRetraitTooltip: "3.5% = very conservative · 4% = balanced · 5% = aggressive",
    ageCoast: "\"Classic\" retirement age (Coast FIRE)",
    ageCoastHint: "Target age if you let your capital grow without saving more",
    fiscaliteLabel: "Account for taxes",
    fiscaliteDesc: "Increases target net worth to absorb tax on withdrawals",
    impositionLabel: "Effective tax rate on withdrawals",
    impositionHint: "30% flat tax on gains → often ~10–17% effective (ISA/life insurance reduces this)",
    impositionTooltip: "Only the capital-gain portion of a withdrawal is taxed, not the principal.",
    trajectoire: "Your FIRE trajectory",
    renseignezDepenses: "Enter your annual expenses to get started.",
    objectifAtteint: "Goal reached! 🎉",
    objectifAtteintDesc: "Your current net worth can already cover your expenses indefinitely.",
    patrimoineCible: "Target net worth",
    nonAtteint: (age) => `Not reached before age ${age} with these parameters. Increase savings or reduce target expenses.`,
    ageAtteinteFire: "Age at FIRE",
    ansLabel: (n) => `in ${n} years`,
    versLabel: (date) => `around ${date}`,
    patrimoineCibleLabel: "target net worth",
    progressionFire: "Progress toward FIRE",
    courbeCroissance: "Net worth growth curve",
    ageFireChip: "FIRE age",
    anneesRestantes: "Years remaining",
    revenuPassifMensuel: "Monthly passive income",
    capitalCible: "Target net worth",
    tauxEpargneChip: "Savings rate",
    totalEpargne: "Total contributions",
    interetsGeneres: "Interest earned",
    retraitBrutVise: "Target gross withdrawal",
    coastFireAtteint: (cap, age) => <>With <strong style={{ color: "var(--text)" }}>{cap}</strong> already invested, you can stop saving for retirement — compounding alone will reach your goal by age {age}.</>,
    coastFireManque: (amount, age) => <>You need <strong style={{ color: "var(--gold)" }}>{amount}</strong> invested today to reach your goal at age {age} <em>without saving another cent</em>. Beyond this milestone, your capital "coasts" to the finish line.</>,
    versCoastFire: "Toward Coast FIRE",
    paliers: "Your independence milestones",
    disclaimer: "⚠️ Indicative simulation. Does not constitute investment advice. Financial markets are volatile and past returns do not guarantee future results. Calculations in today's money (real return).",
    disclaimerStrong: "Indicative simulation.",
    sauvegarder: "Save this simulation",
    sauvegardee: "Saved",
    detailAnnuel: "Annual breakdown",
    detailAnnuelSub: "Contributions, interest and cumulative net worth",
    csvExportAge: "Age",
    tauxEpargneTitre: "Savings rate: the true FIRE driver",
    tauxEpargneSub: "How many years depending on how much you save",
    regle25x: "Understanding the 25x rule",
    regle25xSub: "The math behind the safe withdrawal rate",
    regle25xP1: () => <>The <strong>25x rule</strong>: your net worth must equal 25 times your annual expenses to sustain a 4% withdrawal rate in perpetuity.</>,
    regle25xP2: (dep, total) => <><strong>Example:</strong> {dep} / year × 25 = <strong>{total}</strong> target net worth.</>,
    regle25xP3: <>This rule is based on the <strong>Trinity Study (1998)</strong>, which analysed markets back to 1926 and found that a 4% rate survives 95% of scenarios over 30 years.</>,
    sensibilite: "Sensitivity: impact of withdrawal rate",
    sensibiliteSub: "Target net worth at different withdrawal rates",
    compareTitle: "⚖️ Compare two scenarios",
    compareSub: "Measure the impact of a key change side by side",
    aPropos: "About this calculator",
    faqTitle: "Frequently asked questions — FIRE",
    ressources: "Resources:",
    // MilestonesTable
    milesPalier: "Milestone",
    milesCapital: "Required capital",
    milesAtteint: "Reached at",
    milesStatut: "Status",
    milesReached: "Reached",
    milesLointain: "Far off",
    // YearTable
    yearAge: "Age",
    yearVersements: "Contributions",
    yearInterets: "Interest",
    yearPatrimoine: "Net worth",
    // SensibiliteTable
    sensTauxRetrait: "Withdrawal rate",
    sensPatrimoineCible: "Target net worth",
    sensVs4: "vs 4%",
    // SavingsRateTable
    savTauxEpargne: "Savings rate",
    savAnnees: "Years to independence",
    savVous: "← you",
    savNote: "Assumptions: 5% real return/year, 4% withdrawal, starting from zero. What determines when you reach independence is not so much your income as the ",
    savNoteStrong: "share you save",
    savNoteSuffix: ".",
    // CompareSection
    compBtnLabel: "⚖️ Compare two scenarios",
    compBtnDesc: "Test the impact of a change in savings, expenses or return",
    compScenBTitle: "Scenario B — modified parameters",
    compEpargne: "Monthly savings",
    compDepenses: "Annual expenses",
    compRendement: "Return",
    compMetrique: "Metric",
    compScenA: "Scenario A",
    compScenB: "Scenario B",
    compFermer: "Close comparison",
    compAgeFire: "FIRE age",
    compAnneesRestantes: "Years remaining",
    compCapitalCible: "Target net worth",
    compRevenuMois: "Passive income / month",
    // Report
    reportTitle: "FIRE Calculator — Financial Independence",
    reportHighlightLabel: (isAlreadyFire) => isAlreadyFire ? "FIRE status" : "Target net worth (independence)",
    reportHighlightValue: (isAlreadyFire) => isAlreadyFire ? "FIRE already reached" : null,
    reportAgeActuel: "Current age",
    reportCapitalActuel: "Current net worth",
    reportEpargneMensuelle: "Monthly savings",
    reportDepenses: "Target annual expenses",
    reportRendement: "Real annual return",
    reportTauxRetrait: "Withdrawal rate (SWR)",
    reportPatrimoineCible: "Target net worth",
    reportAgeAtteinte: "Age at FIRE",
    reportAnneesRestantes: "Years remaining",
    reportRevenuPassif: "Monthly passive income",
    reportTauxEpargne: "Savings rate",
    reportNoteAlready: "Your current net worth already covers your expenses at the chosen withdrawal rate.",
    reportNoteRegle: (rate, rateDecimal) => `${rate}% rule: target net worth = annual expenses ÷ ${rateDecimal}.`,
    // historySaved
    historyLabelAlready: "FIRE already reached 🎉",
    historyLabelAge: (age, amount) => `FIRE at ${age} · ${amount}`,
    historyLabelCible: (amount) => `Target ${amount}`,
    // fireDateLabel
    fireDateLocale: "en-US",
    // GrowthCurve
    liberteFinanciere: "Financial freedom",
    ageAns: (age) => `Age ${age}`,
    // MilestonesTable age cell
    milesAgeSuffix: (age) => `Age ${age}`,
    milesAgeMax: "> age 80",
    // YearTable age cell
    yearAgeSuffix: (age) => `Age ${age}`,
    // About section
    aboutH1: "The 4% rule and the Trinity Study",
    aboutP1: "The FIRE movement (Financial Independence, Retire Early) is built on the 1998 Trinity Study, which analysed the survival of investment portfolios over 15–30 year periods. Conclusion: a 4% annual withdrawal rate on a diversified stock/bond portfolio has historically never depleted capital over 30 years, with a success rate above 95%. For a very early retirement (40+ years of withdrawals), many opt for 3.25–3.5% to guard against sequence-of-returns risk — the idea that a market downturn early in retirement is far more damaging than a late one.",
    aboutH2: "Savings rate: the key metric",
    aboutP2: <>Counter-intuitively, what determines how long the journey to independence takes is not so much income level as the <strong>share of that income actually saved</strong>. Someone saving 50% of their income reaches independence in ~17 years, versus ~37 years at a 20% savings rate, regardless of the absolute amounts. Raising your savings rate both accelerates accumulation and lowers your target expenses — and therefore the required capital.</>,
    aboutH3: "Coast FIRE: the tipping point",
    aboutP3: "Coast FIRE is the moment when your invested capital is large enough to reach your FIRE goal at a traditional retirement age through compounding alone — without needing to save another penny. Once you cross this milestone, you no longer need to set money aside for retirement: you can cut back your working hours, switch to a less lucrative but more fulfilling career, and simply cover your day-to-day expenses.",
    aboutH4: "The variants: Lean, Fat and Barista FIRE",
    aboutP4: "Lean FIRE targets a frugal lifestyle with a modest capital but strict budget discipline. Fat FIRE aims for unconstrained comfort, requiring a significantly higher net worth. Barista FIRE is a hybrid approach: you reach partial independence and keep a part-time job to cover some expenses, letting the portfolio grow without full withdrawals.",
    // Milestones desc
    baristaDesc: "Part-time income covers the other half",
    leanDesc: "Frugal lifestyle",
    fireDesc: "Full independence (25×)",
    fatDesc: "Comfort, no constraints",
    // FAQ
    faq: [
      { q: "What is the 25x rule?", a: "The 25x rule states that your retirement net worth must equal 25 times your annual expenses, which corresponds to a 4%/year withdrawal rate. Example: $30,000/year in expenses → $750,000 target net worth." },
      { q: "What is Coast FIRE?", a: "Coast FIRE is the amount you need invested today so that, without adding another dollar, compounding alone is enough to reach your FIRE goal by traditional retirement age. Once you hit this milestone, you can stop saving for retirement — your capital 'coasts' to the finish line." },
      { q: "Barista, Lean, Fat FIRE: what's the difference?", a: "Lean FIRE targets a frugal lifestyle (lower capital, strong discipline). Fat FIRE targets unconstrained comfort (significantly higher capital). Barista FIRE is a hybrid: part-time work covers some expenses, reducing the required capital and letting the portfolio keep growing." },
      { q: "What is the safe withdrawal rate?", a: "The Trinity Study (1998) concluded that 4% is historically safe over 30 years (~95% success rate with a stock/bond portfolio). For a long early retirement (40+ years), 3.25–3.5% is more prudent — this guards against sequence-of-returns risk: bad market years early in retirement cause far more damage." },
      { q: "Is the return before or after inflation?", a: "This calculator uses real returns (after inflation) and today's dollars. A diversified equity portfolio has historically returned ~7% nominal; subtract ~2% inflation and you get ~5% real. Your target expenses therefore remain expressed in current purchasing power." },
      { q: "What about taxes on investment income?", a: "Enable the tax option to increase the target capital. The effective tax rate on a withdrawal depends on your country and account type (ISA, pension, etc.). Tax-advantaged accounts can significantly reduce this burden." },
      { q: "Should I count my primary residence?", a: "If it is not rented out, it generates no passive income and should not be included in FIRE capital. However, being a homeowner reduces your target annual expenses (no rent), which mechanically lowers the required capital." },
    ],
  },
};

// ─── Constantes ───────────────────────────────────────────────────────────────
const RENDEMENT_DEFAUT = 5;
const TAUX_RETRAIT_DEFAUT = 4;
const AGE_COAST_DEFAUT = 65;
const AGE_MAX = 80;

// ─── Helpers de calcul ─────────────────────────────────────────────────────────
// Nombre d'années (flottant) pour qu'un capital `cap`, abondé de `epargneMensuelle`
// et capitalisé à `rAnnual` %/an, atteigne `target`. Renvoie null si jamais atteint.
function yearsToTarget({ cap, epargneMensuelle, rAnnual, target }) {
  if (!target || target <= 0) return null;
  if (cap >= target) return 0;
  const epargne = epargneMensuelle || 0;
  const r = rAnnual / 100 / 12;
  if (r > 1e-10) {
    // target = cap·(1+r)ⁿ + épargne·[((1+r)ⁿ−1)/r]  ⟹  (1+r)ⁿ = (target+Sr)/(cap+Sr)
    const Sr = epargne / r;
    const ratio = (target + Sr) / (cap + Sr);
    if (ratio > 1) {
      const n = Math.log(ratio) / Math.log(1 + r);
      if (isFinite(n) && n > 0) return n / 12;
    }
    return null;
  }
  if (epargne > 0) return (target - cap) / (epargne * 12);
  return null;
}

// ─── Calcul principal ──────────────────────────────────────────────────────────
function calcFire({ ageActuel, capitalActuel, epargneMensuelle, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot }) {
  const empty = {
    patrimoineCible: 0, depensesBrutes: 0, anneesRestantes: null, ageAtteinte: null,
    progressPct: 0, revenuPassifMensuel: 0, revenuPassifBrutMensuel: 0, projectionData: [],
  };
  if (!depensesAnnuelles || depensesAnnuelles <= 0) return empty;

  const swr = tauxRetrait / 100;
  // Retraits bruts nécessaires pour disposer de `depensesAnnuelles` nets après impôt
  const depensesBrutes = depensesAnnuelles / (1 - (tauxImpot || 0) / 100);
  const patrimoineCible = depensesBrutes / swr;

  const cap = capitalActuel || 0;
  const epargne = epargneMensuelle || 0;
  const ageRef = ageActuel || 30;
  const r = rendementAnnuel / 100 / 12;

  // Âge / années d'atteinte (formule analytique précise)
  let anneesRestantes = yearsToTarget({ cap, epargneMensuelle: epargne, rAnnual: rendementAnnuel, target: patrimoineCible });
  let ageAtteinte = anneesRestantes != null ? ageRef + Math.ceil(anneesRestantes) : null;
  if (ageAtteinte !== null && ageAtteinte > AGE_MAX) { ageAtteinte = null; anneesRestantes = null; }

  const progressPct = patrimoineCible > 0 ? Math.min((cap / patrimoineCible) * 100, 100) : 0;
  const revenuPassifMensuel = depensesAnnuelles / 12;
  const revenuPassifBrutMensuel = depensesBrutes / 12;

  // Projection annuelle détaillée (capital début, versements, intérêts, capital fin)
  const fireYear = anneesRestantes != null ? Math.ceil(anneesRestantes) : null;
  const maxAnnees = Math.min(AGE_MAX - ageRef, fireYear != null ? fireYear + 2 : 45);
  const projectionData = [{ annee: 0, age: ageRef, debut: cap, versements: 0, interets: 0, patrimoine: cap }];
  let patrimoine = cap;
  for (let a = 1; a <= Math.max(1, maxAnnees); a++) {
    const debut = patrimoine;
    let fin;
    if (r > 1e-10) {
      const factor = Math.pow(1 + r, 12);
      fin = debut * factor + epargne * ((factor - 1) / r);
    } else {
      fin = debut + epargne * 12;
    }
    const versements = epargne * 12;
    const interets = fin - debut - versements;
    patrimoine = fin;
    projectionData.push({ annee: a, age: ageRef + a, debut, versements, interets, patrimoine: fin });
    if (fin >= patrimoineCible) break;
  }

  return { patrimoineCible, depensesBrutes, anneesRestantes, ageAtteinte, progressPct, revenuPassifMensuel, revenuPassifBrutMensuel, projectionData };
}

// ─── Courbe SVG ──────────────────────────────────────────────────────────────
function GrowthCurve({ projectionData, patrimoineCible, txt }) {
  const svgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const animKey = useMemo(() => {
    if (!projectionData || !projectionData.length) return "empty";
    const last = projectionData[projectionData.length - 1];
    return `${projectionData.length}_${Math.round(last?.patrimoine || 0)}_${Math.round(patrimoineCible)}`;
  }, [projectionData, patrimoineCible]);

  if (!projectionData || projectionData.length < 2 || patrimoineCible <= 0) return null;

  const PAD = { top: 24, right: 48, bottom: 36, left: 62 };
  const W = 600, H = 300;
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const maxP = Math.max(...projectionData.map(d => d.patrimoine), patrimoineCible) * 1.1;
  const maxA = projectionData[projectionData.length - 1].annee || 1;

  const x = a => PAD.left + (a / maxA) * iW;
  const y = p => PAD.top + iH - (p / maxP) * iH;

  const pts = projectionData.map(d => `${x(d.annee).toFixed(1)},${y(d.patrimoine).toFixed(1)}`).join(" ");
  const cibleY = y(patrimoineCible).toFixed(1);

  const firePoint = projectionData.find(d => d.patrimoine >= patrimoineCible);
  const fireX = firePoint ? x(firePoint.annee) : null;
  const fireY = firePoint ? y(patrimoineCible) : null;

  const ages = projectionData.filter((_, i) => i % Math.ceil(projectionData.length / 5) === 0 || i === projectionData.length - 1);
  const yTicks = [0.25, 0.5, 0.75, 1].map(f => ({ val: maxP * f, yv: y(maxP * f) }));

  const fmtK = v => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace(".", ",")}M${activeSymbol()}` : `${Math.round(v / 1000)}k${activeSymbol()}`;

  const fillPts = `${x(0).toFixed(1)},${(H - PAD.bottom).toFixed(1)} ${pts} ${x(maxA).toFixed(1)},${(H - PAD.bottom).toFixed(1)}`;

  // ── Survol : index le plus proche de la position du curseur ──────────────────
  const idxFromClientX = (clientX) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const svgX = (clientX - rect.left) / rect.width * W;
    const clamped = Math.max(PAD.left, Math.min(W - PAD.right, svgX));
    const annee = ((clamped - PAD.left) / iW) * maxA;
    // Point dont l'année est la plus proche
    let best = 0, bestD = Infinity;
    projectionData.forEach((d, i) => {
      const dist = Math.abs(d.annee - annee);
      if (dist < bestD) { bestD = dist; best = i; }
    });
    return best;
  };
  const handleMouseMove = (e) => setHoverIdx(idxFromClientX(e.clientX));
  const handleTouchMove = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    if (t) setHoverIdx(idxFromClientX(t.clientX));
  };

  const hoverPt = hoverIdx != null ? projectionData[hoverIdx] : null;

  const css = `
    @keyframes drawLine_${animKey} {
      from { stroke-dashoffset: 1000; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes fadeArea_${animKey} {
      from { opacity: 0; }
      to   { opacity: 0.15; }
    }
    .gcLine_${animKey} {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawLine_${animKey} 1.4s ease-out forwards;
    }
    .gcArea_${animKey} {
      opacity: 0;
      animation: fadeArea_${animKey} 1.2s ease-out 0.3s forwards;
    }
  `;

  return (
    <svg
      key={animKey}
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "min(300px, 55vw)", display: "block", overflow: "visible", touchAction: "none" }}
      aria-label={txt.courbeCroissance}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setHoverIdx(null)}
    >
      <defs><style>{css}</style></defs>

      {/* Zone remplie */}
      <polygon className={`gcArea_${animKey}`} points={fillPts} fill="rgba(184,147,74,1)" />

      {/* Ligne cible pointillée */}
      <line x1={PAD.left} y1={cibleY} x2={W - PAD.right} y2={cibleY}
        stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5" />
      <text x={W - PAD.right + 4} y={parseFloat(cibleY) + 4} fontSize="13.5" fill="var(--gold)" opacity="0.75" fontFamily="DM Sans, sans-serif">
        {fmtK(patrimoineCible)}
      </text>

      {/* Ligne verticale FIRE + label */}
      {fireX !== null && (
        <>
          <line x1={fireX} y1={PAD.top} x2={fireX} y2={H - PAD.bottom}
            stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.55" />
          <text x={fireX + 5} y={PAD.top + 13} fontSize="13" fill="var(--gold)"
            fontFamily="DM Sans, sans-serif" opacity="0.9">
            {txt.liberteFinanciere}
          </text>
        </>
      )}

      {/* Courbe */}
      <polyline
        className={`gcLine_${animKey}`}
        points={pts}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1000"
      />

      {/* Point de départ */}
      <circle cx={x(0)} cy={y(projectionData[0]?.patrimoine || 0)} r="4" fill="var(--gold-mid)" />

      {/* Point FIRE pulsatant */}
      {fireX !== null && fireY !== null && (
        <>
          <circle cx={fireX} cy={fireY} r="8" fill="var(--gold)" opacity="0.25">
            <animate attributeName="r" values="6;12;6" dur="2s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={fireX} cy={fireY} r="5" fill="var(--gold)" />
        </>
      )}

      {/* Point final si pas de FIRE */}
      {fireX === null && (
        <circle cx={x(maxA)} cy={y(projectionData[projectionData.length - 1]?.patrimoine || 0)} r="4" fill="var(--gold)" />
      )}

      {/* Labels âge (axe X) */}
      {ages.map(d => (
        <text key={d.age} x={x(d.annee)} y={H - 6} textAnchor="middle" fontSize="13"
          fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
          {txt.ageAns(d.age)}
        </text>
      ))}

      {/* Labels patrimoine (axe Y) */}
      {yTicks.map((t, i) => (
        <text key={i} x={PAD.left - 6} y={t.yv + 4} textAnchor="end" fontSize="13"
          fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
          {fmtK(t.val)}
        </text>
      ))}

      {/* Axes */}
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom}
        stroke="var(--border)" strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom}
        stroke="var(--border)" strokeWidth="1" />

      {/* Survol : crosshair + point + tooltip */}
      {hoverPt && (() => {
        const hx = x(hoverPt.annee);
        const hy = y(hoverPt.patrimoine);
        const boxW = 134;
        const boxH = 46;
        const flip = hx > W / 2;
        let boxX = flip ? hx - boxW - 10 : hx + 10;
        boxX = Math.max(PAD.left, Math.min(W - PAD.right - boxW, boxX));
        const boxY = Math.max(PAD.top, Math.min(H - PAD.bottom - boxH, hy - boxH - 8));
        return (
          <g pointerEvents="none">
            <line x1={hx} y1={PAD.top} x2={hx} y2={H - PAD.bottom}
              stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <circle cx={hx} cy={hy} r="4" fill="var(--gold)" stroke="var(--card-bg)" strokeWidth="1" />
            <rect x={boxX} y={boxY} width={boxW} height={boxH} rx="6"
              fill="var(--card-bg)" stroke="var(--border-gold)" strokeWidth="1" opacity="0.97" />
            <text x={boxX + 8} y={boxY + 18} fontSize="13" fontWeight="600"
              fill="var(--text)" fontFamily="DM Sans, sans-serif">
              {txt.ageAns(hoverPt.age)}
            </text>
            <text x={boxX + 8} y={boxY + 35} fontSize="13"
              fill="var(--gold)" fontFamily="DM Sans, sans-serif">
              {fmtCur(Math.round(hoverPt.patrimoine))}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ─── Paliers FIRE (Barista / Lean / FIRE / Fat) ───────────────────────────────
function MilestonesTable({ milestones, txt }) {
  if (!milestones || !milestones.length) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.milesPalier}</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.milesCapital}</th>
            <th style={{ textAlign: "right", padding: "10px 8px", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.milesAtteint}</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.milesStatut}</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map(m => (
            <tr key={m.key} style={{ borderBottom: "1px solid var(--border)", background: m.key === "fire" ? "rgba(184,147,74,0.08)" : "transparent" }}>
              <td style={{ padding: "12px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15 }}>{m.icon}</span>
                  <div>
                    <div style={{ color: m.key === "fire" ? "var(--gold)" : "var(--text)", fontWeight: m.key === "fire" ? 600 : 400 }}>{m.label}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-secondary)", lineHeight: 1.3 }}>{m.desc}</div>
                  </div>
                </div>
              </td>
              <td style={{ textAlign: "right", padding: "12px 0", color: "var(--text)", whiteSpace: "nowrap" }}>{fmtCur(Math.round(m.target))}</td>
              <td style={{ textAlign: "right", padding: "12px 8px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                {m.reached ? "—" : m.age != null ? txt.milesAgeSuffix(m.age) : txt.milesAgeMax}
              </td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>
                {m.reached
                  ? <StatusBadge status="good" label={txt.milesReached} />
                  : m.age != null
                    ? <StatusBadge status="gold" label={`${Math.ceil(m.years)} ans`} />
                    : <StatusBadge status="warn" label={txt.milesLointain} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tableau année par année ──────────────────────────────────────────────────
function YearTable({ projectionData, txt }) {
  if (!projectionData || projectionData.length < 2) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "9px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.yearAge}</th>
            <th style={{ textAlign: "right", padding: "9px 8px", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.yearVersements}</th>
            <th style={{ textAlign: "right", padding: "9px 8px", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.yearInterets}</th>
            <th style={{ textAlign: "right", padding: "9px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.yearPatrimoine}</th>
          </tr>
        </thead>
        <tbody>
          {projectionData.slice(1).map(d => (
            <tr key={d.annee} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "9px 0", color: "var(--text)" }}>{txt.yearAgeSuffix(d.age)}</td>
              <td style={{ textAlign: "right", padding: "9px 8px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>+{fmtCur(Math.round(d.versements))}</td>
              <td style={{ textAlign: "right", padding: "9px 8px", color: "#22c55e", whiteSpace: "nowrap" }}>+{fmtCur(Math.round(d.interets))}</td>
              <td style={{ textAlign: "right", padding: "9px 0", color: "var(--text)", fontWeight: 500, whiteSpace: "nowrap" }}>{fmtCur(Math.round(d.patrimoine))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Table de sensibilité ─────────────────────────────────────────────────────
function SensibiliteTable({ depensesBrutes, tauxRetrait, txt }) {
  const taux = [3, 3.5, 4, 4.5, 5];
  if (!depensesBrutes) return null;
  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.sensTauxRetrait}</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.sensPatrimoineCible}</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.sensVs4}</th>
          </tr>
        </thead>
        <tbody>
          {taux.map(t => {
            const target = depensesBrutes / (t / 100);
            const target4 = depensesBrutes / 0.04;
            const diff = target4 - target;
            return (
              <tr key={t} style={{ borderBottom: "1px solid var(--border)", background: t === tauxRetrait ? "rgba(184,147,74,0.08)" : "transparent" }}>
                <td style={{ padding: "10px 0", color: t === tauxRetrait ? "var(--gold)" : "var(--text)" }}>{t} %</td>
                <td style={{ textAlign: "right", padding: "10px 0", color: t === tauxRetrait ? "var(--gold)" : "var(--text)" }}>{fmtCur(target)}</td>
                <td style={{ textAlign: "right", padding: "10px 0", color: diff >= 0 ? "#22c55e" : "#ef4444", fontSize: 11 }}>
                  {diff >= 0 ? "−" : "+"}{fmtCur(Math.abs(diff))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Référence taux d'épargne → années (rendement réel ~5 %) ──────────────────
const SAVINGS_REF = [
  { sr: 10, ans: 51 }, { sr: 15, ans: 43 }, { sr: 20, ans: 37 }, { sr: 25, ans: 32 },
  { sr: 30, ans: 28 }, { sr: 40, ans: 22 }, { sr: 50, ans: 17 }, { sr: 60, ans: 12.5 },
  { sr: 70, ans: 8.5 },
];

function SavingsRateTable({ savingsRate, txt }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.savTauxEpargne}</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>{txt.savAnnees}</th>
          </tr>
        </thead>
        <tbody>
          {SAVINGS_REF.map(({ sr, ans }, i) => {
            const next = SAVINGS_REF[i + 1];
            const active = savingsRate != null && savingsRate >= sr && (!next || savingsRate < next.sr);
            return (
              <tr key={sr} style={{ borderBottom: "1px solid var(--border)", background: active ? "rgba(184,147,74,0.1)" : "transparent" }}>
                <td style={{ padding: "10px 0", color: active ? "var(--gold)" : "var(--text)", fontWeight: active ? 600 : 400 }}>
                  {sr} %{active ? `  ${txt.savVous}` : ""}
                </td>
                <td style={{ textAlign: "right", padding: "10px 0", color: active ? "var(--gold)" : "var(--text)" }}>
                  ~{String(ans).replace(".", ",")} ans
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 12, lineHeight: 1.6 }}>
        {txt.savNote}<strong>{txt.savNoteStrong}</strong>{txt.savNoteSuffix}
      </p>
    </div>
  );
}

// ─── Comparaison de scénarios ─────────────────────────────────────────────────
function CompareSection({ resA, ageRef, epargneMensuelle, depensesAnnuelles, rendementAnnuel, tauxRetrait, tauxImpotEff, capitalActuel, ageActuel, txt }) {
  const [active, setActive] = useState(false);
  const [compEpargne, setCompEpargne]     = useState(epargneMensuelle);
  const [compDepenses, setCompDepenses]   = useState(depensesAnnuelles);
  const [compRendement, setCompRendement] = useState(rendementAnnuel);

  // Reset Scénario B to current values when toggled on
  const enable = useCallback(() => {
    setCompEpargne(epargneMensuelle);
    setCompDepenses(depensesAnnuelles);
    setCompRendement(rendementAnnuel);
    setActive(true);
  }, [epargneMensuelle, depensesAnnuelles, rendementAnnuel]);

  const resB = active ? calcFire({
    ageActuel: ageActuel || 30,
    capitalActuel: capitalActuel || 0,
    epargneMensuelle: compEpargne,
    rendementAnnuel: compRendement,
    depensesAnnuelles: compDepenses,
    tauxRetrait,
    tauxImpot: tauxImpotEff,
  }) : null;

  const btnStyle = {
    padding: '7px 16px', borderRadius: 9,
    border: '1px solid var(--border-gold)',
    background: 'rgba(184,147,74,0.07)',
    color: 'var(--gold)', fontSize: 13, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  };

  if (!active) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
        <button onClick={enable} style={btnStyle}>{txt.compBtnLabel}</button>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
          {txt.compBtnDesc}
        </div>
      </div>
    );
  }

  // Build comparison rows
  const rows = [
    {
      label: txt.compAgeFire,
      a: resA.ageAtteinte != null ? `${resA.ageAtteinte} ans` : '> 80 ans',
      av: resA.ageAtteinte,
      b: resB.ageAtteinte != null ? `${resB.ageAtteinte} ans` : '> 80 ans',
      bv: resB.ageAtteinte,
      invert: true, unit: 'ans',
    },
    {
      label: txt.compAnneesRestantes,
      a: resA.anneesRestantes != null ? `${Math.ceil(resA.anneesRestantes)}` : '—',
      av: resA.anneesRestantes != null ? Math.ceil(resA.anneesRestantes) : null,
      b: resB.anneesRestantes != null ? `${Math.ceil(resB.anneesRestantes)}` : '—',
      bv: resB.anneesRestantes != null ? Math.ceil(resB.anneesRestantes) : null,
      invert: true, unit: 'ans',
    },
    {
      label: txt.compCapitalCible,
      a: fmtCur(Math.round(resA.patrimoineCible)),
      av: resA.patrimoineCible,
      b: fmtCur(Math.round(resB.patrimoineCible)),
      bv: resB.patrimoineCible,
      invert: false, unit: '€',
    },
    {
      label: txt.compRevenuMois,
      a: fmtCur(Math.round(resA.revenuPassifMensuel)),
      av: resA.revenuPassifMensuel,
      b: fmtCur(Math.round(resB.revenuPassifMensuel)),
      bv: resB.revenuPassifMensuel,
      invert: false, unit: '€',
    },
  ];

  return (
    <div>
      {/* Inputs Scénario B */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14 }}>
          {txt.compScenBTitle}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
          <NumInput id="cmp-epargne"  label={txt.compEpargne}   value={compEpargne}   onChange={setCompEpargne}   unit={`${activeSymbol()}/mois`} min={0}    max={50000}  />
          <NumInput id="cmp-depenses" label={txt.compDepenses}  value={compDepenses}  onChange={setCompDepenses}  unit={`${activeSymbol()}/an`}   min={1000} max={500000} />
          <StepperInput               label={txt.compRendement} value={compRendement} onChange={setCompRendement} unit="%"      min={0}    max={15} step={0.5} />
        </div>
      </div>

      {/* Table de comparaison */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left',  padding: '10px 0',  color: 'var(--text-secondary)', fontWeight: 600 }}>{txt.compMetrique}</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>{txt.compScenA}</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--gold)', fontWeight: 600 }}>{txt.compScenB}</th>
              <th style={{ textAlign: 'right', padding: '10px 0',  color: 'var(--text-secondary)', fontWeight: 600 }}>Δ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const diff = row.bv != null && row.av != null ? row.bv - row.av : null;
              const better = diff !== null && diff !== 0 ? (row.invert ? diff < 0 : diff > 0) : null;
              const diffLabel = diff !== null && diff !== 0
                ? (diff > 0 ? '+' : '') + (row.unit === '€' ? fmtCur(Math.abs(Math.round(diff))) : Math.round(Math.abs(diff)) + ' ' + row.unit)
                : '—';
              return (
                <tr key={row.label} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '11px 0', color: 'var(--text)' }}>{row.label}</td>
                  <td style={{ textAlign: 'right', padding: '11px 8px', color: 'var(--text-secondary)' }}>{row.a}</td>
                  <td style={{ textAlign: 'right', padding: '11px 8px', fontWeight: 500, color: better === null ? 'var(--text)' : better ? '#22c55e' : '#ef4444' }}>{row.b}</td>
                  <td style={{ textAlign: 'right', padding: '11px 0', fontSize: 11, color: better === null ? 'var(--text-secondary)' : better ? '#22c55e' : '#ef4444' }}>{diffLabel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button onClick={() => setActive(false)} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
          {txt.compFermer}
        </button>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Fire() {
  const [theme, setTheme] = useTheme();
  useMoney(); // abonnement aux changements de devise
  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  const [ageActuel, setAge]               = useState(null);
  const [capitalActuel, setCapital]       = useState(null);
  const [epargneMensuelle, setEpargne]    = useState(null);
  const [revenuMensuel, setRevenu]        = useState(null);
  const [rendementAnnuel, setRendement]   = useState(RENDEMENT_DEFAUT);
  const [depensesAnnuelles, setDepenses]  = useState(null);
  const [tauxRetrait, setTauxRetrait]     = useState(TAUX_RETRAIT_DEFAUT);
  const [tauxImpot, setTauxImpot]         = useState(0);
  const [fiscaliteOn, setFiscaliteOn]     = useState(false);
  const [ageCoast, setAgeCoast]           = useState(AGE_COAST_DEFAUT);
  const [now] = useState(() => Date.now());
  const [historySaved, setHistorySaved] = useState(false);

  const resultsRef = useRef(null);
  const chartRef = useRef(null);
  const { getProfile, updateProfile } = useProfile();
  const { saveEntry } = useSimHistory();

  usePageMeta(
    locale === 'en'
      ? "FIRE Calculator — Financial Independence, Retire Early | Simfinly"
      : "Simulateur FIRE 2026 — Indépendance financière & Coast FIRE",
    locale === 'en'
      ? "Calculate the net worth you need to live off your investments and the age you reach financial independence. Based on the 4% rule with Lean/Coast/Fat FIRE milestones."
      : "Calculez à quel âge vous atteindrez l'indépendance financière : règle des 4 %, Coast FIRE, paliers Lean/Barista/Fat FIRE, taux d'épargne, fiscalité et projection année par année."
  );

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'fire' });
    if (!sessionStorage.getItem('tracked_fire')) {
      sessionStorage.setItem('tracked_fire', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'fire' })
      }).catch(() => {});
    }
  }, [locale]);

  useEffect(() => {
    const shared = readShareParams();
    const profile = getProfile();
    if (shared) {
      if (shared.ageActuel !== undefined) setAge(shared.ageActuel);
      if (shared.capitalActuel !== undefined) setCapital(shared.capitalActuel);
      if (shared.epargneMensuelle !== undefined) setEpargne(shared.epargneMensuelle);
      if (shared.revenuMensuel !== undefined) setRevenu(shared.revenuMensuel);
      if (shared.rendementAnnuel !== undefined) setRendement(shared.rendementAnnuel);
      if (shared.depensesAnnuelles !== undefined) setDepenses(shared.depensesAnnuelles);
      if (shared.tauxRetrait !== undefined) setTauxRetrait(shared.tauxRetrait);
      if (shared.tauxImpot !== undefined) { setTauxImpot(shared.tauxImpot); if (shared.tauxImpot > 0) setFiscaliteOn(true); }
      if (shared.ageCoast !== undefined) setAgeCoast(shared.ageCoast);
    } else {
      // Pas d'URL partagée → pré-remplir depuis le profil sauvegardé
      if (profile.ageActuel !== undefined) setAge(profile.ageActuel);
      if (profile.capitalActuel !== undefined) setCapital(profile.capitalActuel);
      if (profile.epargneMensuelle !== undefined) setEpargne(profile.epargneMensuelle);
      if (profile.revenuMensuel !== undefined) setRevenu(profile.revenuMensuel);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Synchronise les champs "profil global" avec localStorage
  useEffect(() => {
    updateProfile({ ageActuel, capitalActuel, epargneMensuelle, revenuMensuel });
  }, [ageActuel, capitalActuel, epargneMensuelle, revenuMensuel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ ageActuel, capitalActuel, epargneMensuelle, revenuMensuel, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot, ageCoast }));
  }, [ageActuel, capitalActuel, epargneMensuelle, revenuMensuel, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot, ageCoast]);

  const tauxImpotEff = fiscaliteOn ? tauxImpot : 0;
  const res = calcFire({ ageActuel, capitalActuel, epargneMensuelle, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot: tauxImpotEff });
  const patrimoineAnim = useAnimatedNumber(res.patrimoineCible);

  const hasResult     = (depensesAnnuelles || 0) > 0;
  const isAlreadyFire = res.anneesRestantes === 0 && hasResult;
  const nonAtteint    = hasResult && !isAlreadyFire && res.ageAtteinte === null;

  const ageRef = ageActuel || 30;
  const swr = tauxRetrait / 100;

  // Taux d'épargne (métrique clé du mouvement FIRE)
  const savingsRate = (revenuMensuel && revenuMensuel > 0 && epargneMensuelle)
    ? Math.min((epargneMensuelle / revenuMensuel) * 100, 100)
    : null;

  // Coast FIRE : capital à avoir aujourd'hui pour atteindre la cible à l'âge `ageCoast` sans rien ajouter
  const yearsToCoast = (ageCoast || AGE_COAST_DEFAUT) - ageRef;
  const coastNumber = hasResult && yearsToCoast > 0
    ? res.patrimoineCible / Math.pow(1 + rendementAnnuel / 100, yearsToCoast)
    : res.patrimoineCible;
  const coastReached = (capitalActuel || 0) >= coastNumber;
  const coastPct = coastNumber > 0 ? Math.min(((capitalActuel || 0) / coastNumber) * 100, 100) : 0;

  // Paliers FIRE
  const milestoneDefs = [
    { key: "barista", icon: "☕", label: "Barista FIRE", mult: 0.5, desc: txt.baristaDesc },
    { key: "lean",    icon: "🌿", label: "Lean FIRE",    mult: 0.7, desc: txt.leanDesc },
    { key: "fire",    icon: "🔥", label: "FIRE",          mult: 1,   desc: txt.fireDesc },
    { key: "fat",     icon: "🛋️", label: "Fat FIRE",      mult: 1.5, desc: txt.fatDesc },
  ];
  const milestones = hasResult ? milestoneDefs.map(m => {
    const target = (res.depensesBrutes * m.mult) / swr;
    const years = yearsToTarget({ cap: capitalActuel || 0, epargneMensuelle, rAnnual: rendementAnnuel, target });
    const reached = (capitalActuel || 0) >= target;
    const age = years != null && (ageRef + Math.ceil(years)) <= AGE_MAX ? ageRef + Math.ceil(years) : null;
    return { ...m, target, years, reached, age };
  }) : [];

  // Date d'atteinte FIRE
  const fireDate = res.anneesRestantes
    ? new Date(now + res.anneesRestantes * 365.25 * 86400000)
    : null;
  const fireDateLabel = fireDate ? fireDate.toLocaleDateString(txt.fireDateLocale, { month: "long", year: "numeric" }) : null;

  const handleSaveHistory = useCallback(() => {
    const label = isAlreadyFire
      ? txt.historyLabelAlready
      : res.ageAtteinte
        ? txt.historyLabelAge(res.ageAtteinte, fmtCur(Math.round(res.patrimoineCible)))
        : txt.historyLabelCible(fmtCur(Math.round(res.patrimoineCible)));
    saveEntry({ simulator: 'fire', label, shareUrl: window.location.pathname + window.location.search });
    setHistorySaved(true);
    setTimeout(() => setHistorySaved(false), 2500);
  }, [res, isAlreadyFire, saveEntry, txt]);

  const totalEpargne = hasResult && res.anneesRestantes
    ? (epargneMensuelle || 0) * Math.ceil(res.anneesRestantes) * 12
    : 0;
  const interetsGeneres = hasResult && res.patrimoineCible > 0
    ? Math.max(0, res.patrimoineCible - (capitalActuel || 0) - totalEpargne)
    : 0;

  const fireChartData = useMemo(() => {
    if (!hasResult) return [];
    const cap = capitalActuel || 0;
    const vers = epargneMensuelle || 0;
    const r = rendementAnnuel / 100 / 12;
    const maxMonths = (Math.ceil(res.anneesRestantes || 30) + 2) * 12;
    const pts = [];
    for (let m = 0; m <= maxMonths; m++) {
      let val;
      if (r > 1e-10) {
        const f = Math.pow(1 + r, m);
        val = cap * f + vers * ((f - 1) / r);
      } else {
        val = cap + vers * m;
      }
      pts.push({ t: m / 12, value: val });
      if (res.patrimoineCible > 0 && val >= res.patrimoineCible * 1.02) break;
    }
    return pts;
  }, [capitalActuel, epargneMensuelle, rendementAnnuel, hasResult, res.anneesRestantes, res.patrimoineCible]);

  const report = {
    title: txt.reportTitle,
    highlight: {
      label: txt.reportHighlightLabel(isAlreadyFire),
      value: !hasResult ? "—" : isAlreadyFire ? txt.reportHighlightValue(true) : fmtCur(Math.round(res.patrimoineCible)),
    },
    params: [
      { label: txt.reportAgeActuel, value: ageActuel ? `${ageActuel} ans` : "—" },
      { label: txt.reportCapitalActuel, value: fmtCur(capitalActuel ?? 0) },
      { label: txt.reportEpargneMensuelle, value: epargneMensuelle ? fmtCur(epargneMensuelle) : "—" },
      { label: txt.reportDepenses, value: depensesAnnuelles ? fmtCur(depensesAnnuelles) : "—" },
      { label: txt.reportRendement, value: `${rendementAnnuel} %` },
      { label: txt.reportTauxRetrait, value: `${tauxRetrait} %` },
    ],
    results: hasResult ? [
      { label: txt.reportPatrimoineCible, value: fmtCur(Math.round(res.patrimoineCible)), strong: true },
      ...(res.ageAtteinte ? [{ label: txt.reportAgeAtteinte, value: `${res.ageAtteinte} ans` }] : []),
      ...(res.anneesRestantes ? [{ label: txt.reportAnneesRestantes, value: `${Math.ceil(res.anneesRestantes)}` }] : []),
      { label: txt.reportRevenuPassif, value: fmtCur(Math.round(res.revenuPassifMensuel)) },
      ...(savingsRate != null ? [{ label: txt.reportTauxEpargne, value: `${Math.round(savingsRate)} %` }] : []),
    ] : [],
    notes: hasResult ? [
      isAlreadyFire
        ? txt.reportNoteAlready
        : txt.reportNoteRegle(tauxRetrait, (tauxRetrait / 100).toFixed(2)),
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.jsonLdName,
        "url": locale === 'en' ? "https://www.simfinly.com/en/simulateurs/fire" : "https://www.simfinly.com/simulateurs/fire",
        "description": txt.jsonLdDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": locale === 'en' ? 'en-US' : 'fr-FR',
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/fire" size={34} />}
          badge={txt.badge}
          title={txt.headerTitle}
          desc={txt.headerDesc}
        />

        {/* Reassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {txt.reassurance.map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>
            {txt.situationActuelle}
          </h2>

          <NumInput id="age-actuel" label={txt.ageActuel} value={ageActuel} onChange={setAge} unit="ans" min={15} max={79} hint={txt.ageActuelHint} />
          <NumInput id="capital-actuel" label={txt.capitalActuel} value={capitalActuel} onChange={setCapital} unit={activeSymbol()} min={0} max={10000000} hint={txt.capitalActuelHint} />
          <NumInput id="epargne-mensuelle" label={txt.epargneMensuelle} value={epargneMensuelle} onChange={setEpargne} unit={`${activeSymbol()}/mois`} min={0} max={50000}
            hint={epargneMensuelle ? txt.epargneAnnuelleHint(fmtCur(epargneMensuelle * 12)) : txt.epargneMensuelleHintAlt} />
          <NumInput id="revenu-mensuel" label={txt.revenuMensuel} value={revenuMensuel} onChange={setRevenu} unit={`${activeSymbol()}/mois`} min={0} max={100000}
            hint={savingsRate != null ? txt.tauxEpargneHint(Math.round(savingsRate)) : txt.revenuMensuelHint} />

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, marginTop: 32, fontWeight: 400 }}>
            {txt.objectifFire}
          </h2>

          <NumInput id="depenses-annuelles" label={txt.depensesAnnuelles} value={depensesAnnuelles} onChange={setDepenses} unit={`${activeSymbol()}/an`} min={1000} max={500000}
            hint={depensesAnnuelles ? txt.depensesAnnuellesHint(fmtCur(Math.round(depensesAnnuelles / 12))) : txt.depensesAnnuellesHintAlt} />
          <StepperInput label={txt.rendementAnnuel} value={rendementAnnuel} onChange={setRendement} min={0} max={15} step={0.5} unit="%" hint={txt.rendementHint} tooltip={txt.rendementTooltip} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10, marginBottom: 16 }}>
            <HistoricalReturnPicker duration={Math.ceil(res.anneesRestantes) || 30} onSelect={setRendement} />
          </div>
          <StepperInput label={txt.tauxRetrait} value={tauxRetrait} onChange={setTauxRetrait} min={1} max={6} step={0.25} unit="%" hint={txt.tauxRetraitHint} tooltip={txt.tauxRetraitTooltip} />
          <StepperInput label={txt.ageCoast} value={ageCoast} onChange={setAgeCoast} min={Math.max(ageRef + 1, 50)} max={75} step={1} unit="ans" hint={txt.ageCoastHint} />

          {/* Fiscalité */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: fiscaliteOn ? 18 : 0 }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{txt.fiscaliteLabel}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{txt.fiscaliteDesc}</div>
              </div>
              <Toggle checked={fiscaliteOn} onChange={setFiscaliteOn} />
            </div>
            {fiscaliteOn && (
              <StepperInput label={txt.impositionLabel} value={tauxImpot} onChange={setTauxImpot} min={0} max={32} step={1} unit="%"
                hint={txt.impositionHint} tooltip={txt.impositionTooltip} />
            )}
          </div>
        </div>

        {/* Résultats */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>
            {txt.trajectoire}
          </h2>

          {/* Héro */}
          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
                {txt.renseignezDepenses}
              </p>
            ) : isAlreadyFire ? (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {txt.objectifAtteint}
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: "var(--text-secondary)" }}>
                  {txt.objectifAtteintDesc}
                </div>
              </>
            ) : nonAtteint ? (
              <>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>{txt.patrimoineCible}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {fmtCur(Math.round(patrimoineAnim))}
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: "#e08030" }}>
                  {txt.nonAtteint(AGE_MAX)}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                  {txt.ageAtteinteFire}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(56px,12vw,88px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {res.ageAtteinte} ans
                </div>
                <div style={{ marginTop: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                  {ageActuel ? txt.ansLabel(Math.ceil(res.anneesRestantes)) : ""}{fireDateLabel ? ` · ${txt.versLabel(fireDateLabel)}` : ""} · {txt.patrimoineCibleLabel}{" "}
                  <strong style={{ color: "var(--text)" }}>{fmtCur(Math.round(res.patrimoineCible))}</strong>
                </div>
              </>
            )}
          </div>

          {hasResult && !isAlreadyFire && (
            <>
              {/* Barre de progression */}
              <ProgressBar
                label={txt.progressionFire}
                value={capitalActuel || 0}
                total={res.patrimoineCible}
                color="linear-gradient(90deg,var(--gold-mid),var(--gold))"
              />

              {/* Courbe SVG */}
              {res.projectionData.length >= 2 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                    {txt.courbeCroissance}
                  </div>
                  <ZoomableChart innerRef={chartRef}>
                    <GrowthCurve projectionData={res.projectionData} patrimoineCible={res.patrimoineCible} txt={txt} />
                  </ZoomableChart>
                </div>
              )}

              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                {res.ageAtteinte && <Chip label={txt.ageFireChip} value={`${res.ageAtteinte} ans`} accent />}
                {res.anneesRestantes && <Chip label={txt.anneesRestantes} value={`${Math.ceil(res.anneesRestantes)}`} />}
                <Chip label={txt.revenuPassifMensuel} value={fmtCur(Math.round(res.revenuPassifMensuel))} accent />
                <Chip label={txt.capitalCible} value={fmtCur(Math.round(res.patrimoineCible))} />
                {savingsRate != null && <Chip label={txt.tauxEpargneChip} value={`${Math.round(savingsRate)} %`} accent />}
                {totalEpargne > 0 && <Chip label={txt.totalEpargne} value={fmtCur(Math.round(totalEpargne))} />}
                {interetsGeneres > 0 && <Chip label={txt.interetsGeneres} value={fmtCur(Math.round(interetsGeneres))} accent />}
                {tauxImpotEff > 0 && <Chip label={txt.retraitBrutVise} value={fmtCur(Math.round(res.revenuPassifBrutMensuel))} />}
              </div>

              {/* Coast FIRE */}
              {yearsToCoast > 0 && (
                <div style={{ background: "var(--card-bg)", border: `1px solid ${coastReached ? "rgba(34,197,94,0.35)" : "var(--border)"}`, borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>🛟</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "var(--text)" }}>Coast FIRE</span>
                    </div>
                    <StatusBadge status={coastReached ? "good" : "gold"} label={coastReached ? `${txt.milesReached} ✓` : `${Math.round(coastPct)} %`} />
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
                    {coastReached
                      ? txt.coastFireAtteint(fmtCur(capitalActuel || 0), ageCoast)
                      : txt.coastFireManque(fmtCur(Math.round(coastNumber)), ageCoast)}
                  </p>
                  <ProgressBar label={txt.versCoastFire} value={capitalActuel || 0} total={coastNumber} />
                </div>
              )}

              {/* Paliers FIRE */}
              {milestones.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                    {txt.paliers}
                  </div>
                  <MilestonesTable milestones={milestones} txt={txt} />
                </div>
              )}
            </>
          )}

          {hasResult && (
            <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              ⚠️ <strong>{txt.disclaimerStrong}</strong> {txt.disclaimer.replace(/^⚠️\s*\S+\s*/, '')}
            </div>
          )}

          {hasResult && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button
                onClick={handleSaveHistory}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 8,
                  border: `1px solid ${historySaved ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
                  background: historySaved ? "rgba(34,197,94,0.08)" : "transparent",
                  color: historySaved ? "#22c55e" : "var(--text-secondary)",
                  fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {historySaved ? "✓" : "💾"}<span className="btn-text"> {historySaved ? txt.sauvegardee : txt.sauvegarder}</span>
              </button>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
<ShareBar
              params={{ ageActuel, capitalActuel, epargneMensuelle, revenuMensuel, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot: tauxImpotEff, ageCoast }}
              resultsRef={resultsRef}
              chartRef={chartRef}
              report={report}
              name="fire"
            />
          </div>
        </div>

        {/* Affiliation */}
        {hasResult && <AffiliateCTA type="epargne" />}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {hasResult && (
          <>
            <AccordionSection title={txt.detailAnnuel} subtitle={txt.detailAnnuelSub}>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => downloadCSV(
                    res.projectionData.slice(1).map(d => ({
                      [txt.csvExportAge]: d.age,
                      [`${txt.yearVersements} (€)`]: Math.round(d.versements),
                      [`${txt.yearInterets} (€)`]: Math.round(d.interets),
                      [`${txt.yearPatrimoine} (€)`]: Math.round(d.patrimoine),
                    })),
                    'projection-fire.csv'
                  )}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text-secondary)",
                    fontSize: 12, cursor: "pointer",
                  }}
                >
                  ↓ CSV
                </button>
                <button
                  onClick={() => downloadXLSX(
                    [{ name: 'Projection FIRE', rows: res.projectionData.slice(1).map(d => ({
                      [txt.csvExportAge]: d.age,
                      [`${txt.yearVersements} (€)`]: Math.round(d.versements),
                      [`${txt.yearInterets} (€)`]: Math.round(d.interets),
                      [`${txt.yearPatrimoine} (€)`]: Math.round(d.patrimoine),
                    })) }],
                    'projection-fire.xlsx'
                  )}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text-secondary)",
                    fontSize: 12, cursor: "pointer",
                  }}
                >
                  ↓ Excel
                </button>
              </div>
              <YearTable projectionData={res.projectionData} txt={txt} />
            </AccordionSection>

            <AccordionSection title={txt.tauxEpargneTitre} subtitle={txt.tauxEpargneSub}>
              <SavingsRateTable savingsRate={savingsRate} txt={txt} />
            </AccordionSection>

            <AccordionSection title={txt.regle25x} subtitle={txt.regle25xSub}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                <p style={{ marginBottom: 14 }}>{txt.regle25xP1(fmtCur(depensesAnnuelles || 30000), fmtCur((depensesAnnuelles || 30000) * 25))}</p>
                <p style={{ marginBottom: 14 }}>{txt.regle25xP2(fmtCur(depensesAnnuelles || 30000), fmtCur((depensesAnnuelles || 30000) * 25))}</p>
                <p>{txt.regle25xP3}</p>
              </div>
            </AccordionSection>

            <AccordionSection title={txt.sensibilite} subtitle={txt.sensibiliteSub}>
              <SensibiliteTable depensesBrutes={res.depensesBrutes} tauxRetrait={tauxRetrait} txt={txt} />
            </AccordionSection>

            <AccordionSection title={txt.compareTitle} subtitle={txt.compareSub}>
              <CompareSection
                resA={res}
                ageRef={ageRef}
                epargneMensuelle={epargneMensuelle}
                depensesAnnuelles={depensesAnnuelles}
                rendementAnnuel={rendementAnnuel}
                tauxRetrait={tauxRetrait}
                tauxImpotEff={tauxImpotEff}
                capitalActuel={capitalActuel}
                ageActuel={ageActuel}
                txt={txt}
              />
            </AccordionSection>
          </>
        )}

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aPropos}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.aboutH1}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP1}</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH2}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP2}</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP3}</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH4}</h3>
            <p>{txt.aboutP4}</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>
            {txt.faqTitle}
          </h2>
          {txt.faq.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            {txt.ressources}{" "}
            <a href="https://www.earlyretirementnow.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>Early Retirement Now</a>
            {" · "}
            <a href="https://www.bogleheads.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>Bogleheads</a>
          </p>
        </div>

        {/* AdSense bas */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
