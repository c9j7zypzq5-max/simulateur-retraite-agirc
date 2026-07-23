import { describe, it, expect } from 'vitest';
import { jsStringForScript } from './share.js';

describe('jsStringForScript (durcissement XSS de la preview sociale)', () => {
  it('neutralise une tentative de fermeture de balise <script>', () => {
    const payload = '/foo</script><img src=x onerror=alert(1)>';
    const out = jsStringForScript(payload);
    // Aucun « < » ni « > » brut ne subsiste : le parseur HTML ne peut plus
    // fermer la balise <script> ni ouvrir une nouvelle balise.
    expect(out).not.toMatch(/[<>]/);
    expect(out).toContain('\\u003c');
    expect(out).toContain('\\u003e');
  });

  it("reste une chaîne JS valide qui redonne la valeur d'origine", () => {
    const dest = 'https://www.simfinly.com/simulateurs/cnav?s=abc';
    expect(eval(jsStringForScript(dest))).toBe(dest);
  });

  it('gère les guillemets et backslashes sans casser', () => {
    const dest = 'https://www.simfinly.com/x?q="a"\\b';
    expect(eval(jsStringForScript(dest))).toBe(dest);
  });
});
