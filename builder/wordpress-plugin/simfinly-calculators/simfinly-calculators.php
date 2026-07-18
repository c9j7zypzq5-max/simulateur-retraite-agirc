<?php
/**
 * Plugin Name:       Simfinly Calculators
 * Plugin URI:        https://app.simfinly.com
 * Description:       Intègre vos calculateurs et simulateurs Simfinly dans une page ou un article via un shortcode ou un bloc. Embed a Simfinly calculator with a shortcode or block.
 * Version:           1.0.0
 * Requires at least: 5.6
 * Requires PHP:      7.2
 * Author:            Simfinly
 * Author URI:        https://www.simfinly.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       simfinly-calculators
 *
 * Usage: [simfinly slug="mon-calculateur" height="560"]
 * Le slug est celui affiché dans l'éditeur Simfinly au moment de publier
 * (app.simfinly.com/s/<slug>).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Accès direct interdit.
}

/**
 * Origine du service Simfinly. Surchargée si besoin via le filtre
 * `simfinly_origin` (utile pour un environnement de préproduction).
 */
function simfinly_origin() {
	return apply_filters( 'simfinly_origin', 'https://app.simfinly.com' );
}

/**
 * Rendu du shortcode [simfinly].
 *
 * Attributs :
 *  - slug   (obligatoire) : identifiant du calculateur publié.
 *  - height (optionnel)   : hauteur de l'iframe en pixels (défaut 560).
 *  - title  (optionnel)   : titre accessible de l'iframe.
 *
 * @param array $atts Attributs du shortcode.
 * @return string HTML de l'iframe, ou chaîne vide si le slug est invalide.
 */
function simfinly_render_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'slug'   => '',
			'height' => '560',
			'title'  => 'Calculateur Simfinly',
		),
		$atts,
		'simfinly'
	);

	// Slug : uniquement minuscules, chiffres et tirets (même forme que
	// lib/slug.ts côté application). Neutralise toute tentative d'injection.
	$slug = preg_replace( '/[^a-z0-9\-]/', '', strtolower( (string) $atts['slug'] ) );
	if ( '' === $slug ) {
		return '';
	}

	$height = absint( $atts['height'] );
	if ( $height < 120 || $height > 2000 ) {
		$height = 560;
	}

	$src = trailingslashit( simfinly_origin() ) . 's/' . rawurlencode( $slug );

	return sprintf(
		'<iframe src="%1$s" width="100%%" height="%2$d" style="border:none;max-width:100%%" loading="lazy" title="%3$s"></iframe>',
		esc_url( $src ),
		$height,
		esc_attr( $atts['title'] )
	);
}
add_shortcode( 'simfinly', 'simfinly_render_shortcode' );

/**
 * Bloc Gutenberg minimal adossé au shortcode : l'éditeur de blocs propose
 * « Simfinly Calculator » et les auteurs saisissent le slug + la hauteur.
 * Enregistré côté serveur (render via le shortcode) — aucun build JS requis.
 */
function simfinly_register_block() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return; // WordPress < 5.0 : le shortcode reste disponible.
	}

	wp_register_script(
		'simfinly-block',
		plugins_url( 'block.js', __FILE__ ),
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		'1.0.0',
		true
	);

	register_block_type(
		'simfinly/calculator',
		array(
			'editor_script'   => 'simfinly-block',
			'attributes'      => array(
				'slug'   => array( 'type' => 'string', 'default' => '' ),
				'height' => array( 'type' => 'number', 'default' => 560 ),
			),
			'render_callback' => 'simfinly_render_block',
		)
	);
}
add_action( 'init', 'simfinly_register_block' );

/**
 * Rendu serveur du bloc : délègue au shortcode pour une source unique.
 *
 * @param array $attributes Attributs du bloc.
 * @return string HTML de l'iframe.
 */
function simfinly_render_block( $attributes ) {
	return simfinly_render_shortcode(
		array(
			'slug'   => isset( $attributes['slug'] ) ? $attributes['slug'] : '',
			'height' => isset( $attributes['height'] ) ? $attributes['height'] : 560,
		)
	);
}
