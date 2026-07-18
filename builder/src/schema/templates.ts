// Templates de calculateurs — convertis depuis les simulateurs du site
// principal (ne pas réécrire les règles : chaque schéma référence son
// fichier source). Servent au « Nouveau » du dashboard ET aux démos
// interactives de la landing.

import type { CalculatorSchema, Tranche } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  // Métier ciblé : sert à regrouper la galerie /modeles et à donner un angle
  // SEO (« calculateur pour <métier> »). Simple libellé, pas d'enum : la liste
  // de métiers est éditoriale, elle bougera plus souvent que le code.
  metier: string;
  schema: CalculatorSchema;
}

// Barème de l'impôt sur le revenu 2026 (src/data/tauxFiscaux.js du site
// principal) — partagé par les templates TJM et « Impôt sur le revenu ».
const IR2026: Tranche[] = [
  { jusqua: 11600, taux: 0 },
  { jusqua: 29579, taux: 0.11 },
  { jusqua: 84577, taux: 0.3 },
  { jusqua: 181917, taux: 0.41 },
  { jusqua: null, taux: 0.45 },
];

// 1. Mensualités de prêt — depuis src/utils/amortization.js (mensualite()).
const PRET: CalculatorSchema = {
  fields: [
    { id: 'montant', type: 'slider', label: 'Montant emprunté', default: 15000, min: 1000, max: 100000, step: 500, suffix: '€' },
    { id: 'duree', type: 'slider', label: 'Durée', default: 5, min: 1, max: 15, step: 1, suffix: 'ans' },
    { id: 'taux', type: 'number', label: 'Taux annuel', default: 4.5, min: 0, max: 20, step: 0.1, suffix: '%' },
  ],
  variables: [
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    {
      name: 'mensualite',
      formula: 'IF(tauxMensuel == 0, montant / nbMois, montant * tauxMensuel / (1 - (1 + tauxMensuel)^(-nbMois)))',
    },
    { name: 'coutCredit', formula: 'mensualite * nbMois - montant' },
  ],
  results: [
    { label: 'Mensualité', formula: 'mensualite', format: 'eur', size: 'lg' },
    { label: 'Coût total du crédit', formula: 'coutCredit', format: 'eur', size: 'md' },
    { label: 'Total remboursé', formula: 'montant + coutCredit', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Capital', formula: 'montant' },
      { label: 'Intérêts', formula: 'coutCredit' },
    ],
  },
  baremes: {},
};

// 2. Frais de notaire — depuis src/pages/simulateurs/FraisNotaire.jsx :
// barème des émoluments (arrêté du 28/02/2020), DMTO 2025 (hausse votée dans
// la majorité des départements), CSI 0,10 %, débours forfaitaires 1 000 €.
// Le radio « type de bien » porte directement le taux DMTO en valeur.
const NOTAIRE: CalculatorSchema = {
  fields: [
    { id: 'prix', type: 'slider', label: 'Prix du bien', default: 250000, min: 50000, max: 1000000, step: 5000, suffix: '€' },
    {
      id: 'tauxDmto',
      type: 'radio',
      label: 'Type de bien',
      default: 0.0632,
      options: [
        { label: 'Ancien', value: 0.0632 },
        { label: 'Ancien (départements sans hausse 2025)', value: 0.0581 },
        { label: 'Neuf', value: 0.00715 },
      ],
    },
    { id: 'mobilier', type: 'number', label: 'Mobilier inclus (déduit des droits)', default: 0, min: 0, step: 500, suffix: '€' },
  ],
  variables: [
    { name: 'assiette', formula: 'MAX(prix - mobilier, 0)' },
    { name: 'droits', formula: 'assiette * tauxDmto' },
    { name: 'emoluments', formula: 'BAREME("emoluments", assiette) * 1.2' },
    { name: 'csiDebours', formula: 'assiette * 0.001 + 1000' },
    { name: 'fraisTotal', formula: 'droits + emoluments + csiDebours' },
  ],
  results: [
    { label: 'Frais de notaire estimés', formula: 'fraisTotal', format: 'eur', size: 'lg' },
    { label: 'Droits de mutation', formula: 'droits', format: 'eur', size: 'md' },
    { label: 'Émoluments du notaire TTC', formula: 'emoluments', format: 'eur', size: 'md' },
    { label: 'Part du prix du bien', formula: 'fraisTotal / prix * 100', format: 'pct', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Droits de mutation', formula: 'droits' },
      { label: 'Émoluments TTC', formula: 'emoluments' },
      { label: 'CSI + débours', formula: 'csiDebours' },
    ],
  },
  baremes: {
    emoluments: [
      { jusqua: 6500, taux: 0.0387 },
      { jusqua: 17000, taux: 0.01596 },
      { jusqua: 60000, taux: 0.01064 },
      { jusqua: null, taux: 0.00799 },
    ],
  },
};

// 3. TJM freelance → net mensuel — micro-BNC depuis
// src/pages/simulateurs/FreelanceVsSalarie.jsx (cotisations 21,1 % du CA,
// abattement 34 %) + barème IR 2026 de src/data/tauxFiscaux.js.
const TJM: CalculatorSchema = {
  fields: [
    { id: 'tjm', type: 'slider', label: 'Taux journalier (TJM)', default: 500, min: 200, max: 1200, step: 10, suffix: '€' },
    { id: 'joursParMois', type: 'slider', label: 'Jours facturés par mois', default: 18, min: 1, max: 22, step: 1, suffix: 'j' },
  ],
  variables: [
    { name: 'caAnnuel', formula: 'tjm * joursParMois * 12' },
    { name: 'cotisations', formula: 'caAnnuel * 0.211' },
    { name: 'impot', formula: 'BAREME("ir2026", caAnnuel * 0.66)' },
    { name: 'netAnnuel', formula: 'caAnnuel - cotisations - impot' },
  ],
  results: [
    { label: 'Net mensuel après impôt', formula: 'netAnnuel / 12', format: 'eur', size: 'lg' },
    { label: 'CA annuel', formula: 'caAnnuel', format: 'eur', size: 'md' },
    { label: 'Cotisations sociales', formula: 'cotisations', format: 'eur', size: 'md' },
    { label: 'Impôt sur le revenu', formula: 'impot', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Net', formula: 'netAnnuel' },
      { label: 'Cotisations', formula: 'cotisations' },
      { label: 'Impôt', formula: 'impot' },
    ],
  },
  baremes: { ir2026: IR2026 },
};

// 4. Capacité d'emprunt — inverse du calcul de mensualité (amortization.js) :
// on part de la mensualité maximale supportable (taux d'endettement 35 %,
// norme HCSF) pour remonter au capital empruntable. Cible : courtiers.
const CAPACITE: CalculatorSchema = {
  fields: [
    { id: 'revenu', type: 'slider', label: 'Revenus mensuels nets du foyer', default: 4000, min: 1000, max: 15000, step: 100, suffix: '€' },
    { id: 'charges', type: 'number', label: 'Charges de crédit déjà en cours', default: 0, min: 0, step: 50, suffix: '€' },
    { id: 'taux', type: 'number', label: 'Taux annuel', default: 3.5, min: 0, max: 20, step: 0.1, suffix: '%' },
    { id: 'duree', type: 'slider', label: 'Durée', default: 20, min: 5, max: 25, step: 1, suffix: 'ans' },
  ],
  variables: [
    { name: 'mensualiteMax', formula: 'MAX(revenu * 0.35 - charges, 0)' },
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    {
      name: 'capacite',
      formula: 'IF(tauxMensuel == 0, mensualiteMax * nbMois, mensualiteMax * (1 - (1 + tauxMensuel)^(-nbMois)) / tauxMensuel)',
    },
  ],
  results: [
    { label: 'Capacité d\'emprunt', formula: 'capacite', format: 'eur', size: 'lg' },
    { label: 'Mensualité maximale', formula: 'mensualiteMax', format: 'eur', size: 'md' },
    { label: 'Coût total des intérêts', formula: 'mensualiteMax * nbMois - capacite', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Capital empruntable', formula: 'capacite' },
      { label: 'Intérêts', formula: 'mensualiteMax * nbMois - capacite' },
    ],
  },
  baremes: {},
};

// 5. Épargne & intérêts composés — capitalisation mensuelle d'un versement
// régulier + capital de départ. Cible : conseillers en gestion de patrimoine.
const EPARGNE: CalculatorSchema = {
  fields: [
    { id: 'capitalInitial', type: 'number', label: 'Capital de départ', default: 5000, min: 0, step: 500, suffix: '€' },
    { id: 'versement', type: 'slider', label: 'Versement mensuel', default: 200, min: 0, max: 2000, step: 10, suffix: '€' },
    { id: 'taux', type: 'number', label: 'Rendement annuel', default: 5, min: 0, max: 15, step: 0.1, suffix: '%' },
    { id: 'duree', type: 'slider', label: 'Durée', default: 10, min: 1, max: 40, step: 1, suffix: 'ans' },
  ],
  variables: [
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    { name: 'facteur', formula: '(1 + tauxMensuel)^nbMois' },
    {
      name: 'valeurFinale',
      formula: 'IF(tauxMensuel == 0, capitalInitial + versement * nbMois, capitalInitial * facteur + versement * (facteur - 1) / tauxMensuel)',
    },
    { name: 'totalVerse', formula: 'capitalInitial + versement * nbMois' },
    { name: 'interets', formula: 'valeurFinale - totalVerse' },
  ],
  results: [
    { label: 'Capital final', formula: 'valeurFinale', format: 'eur', size: 'lg' },
    { label: 'Total versé', formula: 'totalVerse', format: 'eur', size: 'md' },
    { label: 'Intérêts gagnés', formula: 'interets', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Versements', formula: 'totalVerse' },
      { label: 'Intérêts', formula: 'interets' },
    ],
  },
  baremes: {},
};

// 6. Impôt sur le revenu 2026 — barème progressif appliqué au quotient
// familial (revenu / nombre de parts). Cible : experts-comptables, conseillers.
const IMPOT: CalculatorSchema = {
  fields: [
    { id: 'revenu', type: 'slider', label: 'Revenu net imposable du foyer', default: 30000, min: 0, max: 300000, step: 1000, suffix: '€' },
    { id: 'parts', type: 'number', label: 'Nombre de parts (quotient familial)', default: 1, min: 1, max: 10, step: 0.5 },
  ],
  variables: [
    { name: 'quotient', formula: 'revenu / parts' },
    { name: 'impot', formula: 'BAREME("ir2026", quotient) * parts' },
    { name: 'net', formula: 'revenu - impot' },
  ],
  results: [
    { label: 'Impôt sur le revenu', formula: 'impot', format: 'eur', size: 'lg' },
    { label: 'Revenu net après impôt', formula: 'net', format: 'eur', size: 'md' },
    { label: 'Taux moyen d\'imposition', formula: 'IF(revenu == 0, 0, impot / revenu * 100)', format: 'pct', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Net', formula: 'net' },
      { label: 'Impôt', formula: 'impot' },
    ],
  },
  baremes: { ir2026: IR2026 },
};

// 7. Devis peinture / rénovation — chiffrage au m² + forfait déplacement, TVA
// 10 % (rénovation logement >2 ans) ou 20 %. Cible : artisans du bâtiment.
const DEVIS: CalculatorSchema = {
  fields: [
    { id: 'surface', type: 'slider', label: 'Surface à traiter', default: 40, min: 1, max: 500, step: 1, suffix: 'm²' },
    { id: 'prixM2', type: 'number', label: 'Prix au m²', default: 25, min: 1, max: 200, step: 1, suffix: '€' },
    { id: 'deplacement', type: 'number', label: 'Forfait déplacement', default: 80, min: 0, step: 10, suffix: '€' },
    {
      id: 'tva',
      type: 'radio',
      label: 'TVA applicable',
      default: 0.1,
      options: [
        { label: 'Rénovation (10 %)', value: 0.1 },
        { label: 'Neuf / autre (20 %)', value: 0.2 },
      ],
    },
  ],
  variables: [
    { name: 'montantHT', formula: 'surface * prixM2 + deplacement' },
    { name: 'montantTva', formula: 'montantHT * tva' },
    { name: 'montantTTC', formula: 'montantHT + montantTva' },
  ],
  results: [
    { label: 'Total TTC', formula: 'montantTTC', format: 'eur', size: 'lg' },
    { label: 'Montant HT', formula: 'montantHT', format: 'eur', size: 'md' },
    { label: 'Dont TVA', formula: 'montantTva', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'bars',
    items: [
      { label: 'Main d\'œuvre', formula: 'surface * prixM2' },
      { label: 'Déplacement', formula: 'deplacement' },
      { label: 'TVA', formula: 'montantTva' },
    ],
  },
  baremes: {},
};

// 8. ROI publicitaire — d'un budget d'ads au chiffre d'affaires et au profit,
// via CPC, taux de conversion, panier moyen et marge. Cible : agences / marketeurs.
const ROI: CalculatorSchema = {
  fields: [
    { id: 'budget', type: 'slider', label: 'Budget publicitaire', default: 2000, min: 100, max: 50000, step: 100, suffix: '€' },
    { id: 'cpc', type: 'number', label: 'Coût par clic (CPC)', default: 0.8, min: 0.05, max: 20, step: 0.05, suffix: '€' },
    { id: 'conversion', type: 'number', label: 'Taux de conversion', default: 2, min: 0.1, max: 100, step: 0.1, suffix: '%' },
    { id: 'panier', type: 'number', label: 'Panier moyen', default: 60, min: 1, step: 5, suffix: '€' },
    { id: 'marge', type: 'slider', label: 'Marge brute', default: 40, min: 1, max: 100, step: 1, suffix: '%' },
  ],
  variables: [
    { name: 'clics', formula: 'budget / cpc' },
    { name: 'conversions', formula: 'clics * conversion / 100' },
    { name: 'chiffreAffaires', formula: 'conversions * panier' },
    { name: 'profit', formula: 'chiffreAffaires * marge / 100 - budget' },
  ],
  results: [
    { label: 'ROAS (retour sur dépense pub)', formula: 'chiffreAffaires / budget', format: 'number', size: 'lg' },
    { label: 'Chiffre d\'affaires estimé', formula: 'chiffreAffaires', format: 'eur', size: 'md' },
    { label: 'Profit net après pub', formula: 'profit', format: 'eur', size: 'md' },
    { label: 'Conversions attendues', formula: 'conversions', format: 'number', size: 'md' },
  ],
  chart: {
    type: 'bars',
    items: [
      { label: 'Budget pub', formula: 'budget' },
      { label: 'Chiffre d\'affaires', formula: 'chiffreAffaires' },
    ],
  },
  baremes: {},
};

// 9. Rendement locatif brut / net — loyers annuels rapportés au prix d'achat,
// charges non récupérables et taxe foncière déduites pour le net.
// Cible : agents immobiliers, CGP, investisseurs.
const RENDEMENT: CalculatorSchema = {
  fields: [
    { id: 'prix', type: 'slider', label: 'Prix d\'achat (frais inclus)', default: 200000, min: 30000, max: 1000000, step: 5000, suffix: '€' },
    { id: 'loyer', type: 'number', label: 'Loyer mensuel hors charges', default: 800, min: 0, step: 25, suffix: '€' },
    { id: 'charges', type: 'number', label: 'Charges annuelles non récupérables', default: 1200, min: 0, step: 100, suffix: '€' },
    { id: 'taxeFonciere', type: 'number', label: 'Taxe foncière', default: 900, min: 0, step: 50, suffix: '€' },
  ],
  variables: [
    { name: 'loyerAnnuel', formula: 'loyer * 12' },
    { name: 'brut', formula: 'loyerAnnuel / prix * 100' },
    { name: 'cashNet', formula: 'loyerAnnuel - charges - taxeFonciere' },
    { name: 'net', formula: 'cashNet / prix * 100' },
  ],
  results: [
    { label: 'Rendement net', formula: 'net', format: 'pct', size: 'lg' },
    { label: 'Rendement brut', formula: 'brut', format: 'pct', size: 'md' },
    { label: 'Revenu net annuel', formula: 'cashNet', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Revenu net', formula: 'cashNet' },
      { label: 'Charges & taxe foncière', formula: 'charges + taxeFonciere' },
    ],
  },
  baremes: {},
};

// 10. Cash-flow locatif mensuel — loyer moins mensualité de crédit (même
// formule d'annuité que le template « Mensualités de prêt »), charges et
// taxe foncière mensualisée. Cible : investisseurs locatifs, courtiers.
const CASHFLOW: CalculatorSchema = {
  fields: [
    { id: 'loyer', type: 'number', label: 'Loyer mensuel hors charges', default: 800, min: 0, step: 25, suffix: '€' },
    { id: 'montant', type: 'slider', label: 'Montant emprunté', default: 180000, min: 0, max: 800000, step: 5000, suffix: '€' },
    { id: 'taux', type: 'number', label: 'Taux annuel du crédit', default: 3.5, min: 0, max: 20, step: 0.1, suffix: '%' },
    { id: 'duree', type: 'slider', label: 'Durée du crédit', default: 20, min: 5, max: 25, step: 1, suffix: 'ans' },
    { id: 'charges', type: 'number', label: 'Charges mensuelles (copro, assurance, gestion)', default: 150, min: 0, step: 10, suffix: '€' },
    { id: 'taxeFonciere', type: 'number', label: 'Taxe foncière annuelle', default: 900, min: 0, step: 50, suffix: '€' },
  ],
  variables: [
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    {
      name: 'mensualite',
      formula: 'IF(tauxMensuel == 0, montant / nbMois, montant * tauxMensuel / (1 - (1 + tauxMensuel)^(-nbMois)))',
    },
    { name: 'cashflow', formula: 'loyer - mensualite - charges - taxeFonciere / 12' },
  ],
  results: [
    { label: 'Cash-flow mensuel', formula: 'cashflow', format: 'eur', size: 'lg' },
    { label: 'Mensualité de crédit', formula: 'mensualite', format: 'eur', size: 'md' },
    { label: 'Cash-flow annuel', formula: 'cashflow * 12', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'bars',
    items: [
      { label: 'Loyer', formula: 'loyer' },
      { label: 'Crédit + charges', formula: 'mensualite + charges + taxeFonciere / 12' },
    ],
  },
  baremes: {},
};

// 11. Assurance emprunteur — coût mensuel et total d'une assurance de prêt
// exprimée en % du capital initial (mode de calcul des contrats groupe).
// Cible : courtiers en crédit et en assurance.
const ASSURANCE_EMPRUNTEUR: CalculatorSchema = {
  fields: [
    { id: 'capital', type: 'slider', label: 'Capital emprunté', default: 200000, min: 10000, max: 800000, step: 5000, suffix: '€' },
    { id: 'tauxAssurance', type: 'number', label: 'Taux d\'assurance annuel (sur capital initial)', default: 0.34, min: 0, max: 2, step: 0.01, suffix: '%' },
    { id: 'duree', type: 'slider', label: 'Durée', default: 20, min: 5, max: 25, step: 1, suffix: 'ans' },
  ],
  variables: [
    { name: 'coutAnnuel', formula: 'capital * tauxAssurance / 100' },
    { name: 'coutMensuel', formula: 'coutAnnuel / 12' },
    { name: 'coutTotal', formula: 'coutAnnuel * duree' },
  ],
  results: [
    { label: 'Coût mensuel de l\'assurance', formula: 'coutMensuel', format: 'eur', size: 'lg' },
    { label: 'Coût total sur la durée', formula: 'coutTotal', format: 'eur', size: 'md' },
    { label: 'Coût annuel', formula: 'coutAnnuel', format: 'eur', size: 'md' },
  ],
  baremes: {},
};

// 12. Honoraires d'agence / net vendeur — commission en % du prix de vente
// FAI. Cible : agences immobilières, mandataires.
const FRAIS_AGENCE: CalculatorSchema = {
  fields: [
    { id: 'prix', type: 'slider', label: 'Prix de vente (honoraires inclus)', default: 300000, min: 30000, max: 1500000, step: 5000, suffix: '€' },
    { id: 'commission', type: 'number', label: 'Commission d\'agence', default: 4.5, min: 0, max: 15, step: 0.1, suffix: '%' },
  ],
  variables: [
    { name: 'honoraires', formula: 'prix * commission / 100' },
    { name: 'netVendeur', formula: 'prix - honoraires' },
  ],
  results: [
    { label: 'Net vendeur', formula: 'netVendeur', format: 'eur', size: 'lg' },
    { label: 'Honoraires d\'agence', formula: 'honoraires', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Net vendeur', formula: 'netVendeur' },
      { label: 'Honoraires', formula: 'honoraires' },
    ],
  },
  baremes: {},
};

// 13. Revenu net d'une location saisonnière — nuitées au taux d'occupation
// (30,4 j/mois), commission plateforme, charges. Cible : conciergeries,
// loueurs courte durée.
const LOCATION_SAISONNIERE: CalculatorSchema = {
  fields: [
    { id: 'prixNuit', type: 'number', label: 'Prix par nuit', default: 90, min: 1, step: 5, suffix: '€' },
    { id: 'occupation', type: 'slider', label: 'Taux d\'occupation', default: 65, min: 0, max: 100, step: 1, suffix: '%' },
    { id: 'commission', type: 'number', label: 'Commission plateforme', default: 17, min: 0, max: 50, step: 0.5, suffix: '%' },
    { id: 'charges', type: 'number', label: 'Charges mensuelles (ménage, énergie, assurance)', default: 250, min: 0, step: 25, suffix: '€' },
  ],
  variables: [
    { name: 'nuitees', formula: '30.4 * occupation / 100' },
    { name: 'brut', formula: 'nuitees * prixNuit' },
    { name: 'comm', formula: 'brut * commission / 100' },
    { name: 'net', formula: 'brut - comm - charges' },
  ],
  results: [
    { label: 'Revenu net mensuel', formula: 'net', format: 'eur', size: 'lg' },
    { label: 'Revenu brut mensuel', formula: 'brut', format: 'eur', size: 'md' },
    { label: 'Revenu net annuel', formula: 'net * 12', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Net', formula: 'MAX(net, 0)' },
      { label: 'Commission', formula: 'comm' },
      { label: 'Charges', formula: 'charges' },
    ],
  },
  baremes: {},
};

// 14. Cotisations micro-entrepreneur — taux 2026 (autoentrepreneur.urssaf.fr) :
// vente 12,3 %, prestations BIC 21,2 %, libérale BNC 26,1 %, Cipav 23,2 %.
// Le select porte directement le taux en valeur. Cible : experts-comptables.
const CHARGES_MICRO: CalculatorSchema = {
  fields: [
    { id: 'ca', type: 'slider', label: 'Chiffre d\'affaires annuel', default: 40000, min: 0, max: 200000, step: 1000, suffix: '€' },
    {
      id: 'activite',
      type: 'select',
      label: 'Type d\'activité',
      default: 0.212,
      options: [
        { label: 'Vente de marchandises (12,3 %)', value: 0.123 },
        { label: 'Prestations de services BIC (21,2 %)', value: 0.212 },
        { label: 'Libérale BNC (26,1 %)', value: 0.261 },
        { label: 'Libérale Cipav (23,2 %)', value: 0.232 },
      ],
    },
  ],
  variables: [
    { name: 'cotisations', formula: 'ca * activite' },
    { name: 'net', formula: 'ca - cotisations' },
  ],
  results: [
    { label: 'Revenu après cotisations', formula: 'net', format: 'eur', size: 'lg' },
    { label: 'Cotisations sociales', formula: 'cotisations', format: 'eur', size: 'md' },
    { label: 'Soit par mois', formula: 'net / 12', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Revenu', formula: 'net' },
      { label: 'Cotisations', formula: 'cotisations' },
    ],
  },
  baremes: {},
};

// 15. Indemnités kilométriques — barème fiscal 2025 (inchangé depuis 2023),
// tranche ≤ 5 000 km/an : le select porte le tarif par km selon la puissance.
// Cible : experts-comptables, indépendants, salariés aux frais réels.
const IK: CalculatorSchema = {
  fields: [
    { id: 'km', type: 'slider', label: 'Kilomètres professionnels par an (≤ 5 000)', default: 4000, min: 100, max: 5000, step: 100, suffix: 'km' },
    {
      id: 'tarif',
      type: 'select',
      label: 'Puissance fiscale du véhicule',
      default: 0.636,
      options: [
        { label: '3 CV et moins (0,529 €/km)', value: 0.529 },
        { label: '4 CV (0,606 €/km)', value: 0.606 },
        { label: '5 CV (0,636 €/km)', value: 0.636 },
        { label: '6 CV (0,665 €/km)', value: 0.665 },
        { label: '7 CV et plus (0,697 €/km)', value: 0.697 },
      ],
    },
  ],
  variables: [{ name: 'montant', formula: 'km * tarif' }],
  results: [
    { label: 'Indemnité annuelle déductible', formula: 'montant', format: 'eur', size: 'lg' },
    { label: 'Soit par mois', formula: 'montant / 12', format: 'eur', size: 'md' },
  ],
  baremes: {},
};

// 16. TVA à reverser — TVA collectée sur les ventes moins TVA déductible sur
// les achats. Un résultat négatif = crédit de TVA. Cible : experts-comptables,
// TPE.
const TVA_REVERSER: CalculatorSchema = {
  fields: [
    { id: 'caHT', type: 'number', label: 'Ventes hors taxes (période)', default: 30000, min: 0, step: 500, suffix: '€' },
    {
      id: 'tauxVente',
      type: 'radio',
      label: 'TVA sur les ventes',
      default: 0.2,
      options: [
        { label: '20 %', value: 0.2 },
        { label: '10 %', value: 0.1 },
        { label: '5,5 %', value: 0.055 },
      ],
    },
    { id: 'achatsHT', type: 'number', label: 'Achats hors taxes (période)', default: 8000, min: 0, step: 500, suffix: '€' },
    {
      id: 'tauxAchats',
      type: 'radio',
      label: 'TVA sur les achats',
      default: 0.2,
      options: [
        { label: '20 %', value: 0.2 },
        { label: '10 %', value: 0.1 },
        { label: '5,5 %', value: 0.055 },
      ],
    },
  ],
  variables: [
    { name: 'collectee', formula: 'caHT * tauxVente' },
    { name: 'deductible', formula: 'achatsHT * tauxAchats' },
    { name: 'due', formula: 'collectee - deductible' },
  ],
  results: [
    { label: 'TVA à reverser', formula: 'due', format: 'eur', size: 'lg' },
    { label: 'TVA collectée', formula: 'collectee', format: 'eur', size: 'md' },
    { label: 'TVA déductible', formula: 'deductible', format: 'eur', size: 'md' },
  ],
  baremes: {},
};

// 17. Coût total d'un salarié — brut + charges patronales (taux moyen
// paramétrable, 25-45 % selon exonérations) + avantages. Cible : TPE, RH,
// experts-comptables.
const COUT_SALARIE: CalculatorSchema = {
  fields: [
    { id: 'brut', type: 'slider', label: 'Salaire brut mensuel', default: 3000, min: 1500, max: 15000, step: 100, suffix: '€' },
    { id: 'tauxPatronal', type: 'number', label: 'Charges patronales', help: 'De ~25 % (salaires proches du SMIC, allègements) à ~45 %.', default: 42, min: 0, max: 60, step: 1, suffix: '%' },
    { id: 'avantages', type: 'number', label: 'Avantages mensuels (tickets resto, mutuelle…)', default: 100, min: 0, step: 25, suffix: '€' },
  ],
  variables: [
    { name: 'chargesPatronales', formula: 'brut * tauxPatronal / 100' },
    { name: 'coutMensuel', formula: 'brut + chargesPatronales + avantages' },
  ],
  results: [
    { label: 'Coût employeur mensuel', formula: 'coutMensuel', format: 'eur', size: 'lg' },
    { label: 'Coût annuel', formula: 'coutMensuel * 12', format: 'eur', size: 'md' },
    { label: 'Coefficient (coût / brut)', formula: 'coutMensuel / brut', format: 'number', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Brut', formula: 'brut' },
      { label: 'Charges patronales', formula: 'chargesPatronales' },
      { label: 'Avantages', formula: 'avantages' },
    ],
  },
  baremes: {},
};

// 18. Seuil de rentabilité — charges fixes couvertes par la marge sur coûts
// variables. Cible : créateurs d'entreprise, experts-comptables.
const SEUIL_RENTABILITE: CalculatorSchema = {
  fields: [
    { id: 'chargesFixes', type: 'number', label: 'Charges fixes mensuelles', default: 4000, min: 0, step: 100, suffix: '€' },
    { id: 'margeVariable', type: 'slider', label: 'Marge sur coûts variables', default: 60, min: 1, max: 100, step: 1, suffix: '%' },
    { id: 'joursOuvres', type: 'slider', label: 'Jours d\'activité par mois', default: 21, min: 10, max: 26, step: 1, suffix: 'j' },
  ],
  variables: [
    { name: 'seuilMensuel', formula: 'chargesFixes / (margeVariable / 100)' },
    { name: 'seuilJournalier', formula: 'seuilMensuel / joursOuvres' },
  ],
  results: [
    { label: 'CA mensuel minimum', formula: 'seuilMensuel', format: 'eur', size: 'lg' },
    { label: 'Soit par jour d\'activité', formula: 'seuilJournalier', format: 'eur', size: 'md' },
    { label: 'CA annuel minimum', formula: 'seuilMensuel * 12', format: 'eur', size: 'md' },
  ],
  baremes: {},
};

// 19. Marge sur un produit — prix de vente TTC ramené en HT, moins coût
// d'achat, frais logistiques et commission plateforme (calculée sur le TTC,
// pratique des marketplaces). Cible : e-commerçants.
const MARGE_PRODUIT: CalculatorSchema = {
  fields: [
    { id: 'prixVente', type: 'number', label: 'Prix de vente TTC', default: 59.9, min: 0, step: 0.1, suffix: '€' },
    {
      id: 'tva',
      type: 'radio',
      label: 'TVA',
      default: 0.2,
      options: [
        { label: '20 %', value: 0.2 },
        { label: '10 %', value: 0.1 },
        { label: '5,5 %', value: 0.055 },
        { label: '0 %', value: 0 },
      ],
    },
    { id: 'prixAchat', type: 'number', label: 'Coût d\'achat HT', default: 20, min: 0, step: 0.5, suffix: '€' },
    { id: 'frais', type: 'number', label: 'Frais logistiques par commande', default: 5, min: 0, step: 0.5, suffix: '€' },
    { id: 'commission', type: 'number', label: 'Commission plateforme (sur le prix TTC)', default: 15, min: 0, max: 100, step: 0.5, suffix: '%' },
  ],
  variables: [
    { name: 'prixHT', formula: 'prixVente / (1 + tva)' },
    { name: 'commissionMontant', formula: 'prixVente * commission / 100' },
    { name: 'coutTotal', formula: 'prixAchat + frais + commissionMontant' },
    { name: 'marge', formula: 'prixHT - coutTotal' },
  ],
  results: [
    { label: 'Marge nette par vente', formula: 'marge', format: 'eur', size: 'lg' },
    { label: 'Taux de marge', formula: 'IF(prixHT == 0, 0, marge / prixHT * 100)', format: 'pct', size: 'md' },
    { label: 'Coûts par vente', formula: 'coutTotal', format: 'eur', size: 'md' },
  ],
  chart: {
    type: 'bars',
    items: [
      { label: 'Prix HT', formula: 'prixHT' },
      { label: 'Coûts', formula: 'coutTotal' },
      { label: 'Marge', formula: 'marge' },
    ],
  },
  baremes: {},
};

// 20. Taux horaire à facturer (artisan / indépendant) — revenu cible et
// charges fixes couverts par un CA net de cotisations, ramené aux heures
// réellement facturables (4,33 semaines/mois). Cible : artisans.
const TAUX_HORAIRE: CalculatorSchema = {
  fields: [
    { id: 'revenuCible', type: 'slider', label: 'Revenu net mensuel visé', default: 2500, min: 500, max: 10000, step: 100, suffix: '€' },
    { id: 'chargesFixes', type: 'number', label: 'Charges fixes mensuelles (local, véhicule, assurances)', default: 800, min: 0, step: 50, suffix: '€' },
    { id: 'cotisations', type: 'slider', label: 'Cotisations et impôts (% du CA)', default: 45, min: 0, max: 60, step: 1, suffix: '%' },
    { id: 'heures', type: 'slider', label: 'Heures facturables par semaine', default: 25, min: 5, max: 45, step: 1, suffix: 'h' },
  ],
  variables: [
    { name: 'caMensuel', formula: '(revenuCible + chargesFixes) / (1 - cotisations / 100)' },
    { name: 'heuresMois', formula: 'heures * 4.33' },
    { name: 'tauxHoraire', formula: 'caMensuel / heuresMois' },
  ],
  results: [
    { label: 'Taux horaire à facturer', formula: 'tauxHoraire', format: 'eur', size: 'lg' },
    { label: 'CA mensuel nécessaire', formula: 'caMensuel', format: 'eur', size: 'md' },
    { label: 'Soit par jour (7 h)', formula: 'tauxHoraire * 7', format: 'eur', size: 'md' },
  ],
  baremes: {},
};

// 21. Capital nécessaire pour une rente — règle du taux de retrait annuel
// (4 % par défaut). Cible : CGP, préparation retraite.
const RENTE: CalculatorSchema = {
  fields: [
    { id: 'rente', type: 'slider', label: 'Revenu mensuel souhaité', default: 1000, min: 100, max: 10000, step: 50, suffix: '€' },
    { id: 'taux', type: 'number', label: 'Taux de retrait annuel', help: 'Part du capital prélevée chaque année (règle classique : 4 %).', default: 4, min: 1, max: 10, step: 0.1, suffix: '%' },
  ],
  variables: [
    { name: 'annuel', formula: 'rente * 12' },
    { name: 'capital', formula: 'annuel / (taux / 100)' },
  ],
  results: [
    { label: 'Capital nécessaire', formula: 'capital', format: 'eur', size: 'lg' },
    { label: 'Revenu annuel', formula: 'annuel', format: 'eur', size: 'md' },
  ],
  baremes: {},
};

// 22. Versement mensuel pour un objectif — inverse du template « Épargne » :
// capitalisation mensuelle du capital actuel, puis annuité couvrant l'écart
// restant. Cible : CGP, banques.
const EPARGNE_OBJECTIF: CalculatorSchema = {
  fields: [
    { id: 'objectif', type: 'slider', label: 'Objectif de capital', default: 100000, min: 5000, max: 1000000, step: 5000, suffix: '€' },
    { id: 'capitalInitial', type: 'number', label: 'Capital déjà épargné', default: 10000, min: 0, step: 500, suffix: '€' },
    { id: 'duree', type: 'slider', label: 'Horizon', default: 15, min: 1, max: 40, step: 1, suffix: 'ans' },
    { id: 'taux', type: 'number', label: 'Rendement annuel', default: 4, min: 0, max: 15, step: 0.1, suffix: '%' },
  ],
  variables: [
    { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
    { name: 'nbMois', formula: 'duree * 12' },
    { name: 'facteur', formula: '(1 + tauxMensuel)^nbMois' },
    { name: 'futurCapital', formula: 'capitalInitial * facteur' },
    { name: 'besoin', formula: 'MAX(objectif - futurCapital, 0)' },
    {
      name: 'versement',
      formula: 'IF(besoin == 0, 0, IF(tauxMensuel == 0, besoin / nbMois, besoin * tauxMensuel / (facteur - 1)))',
    },
  ],
  results: [
    { label: 'Versement mensuel requis', formula: 'versement', format: 'eur', size: 'lg' },
    { label: 'Votre capital actuel en fin de période', formula: 'futurCapital', format: 'eur', size: 'md' },
    { label: 'Effort restant à financer', formula: 'besoin', format: 'eur', size: 'md' },
  ],
  baremes: {},
};

// 23. Économies panneaux solaires — production (kWc × productible), part
// autoconsommée valorisée au prix du kWh, surplus revendu, amortissement.
// Cible : installateurs photovoltaïques.
const SOLAIRE: CalculatorSchema = {
  fields: [
    { id: 'puissance', type: 'slider', label: 'Puissance installée', default: 6, min: 2, max: 12, step: 0.5, suffix: 'kWc' },
    { id: 'productible', type: 'number', label: 'Production par kWc', help: 'De ~900 kWh/an au nord à ~1 400 kWh/an au sud.', default: 1100, min: 700, max: 1500, step: 10, suffix: 'kWh' },
    { id: 'autoconso', type: 'slider', label: 'Part autoconsommée', default: 40, min: 0, max: 100, step: 5, suffix: '%' },
    { id: 'prixKwh', type: 'number', label: 'Prix du kWh acheté', default: 0.25, min: 0.05, max: 1, step: 0.01, suffix: '€' },
    { id: 'tarifRachat', type: 'number', label: 'Tarif de rachat du surplus', default: 0.04, min: 0, max: 0.2, step: 0.01, suffix: '€' },
    { id: 'cout', type: 'number', label: 'Coût de l\'installation', default: 14000, min: 1000, step: 500, suffix: '€' },
  ],
  variables: [
    { name: 'production', formula: 'puissance * productible' },
    { name: 'economie', formula: 'production * autoconso / 100 * prixKwh' },
    { name: 'revente', formula: 'production * (1 - autoconso / 100) * tarifRachat' },
    { name: 'gain', formula: 'economie + revente' },
  ],
  results: [
    { label: 'Gain annuel total', formula: 'gain', format: 'eur', size: 'lg' },
    { label: 'Économies d\'autoconsommation', formula: 'economie', format: 'eur', size: 'md' },
    { label: 'Amortissement (années)', formula: 'IF(gain == 0, 0, cout / gain)', format: 'number', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Autoconsommation', formula: 'economie' },
      { label: 'Revente du surplus', formula: 'revente' },
    ],
  },
  baremes: {},
};

// 24. Ratio coût matière (restauration) — coût de l'assiette rapporté au prix
// de vente HT, marge brute et coefficient multiplicateur. Cible :
// restaurateurs, food trucks.
const FOOD_COST: CalculatorSchema = {
  fields: [
    { id: 'coutMatiere', type: 'number', label: 'Coût matière de l\'assiette', default: 4.5, min: 0.1, step: 0.1, suffix: '€' },
    { id: 'prixVente', type: 'number', label: 'Prix de vente TTC', default: 18, min: 0.5, step: 0.5, suffix: '€' },
    {
      id: 'tva',
      type: 'radio',
      label: 'TVA',
      default: 0.1,
      options: [
        { label: 'Sur place / à emporter (10 %)', value: 0.1 },
        { label: 'Produits à emporter (5,5 %)', value: 0.055 },
        { label: 'Alcool (20 %)', value: 0.2 },
      ],
    },
  ],
  variables: [
    { name: 'prixHT', formula: 'prixVente / (1 + tva)' },
    { name: 'ratio', formula: 'IF(prixHT == 0, 0, coutMatiere / prixHT * 100)' },
    { name: 'marge', formula: 'prixHT - coutMatiere' },
  ],
  results: [
    { label: 'Ratio coût matière', formula: 'ratio', format: 'pct', size: 'lg' },
    { label: 'Marge brute par plat', formula: 'marge', format: 'eur', size: 'md' },
    { label: 'Coefficient multiplicateur', formula: 'IF(coutMatiere == 0, 0, prixHT / coutMatiere)', format: 'number', size: 'md' },
  ],
  chart: {
    type: 'donut',
    items: [
      { label: 'Coût matière', formula: 'coutMatiere' },
      { label: 'Marge brute', formula: 'MAX(marge, 0)' },
    ],
  },
  baremes: {},
};

export const TEMPLATES: Template[] = [
  {
    id: 'pret',
    name: 'Mensualités de prêt',
    description: 'Mensualité, coût total et part des intérêts d\'un crédit.',
    metier: 'Immobilier & crédit',
    schema: PRET,
  },
  {
    id: 'notaire',
    name: 'Frais de notaire',
    description: 'Frais d\'acquisition immobilière : droits, émoluments, débours (barèmes 2026).',
    metier: 'Immobilier & crédit',
    schema: NOTAIRE,
  },
  {
    id: 'capacite',
    name: 'Capacité d\'emprunt',
    description: 'Le capital empruntable à partir des revenus, au taux d\'endettement de 35 %.',
    metier: 'Immobilier & crédit',
    schema: CAPACITE,
  },
  {
    id: 'tjm',
    name: 'TJM freelance → net mensuel',
    description: 'Du taux journalier au revenu net après cotisations et impôt (micro-BNC).',
    metier: 'Freelance & indépendant',
    schema: TJM,
  },
  {
    id: 'epargne',
    name: 'Épargne & intérêts composés',
    description: 'La valeur future d\'un capital et de versements mensuels réguliers.',
    metier: 'Épargne & patrimoine',
    schema: EPARGNE,
  },
  {
    id: 'impot',
    name: 'Impôt sur le revenu 2026',
    description: 'Impôt et taux moyen selon le barème progressif et le quotient familial.',
    metier: 'Fiscalité',
    schema: IMPOT,
  },
  {
    id: 'devis',
    name: 'Devis travaux au m²',
    description: 'Chiffrage HT / TTC d\'un chantier au m² avec forfait et TVA rénovation.',
    metier: 'Artisan & BTP',
    schema: DEVIS,
  },
  {
    id: 'roi',
    name: 'ROI publicitaire',
    description: 'Du budget d\'ads au chiffre d\'affaires et au profit (CPC, conversion, marge).',
    metier: 'Marketing & agence',
    schema: ROI,
  },
  {
    id: 'rendement-locatif',
    name: 'Rendement locatif',
    description: 'Rendement brut et net d\'un bien loué, charges et taxe foncière déduites.',
    metier: 'Immobilier & crédit',
    schema: RENDEMENT,
  },
  {
    id: 'cashflow-locatif',
    name: 'Cash-flow locatif',
    description: 'Ce qui reste chaque mois : loyer moins crédit, charges et taxe foncière.',
    metier: 'Immobilier & crédit',
    schema: CASHFLOW,
  },
  {
    id: 'assurance-emprunteur',
    name: 'Assurance emprunteur',
    description: 'Coût mensuel et total d\'une assurance de prêt en % du capital initial.',
    metier: 'Immobilier & crédit',
    schema: ASSURANCE_EMPRUNTEUR,
  },
  {
    id: 'frais-agence',
    name: 'Net vendeur & honoraires',
    description: 'Du prix de vente honoraires inclus au net vendeur, selon la commission.',
    metier: 'Immobilier & crédit',
    schema: FRAIS_AGENCE,
  },
  {
    id: 'location-saisonniere',
    name: 'Location saisonnière',
    description: 'Revenu net d\'une location courte durée : occupation, commission, charges.',
    metier: 'Immobilier & crédit',
    schema: LOCATION_SAISONNIERE,
  },
  {
    id: 'charges-micro',
    name: 'Cotisations micro-entrepreneur',
    description: 'Revenu après cotisations sociales selon l\'activité (taux 2026).',
    metier: 'Freelance & indépendant',
    schema: CHARGES_MICRO,
  },
  {
    id: 'rente',
    name: 'Capital pour une rente',
    description: 'Le capital nécessaire pour un revenu mensuel donné (règle des 4 %).',
    metier: 'Épargne & patrimoine',
    schema: RENTE,
  },
  {
    id: 'epargne-objectif',
    name: 'Versement pour un objectif',
    description: 'Le versement mensuel requis pour atteindre un capital à horizon donné.',
    metier: 'Épargne & patrimoine',
    schema: EPARGNE_OBJECTIF,
  },
  {
    id: 'tva',
    name: 'TVA à reverser',
    description: 'TVA collectée moins TVA déductible sur une période (crédit si négatif).',
    metier: 'Fiscalité',
    schema: TVA_REVERSER,
  },
  {
    id: 'indemnites-km',
    name: 'Indemnités kilométriques',
    description: 'Frais de véhicule déductibles (barème fiscal, jusqu\'à 5 000 km/an).',
    metier: 'Fiscalité',
    schema: IK,
  },
  {
    id: 'taux-horaire',
    name: 'Taux horaire à facturer',
    description: 'Le tarif horaire qui couvre revenu visé, charges fixes et cotisations.',
    metier: 'Artisan & BTP',
    schema: TAUX_HORAIRE,
  },
  {
    id: 'cout-salarie',
    name: 'Coût d\'un salarié',
    description: 'Coût employeur réel : brut, charges patronales et avantages.',
    metier: 'Entreprise & gestion',
    schema: COUT_SALARIE,
  },
  {
    id: 'seuil-rentabilite',
    name: 'Seuil de rentabilité',
    description: 'Le chiffre d\'affaires minimum pour couvrir les charges fixes.',
    metier: 'Entreprise & gestion',
    schema: SEUIL_RENTABILITE,
  },
  {
    id: 'marge-produit',
    name: 'Marge sur un produit',
    description: 'Marge nette par vente : TVA, coût d\'achat, logistique, commission.',
    metier: 'Commerce & e-commerce',
    schema: MARGE_PRODUIT,
  },
  {
    id: 'food-cost',
    name: 'Ratio coût matière',
    description: 'Coût matière, marge brute et coefficient d\'un plat au prix de carte.',
    metier: 'Restauration',
    schema: FOOD_COST,
  },
  {
    id: 'solaire',
    name: 'Économies panneaux solaires',
    description: 'Gain annuel d\'une installation : autoconsommation, revente, amortissement.',
    metier: 'Énergie & habitat',
    schema: SOLAIRE,
  },
];

// Contenu éditorial des fiches modèles (/modeles/:id) — enrichit la page pour
// le SEO et l'utilisateur : « pour qui » (angle métier) et « base de calcul »
// (source/règle, reprise des commentaires de conversion ci-dessus). Les
// entrées/sorties, elles, sont dérivées automatiquement du schéma côté page.
export interface TemplateContent {
  audience: string;
  basis: string;
}

export const TEMPLATE_CONTENT: Record<string, TemplateContent> = {
  pret: {
    audience: 'Courtiers en crédit, agents immobiliers et banques qui veulent chiffrer une mensualité en direct avec leurs clients.',
    basis: 'Formule d\'annuité constante : mensualité = capital × taux mensuel / (1 − (1 + taux mensuel)^−durée). Le coût du crédit est la somme des intérêts sur la durée.',
  },
  notaire: {
    audience: 'Agences immobilières, courtiers et acquéreurs qui estiment les frais d\'acquisition avant une offre.',
    basis: 'Barème des émoluments (arrêté du 28/02/2020), droits de mutation (DMTO) 2025 selon le type de bien, contribution de sécurité immobilière 0,10 % et débours forfaitaires.',
  },
  capacite: {
    audience: 'Courtiers en crédit et conseillers qui déterminent le budget d\'un emprunteur.',
    basis: 'Taux d\'endettement maximal de 35 % (norme HCSF) appliqué aux revenus nets, puis inverse de la formule d\'annuité pour remonter au capital empruntable.',
  },
  tjm: {
    audience: 'Freelances, indépendants et sociétés de portage qui traduisent un TJM en revenu net.',
    basis: 'Régime micro-BNC : cotisations sociales 21,1 % du chiffre d\'affaires, abattement forfaitaire 34 %, puis barème progressif de l\'impôt sur le revenu 2026.',
  },
  epargne: {
    audience: 'Conseillers en gestion de patrimoine et banques qui projettent une épargne dans le temps.',
    basis: 'Capitalisation mensuelle d\'un capital de départ et de versements réguliers au taux de rendement annuel indiqué (intérêts composés).',
  },
  impot: {
    audience: 'Experts-comptables et conseillers qui estiment l\'impôt sur le revenu d\'un foyer.',
    basis: 'Barème progressif de l\'impôt sur le revenu 2026 appliqué au quotient familial (revenu imposable divisé par le nombre de parts).',
  },
  devis: {
    audience: 'Artisans du bâtiment (peinture, rénovation) qui produisent un devis instantané au m².',
    basis: 'Chiffrage au m² majoré d\'un forfait de déplacement, avec TVA à 10 % (rénovation de logement de plus de 2 ans) ou 20 %.',
  },
  roi: {
    audience: 'Agences et marketeurs qui projettent le retour d\'une campagne publicitaire.',
    basis: 'Entonnoir budget → clics (via le CPC) → conversions (taux de conversion) → chiffre d\'affaires (panier moyen), profit net après application de la marge.',
  },
  'rendement-locatif': {
    audience: 'Agents immobiliers, CGP et investisseurs qui comparent la rentabilité d\'un bien.',
    basis: 'Rendement brut = loyers annuels / prix d\'achat ; rendement net après déduction des charges non récupérables et de la taxe foncière.',
  },
  'cashflow-locatif': {
    audience: 'Investisseurs locatifs et courtiers qui vérifient l\'effort d\'épargne mensuel d\'un projet.',
    basis: 'Loyer mensuel moins la mensualité de crédit (formule d\'annuité), les charges et la taxe foncière mensualisée.',
  },
  'assurance-emprunteur': {
    audience: 'Courtiers en crédit et en assurance qui chiffrent le coût d\'une assurance de prêt.',
    basis: 'Coût annuel = taux d\'assurance × capital initial (mode de calcul des contrats groupe), rapporté au mois et cumulé sur la durée.',
  },
  'frais-agence': {
    audience: 'Agences immobilières et mandataires qui présentent le net vendeur.',
    basis: 'Honoraires = commission en % du prix de vente honoraires inclus (FAI) ; net vendeur = prix − honoraires.',
  },
  'location-saisonniere': {
    audience: 'Conciergeries et loueurs en courte durée qui estiment un revenu net.',
    basis: 'Nuitées = taux d\'occupation × 30,4 jours ; revenu net = chiffre d\'affaires − commission de plateforme − charges (ménage, énergie, assurance).',
  },
  'charges-micro': {
    audience: 'Experts-comptables et micro-entrepreneurs qui calculent le revenu après cotisations.',
    basis: 'Taux de cotisations URSSAF 2026 selon l\'activité : vente 12,3 %, prestations BIC 21,2 %, libérale BNC 26,1 %, Cipav 23,2 %.',
  },
  rente: {
    audience: 'Conseillers en gestion de patrimoine et particuliers préparant leur retraite.',
    basis: 'Règle du taux de retrait annuel : capital nécessaire = revenu annuel souhaité / taux de retrait (par défaut 4 %).',
  },
  'epargne-objectif': {
    audience: 'CGP et banques qui déterminent l\'effort d\'épargne pour atteindre un capital.',
    basis: 'Capitalisation mensuelle du capital déjà épargné, puis versement d\'annuité couvrant l\'écart restant jusqu\'à l\'objectif.',
  },
  tva: {
    audience: 'Experts-comptables et TPE qui préparent une déclaration de TVA.',
    basis: 'TVA à reverser = TVA collectée sur les ventes − TVA déductible sur les achats (un résultat négatif est un crédit de TVA).',
  },
  'indemnites-km': {
    audience: 'Experts-comptables, indépendants et salariés aux frais réels.',
    basis: 'Barème kilométrique fiscal (tranche jusqu\'à 5 000 km/an) : tarif par kilomètre selon la puissance fiscale du véhicule.',
  },
  'taux-horaire': {
    audience: 'Artisans et indépendants qui fixent le bon tarif horaire.',
    basis: '(Revenu net visé + charges fixes) / (1 − taux de cotisations), ramené aux heures réellement facturables (4,33 semaines/mois).',
  },
  'cout-salarie': {
    audience: 'TPE, responsables RH et experts-comptables qui évaluent un recrutement.',
    basis: 'Coût employeur = salaire brut + charges patronales (de ~25 % près du SMIC à ~45 %) + avantages (tickets resto, mutuelle…).',
  },
  'seuil-rentabilite': {
    audience: 'Créateurs d\'entreprise et experts-comptables qui valident un modèle économique.',
    basis: 'Chiffre d\'affaires minimum = charges fixes / taux de marge sur coûts variables ; décliné par jour d\'activité et par an.',
  },
  'marge-produit': {
    audience: 'E-commerçants et vendeurs en marketplace qui vérifient leur marge unitaire.',
    basis: 'Prix HT (déduit de la TVA) − coût d\'achat − frais logistiques − commission de plateforme (calculée sur le prix TTC).',
  },
  'food-cost': {
    audience: 'Restaurateurs et food trucks qui fixent le prix d\'un plat.',
    basis: 'Ratio coût matière = coût de l\'assiette / prix de vente HT ; marge brute et coefficient multiplicateur associés.',
  },
  solaire: {
    audience: 'Installateurs photovoltaïques qui présentent le gain d\'une installation.',
    basis: 'Production = puissance (kWc) × productible régional ; gain = part autoconsommée valorisée au prix du kWh + revente du surplus au tarif de rachat.',
  },
};

// Ordre d'affichage des métiers dans la galerie /modeles (les métiers non
// listés viennent après, dans l'ordre d'apparition).
export const METIERS_ORDER = [
  'Immobilier & crédit',
  'Freelance & indépendant',
  'Épargne & patrimoine',
  'Fiscalité',
  'Artisan & BTP',
  'Entreprise & gestion',
  'Commerce & e-commerce',
  'Restauration',
  'Énergie & habitat',
  'Marketing & agence',
];

// Regroupe les templates par métier en respectant METIERS_ORDER.
export function templatesByMetier(): { metier: string; templates: Template[] }[] {
  const groups = new Map<string, Template[]>();
  for (const tpl of TEMPLATES) {
    const list = groups.get(tpl.metier) ?? [];
    list.push(tpl);
    groups.set(tpl.metier, list);
  }
  const ordered = [...groups.keys()].sort((a, b) => {
    const ia = METIERS_ORDER.indexOf(a);
    const ib = METIERS_ORDER.indexOf(b);
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
  });
  return ordered.map((metier) => ({ metier, templates: groups.get(metier)! }));
}
