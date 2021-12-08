<?php
/**
 * Plugin Name:    Calendar.io
 * Description:    The professional editorial calendar for WordPress.
 * Author:         Roundhouse Designs
 * Author URI:     https://roundhouse-designs.com
 * Text Domain:    rhd
 * Version:        0.7.62
 *
 * @package       calendario
 *
 * phpcs:disable WordPress.Arrays.ArrayKeySpacingRestrictions.NoSpacesAroundArrayKeys
 */

/**
 * Paths
 */
define( 'RHD_CALENDARIO_PLUGIN_VERSION', '0.7.62' );
define( 'RHD_CALENDARIO_PLUGIN_DIR_BASE', plugin_dir_path( __FILE__ ) );
define( 'RHD_CALENDARIO_PLUGIN_DIR_BASE_URL', plugin_dir_url( __FILE__ ) );

// Load JS interface locally.
// phpcs:disable Squiz.Commenting.InlineComment.InvalidEndChar
// define( 'RHD_CALENDARIO_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) . 'app/' );
// define( 'RHD_CALENDARIO_REACT_APP_BUILD', RHD_CALENDARIO_PLUGIN_DIR_URL . 'build/' );

// Load JS interface from CloudFlare Pages (CI/CD).
define( 'RHD_CALENDARIO_REACT_APP_BUILD', 'https://calendario.roundhouse-designs.com/' );

// phpcs:enable Squiz.Commenting.InlineComment.InvalidEndChar

/**
 * Base configuration
 */
define( 'RHD_CALENDARIO_REST_VERSION', 'v1' );
define( 'RHD_CALENDARIO_MANIFEST_URL', RHD_CALENDARIO_REACT_APP_BUILD . 'asset-manifest.json' );
define( 'RHD_WP_DATE_FORMAT', 'Y-m-d H:i:s' );
define( 'RHD_UNSCHEDULED_INDEX_META_KEY', 'rhd_unscheduled' );
define( 'RHD_POST_STATUS_COLOR_OPTION_KEY', 'rhd_calendario_post_statuses' );
define(
	'RHD_POST_STATUS_SWATCHES',
	array(
		'#00A193',
		'#F7C900',
		'#B8B8B8',
		'#EB867B',
		'#252B6F',
		'#00A2ED',
		'#6C6C6C',
		'#F85A00',
		'#B90062',
		'#AA70BB',
	)
);

/**
 * Sets the default post status color key.
 */
function rhd_set_default_status_colors() {
	$statuses = array(
		'publish' => array(
			'name' => 'Published',
		),
		'future'  => array(
			'name' => 'Scheduled',
		),
		'draft'   => array(
			'name' => 'Draft',
		),
		'pending' => array(
			'name' => 'Pending Review',
		),
		'private' => array(
			'name' => 'Private',
		),
	);

	$i = 0;
	foreach ( array_keys( $statuses ) as $status ) {
		$statuses[$status]['color'] = RHD_POST_STATUS_SWATCHES[$i];
		$i++;
	}

	define( 'RHD_POST_STATUS_DEFAULTS', $statuses );
}
add_action( 'rhd_cal_loaded', 'rhd_set_default_status_colors' );

/**
 * Freemius integration
 */
if ( ! function_exists( 'rhd_cal' ) ) {
	/**
	 * Create a helper function for easy SDK access.
	 *
	 * @return Freemius The Freemius instance.
	 */
	function rhd_cal() {
		global $rhd_cal;

		if ( ! isset( $rhd_cal ) ) {
			// Include Freemius SDK.
			require_once dirname( __FILE__ ) . '/freemius/start.php';

			$rhd_cal = fs_dynamic_init(
				array(
					'id'               => '8136',
					'slug'             => 'calendario',
					'premium_slug'     => 'calendario',
					'type'             => 'plugin',
					'public_key'       => 'pk_0ceb9fcfae9cbd708428cd6126d45',
					'is_premium'       => true,
					'is_premium_only'  => true,
					'has_addons'       => false,
					'has_paid_plans'   => true,
					'is_org_compliant' => false,
					'trial'            => array(
						'days'               => 30,
						'is_require_payment' => false,
					),
					'menu'             => array(
						'slug'    => 'calendario',
						'support' => false,
						'parent'  => array(
							'slug' => 'edit.php',
						),
					),
				)
			);
		}

		return $rhd_cal;
	}

	// Init Freemius.
	rhd_cal();

	// Signal that SDK was initiated.
	do_action( 'rhd_cal_loaded' );
}

// phpcs:ignore Squiz.Commenting.FunctionComment.MissingParamTag
/**
 * Freemius customer messages.
 */
function rhd_cal_custom_connect_message_on_update( $message, $user_first_name, $plugin_title, $user_login, $site_link, $freemius_link ) {
	$updated_message = sprintf(
		/* Translators: %s: user first name, %s: plugin title, %s: user login, %s: site link, freemiums link */
		__( 'Hey %1$s' ) . ',<br>' . __( 'Never miss an important %2$s update! Opt-in to our security and feature updates notifications and non-sensitive diagnostic tracking with %5$s. If you skip this, that\'s okay! %2$s will totally work just fine. :)', 'calendario' ),
		$user_first_name,
		'<b>' . $plugin_title . '</b>',
		'<b>' . $user_login . '</b>',
		$site_link,
		$freemius_link
	);

	return $updated_message;
}
rhd_cal()->add_filter( 'connect_message_on_update', 'rhd_cal_custom_connect_message_on_update', 10, 6 );

/**
 * Functions
 */
require plugin_dir_path( __FILE__ ) . 'includes/functions.php';

/**
 * Endpoints
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-calendario-route.php';

/**
 * Calling the plugin class with parameters.
 */
function rhd_load_calendario_plugin() {
	// Loading the app in WordPress admin main screen.
	new Calendario( 'admin_enqueue_scripts', 'posts_page_calendario', false, '#calendario' );

	new Calendario_Route();
}
add_action( 'init', 'rhd_load_calendario_plugin' );

/**
 * Activation hook
 */
function rhd_calendario_plugin_activation() {
	rhd_set_post_status_colors();
}
register_activation_hook( __FILE__, 'rhd_calendario_plugin_activation' );

/**
 * Calendario
 */
require_once plugin_dir_path( __FILE__ ) . '/includes/class-calendario.php';
