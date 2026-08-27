import { describe, it, expect } from "vitest";
import { GLOSSARY, TERM_MATCHERS as MATCHERS_SOURCE } from "./glossaire.js";
import { GUIDES } from "./guides.js";
import { METIERS_LIST } from "./metiers.js";
import { GLOSSARY_INDEX, GLOSSARY_INDEX_BY_SLUG, TERM_MATCHERS } from "./glossaireIndex.js";
import { GUIDES_INDEX } from "./guidesIndex.js";
import { METIERS_INDEX } from "./metiersIndex.js";
import { INDEX_FIELDS, pick } from "../../scripts/generate-data-indexes.mjs";

// Les trois index sont générés depuis leur source (npm run gen:indexes).
// Ces tests échouent si quelqu'un modifie une source sans régénérer : sans eux,
// les infobulles, l'auto-liaison et les blocs de liens du Footer serviraient
// silencieusement des données périmées sur tout le site.

const CAS = [
  { nom: "glossaire", source: GLOSSARY, index: GLOSSARY_INDEX, champs: INDEX_FIELDS.glossaire },
  { nom: "guides", source: GUIDES, index: GUIDES_INDEX, champs: INDEX_FIELDS.guides },
  { nom: "metiers", source: METIERS_LIST, index: METIERS_INDEX, champs: INDEX_FIELDS.metiers },
];

describe.each(CAS)("index $nom", ({ source, index, champs }) => {
  it("contient les mêmes entrées, dans le même ordre", () => {
    expect(index.map(e => e.slug)).toEqual(source.map(e => e.slug));
  });

  it("reproduit fidèlement les champs conservés", () => {
    expect(index).toEqual(source.map(e => pick(e, champs)));
  });

  it("n'embarque aucun champ hors de la liste retenue", () => {
    for (const e of index) {
      for (const champ of Object.keys(e)) {
        expect(champs, `${e.slug} → champ inattendu « ${champ} »`).toContain(champ);
      }
    }
  });

  it("reste nettement plus léger que sa source", () => {
    const poids = o => JSON.stringify(o).length;
    expect(poids(index)).toBeLessThan(poids(source) * 0.5);
  });
});

describe("glossaireIndex — usages transverses", () => {
  it("produit les mêmes matchers d'auto-liaison que la source", () => {
    expect(TERM_MATCHERS).toEqual(MATCHERS_SOURCE);
  });

  it("expose une entrée indexée pour chaque slug", () => {
    for (const t of GLOSSARY) {
      expect(GLOSSARY_INDEX_BY_SLUG[t.slug], `slug manquant : ${t.slug}`).toBeTruthy();
    }
  });

  it("porte les champs dont dépendent Terme et le Footer", () => {
    for (const t of GLOSSARY_INDEX) {
      expect(typeof t.term, `${t.slug} → term`).toBe("string");
      expect(typeof t.full, `${t.slug} → full`).toBe("string");
      expect(typeof t.short, `${t.slug} → short`).toBe("string");
    }
  });
});

describe("guidesIndex — bloc « guides associés » du Footer", () => {
  it("porte un nom d'icône lucide, pas un emoji", () => {
    // Le Footer affichait {g.emoji}, champ absent de toutes les entrées : le
    // bloc rendait une puce vide. Il lit désormais `icon`.
    for (const g of GUIDES_INDEX) {
      expect(g.emoji, `${g.slug} → emoji ne doit pas exister`).toBeUndefined();
      expect(typeof g.icon, `${g.slug} → icon`).toBe("string");
    }
  });

  it("conserve les simulateurs liés, qui pilotent le filtrage", () => {
    const avecSims = GUIDES_INDEX.filter(g => Array.isArray(g.sims) && g.sims.length > 0);
    expect(avecSims.length).toBeGreaterThan(0);
  });
});

describe("metiersIndex — liste de la page d'accueil", () => {
  it("porte de quoi rendre une puce : slug, icône et titre", () => {
    for (const m of METIERS_INDEX) {
      expect(typeof m.slug, "slug").toBe("string");
      expect(typeof m.title, `${m.slug} → title`).toBe("string");
      expect(typeof m.icon, `${m.slug} → icon`).toBe("string");
    }
  });
});
