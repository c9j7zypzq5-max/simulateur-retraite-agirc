import { describe, it, expect } from "vitest";
import { structuredData, ogImageForRoute } from "./_routes.js";

const types = arr => arr.map(d => d["@type"]);

describe("structuredData", () => {
  it("génère DefinedTerm + fil d'Ariane pour une fiche du lexique", () => {
    const data = structuredData("/lexique/taeg");
    expect(types(data)).toContain("DefinedTerm");
    expect(types(data)).toContain("BreadcrumbList");
    const term = data.find(d => d["@type"] === "DefinedTerm");
    expect(term.name).toBe("TAEG");
    expect(term.url).toBe("https://www.simfinly.com/lexique/taeg");
  });

  it("renvoie [] pour un slug de lexique inconnu", () => {
    expect(structuredData("/lexique/inexistant")).toEqual([]);
  });

  it("génère un Article pour un article de blog avec métadonnées", () => {
    const data = structuredData("/blog/mon-article", {
      title: "Mon article", description: "Intro", publishedAt: "2026-01-01T00:00:00Z", image: "https://x/y.jpg",
    });
    const article = data.find(d => d["@type"] === "Article");
    expect(article).toBeTruthy();
    expect(article.headline).toBe("Mon article");
    expect(article.datePublished).toBe("2026-01-01T00:00:00Z");
    expect(article.image).toBe("https://x/y.jpg");
  });

  it("n'émet pas d'Article sans titre", () => {
    expect(structuredData("/blog/sans-titre")).toEqual([]);
  });

  it("génère WebApplication pour un simulateur", () => {
    const data = structuredData("/simulateurs/ptz");
    expect(types(data)).toContain("WebApplication");
    expect(types(data)).toContain("BreadcrumbList");
  });

  it("ne génère rien pour la home", () => {
    expect(structuredData("/")).toEqual([]);
  });
});

describe("ogImageForRoute", () => {
  it("renvoie l'og:image de la catégorie pour un simulateur retraite", () => {
    expect(ogImageForRoute("/simulateurs/cnav")).toBe("/og-retraite.png");
  });
  it("retombe sur l'image par défaut pour une route sans catégorie", () => {
    expect(ogImageForRoute("/lexique/taeg")).toBe("/og-image.png");
  });
});
