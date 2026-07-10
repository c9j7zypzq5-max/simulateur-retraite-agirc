// Schéma vierge — le choix « Vierge » du dashboard. Les schémas de départ
// pré-remplis vivent dans templates.ts.

import type { CalculatorSchema } from './types';

export const BLANK_SCHEMA: CalculatorSchema = { fields: [], variables: [], results: [], baremes: {} };
