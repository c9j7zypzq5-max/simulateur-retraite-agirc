# i18n — fondations

Préparation à l'internationalisation, **sans changer le comportement actuel**
(le site reste 100 % français). Conçu pour survivre à une future migration de
framework (Astro) : aucune dépendance lourde, simples modules JS.

## Comment ça marche

- `config.js` — locale par défaut (`fr`), liste des `LOCALES` actives, et
  `localeFromPath()` (déduit la locale du 1er segment d'URL).
- `fr.js` — dictionnaire français, **source de vérité** des libellés UI partagés.
- `index.js` — `useTranslation()` → `t('nav.blog')`. Replis : locale → fr → clé.

```jsx
import { useTranslation } from '../i18n/index.js';
const { t } = useTranslation();
<Link to="/blog">{t('nav.blog')}</Link>
```

## Stratégie d'URL

Sous-chemin par locale : le français à la racine (`/blog`), les autres langues
préfixées (`/en/blog`). Le routing par préfixe sera branché lors de la migration.

## Ajouter une langue (ex. anglais)

1. Créer `src/i18n/en.js` en répliquant la structure de `fr.js`.
2. L'enregistrer dans `DICTIONARIES` (`index.js`) et l'ajouter à `LOCALES`
   (`config.js`).
3. La plomberie **hreflang** (`api/_routes.js → hreflangLinks`) s'active alors
   automatiquement au build (dormante tant qu'il n'y a qu'une langue).
4. Brancher le routing par préfixe `/en/...` (phase migration).

## État

Pilote migré : `Footer.jsx` (libellés de navigation, titres de sections,
mention légale). Les autres composants seront migrés progressivement.
