// Schéma de calculateur — la structure JSON unique consommée par les trois
// surfaces de rendu (aperçu éditeur, page hébergée, iframe embed) et stockée
// telle quelle dans calculators.schema côté Supabase (Lot 2).

export type FieldType = 'number' | 'slider' | 'select' | 'radio' | 'toggle';

export interface FieldOption {
  label: string;
  value: number; // les options portent des valeurs numériques, utilisables en formule
}

export interface Field {
  id: string; // identifiant utilisable dans les formules (ex. "montant")
  type: FieldType;
  label: string;
  help?: string;
  default: number; // toggle : 0/1
  // number & slider
  min?: number;
  max?: number;
  step?: number;
  suffix?: string; // "€", "%", "ans"…
  // select & radio
  options?: FieldOption[];
}

export interface Variable {
  name: string;
  formula: string;
}

export type ResultFormat = 'eur' | 'pct' | 'number';

export interface ResultItem {
  label: string;
  formula: string;
  format: ResultFormat;
  size: 'lg' | 'md';
}

export interface ChartItem {
  label: string;
  formula: string;
}

export interface Chart {
  type: 'bars' | 'donut';
  items: ChartItem[];
}

// Tranche de barème progressif : s'applique à la part de la valeur comprise
// entre le plafond de la tranche précédente et `jusqua` (null = sans plafond).
export interface Tranche {
  jusqua: number | null;
  taux: number; // ex. 0.11 pour 11 %
}

export interface CalculatorSchema {
  fields: Field[];
  variables: Variable[];
  results: ResultItem[]; // 1 à 4
  chart?: Chart;
  baremes: Record<string, Tranche[]>;
}

export interface Theme {
  primary: string;
  background: string;
  text: string;
  logoUrl?: string;
  font?: string; // police custom : Premium uniquement (verrou Lot 3)
}

export type Plan = 'free' | 'pro' | 'premium';

export interface Calculator {
  id: string;
  slug: string | null;
  title: string;
  status: 'draft' | 'published';
  theme: Theme;
  schema: CalculatorSchema;
  // Verrous de plan (Lot 3) — la valeur effective est toujours clampée côté
  // serveur (triggers Postgres) ; ces champs reflètent ce que la base a
  // accepté, jamais une intention client non vérifiée.
  hideBadge: boolean;
  captureEmail: boolean;
  overFreeQuota: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_THEME: Theme = {
  primary: '#2B5CE6',
  background: '#ffffff',
  text: '#0F1828',
};
