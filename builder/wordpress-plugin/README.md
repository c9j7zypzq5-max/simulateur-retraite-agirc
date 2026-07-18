# Plugin WordPress — Simfinly Calculators

Intègre un calculateur Simfinly publié dans WordPress via un shortcode
`[simfinly slug="..."]` ou le bloc « Simfinly Calculator ».

## Contenu

```
simfinly-calculators/
  simfinly-calculators.php   Plugin principal (shortcode + bloc, rendu serveur)
  block.js                   UI du bloc Gutenberg (JS sans build)
  readme.txt                 Fiche au format WordPress.org
```

Le rendu réel (iframe vers `app.simfinly.com/s/<slug>`) est produit côté
serveur par le shortcode ; le bloc délègue au shortcode (source unique). Aucun
build n'est nécessaire — `block.js` utilise `wp.element` directement.

## Packager pour distribution

```bash
cd builder/wordpress-plugin
zip -r simfinly-calculators.zip simfinly-calculators
```

Le `.zip` s'installe via **Extensions → Ajouter → Téléverser** dans WordPress,
ou peut être soumis au répertoire WordPress.org (le `readme.txt` est déjà au
bon format).

## Configuration avancée

L'origine du service (par défaut `https://app.simfinly.com`) est surchargeable
via le filtre `simfinly_origin` — utile pour une préproduction :

```php
add_filter( 'simfinly_origin', function () {
    return 'https://staging.simfinly.com';
} );
```
