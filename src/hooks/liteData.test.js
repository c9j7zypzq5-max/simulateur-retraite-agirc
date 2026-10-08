import { describe, it, expect } from "vitest";
import * as glossaire from "../data/glossaire.js";
import * as glossaireLite from "virtual:glossaire-lite";
import * as guides from "../data/guides.js";
import * as guidesLite from "virtual:guides-lite";
import * as metiers from "../data/metiers.js";
import * as metiersLite from "virtual:metiers-lite";

// Les index allégés (vite.config.js) sont dérivés des modules complets : ils
// doivent rester fidèles, sinon infobulles, auto-liaison et liens du pied de
// page divergeraient des pages du lexique / des guides.
describe("modules de données allégés", () => {
  it("glossaire : mêmes matchers d'auto-liaison que le module complet", () => {
    expect(glossaireLite.TERM_MATCHERS).toEqual(glossaire.TERM_MATCHERS);
  });

  it("glossaire : mêmes champs d'index pour chaque terme", () => {
    expect(glossaireLite.GLOSSARY).toHaveLength(glossaire.GLOSSARY.length);
    for (const t of glossaire.GLOSSARY) {
      const l = glossaireLite.GLOSSARY_BY_SLUG[t.slug];
      expect(l).toBeTruthy();
      for (const k of ["term", "full", "short", "aliases", "sims", "category"]) expect(l[k]).toEqual(t[k]);
    }
  });

  it("glossaire allégé nettement plus léger que le complet", () => {
    expect(JSON.stringify(glossaireLite.GLOSSARY).length).toBeLessThan(JSON.stringify(glossaire.GLOSSARY).length / 3);
  });

  it("guides : slug, titre, icône et simulateurs liés conservés", () => {
    expect(guidesLite.GUIDES.map(g => [g.slug, g.title, g.icon, g.sims])).toEqual(guides.GUIDES.map(g => [g.slug, g.title, g.icon, g.sims]));
  });

  it("métiers : slug, icône et titre conservés, dans le même ordre", () => {
    expect(metiersLite.METIERS_LIST.map(m => [m.slug, m.icon, m.title])).toEqual(metiers.METIERS_LIST.map(m => [m.slug, m.icon, m.title]));
  });
});
