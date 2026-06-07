import { describe, it, expect } from "vitest";
import { GUIDES, GUIDES_BY_SLUG } from "./guides.js";
import { GLOSSARY_BY_SLUG } from "./glossaire.js";
import { ROUTE_META } from "../../api/_routes.js";

describe("guides", () => {
  it("a des slugs uniques et les champs requis", () => {
    const slugs = GUIDES.map(g => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const g of GUIDES) {
      expect(g.title).toBeTruthy();
      expect(g.intro).toBeTruthy();
      expect(Array.isArray(g.sections) && g.sections.length > 0).toBe(true);
      expect(g.sims.length).toBeGreaterThan(0);
    }
  });

  it("ne référence que des simulateurs existants", () => {
    for (const g of GUIDES) {
      for (const path of g.sims) {
        expect(ROUTE_META[path], `${g.slug} → simulateur inconnu: ${path}`).toBeTruthy();
      }
    }
  });

  it("ne référence que des termes du lexique existants", () => {
    for (const g of GUIDES) {
      for (const slug of g.terms || []) {
        expect(GLOSSARY_BY_SLUG[slug], `${g.slug} → terme inconnu: ${slug}`).toBeTruthy();
      }
    }
  });

  it("expose un index par slug", () => {
    expect(Object.keys(GUIDES_BY_SLUG).length).toBe(GUIDES.length);
  });
});
