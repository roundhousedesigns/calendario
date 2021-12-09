<?php
/**
 * Core plugin functionality.
 *
 * Activation, deactivation, enqueue.
 *
 * @package calendario
 */

/**
 * Class Calendario.
 */
class Calendario {
	/**
	 * Load to hook in admin load. If front end pass empty string.
	 *
	 * @var string
	 */
	private $limit_load_hook = '';

	/**
	 * Limit load by callback result.- If back end send false.
	 *
	 * @var bool|string
	 */
	private $limit_callback = '';

	/**
	 * Calendario constructor.
	 *
	 * @param string      $enqueue_hook    Hook to enqueue scripts.
	 * @param string      $limit_load_hook Limit load to hook in admin load. If front end pass empty string.
	 * @param bool|string $limit_callback  Limit load by callback result. If back end send false.
	 * @param string      $css_selector    Css selector to render app.
	 */
	public function __construct( $enqueue_hook, $limit_load_hook, $limit_callback = false, $css_selector ) {
		$this->selector        = $css_selector;
		$this->limit_load_hook = $limit_load_hook;
		$this->limit_callback  = $limit_callback;

		// Check for pretty permalinks, and alert if not set.
		if ( ! get_option( 'permalink_structure' ) ) {
			add_action( 'admin_notices', array( $this, 'notice_pretty_permalinks' ) );
		}

		add_action( $enqueue_hook, array( $this, 'load_react_app__premium_only' ) );

		// wp-admin interface.
		add_action( 'admin_menu', array( $this, 'create_plugin_page' ) );

		// TODO Create settings page (roadmap).
	}

	/**
	 * Prints a notice with a link to enable Pretty Permalinks.
	 */
	public function notice_pretty_permalinks() {
		printf(
			'<div class="notice error"><p>%s %s</p></div>',
			esc_html__( 'Editorial Calendar.io requires pretty permalinks to be set. Please set any permalink structure other than "Plain" to avoid unexpected behavior.' ),
			'<a href="' . esc_url( admin_url( '/options-permalink.php' ) ) . '">Settings->Permalinks</a>'
		);
	}

	/**
	 * Load react app files in WordPress admin.
	 *
	 * @param string $hook The admin page hook.
	 * @return void
	 */
	public function load_react_app__premium_only( $hook ) {
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

		$js_files = array_filter(
			$assets_files,
			function ( $file_string ) {
				return pathinfo( $file_string, PATHINFO_EXTENSION ) === 'js';
			}
		);

		$css_files = array_filter(
			$assets_files,
			function ( $file_string ) {
				return pathinfo( $file_string, PATHINFO_EXTENSION ) === 'css';
			}
		);

		// Load css files.
		foreach ( $css_files as $index => $css_file ) {
			wp_enqueue_style( 'react-plugin-' . $index, RHD_CALENDARIO_REACT_APP_BUILD . $css_file, array(), RHD_CALENDARIO_PLUGIN_VERSION );
		}

		// Load js files.
		foreach ( $js_files as $index => $js_file ) {
			$handle = 'react-plugin-' . $index;
			wp_enqueue_script( $handle, RHD_CALENDARIO_REACT_APP_BUILD . $js_file, array(), RHD_CALENDARIO_PLUGIN_VERSION, true );
		}

		// Variables for app use - These variables will be available in window.rhdReactPlugin variable.
		wp_localize_script(
			'react-plugin-0',
			'rhdReactPlugin',
			array(
				'appSelector'         => $this->selector,
				'adminUrl'            => admin_url(),
				'pluginUrl'           => RHD_CALENDARIO_PLUGIN_DIR_BASE_URL,
				'postsUrl'            => admin_url( 'edit.php?post_type=post' ),
				'trashUrl'            => admin_url( 'edit.php?post_status=trash&post_type=post' ),
				'user'                => get_current_user_id(),
				'nonce'               => wp_create_nonce( 'wp_rest' ),
				'routeBase'           => get_rest_url( null, sprintf( 'calendario/%s', RHD_CALENDARIO_REST_VERSION ) ),
				'defaultStatusColors' => rhd_post_status_default_color_pairs(),
				'presetStatusColors'  => RHD_POST_STATUS_SWATCHES,
			)
		);
	}

	/**
	 * Creates the submenu!
	 *
	 * @return void
	 */
	public function create_plugin_page() {
		add_submenu_page( 'edit.php', 'Editorial Calendar.io', 'Calendar.io', 'manage_options', 'calendario', array( $this, 'calendario_page' ) );
	}

	/**
	 * Creates the settings page!
	 *
	 * @return void
	 */
	public function create_settings_page() {
		add_submenu_page( 'options-general.php', 'Editorial Calendar.io Settings', 'Calendario.io Settings', 'manage_options', 'calendario', array( $this, 'calendario_settings_page' ) );
	}

	/**
	 * Prints the main workspace. Tasty!
	 *
	 * @return void
	 */
	public function calendario_page() {
		include_once RHD_CALENDARIO_PLUGIN_DIR_BASE . 'pages/main.php';
	}

	/**
	 * The settings page.
	 */
	public function calendario_settings_page() {
		include_once RHD_CALENDARIO_PLUGIN_DIR_BASE . 'pages/settings.php';
	}

	/**
	 * Get app entry points assets files.
	 *
	 * @return array|void
	 */
	private function get_assets_files() {
		// Request manifest file.
		$request  = wp_remote_get( RHD_CALENDARIO_MANIFEST_URL );
		$response = wp_remote_retrieve_body( $request );

		// If the remote request fails.
		if ( ! $request || ! $request ) {
			return false;
		}

		// Convert json to php array.
		$files_data = json_decode( $response );
		if ( null === $files_data ) {
			return;
		}

		// No entry points found.
		if ( ! property_exists( $files_data, 'entrypoints' ) ) {
			return false;
		}

		return $files_data->entrypoints;
	}
}
