import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { FAQS } from "../data/faqs.js";

// Chaque simulateur importe ses seules FAQ via `virtual:faq:<route>` (voir
// vite.config.js). Une route mal orthographiée ou absente de data/faqs.js
// donnerait silencieusement une page sans FAQ (ni rich result FAQPage).
const sources = [
  ...fs.readdirSync(new URL("../pages/simulateurs/", import.meta.url)).map(f => new URL(`../pages/simulateurs/${f}`, import.meta.url)),
  new URL("../SimulateurRetraite.jsx", import.meta.url),
];
const imports = sources.flatMap(u => [...fs.readFileSync(u, "utf8").matchAll(/from ['"]virtual:faq:([^'"]+)['"]/g)].map(m => m[1]));

describe("FAQ par simulateur", () => {
  it("les simulateurs importent bien leurs FAQ par route", () => {
    expect(imports.length).toBeGreaterThan(40);
  });

  it.each(imports)("%s existe dans data/faqs.js et n'est pas vide", (route) => {
    expect(Array.isArray(FAQS[route])).toBe(true);
    expect(FAQS[route].length).toBeGreaterThan(0);
  });
});
