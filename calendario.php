<?php
/**
 * Plugin Name:     Calendario II: The Datening
 * Description:     The newer, fancier Calendario. IN DEVELOPMENT.
 * Author:          Roundhouse Designs
 * Author URI:      https://roundhouse-designs.com
 * Text Domain:     rhd
 * Version:         0.1.0
 *
 * @package         calendario
 */

// Setting react app path constants.
define( 'RHD_CALENDARIO_PLUGIN_VERSION', '0.1.0' );
define( 'RHD_CALENDARIO_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) . 'app/' );
define( 'RHD_CALENDARIO_REACT_APP_BUILD', RHD_CALENDARIO_PLUGIN_DIR_URL . 'build/' );
define( 'RHD_CALENDARIO_MANIFEST_URL', RHD_CALENDARIO_REACT_APP_BUILD . 'asset-manifest.json' );
define( 'RHD_UNSCHEDULED_META_KEY', 'rhd_unscheduled' );

/**
 * Functions
 */
include plugin_dir_path( __FILE__ ) . 'includes/utils.php';

/**
 * Endpoints
 */
include plugin_dir_path( __FILE__ ) . 'includes/class-calendario-route.php';

/**
 * Calling the plugin class with parameters.
 */
function rhd_load_plugin() {
	// Loading the app in WordPress admin main screen.
	new Calendario( 'admin_enqueue_scripts', 'posts_page_calendario', false, '#calendario' );

	new Calendario_Route();
}
add_action( 'init', 'rhd_load_plugin' );

/**
 * Class Calendario.
 */
class Calendario {

	/**
	 * @var string
	 */
	private $selector = '';
	/**
	 * @var string
	 */
	private $limit_load_hook = '';
	/**
	 * @var bool|string
	 */
	private $limit_callback = '';

	/**
	 * Calendario constructor.
	 *
	 * @param string $enqueue_hook Hook to enqueue scripts.
	 * @param string $limit_load_hook Limit load to hook in admin load. If front end pass empty string.
	 * @param bool|string $limit_callback Limit load by callback result. If back end send false.
	 * @param string $css_selector Css selector to render app.
	 */
	function __construct( $enqueue_hook, $limit_load_hook, $limit_callback = false, $css_selector ) {
		$this->selector        = $css_selector;
		$this->limit_load_hook = $limit_load_hook;
		$this->limit_callback  = $limit_callback;

		add_action( $enqueue_hook, [$this, 'load_react_app'] );

		// wp-admin interface
		add_action( 'admin_menu', [$this, 'create_plugin_page'] );
	}

	/**
	 * Load react app files in WordPress admin.
	 *
	 * @param $hook
	 *
	 * @return bool|void
	 */
	function load_react_app( $hook ) {
		// Limit app load in admin by admin page hook.
		$is_main_dashboard = $hook === $this->limit_load_hook;

		if ( ! $is_main_dashboard && is_bool( $this->limit_callback ) ) {
			return;
		}

		// Limit app load in front end by callback.
		$limit_callback = $this->limit_callback;
		if ( is_string( $limit_callback ) && ! $limit_callback() ) {
			return;
		}

		// Get assets links.
		$assets_files = $this->get_assets_files();

		$js_files  = array_filter( $assets_files, fn( $file_string ) => pathinfo( $file_string, PATHINFO_EXTENSION ) === 'js' );
		$css_files = array_filter( $assets_files, fn( $file_string ) => pathinfo( $file_string, PATHINFO_EXTENSION ) === 'css' );

		// Load css files.
		foreach ( $css_files as $index => $css_file ) {
			wp_enqueue_style( 'react-plugin-' . $index, RHD_CALENDARIO_REACT_APP_BUILD . $css_file );
		}

		// Load js files.
		foreach ( $js_files as $index => $js_file ) {
			$handle = 'react-plugin-' . $index;
			wp_enqueue_script( $handle, RHD_CALENDARIO_REACT_APP_BUILD . $js_file, array(), RHD_CALENDARIO_PLUGIN_VERSION, true );
		}

		// Variables for app use - These variables will be available in window.rhdReactPlugin variable.
		wp_localize_script( 'react-plugin-0', 'rhdReactPlugin',
			array(
				'appSelector' => $this->selector,
				'restBase'    => get_rest_url( null, 'calendario/v1/posts' ),
			)
		);
	}

	/**
	 * create_plugin_page function. Creates the submenu!
	 *
	 * @access public
	 *
	 * @return void
	 */
	function create_plugin_page() {
		add_submenu_page( 'edit.php', 'Calendario', 'Calendario', 'manage_options', 'calendario', array( $this, 'calendario_page' ) );
	}

	/**
	 * calendario_page function. Prints the main workspace. Tasty!
	 *
	 * @return void
	 */
	public function calendario_page() {
		include_once plugin_dir_path( __FILE__ ) . 'templates/main.php';
	}

	/**
	 * Get app entry points assets files.
	 *
	 * @return array|void
	 */
	private function get_assets_files() {
		// Request manifest file.
		$request = file_get_contents( RHD_CALENDARIO_MANIFEST_URL );

		// If the remote request fails.
		if ( ! $request ) {
			return false;
		}

		// Convert json to php array.
		$files_data = json_decode( $request );
		if ( $files_data === null ) {
			return;
		}

		// No entry points found.
		if ( ! property_exists( $files_data, 'entrypoints' ) ) {
			return false;
		}

		return $files_data->entrypoints;
	}
}