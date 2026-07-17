import { describe, it, expect } from 'vitest';
import { isUuid, esc, buildEmail } from './notify.js';

describe('api/notify helpers', () => {
  it('isUuid : accepte un UUID v4, rejette tout le reste (dont les injections PostgREST)', () => {
    expect(isUuid('a3f1c2d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d')).toBe(true);
    expect(isUuid('')).toBe(false);
    expect(isUuid(undefined)).toBe(false);
    expect(isUuid(42)).toBe(false);
    // Un id non contraint serait interpolé dans l'URL PostgREST (id=eq.<id>).
    expect(isUuid('x&notified_at=is.not.null')).toBe(false);
  });

  it('buildEmail : échappe le titre saisi par l\'utilisateur', () => {
    const { subject, html } = buildEmail('<script>alert(1)</script>', 'lead@exemple.fr', '2026-07-17T10:00:00Z');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(subject).toContain('Nouveau contact');
    expect(html).toContain('lead@exemple.fr');
  });

  it('buildEmail : sans email capturé, sujet et corps neutres', () => {
    const { subject, html } = buildEmail('Devis travaux', null, '2026-07-17T10:00:00Z');
    expect(subject).toContain('Nouvelle simulation');
    expect(html).toContain('Un visiteur');
  });

  it('esc : neutralise les caractères HTML', () => {
    expect(esc('a<b>&"\'')).toBe('a&lt;b&gt;&amp;&quot;&#39;');
  });
});
