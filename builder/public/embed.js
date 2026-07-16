// Script d'intégration Simfinly Builder — une ligne côté client :
//   <script src="https://app.simfinly.com/embed.js" data-slug="mon-calculateur"></script>
// Injecte une iframe responsive juste après la balise <script> elle-même.
// Volontairement minimal : pas de dépendance, pas de style injecté dans le
// DOM hôte (isolation totale, cf. plan produit).
(function () {
  var script = document.currentScript;
  if (!script) return;
  var slug = script.getAttribute('data-slug');
  if (!slug) return;

  var origin = new URL(script.src).origin;
  var iframe = document.createElement('iframe');
  iframe.src = origin + '/s/' + encodeURIComponent(slug);
  iframe.width = '100%';
  iframe.height = script.getAttribute('data-height') || '560';
  iframe.style.border = 'none';
  iframe.style.maxWidth = '100%';
  iframe.loading = 'lazy';
  iframe.title = 'Calculateur Simfinly';

  script.parentNode.insertBefore(iframe, script.nextSibling);
})();
