import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PASS_2026, AGIRC_ARRCO_2026 } from "../data/baremesRetraite.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

// Garde-fou anti-divergence : après l'incident où la valeur du point Agirc-Arrco
// existait en 4 versions différentes dans le site, ce test échoue si une valeur
// de barème PÉRIMÉE réapparaît en dur quelque part. Les valeurs courantes vivent
// dans data/baremesRetraite.js (retraite) et config/constants.js (SMIC/PASS).

// ── 1. Les valeurs centrales sont bien celles attendues pour 2026 ────────────
// (si une revalorisation les change, mettre à jour ce test = changement conscient)
it("valeurs centrales Agirc-Arrco / PASS 2026", () => {
  expect(AGIRC_ARRCO_2026.valeurService).toBe(1.4386);
  expect(AGIRC_ARRCO_2026.valeurAchat).toBe(20.1877);
  expect(PASS_2026).toBe(48_060);
});

// ── 2. Aucune valeur périmée en dur dans src/ ou api/ ────────────────────────
const STALE = [
  // Anciennes valeurs de service du point Agirc-Arrco
  "1,4098", "1.4098", "1,4107", "1.4107", "1,4159", "1.4159", "1,4196", "1.4196",
  // Ancienne valeur d'achat du point
  "7,46 €", "= 7.46",
  // PASS 2025 présenté comme 2026
  "47 100 € en 2026", "47 100 €en 2026",
  // Ancien seuil de validation d'un trimestre (150 × SMIC périmé)
  "1 690 €", "1 625 € brut",
  // Anciennes valeurs IRCANTEC (achat/service) — corrigées vers 5,787 / 0,56053
  "8,06 €", "0,54076", "12,516", "0,5204 €",
  // Anciennes valeurs RCI indépendants — corrigées vers 19,394 / 1,335
  "17,763", "0,6331",
  // Anciennes valeurs base CNAVPL — régime désormais modélisé par points (0,6599)
  "0,5714", "7,04 €",
];

// Fichiers exclus : le module central documente les anciennes valeurs en
// commentaire, et ce test les liste par nature.
const EXCLUDE = new Set([
  path.join(ROOT, "src/data/baremesRetraite.js"),
  path.join(ROOT, "src/__tests__/baremes-coherence.test.js"),
]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
      out.push(...walk(p));
    } else if (/\.(js|jsx)$/.test(entry.name) && !EXCLUDE.has(p)) {
      out.push(p);
    }
  }
  return out;
}

describe("cohérence des barèmes — aucune valeur périmée en dur", () => {
  const files = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, "api"))];
  for (const stale of STALE) {
    it(`« ${stale} » n'apparaît nulle part`, () => {
      const hits = files.filter(f => fs.readFileSync(f, "utf8").includes(stale))
        .map(f => path.relative(ROOT, f));
      expect(hits, `Valeur périmée « ${stale} » trouvée dans : ${hits.join(", ")}`).toEqual([]);
    });
  }
});
