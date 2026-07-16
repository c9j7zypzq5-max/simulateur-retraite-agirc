import { describe as vdescribe, it, expect } from 'vitest';
import { esc, describe as ogDescribe } from './meta.js';

vdescribe('api/meta helpers', () => {
  it('esc neutralise une tentative d\'injection dans le titre', () => {
    const out = esc('Prêt "><script>alert(1)</script> & \'co\'');
    expect(out).not.toContain('<script>');
    expect(out).not.toContain('">');
    expect(out).toBe('Prêt &quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt; &amp; &#39;co&#39;');
  });

  it('describe : dérive des libellés de résultats, tronqué à 3', () => {
    const calc = { schema: { results: [{ label: 'Mensualité' }, { label: 'Coût total' }, { label: 'Intérêts' }, { label: 'Assurance' }] } };
    const d = ogDescribe(calc);
    expect(d).toContain('mensualité');
    expect(d).toContain('coût total');
    expect(d).toContain('intérêts');
    expect(d).not.toContain('assurance'); // 4e ignoré
  });

  it('describe : générique si pas de résultats', () => {
    expect(ogDescribe(null)).toMatch(/Simfinly/);
    expect(ogDescribe({ schema: { results: [] } })).toMatch(/Simfinly/);
  });
});
