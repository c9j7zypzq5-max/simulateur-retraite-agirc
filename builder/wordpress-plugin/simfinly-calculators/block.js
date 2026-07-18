/**
 * Bloc Gutenberg « Simfinly Calculator » — enregistrement côté client.
 * Rendu réel côté serveur (render_callback → shortcode) : ici on ne fournit
 * que l'UI d'édition (aperçu iframe + réglages slug/hauteur). Volontairement
 * en JS sans étape de build (wp.element.createElement), à l'image d'un plugin
 * WordPress classique.
 */
( function ( blocks, element, blockEditor, components, i18n ) {
	var el = element.createElement;
	var __ = i18n.__;
	var InspectorControls = blockEditor.InspectorControls;
	var useBlockProps = blockEditor.useBlockProps;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var RangeControl = components.RangeControl;
	var Placeholder = components.Placeholder;

	blocks.registerBlockType( 'simfinly/calculator', {
		title: __( 'Simfinly Calculator', 'simfinly-calculators' ),
		description: __( 'Intègre un calculateur Simfinly publié.', 'simfinly-calculators' ),
		icon: 'calculator',
		category: 'embed',
		attributes: {
			slug: { type: 'string', default: '' },
			height: { type: 'number', default: 560 },
		},
		edit: function ( props ) {
			var slug = props.attributes.slug;
			var height = props.attributes.height;
			var origin = 'https://app.simfinly.com';

			var controls = el(
				InspectorControls,
				{},
				el(
					PanelBody,
					{ title: __( 'Réglages', 'simfinly-calculators' ), initialOpen: true },
					el( TextControl, {
						label: __( 'Slug du calculateur', 'simfinly-calculators' ),
						help: __( 'Visible dans l’éditeur Simfinly au moment de publier.', 'simfinly-calculators' ),
						value: slug,
						onChange: function ( v ) {
							props.setAttributes( { slug: ( v || '' ).toLowerCase().replace( /[^a-z0-9-]/g, '' ) } );
						},
					} ),
					el( RangeControl, {
						label: __( 'Hauteur (px)', 'simfinly-calculators' ),
						value: height,
						min: 200,
						max: 1200,
						onChange: function ( v ) {
							props.setAttributes( { height: v } );
						},
					} )
				)
			);

			var preview = slug
				? el( 'iframe', {
						src: origin + '/s/' + encodeURIComponent( slug ),
						width: '100%',
						height: height,
						style: { border: 'none', maxWidth: '100%' },
						title: 'Calculateur Simfinly',
				  } )
				: el(
						Placeholder,
						{
							icon: 'calculator',
							label: __( 'Simfinly Calculator', 'simfinly-calculators' ),
							instructions: __( 'Saisissez le slug de votre calculateur dans les réglages du bloc.', 'simfinly-calculators' ),
						}
				  );

			return el( 'div', useBlockProps(), controls, preview );
		},
		save: function () {
			return null; // Rendu côté serveur (render_callback).
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );
