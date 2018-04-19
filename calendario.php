<?php
/*
Plugin Name: Calendario
Plugin URI: https://roundhouse-designs.com/calendario
Description: The professional blogger's editorial calendar for WordPress.
Version: 0.1dev
Requires PHP: 5.6
Requires at least: 4.7
Text Domain: rhd
Author: Roundhouse Designs
Author URI: https://roundhouse-designs.com
*/


// Version control
define ( 'RHD_CALENDARIO_VERSION', '0.1dev' );


/* ==========================================================================
	Core
   ========================================================================== */

if ( !class_exists( 'RHD_Calendario' ) ) {

	/**
	 * RHD_Calendario class.
	 */
	class RHD_Calendario // implements RHD_Calendario
	{
		const RHD_DATE_FORMAT = 'Y-m-d H:i:s';

		private static $instance = null;
		private $plugin_meta;
		
		
		/**
		 * get_instance function. This either instantiates the class or retrieves the object.
		 *  This class exists as a single object and cannot be re-instantiated.
		 * 
		 * @access public
		 * @static
		 * @return RHD_Calendario
		 */
		static function get_instance() {
			if ( self::$instance == null ) {
				self::$instance = new self;
			}
			
			return self::$instance;
		}
		
		
		/**
		 * __construct function. Fires on class instantiation.
		 * 
		 * @access public
		 * @return void
		 */
		private function __construct() {
			include_once( 'includes/class-calendario-server.php' );
			
			add_action( 'admin_enqueue_scripts', array( $this, 'assets' ) );
			add_action( 'admin_menu', array( $this, 'create_plugin_page' ) );
			
			// Post Meta Boxes
			// TODO: Add support for other post types
			add_action( 'add_meta_boxes_post', array( $this, 'calendario_add_meta_boxes' ) );
			add_action( 'save_post', array( $this, 'calendario_save_meta_boxes_data' ) );
			
			// Label Taxonomy
			add_action( 'init', array( $this, 'calendario_register_labels_taxonomy' ) );
		}
		
		
		static function plugin_activation() {
			// On plugin activate
		}
		
		
		static function plugin_deactivation() {
			// On plugin deactivate
		}
		
		
		/**
		 * log_error_message function. Prints a WP_Error string.
		 * 
		 * @access public
		 * @param mixed $result
		 * @return void
		 */
		public function log_error_message( $result ) {
			$error_string = 'Calendario ' . RHD_CALENDARIO_VERSION . ':  ';
			
			if ( is_wp_error( $result ) ) {
				$error_string .= $result->get_error_message();
			} elseif ( is_string( $result ) ) {
				$error_string .= $result;
			} elseif ( is_array( $result ) ) {
				ob_start();
				print_r( $result );
				$error_string .= ob_get_clean();
			}
			
			// Print to log
			error_log( $error_string );
		}
		
		
		/**
		 * format_post_title_display function. Decodes and formats post titles for display.
		 * 
		 * @access public
		 * @param string $title The post title
		 * @return string The prepared post title
		 */
		public function format_post_title_display( string $title ) {
			return html_entity_decode( $title, ENT_QUOTES );
		}
		
		
		/**
		 * format_post_date function. Formats a time string into RHD_DATE_FORMAT.
		 * 
		 * @access public
		 * @param string $date
		 * @return array [0] => formatted time, [1] => formatted time (GMT), or array() on null
		 */
		public function format_post_date( $date ) {
			if ( ! $date )
				return;
			
			$time = new DateTime( $date );
			$time_gmt = new DateTime( $date );
			$time_gmt->setTimezone( new DateTimeZone('GMT') );
			
			$time_formatted = array(
				$time->format( self::RHD_DATE_FORMAT ),
				$time_gmt->format( self::RHD_DATE_FORMAT )
			);
			
			// DEBUG
			// self::log_error_message( $time_formatted );
			
			return $time_formatted;
		}
		
		
		/**
		 * assets function. Registers external stylesheets and scripts!
		 * 
		 * @access public
		 * @return void
		 */
		public function assets() {
			// CSS
			wp_enqueue_style( 'google-fonts', '//fonts.googleapis.com/css?family=Josefin+Slab:600|Oswald:400,600' );
			wp_enqueue_style( 'fullcalendar', plugins_url( 'node_modules/fullcalendar/dist/fullcalendar.css', __FILE__ ) );
			wp_enqueue_style( 'vex', plugins_url( 'node_modules/vex-js/dist/css/vex.css', __FILE__ ) );
			wp_enqueue_style( 'vex-theme', plugins_url( 'node_modules/vex-js/dist/css/vex-theme-flat-attack.css', __FILE__ ) );
			wp_enqueue_style( 'fullcalendar', plugins_url( 'css/fullcalendar/fullcalendar.css', __FILE__ ) );
			wp_enqueue_style( 'calendario', plugins_url( 'css/main.css', __FILE__ ) );
			
			// JS
			//wp_register_script( 'jquery-rhd', plugins_url( 'node_modules/jquery/dist/jquery.min.js', __FILE__ ), array(), '3.3.1', true );
			wp_register_script( 'moment', plugins_url( 'node_modules/moment/moment.js', __FILE__ ), array(), '2.19.3', true );
			wp_register_script( 'fullcalendar', plugins_url( 'node_modules/fullcalendar/dist/fullcalendar.js', __FILE__ ), array( 'jquery', 'moment' ), '3.7.0', true );
			wp_register_script( 'vex', plugins_url( 'node_modules/vex-js/dist/js/vex.combined.min.js', __FILE__ ), array(), '4.0.1', true );
			
			wp_enqueue_script( 'calendario', plugins_url( 'js/calendario.js', __FILE__ ), array( 'jquery', 'jquery-ui-draggable','moment', 'fullcalendar', 'vex' ), RHD_CALENDARIO_VERSION, true );
			wp_enqueue_script( 'calendario-modals', plugins_url( 'js/calendario-modals.js', __FILE__ ), array( 'jquery', 'jquery-ui-draggable', 'moment', 'fullcalendar', 'calendario' ), null, true );
			wp_enqueue_script( 'calendario-view', plugins_url( 'js/calendario-view.js', __FILE__ ), array( 'jquery', 'jquery-ui-draggable', 'moment', 'fullcalendar', 'calendario', 'calendario-modals' ), null, true );
			
			// noConflict mode for custom jQuery
			//wp_add_inline_script( 'jquery-rhd', 'var jQueryRHD = jQuery.noConflict(true);', 'after' );
			
			// Vex theme
			wp_add_inline_script( 'vex', "vex.defaultOptions.className = 'vex-theme-flat-attack';", 'after' );
			
			wp_localize_script( 'calendario', 'wpApiSettings', array(
				'homeUrl'	=> home_url( '/' ),
				'root' => esc_url_raw( rest_url() ),
				'nonce' => wp_create_nonce( 'wp_rest' )
			) );
		}
		
				
		/**
		 * create_plugin_page function. Creates the submenu!
		 * 
		 * @access public
		 * @return void
		 */
		public function create_plugin_page() {
			add_submenu_page( 'edit.php', 'Calendario', 'Calendario', 'manage_options', 'calendario', array( $this, 'calendario_page' ) );
		}
		
		
		/**
		 * calendario_add_meta_boxes function. Adds meta boxes, man.
		 * 
		 * @access public
		 * @return void
		 */
		public function calendario_add_meta_boxes() {
			add_meta_box( 'calendario_schedule_draft', __( 'Unscheduled Draft', 'rhd' ), array( $this, 'build_schedule_draft_meta_box' ), 'post', 'side', 'high' );
		}
		
		
		function calendario_register_labels_taxonomy() {
			// TODO: Get selected post types from settings page for post_types array
			$post_types = array( 'post' );
			
			register_taxonomy( 'calendario_label', $post_types, array(
				'hierarchical'      => false,
				'public'            => true,
				'show_in_nav_menus' => false,
				'show_ui'           => false,
				'show_admin_column' => true,
				'query_var'         => true,
				'rewrite'           => true,
				'capabilities'      => array(
					'manage_terms'  => 'edit_posts',
					'edit_terms'    => 'edit_posts',
					'delete_terms'  => 'edit_posts',
					'assign_terms'  => 'edit_posts'
				),
				'labels'            => array(
					'name'                       => __( 'Calendario Label', 'rhd' ),
					'singular_name'              => _x( 'Calendario Labels', 'taxonomy general name', 'rhd' ),
					'search_items'               => __( 'Search Calendario Labels', 'rhd' ),
					'popular_items'              => __( 'Popular Calendario Labels', 'rhd' ),
					'all_items'                  => __( 'All Calendario Labels', 'rhd' ),
					'parent_item'                => __( 'Parent Calendario Labels', 'rhd' ),
					'parent_item_colon'          => __( 'Parent Calendario Labels:', 'rhd' ),
					'edit_item'                  => __( 'Edit Calendario Labels', 'rhd' ),
					'update_item'                => __( 'Update Calendario Labels', 'rhd' ),
					'add_new_item'               => __( 'New Calendario Label', 'rhd' ),
					'new_item_name'              => __( 'New Calendario Label', 'rhd' ),
					'separate_items_with_commas' => __( 'Separate Calendario Labels with commas', 'rhd' ),
					'add_or_remove_items'        => __( 'Add or remove Calendario Labels', 'rhd' ),
					'choose_from_most_used'      => __( 'Choose from the most used Calendario Labels', 'rhd' ),
					'not_found'                  => __( 'No Calendario Labels found.', 'rhd' ),
					'menu_name'                  => __( 'Calendario Labels', 'rhd' ),
				),
				'show_in_rest'      => true,
				'rest_base'         => 'calendario_label',
				'rest_controller_class' => 'WP_REST_Terms_Controller',
			) );
			
			// Built-in labels
			// TODO: Add/remove as many as a user wants? Maybe overkill?
			wp_insert_term( 'one', 'calendario_label' );
			wp_insert_term( 'two', 'calendario_label' );
			wp_insert_term( 'three', 'calendario_label' );
			wp_insert_term( 'four', 'calendario_label' );
			wp_insert_term( 'five', 'calendario_label' );
			wp_insert_term( 'six', 'calendario_label' );
		}
		
		
		/**
		 * build_schedule_draft_meta_box function.
		 * 
		 * @access public
		 * @param post $post The post object
		 * @return void
		 */
		public function build_schedule_draft_meta_box( $post ) {
			wp_nonce_field( basename( __FILE__ ), 'calendario_scheduled_draft_nonce' );
			
			$is_scheduled_draft = get_post_meta( $post->ID, '_unscheduled', true );
			
			echo "
				<p>
					<input type='checkbox' name='calendario-scheduled-draft' value='yes' " . checked( $is_scheduled_draft, 'yes', false ) . " /><label for='calendario-scheduled-draft'>Keep this post off the calendar.</label><br />
				</p>
				";
		}
		
		
		/**
		 * calendario_save_meta_boxes_data function. Saves or deletes data in Calendario meta boxes.
		 * 
		 * @access public
		 * @param mixed $post_id The post ID
		 * @return void
		 */
		public function calendario_save_meta_boxes_data( $post_id ) {
			// Verify meta box nonce
			if ( ! isset( $_POST['calendario_scheduled_draft_nonce'] ) || ! wp_verify_nonce( $_POST['calendario_scheduled_draft_nonce'], basename( __FILE__ ) ) ) {
				return;
			}
			
			// Check the user's permissions
			if ( ! current_user_can( 'edit_post', $post_id ) ){
				return;
			}
			
			if ( isset( $_POST['calendario-scheduled-draft'] ) ){
				// Sanitize string (because why not)
				$data = esc_attr( $_POST['calendario-scheduled-draft'] );
				
				// Save data
				update_post_meta( $post_id, '_unscheduled', $data );
			} else {
				// delete data
				delete_post_meta( $post_id, '_unscheduled' );
			}
		}
		
		
		/**
		 * calendario_page function. Prints the main workspace. Tasty!
		 * 
		 * @access public
		 * @return void
		 */
		public function calendario_page() {
			$this->plugin_meta = get_plugin_data( __FILE__, true, true );
			?>
			
			<div id="calendario">
				<header class="plugin-header">
					<h2 class="plugin-title"><?php echo $this->plugin_meta["Name"]; ?></h2>
				</header>
				
				<div id="calendario-workspace">
					<div id="editorial-calendar" class="editorial-calendar"></div>
					<div id="calendario-sidebar" class="calendario-sidebar">
						<div id="event-toggles" class="calendario-sidebar-container">
							<h4 class="calendario-sidebar-box-title">Filter by Status</h4>
							<div id="calendario-event-toggles" class="calendario-event-toggles calendario-sidebar-box">
								<ul class="toggles">
									<li class="event-toggle status-publish" data-status="publish">
										Published
									</li>
									<li class="event-toggle status-draft" data-status="draft">
										Drafts
									</li>
									<li class="event-toggle status-pending" data-status="pending">
										Pending
									</li>
									<li class="event-toggle status-future" data-status="future">
										Scheduled
									</li>
								</ul>
							</div>
						</div>
						<div id="calendario-drafts" class="calendario-sidebar-container">
							<h4 class="calendario-sidebar-box-title">Unscheduled Drafts</h4>
							<ul id="calendario-unscheduled-drafts" class="unscheduled-drafts-list calendario-sidebar-box"></ul>
						</div>
					</div>
				</div>
			</div>
			
			<?php
		}
				
		
		/**
		 * calendario_make_unscheduled_draft function. Adds the '_unscheduled' meta_key to the post to classify it as an Unscheduled Draft.
		 * 
		 * @access public
		 * @param int $post_id The post ID
		 * @return void
		 */
		public function calendario_make_unscheduled_draft( int $post_id ) {
			$result = update_post_meta( $post_id, '_unscheduled', 'yes' );
			
			// DEBUG
			// self::log_error_message( "Unscheduled: $result" );
			
			return $result;
		}
		
		
		/**
		 * calendario_remove_unscheduled function. Deletes the '_unscheduled' meta_key from the post.
		 * 
		 * @access public
		 * @param int $post_id The post ID
		 * @return void
		 */
		public function calendario_remove_unscheduled( int $post_id ) {
			$result = delete_post_meta( $post_id, '_unscheduled' );
			
			// DEBUG
			// self::log_error_message( "Scheduled: $result" );
			
			return $result;
		}
		
		
		/**
		 * update_post function. Updates post data requested by the Calendario page.
		 * 
		 * @access public
		 * @param int $post_id The post ID
		 * @param string $new_date The string containing the new post date
		 * @param string $post_status The post status
		 * @param string $post_title The 
		 * @return void
		 */
		public function update_post( int $post_id, string $new_date, string $post_status, string $post_title = null ) {
			// Exit if this is a trashed post
			if ( $post_status == 'trash' )
				return;
			
			$postdata = array(
				'ID'			=> $post_id,
				'post_status'	=> $post_status
			);
			
			if ( $post_title ) {
				$postdata['post_title'] = $post_title;
			}
			
			// Format the date, if supplied, otherwise skip setting the date.
			if ( $new_date ) {
				$date_formatted = self::format_post_date( $new_date );
				
				$postdata['post_date'] = $date_formatted[0];
				$postdata['post_date_gmt'] = $date_formatted[1];
			}
			
			// Set edit_date if this is a draft
			if ( $post_status == 'draft' ) {
				$postdata['edit_date'] = true;
			} else {
				$postdata['edit_date'] = false;
			}
			
			$post_clean = sanitize_post( $postdata, 'edit' );
			
			// Update the post
			$result = wp_update_post( $postdata, true );
			
			// Make sure this isn't an "unscheduled" draft
			if ( get_post_meta( $post_id, '_unscheduled', true ) ) {
				self::calendario_remove_unscheduled( $postdata['ID'] );
			}
			
			if ( is_wp_error( $result ) ) {
				self::log_error_message( $result );
			}
		}
		
		
		/**
		 * add_new_draft_post function. Adds a new draft post from the New Post modal dialog.
		 * 
		 * @access public
		 * @param string $post_title The post title
		 * @param string $post_date The post date
		 * @param string $post_status The post status
		 * @param string $post_content The post contnet
		 * @return string|WP_Error The post data array, WP_Error on fail
		 */
		public function add_new_draft_post( string $post_title, string $post_date, string $post_status, string $post_content ) {
			// Check for "unscheduled draft" status
			if ( $post_status == 'unsched' ) {
				$post_status = 'draft';
				$unsched = true;
				$post_date = '';
			} else {
				$unsched = false;
			}
			
			$date_formatted = self::format_post_date( $post_date );
			
			$postdata = array(
				'post_title'	=> $post_title,
				'post_date'		=> $date_formatted[0],
				'post_date_gmt'	=> $date_formatted[1],
				'post_status'	=> $post_status,
				'post_content'	=> $post_content,
				'edit_date'		=> true
			);
			
			// Sanitize
			$post_clean = sanitize_post( $postdata, 'edit' );
			
			// Add Post
			$result = wp_insert_post( $postdata, true );
			
			if ( ! is_wp_error( $result ) ) {
				// Add _unscheduled meta if requested
				if ( $unsched === true ) {
					self::calendario_make_unscheduled_draft( $result );
				}
				
				return array( 
					'post_id'		=> $result,
					'post_title'	=> self::format_post_title_display( $post_clean['post_title'] ),
					'post_date'		=> $date_formatted[0],
					'post_status'	=> $post_clean['post_status'],
					'_unsched'		=> $unsched
				);
			} else {
				self::log_error_message( $result );
				return false;
			}
		}
		
		
		/**
		 * unschedule_draft function. Adds post meta to set this post as an "Unscheduled Draft."
		 * 
		 * @access public
		 * @param int $post_id
		 * @param string $date The post_date value
		 * @return void
		 */
		public function unschedule_draft( int $post_id, string $date ) {
			$postdata = array(
				'ID'			=> $post_id,
				'post_status'	=> 'draft'
			);
			
			// Update the post
			$result = wp_update_post( $postdata, true );
			
			if ( is_wp_error( $result ) ) {
				self::log_error_message( $result );	
				return false;
			}
			
			self::calendario_make_unscheduled_draft( $postdata['ID'] );
		}
	}
}


/* ==========================================================================
	Fire it up...
   ========================================================================== */

register_activation_hook( __FILE__, array( 'RHD_Calendario', 'plugin_activation' ) );
register_deactivation_hook( __FILE__, array( 'RHD_Calendario', 'plugin_deactivation' ) );

RHD_Calendario::get_instance();