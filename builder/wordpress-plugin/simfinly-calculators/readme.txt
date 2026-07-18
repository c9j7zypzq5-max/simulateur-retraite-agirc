=== Simfinly Calculators ===
Contributors: simfinly
Tags: calculator, simulator, embed, leads, finance
Requires at least: 5.6
Tested up to: 6.7
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Intégrez vos calculateurs et simulateurs Simfinly dans WordPress, via un shortcode ou un bloc. Embed your Simfinly calculators in WordPress.

== Description ==

Simfinly (app.simfinly.com) permet de créer des calculateurs de devis et
simulateurs financiers à vos couleurs, sans code. Ce plugin les intègre dans
vos pages et articles WordPress.

Deux méthodes :

* **Shortcode** : `[simfinly slug="mon-calculateur"]`
* **Bloc** : ajoutez le bloc « Simfinly Calculator » dans l’éditeur, saisissez
  le slug.

Le slug est celui affiché dans l’éditeur Simfinly au moment de publier
(l’URL publique est `app.simfinly.com/s/<slug>`).

Le calculateur est chargé dans une iframe responsive : aucune donnée de vos
visiteurs ne transite par votre serveur WordPress, et l’affichage suit le
thème que vous avez défini dans Simfinly.

== Installation ==

1. Téléversez le dossier `simfinly-calculators` dans `/wp-content/plugins/`,
   ou installez le plugin via le menu Extensions de WordPress.
2. Activez le plugin.
3. Dans une page ou un article, ajoutez le shortcode
   `[simfinly slug="votre-slug"]` ou le bloc « Simfinly Calculator ».

== Frequently Asked Questions ==

= Où trouver le slug de mon calculateur ? =

Dans l’éditeur Simfinly, après avoir publié votre calculateur : le lien public
se termine par `/s/<slug>`. C’est ce `<slug>` qu’il faut renseigner.

= Puis-je changer la hauteur ? =

Oui : `[simfinly slug="..." height="700"]`, ou via le réglage « Hauteur » du
bloc.

== Changelog ==

= 1.0.0 =
* Version initiale : shortcode `[simfinly]` et bloc « Simfinly Calculator ».
