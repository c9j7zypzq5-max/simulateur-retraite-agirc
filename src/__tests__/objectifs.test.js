import { describe, it, expect } from "vitest";
import { OBJECTIFS, OBJECTIFS_BY_SLUG } from "../data/objectifs.js";
import { EN_PATH_MAP, EN_ROUTES } from "../i18n/paths.js";
import { ROUTE_META } from "../../api/_meta.js";
import { ROUTE_META_EN, EN_ROUTES as EN_ROUTES_BUILD } from "../../api/_routes.js";
import { SEO_CONTENT, SEO_CONTENT_EN } from "../../api/_seo.js";

const parcoursRoutes = [
  '/objectifs',
  ...OBJECTIFS.flatMap(o => [`/objectifs/${o.slug}`, `/objectifs/${o.slug}/synthese`]),
];

describe("données des parcours par objectif", () => {
  it("expose 3 objectifs complets en FR et EN", () => {
    expect(OBJECTIFS).toHaveLength(3);
    for (const o of OBJECTIFS) {
      for (const loc of ['fr', 'en']) {
        const c = o[loc];
        for (const champ of ['label', 'tagline', 'title', 'metaDescription', 'h1', 'syntheseTitle', 'syntheseMetaDescription', 'syntheseH1', 'syntheseIntro']) {
          expect(c[champ], `${o.slug}.${loc}.${champ}`).toBeTruthy();
        }
        expect(c.intro.length).toBeGreaterThanOrEqual(2);
      }
      expect(o.steps.length).toBeGreaterThanOrEqual(3);
      for (const s of o.steps) {
        expect(s.fr.title && s.en.title, `${o.slug} ${s.route}`).toBeTruthy();
        expect(typeof s.prefill).toBe('function');
      }
    }
  });

  it("résout les slugs FR et EN", () => {
    expect(OBJECTIFS_BY_SLUG['preparer-ma-retraite']).toBe(OBJECTIFS_BY_SLUG['prepare-my-retirement']);
    expect(OBJECTIFS_BY_SLUG['inconnu']).toBeUndefined();
  });

  it("chaque étape pointe vers un simulateur existant (ROUTE_META)", () => {
    for (const o of OBJECTIFS) {
      for (const s of o.steps) {
        expect(ROUTE_META[s.route], `${o.slug} → ${s.route}`).toBeDefined();
      }
    }
  });

  it("prefill ne renvoie que les valeurs saisies (ou null si rien)", () => {
    const retraite = OBJECTIFS_BY_SLUG['preparer-ma-retraite'];
    expect(retraite.steps[0].prefill({})).toBeNull();
    expect(retraite.steps[0].prefill({ salaire: 3000 })).toEqual({ salaire: 3000 });
    expect(retraite.steps[0].prefill({ salaire: 3000, ageDepart: 64 }))
      .toEqual({ salaire: 3000, 'ageDépart': 64 });
    // PER : revenu annuel dérivé du salaire mensuel
    expect(retraite.steps[2].prefill({ salaire: 3000 })).toEqual({ revenu: 36000 });
  });

  it("le versement du parcours placement se déduit du passage budget", () => {
    const placement = OBJECTIFS_BY_SLUG['faire-fructifier-mon-argent'];
    const results = { '/simulateurs/budget': { params: { revenus: 2500, fixe: 1200, variable: 700 } } };
    expect(placement.steps[1].prefill({}, results)).toEqual({ versement: 600 });
  });
});

describe("câblage SEO / prerender des parcours", () => {
  it("chaque page du parcours est dans ROUTE_META (prerender + sitemap FR)", () => {
    for (const r of parcoursRoutes) expect(ROUTE_META[r], r).toBeDefined();
  });

  it("chaque page du parcours a un contenu SEO FR et EN (h1 + intro)", () => {
    for (const r of parcoursRoutes) {
      expect(SEO_CONTENT[r]?.h1, `FR ${r}`).toBeTruthy();
      expect(SEO_CONTENT[r]?.intro, `FR ${r}`).toBeTruthy();
      expect(SEO_CONTENT_EN[r]?.h1, `EN ${r}`).toBeTruthy();
      expect(SEO_CONTENT_EN[r]?.intro, `EN ${r}`).toBeTruthy();
    }
  });

  it("chaque page du parcours est câblée côté EN (routes, chemins, méta)", () => {
    for (const r of parcoursRoutes) {
      expect(EN_ROUTES.has(r), `EN_ROUTES client ${r}`).toBe(true);
      expect(EN_PATH_MAP[r], `EN_PATH_MAP ${r}`).toMatch(/^\/goals/);
      expect(EN_ROUTES_BUILD.includes(r), `EN_ROUTES build ${r}`).toBe(true);
      expect(ROUTE_META_EN[r]?.title, `ROUTE_META_EN ${r}`).toBeTruthy();
      expect(ROUTE_META_EN[r]?.description, `ROUTE_META_EN ${r}`).toBeTruthy();
    }
  });

  it("les slugs EN de EN_PATH_MAP correspondent aux enSlug déclarés", () => {
    for (const o of OBJECTIFS) {
      expect(EN_PATH_MAP[`/objectifs/${o.slug}`]).toBe(`/goals/${o.enSlug}`);
      expect(EN_PATH_MAP[`/objectifs/${o.slug}/synthese`]).toBe(`/goals/${o.enSlug}/summary`);
    }
  });
});
