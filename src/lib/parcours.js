// État du parcours guidé par objectif — sessionStorage uniquement (pas de
// backend) : le parcours survit aux navigations et au refresh, mais pas à la
// fermeture de l'onglet. Voir src/data/objectifs.js pour la définition des
// parcours eux-mêmes.
//
// Forme stockée : { slug, answers: {…}, results: { [routeCanonique]: { name,
// highlight, params, savedAt } } }

import { useSyncExternalStore, useEffect } from 'react';
import { OBJECTIFS_BY_SLUG } from '../data/objectifs.js';
import { encodeParams } from '../hooks/useShareableUrl.js';
import { canonicalPath, localePath, EN_ROUTES } from '../i18n/paths.js';

const KEY = 'simfinly_parcours_v1';
const EVENT = 'simfinly-parcours-change';

let _cache = null; // { raw, parsed } — getSnapshot doit renvoyer une référence stable

function read() {
  let raw = null;
  try { raw = sessionStorage.getItem(KEY); } catch { /* stockage indisponible */ }
  if (_cache && _cache.raw === raw) return _cache.parsed;
  let parsed;
  try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }
  if (parsed && !OBJECTIFS_BY_SLUG[parsed.slug]) parsed = null;
  _cache = { raw, parsed };
  return parsed;
}

function write(state) {
  try {
    if (state) sessionStorage.setItem(KEY, JSON.stringify(state));
    else sessionStorage.removeItem(KEY);
  } catch { /* stockage indisponible : le parcours marche en dégradé */ }
  _cache = null;
  window.dispatchEvent(new Event(EVENT));
}

export function getParcours() { return read(); }

export function startParcours(slug, answers = {}) {
  const objectif = OBJECTIFS_BY_SLUG[slug];
  if (!objectif) return;
  // Repartir d'un parcours existant sur le même objectif conserve les résultats.
  const prev = read();
  const results = prev && prev.slug === objectif.slug ? prev.results : {};
  write({ slug: objectif.slug, answers, results });
}

export function quitParcours() { write(null); }

// Capture le résultat courant d'un simulateur si celui-ci est une étape du
// parcours actif. Appelé depuis ShareBar (présent sur tous les simulateurs) :
// aucun simulateur n'a besoin d'être modifié individuellement.
export function captureParcoursResult(pathname, { name, params, highlight }) {
  const state = read();
  if (!state) return;
  const objectif = OBJECTIFS_BY_SLUG[state.slug];
  const route = canonicalPath(pathname);
  if (!objectif.steps.some(s => s.route === route)) return;
  if (!highlight || !highlight.value || highlight.value === '—') return;
  const prev = state.results[route];
  const entry = { name, highlight, params };
  if (prev && JSON.stringify({ name: prev.name, highlight: prev.highlight, params: prev.params }) === JSON.stringify(entry)) return;
  write({ ...state, results: { ...state.results, [route]: { ...entry, savedAt: Date.now() } } });
}

// URL d'une étape : route localisée (EN si disponible, sinon FR — même repli
// que <LocaleLink>) + préremplissage ?s= compris par readShareParams().
export function stepHref(objectif, stepIndex, locale, state) {
  const step = objectif.steps[stepIndex];
  const path = locale === 'en' && EN_ROUTES.has(step.route) ? localePath(step.route, 'en') : step.route;
  let prefill = null;
  try { prefill = step.prefill(state?.answers || {}, state?.results || {}); } catch { /* préremplissage best-effort */ }
  return prefill ? `${path}?s=${encodeParams(prefill)}` : path;
}

export function syntheseHref(objectif, locale) {
  return locale === 'en' ? `/en/goals/${objectif.enSlug}/summary` : `/objectifs/${objectif.slug}/synthese`;
}

export function objectifHref(objectif, locale) {
  return locale === 'en' ? `/en/goals/${objectif.enSlug}` : `/objectifs/${objectif.slug}`;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function subscribe(cb) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

// Parcours actif (ou null), réactif aux changements.
export function useParcours() {
  return useSyncExternalStore(subscribe, read, () => null);
}

// Branché une seule fois dans ShareBar : capture le résultat affiché
// (report.highlight) quand la page est une étape du parcours actif.
export function useParcoursCapture({ name, params, report }) {
  const json = JSON.stringify({ name, params, highlight: report?.highlight ?? null });
  useEffect(() => {
    const { name: n, params: p, highlight } = JSON.parse(json);
    if (!n || !highlight) return;
    captureParcoursResult(window.location.pathname, { name: n, params: p, highlight });
  }, [json]);
}
