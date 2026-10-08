import { describe, it, expect } from "vitest";
import fs from "node:fs";
import sitemap from "../../api/sitemap.js";
import { CH_ROUTES, BE_ROUTES, LU_ROUTES, QC_ROUTES, EN_ROUTES, COUNTRY_ONLY_ROUTES, localizedHref, isRouteAvailableIn } from "../i18n/paths.js";
import { navGroupsFor } from "../components/Navbar.jsx";
import { RECOMMENDATIONS } from "../data/recommendations.js";

// Routes réellement servies par React Router, extraites de App.jsx. Une URL
// absente de cette liste rend la page 404 (soft 404 + noindex côté client).
const APP_SRC = fs.readFileSync(new URL("../App.jsx", import.meta.url), "utf8");
const APP_ROUTES = [...APP_SRC.matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]).filter(p => p !== "*");
const ROUTE_RES = APP_ROUTES.map(p => new RegExp("^" + p.replace(/:[a-z]+/gi, "[^/]+") + "$"));
const isAppRoute = (url) => ROUTE_RES.some(re => re.test(url.split(/[?#]/)[0]));

async function sitemapUrls(section) {
  let body = "";
  const res = { setHeader() {}, status() { return this; }, send(b) { body = b; }, end(b) { body = b || ""; } };
  await sitemap({ query: { section } }, res);
  return [...body.matchAll(/<loc>https:\/\/www\.simfinly\.com([^<]*)<\/loc>/g)].map(m => m[1] || "/");
}

const CONTEXTS = ["/", "/simulateurs/epargne", "/en/simulators/savings", "/be/simulateurs/epargne", "/ch/simulateurs/epargne", "/lu/simulateurs/epargne", "/qc/simulateurs/epargne"];

describe("intégrité des routes", () => {
  it.each(["static", "blog", "lexique", "guides", "i18n"])("chaque URL du sitemap (%s) correspond à une route", async (section) => {
    const missing = (await sitemapUrls(section)).filter(u => !isAppRoute(u));
    expect(missing).toEqual([]);
  });

  it("chaque route pays existe sous son préfixe", () => {
    const missing = [];
    for (const [prefix, set] of [["ch", CH_ROUTES], ["be", BE_ROUTES], ["lu", LU_ROUTES], ["qc", QC_ROUTES]]) {
      for (const r of set) {
        const url = r.startsWith(`/${prefix}/`) ? r : r === "/" ? `/${prefix}` : `/${prefix}${r}`;
        if (!isAppRoute(url)) missing.push(url);
      }
    }
    expect(missing).toEqual([]);
  });

  it("les simulateurs propres à un pays n'ont pas de route racine", () => {
    for (const [route, country] of Object.entries(COUNTRY_ONLY_ROUTES)) {
      expect(isAppRoute(route)).toBe(false);
      expect(isAppRoute(`/${country}${route}`)).toBe(true);
    }
  });

  it("tout lien de menu ou de recommandation se résout vers une route existante, dans chaque contexte", () => {
    const targets = new Set(Object.values(RECOMMENDATIONS).flat().map(r => r.to));
    for (const ctx of CONTEXTS) {
      for (const g of navGroupsFor(ctx.startsWith("/en") ? "en" : "fr", ctx.split("/")[1])) {
        for (const i of g.items) targets.add(i.path);
      }
    }
    const broken = [];
    for (const ctx of CONTEXTS) {
      for (const to of targets) {
        const href = localizedHref(to, ctx);
        if (!isAppRoute(href)) broken.push(`${ctx} → ${to} ⇒ ${href}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("chaque menu ne propose que des simulateurs disponibles dans son contexte", () => {
    const offending = [];
    for (const ctx of CONTEXTS) {
      const locale = ctx.startsWith("/en") ? "en" : "fr";
      for (const g of navGroupsFor(locale, ctx.split("/")[1])) {
        for (const i of g.items) if (!isRouteAvailableIn(i.path, ctx)) offending.push(`${ctx}: ${i.path}`);
      }
    }
    expect(offending).toEqual([]);
  });
});

describe("localizedHref", () => {
  it("préfixe selon le pays quand la route y existe", () => {
    expect(localizedHref("/simulateurs/epargne", "/be/simulateurs/fire")).toBe("/be/simulateurs/epargne");
    expect(localizedHref("/simulateurs/epargne", "/lu")).toBe("/lu/simulateurs/epargne");
  });

  it("retombe sur la version FR quand la route n'existe pas dans le pays", () => {
    expect(localizedHref("/simulateurs/ptz", "/be/simulateurs/fire")).toBe("/simulateurs/ptz");
  });

  it("traduit le segment anglais", () => {
    expect(localizedHref("/simulateurs/cnav", "/en")).toBe("/en/simulators/french-pension");
  });

  it("garde le préfixe d'un simulateur propre à un pays, depuis n'importe quel contexte", () => {
    expect(localizedHref("/simulateurs/impot-revenu-lu", "/simulateurs/retraite-luxembourg")).toBe("/lu/simulateurs/impot-revenu-lu");
    expect(localizedHref("/simulateurs/impot-revenu-lu", "/en/simulators/luxembourg-pension")).toBe("/lu/simulateurs/impot-revenu-lu");
    expect(localizedHref("/simulateurs/impot-revenu-qc", "/qc/simulateurs/retraite-quebec")).toBe("/qc/simulateurs/impot-revenu-qc");
  });

  it("isRouteAvailableIn tient compte de la langue et du pays", () => {
    expect(isRouteAvailableIn("/simulateurs/ptz", "/be/simulateurs/fire")).toBe(false);
    expect(isRouteAvailableIn("/simulateurs/epargne", "/en")).toBe(EN_ROUTES.has("/simulateurs/epargne"));
    expect(isRouteAvailableIn("/simulateurs/impot-revenu-lu", "/simulateurs/cnav")).toBe(false);
  });
});
