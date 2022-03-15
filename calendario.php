<?php
/**
 * Plugin Name:    Calendar.io
 * Description:    The professional editorial calendar for WordPress.
 * Author:         Roundhouse Designs
 * Author URI:     https://roundhouse-designs.com
 * Text Domain:    rhd
 * Version:        1.0.1-dev
 *
 * @package       calendario
 *
 * phpcs:disable WordPress.Arrays.ArrayKeySpacingRestrictions.NoSpacesAroundArrayKeys
 */

/**
 * Paths.
 */
define( 'RHD_CALENDARIO_PLUGIN_VERSION', '1.0.1-dev' );
define( 'RHD_CALENDARIO_PLUGIN_DIR_BASE', plugin_dir_path( __FILE__ ) );
define( 'RHD_CALENDARIO_PLUGIN_DIR_BASE_URL', plugin_dir_url( __FILE__ ) );

// Load JS interface locally.
// define( 'RHD_CALENDARIO_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) . 'app/' );
// define( 'RHD_CALENDARIO_REACT_APP_BUILD', RHD_CALENDARIO_PLUGIN_DIR_URL . 'build/' );

// Load JS interface from CloudFlare Pages (CI/CD).
define( 'RHD_CALENDARIO_REACT_APP_BUILD', 'https://calendario.roundhouse-designs.com/' );

/**
 * Base configuration.
 */
define( 'RHD_CALENDARIO_REST_VERSION', 'v1' );
define( 'RHD_CALENDARIO_MANIFEST_URL', RHD_CALENDARIO_REACT_APP_BUILD . 'asset-manifest.json' );
define( 'RHD_WP_DATE_FORMAT', 'Y-m-d H:i:s' );
define( 'RHD_UNSCHEDULED_INDEX_META_KEY', 'rhd_unscheduled' );
define( 'RHD_POST_STATUS_COLOR_OPTION_KEY', 'rhd_calendario_post_statuses' );
define(
	'RHD_POST_STATUS_DEFAULT_COLORS',
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
 * Freemius integration.
 */
require_once plugin_dir_path( __FILE__ ) . '/integration.php';

/**
 * Functions
 */
require_once plugin_dir_path( __FILE__ ) . 'includes/utils.php';

/**
 * Endpoints
 */
require_once plugin_dir_path( __FILE__ ) . 'includes/class-calendario-route.php';

/**
 * Calling the plugin class with parameters.
 */
function rhd_load_calendario() {
	// Loading the app in WordPress admin main screen.
	new Calendario( 'admin_enqueue_scripts', 'toplevel_page_calendario', false, '#calendario' );
	new Calendario_Route();
}
add_action( 'init', 'rhd_load_calendario' );

/**
 * Activation hook.
 */
function rhd_calendario_plugin_activation() {
	rhd_set_post_status_colors();
}
register_activation_hook( __FILE__, 'rhd_calendario_plugin_activation' );

/**
 * Registers the plugin icon.
 */
function rhd_calendario_plugin_icon() {
	return plugin_dir_path( __FILE__ ) . '/assets/icon-256x256.png';
}
rhd_cal()->add_filter( 'plugin_icon', 'rhd_calendario_plugin_icon' );

/**
 * Fire it up.
 */
require_once plugin_dir_path( __FILE__ ) . '/includes/class-calendario.php';
