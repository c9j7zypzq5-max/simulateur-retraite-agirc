import { describe, it, expect } from "vitest";
import { GLOSSARY, GLOSSARY_BY_SLUG, TERM_MATCHERS, LEXIQUE_CATEGORIES } from "./glossaire.js";
import { ROUTE_META } from "../../api/_routes.js";

describe("glossaire", () => {
  it("a des slugs uniques", () => {
    const slugs = GLOSSARY.map(t => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("a les champs obligatoires sur chaque entrée", () => {
    for (const t of GLOSSARY) {
      expect(t.slug, `slug manquant`).toBeTruthy();
      expect(t.term, `term manquant pour ${t.slug}`).toBeTruthy();
      expect(t.full, `full manquant pour ${t.slug}`).toBeTruthy();
      expect(t.short, `short manquant pour ${t.slug}`).toBeTruthy();
      expect(Array.isArray(t.long) && t.long.length > 0, `long manquant pour ${t.slug}`).toBe(true);
      expect(LEXIQUE_CATEGORIES.includes(t.category), `catégorie inconnue: ${t.category}`).toBe(true);
    }
  });

  it("ne référence que des termes liés existants", () => {
    for (const t of GLOSSARY) {
      for (const slug of t.related || []) {
        expect(GLOSSARY_BY_SLUG[slug], `${t.slug} → related inconnu: ${slug}`).toBeTruthy();
      }
    }
  });

  it("ne pointe que vers des simulateurs existants", () => {
    for (const t of GLOSSARY) {
      for (const path of t.sims || []) {
        expect(ROUTE_META[path], `${t.slug} → simulateur inconnu: ${path}`).toBeTruthy();
      }
    }
  });

  it("trie les matchers par longueur décroissante (les expressions longues priment)", () => {
    for (let i = 1; i < TERM_MATCHERS.length; i++) {
      expect(TERM_MATCHERS[i - 1].match.length >= TERM_MATCHERS[i].match.length).toBe(true);
    }
  });

  it("associe chaque matcher à un slug valide", () => {
    for (const m of TERM_MATCHERS) {
      expect(GLOSSARY_BY_SLUG[m.slug]).toBeTruthy();
    }
  });
});
