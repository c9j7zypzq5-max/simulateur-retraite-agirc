# Audit des simulateurs — Design, PDF & graphiques

> Audit réalisé le 19/06/2026. Objectif : améliorer en profondeur les pages
> simulateurs, les PDF générés et les graphiques, par vagues successives.

## Méthode

Lecture de l'infrastructure partagée (`ui.jsx`, `pdfReport.js`, `ShareBar.jsx`,
`ZoomableChart.jsx`) + scan systématique des 24 simulateurs (`src/pages/simulateurs/`).
Les constats marqués ✅ sont **vérifiés dans le code**, pas supposés.

---

## 1. Constats transverses (touchent TOUS les simulateurs)

### 1.1 Graphiques — le plus gros déficit

✅ **Seuls 5 simulateurs sur 24 ont un vrai graphique** : `Budget`, `Comparateur`,
`Fire`, `Patrimoine`, `Salaire`. Les 19 autres n'affichent aucune courbe.

✅ **Épargne calcule `epargneChartData` (points mensuels) mais ne l'affiche jamais** :
le `chartRef` est posé sur une `<ProgressBar>` (ui.jsx). Le « graphique » inséré
dans le PDF est donc une simple barre de progression. Données prêtes, courbe absente.

- Chaque graphique est un **SVG ad-hoc réécrit dans chaque page** (W=600/H=300 codés
  en dur, pas de tooltip au survol inline, axes minimalistes, pas de grille).
- Pas de composant graphique partagé → incohérence visuelle + duplication.
- Couleurs basées sur `var(--gold)`, `var(--text-secondary)`… donc **rendues en
  couleurs de thème sombre lors de la capture html2canvas** pour le PDF (fond clair
  + traits clairs = quasi illisible).

**Recommandation** : créer `src/components/charts/` avec `<LineChart>`, `<AreaChart>`,
`<StackedAreaChart>`, `<BarChart>`, `<DonutChart>` — props normalisées (séries,
ticks, formatteurs, légende), tooltip au survol, grille, et un **mode export
« light »** (palette fixe claire) pour des PDF nets.

### 1.2 PDF généré (`pdfReport.js`)

- **Police Helvetica uniquement** : l'écran utilise Cormorant Garamond (titres) +
  DM Sans (corps) ; le PDF perd totalement l'identité de marque.
- **Graphique inséré en raster** (PNG capturé) → flou à l'impression + couleurs de
  thème sombre. Mieux : **redessiner la courbe en vectoriel directement dans jsPDF**
  à partir des points de données (net, léger, toujours en palette claire).
- **Pas de tableau annuel** dans le PDF (ex. l'évolution année par année d'Épargne
  n'y figure pas, alors qu'elle existe à l'écran).
- **~200 lignes dupliquées** entre `buildReportPdf` (gratuit) et `buildReportPdfPro`
  (payant) : sections, footer, highlight… à factoriser.
- ✅ Le symbole `€` passe en WinAnsi, mais `£`/autres devises risquent de mal rendre
  (jsPDF helvetica = WinAnsi). À vérifier avec le sélecteur de devise.

### 1.3 Design des pages

- ✅ **`FaqItem` est redéfini localement dans 15 simulateurs** au lieu d'importer
  celui de `ui.jsx` (~750 lignes dupliquées, comportement légèrement divergent).
- Les blocs « résultat » sont copiés-collés (gradient + highlight) au lieu de
  réutiliser `ResultCard` de `ui.jsx`.
- Pas d'état de chargement / squelette ; le rendu est instantané donc OK, mais les
  captures PDF longues n'ont aucun feedback.
- ✅ i18n : structure `TXT = { fr, en }` propre et cohérente (bon point).

---

## 2. Constats par famille

### Finances (7) — `Epargne` `Fire` `Patrimoine` `Budget` `AssuranceVie` `CreditConso` `Salaire`
- `Fire` (88 Ko) : le plus riche, bon graphique — à prendre comme **référence visuelle**.
- `Epargne` : courbe manquante (cf. 1.1) — **quick win prioritaire**.
- `AssuranceVie`, `CreditConso` : aucun graphique alors que l'amortissement /
  capitalisation s'y prêtent parfaitement.

### Retraite (10) — `Cnav` `AgircArrco` `FonctionPublique` `Independants` `Ircantec` `RetraiteProgressive` `Cnavpl` `Msa` `Per` `SyntheseRetraite`
- Aucun n'a de graphique. Une **courbe « pension estimée selon l'âge de départ »**
  ou un **donut taux de remplacement** auraient un fort impact pédagogique.
- `SyntheseRetraite` agrège plusieurs régimes : candidat idéal pour un **graphique
  empilé par régime**.

### Immobilier (3) — `EmpruntImmobilier` `RendementLocatif` `Ptz`
- `EmpruntImmobilier` : **tableau d'amortissement** → graphique capital/intérêts
  dans le temps (barre empilée) très attendu.
- `RendementLocatif` : donut charges vs revenu net.

### Impôts (2) — `ImpotRevenu` `PlusValue`
- `ImpotRevenu` : **graphique par tranche marginale** (barres) = très lisible.
- `PlusValue` : courbe d'abattement selon la durée de détention.

### Vie & Temps (2) + Comparateur (1)
- `CoutEnHeures`, `VieEnSemaines` : visuels spécifiques déjà, à harmoniser.
- `Comparateur` : a déjà un graphique, surtout à fiabiliser pour l'export.

---

## 3. Plan en vagues

**Vague 0 — Fondations partagées (pré-requis, fort effet de levier)**
1. Bibliothèque de graphiques `src/components/charts/` (Line/Area/Stacked/Bar/Donut)
   avec tooltip, grille, légende et **mode export clair**.
2. Refonte `pdfReport.js` : police de marque (ou fallback soigné), **courbe
   vectorielle native**, ajout des tableaux, factorisation gratuit/Pro.
3. `FaqItem` → import unique depuis `ui.jsx` (suppression des 15 copies).
4. Correction du bug graphique d'Épargne.

**Vague 1 — Finances (7)** : brancher les nouveaux graphiques, soigner les blocs
résultat, enrichir les PDF. `Fire` sert de référence.

**Vague 2 — Retraite (10)** : ajouter courbe pension/âge + donut taux de
remplacement ; graphique empilé pour `SyntheseRetraite`.

**Vague 3 — Immobilier (3) + Impôts (2)** : amortissement, tranches marginales,
abattements.

**Vague 4 — Vie & Temps (2) + Comparateur (1)** : harmonisation visuelle et
fiabilisation export.

Chaque vague = design + graphique + PDF + vérification build, sur une branche
dédiée, puis PR.
