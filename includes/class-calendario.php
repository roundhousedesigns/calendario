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
	 * Menu icon SVG encoded in base64.
	 */
	const MENU_ICON = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAwMHB4IiBoZWlnaHQ9IjIwMDBweCIgdmlld0JveD0iMCAwIDIwMDAgMjAwMCIgdmVyc2lvbj0iMS4xIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xNDI4LjA5IDk1NC42ODFMMTMzNi41OCA4NjMuMTVMOTE1LjI3IDEyODQuNTRMNzMyLjI0MyAxMTAxLjQ4TDY0MC43MyAxMTkzLjAxTDkxNS4yNyAxNDY3LjZMMTQyOC4wOSA5NTQuNjgxTDE0MjguMDkgOTU0LjY4MVpNMTY0MS4zMyAyNTguN0wxNTU1IDI1OC43TDE1NTUgODZMMTM4Mi4zMyA4NkwxMzgyLjMzIDI1OC43TDY5MS42NjcgMjU4LjdMNjkxLjY2NyA4Nkw1MTkgODZMNTE5IDI1OC43TDQzMi42NjcgMjU4LjdDMzM2LjgzNyAyNTguNyAyNjAuODYzIDMzNi40MTUgMjYwLjg2MyA0MzEuNEwyNjAgMTY0MC4zQzI2MCAxNzM1LjI5IDMzNi44MzcgMTgxMyA0MzIuNjY3IDE4MTNMMTY0MS4zMyAxODEzQzE3MzYuMyAxODEzIDE4MTQgMTczNS4yOSAxODE0IDE2NDAuM0wxODE0IDQzMS40QzE4MTQgMzM2LjQxNSAxNzM2LjMgMjU4LjcgMTY0MS4zMyAyNTguN0wxNjQxLjMzIDI1OC43Wk0xNjQxLjMzIDE2NDAuM0w0MzIuNjY3IDE2NDAuM0w0MzIuNjY3IDY5MC40NUwxNjQxLjMzIDY5MC40NUwxNjQxLjMzIDE2NDAuM0wxNjQxLjMzIDE2NDAuM1oiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9Im5vbmUiIC8+Cjwvc3ZnPg==';

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

		// React interface.
		add_action( $enqueue_hook, array( $this, 'load_react_app__premium_only' ) );

		// Menu items and admin pages.
		add_action( 'admin_menu', array( $this, 'create_admin_pages' ) );

		// Default status colors.
		add_action( 'init', array( $this, 'set_default_status_colors' ) );
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
			wp_enqueue_style( 'calendario-' . $index, RHD_CALENDARIO_REACT_APP_BUILD . $css_file, array(), RHD_CALENDARIO_PLUGIN_VERSION );
		}

		// Load js files.
		foreach ( $js_files as $index => $js_file ) {
			$handle = 'calendario-' . $index;
			wp_enqueue_script( $handle, RHD_CALENDARIO_REACT_APP_BUILD . $js_file, array(), RHD_CALENDARIO_PLUGIN_VERSION, true );
		}

		// Variables for app use - These variables will be available in window.rhdReactPlugin variable.
		wp_localize_script(
			'calendario-1',
			'rhdReactPlugin',
			array(
				'appSelector'         => $this->selector,
				'version'             => RHD_CALENDARIO_PLUGIN_VERSION,
				'adminUrl'            => admin_url(),
				'pluginUrl'           => RHD_CALENDARIO_PLUGIN_DIR_BASE_URL,
				'trashUrl'            => admin_url( 'edit.php?post_status=trash&post_type=post' ),
				'tz'                  => wp_timezone_string(),
				'user'                => get_current_user_id(),
				'nonce'               => wp_create_nonce( 'wp_rest' ),
				'routeBase'           => get_rest_url( null, sprintf( 'calendario/%s', RHD_CALENDARIO_REST_VERSION ) ),
				'postAuthors'         => rhd_prepare_post_authors(),
				'postStatuses'        => rhd_prepare_post_statuses(),
				'defaultStatusColors' => rhd_post_status_default_color_pairs(),
				'presetStatusColors'  => RHD_POST_STATUS_SWATCHES,
			)
		);
	}

	/**
	 * Creates the pages and menu items.
	 *
	 * @return void
	 */
	public function create_admin_pages() {
		/**
		 * Main page and top-level menu registration.
		 */
		add_menu_page( 'Editorial Calendar.io', 'Calendar.io', 'edit_others_posts', 'calendario', array( $this, 'calendario_page_main' ), self::MENU_ICON, 8 );
	}

	/**
	 * Prints the main workspace. Tasty!
	 *
	 * @return void
	 */
	public function calendario_page_main() {
		include_once RHD_CALENDARIO_PLUGIN_DIR_BASE . 'includes/template.php';
	}

	/**
	 * Get app entry points assets files.
	 *
	 * @return array|void
	 */
	private function get_assets_files() {
		error_log( home_url );
		// Request manifest file.
		$request = wp_remote_get( esc_url_raw( RHD_CALENDARIO_MANIFEST_URL ), array(
			'headers' => array(
				'origin' => home_url(),
			),
		) );

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
