import { describe, it, expect } from "vitest";
import fr from "./fr.js";
import en from "./en.js";

// Règle i18n du projet : toute clé de libellé partagé existe en FR ET en EN.
const keys = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? keys(v, `${p}${k}.`) : [`${p}${k}`]));

describe("dictionnaires i18n", () => {
  it("fr.js et en.js ont exactement les mêmes clés", () => {
    const f = new Set(keys(fr)), e = new Set(keys(en));
    expect([...f].filter(k => !e.has(k))).toEqual([]);
    expect([...e].filter(k => !f.has(k))).toEqual([]);
  });
});
