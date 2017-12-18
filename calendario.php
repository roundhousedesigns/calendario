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
License: GPL3
License URI: https://www.gnu.org/licenses/gpl-3.0.html
*/

/* Copyright 2017 Roundhouse Designs (https://roundhouse-designs.com)
  Author - Nick Gaswirth (Roundhouse Designs)
  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
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
			include_once( 'includes/calendario-api.php' );
			
			add_action( 'admin_enqueue_scripts', array( $this, 'assets' ) );
			add_action( 'admin_menu', array( $this, 'create_plugin_page' ) );
			
			// Post Meta Boxes
			// TODO: Add support for other post types
			add_action( 'add_meta_boxes_post', array( $this, 'add_calendario_meta_boxes' ) );
			add_action( 'save_post', array( $this, 'save_calendario_meta_boxes_data' ) );
		}
		
		
		static function plugin_activation() {
			// On activate
		}
		
		
		static function plugin_deactivation() {
			// On deactivate
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
			
			error_log( $error_string );
		}
		
		
		/**
		 * format_post_date function. Formats a time string into RHD_DATE_FORMAT.
		 * 
		 * @access public
		 * @param string|null $date
		 * @return array [0] => formatted time, [1] => formatted time (GMT), or array() on null
		 */
		public function format_post_date( $date ) {
			if ( $date ) {
				$time = new DateTime( $date );
				$time_gmt = new DateTime( $date );
				$time_gmt->setTimezone( new DateTimeZone('GMT') );
				
				$time_formatted = array();
				
				return array(
					$time->format( self::RHD_DATE_FORMAT ),
					$time_gmt->format( self::RHD_DATE_FORMAT )
				);
			} else {
				return array();
			}
		}
		
		
		/**
		 * get_draft_post_date function. Gets the actual post_date value directly from the database to circumvent
		 *	WP default behavior, which sometimes shows today's date instead of draft's associated post_date.
		 * 
		 * @access public
		 * @param WP_Post $post The post object
		 * @return string The post_date value
		 */
		public function get_draft_post_date( WP_Post $post ) {			
			// Exit if we're not dealing with a draft.
			if ( get_post_status( $post ) != 'draft' )
				return;
			
			global $wpdb;
			
			$post_id = $post->ID;
			$date_array = $wpdb->get_results( 'SELECT post_date FROM ' . $wpdb->prefix . 'posts WHERE ID = ' . $post_id );
			
			return $date_array[0]->post_date;
		}
		
		
		/**
		 * assets function. Registers external stylesheets and scripts!
		 * 
		 * @access public
		 * @return void
		 */
		public function assets() {
			wp_register_style( 'google-fonts', '//fonts.googleapis.com/css?family=Josefin+Slab:600|Oswald:400,600' );
			wp_register_style( 'fullcalendar', plugin_dir_url( __FILE__ ) . 'node_modules/fullcalendar/dist/fullcalendar.css' );
			wp_register_style( 'calendario-admin', plugin_dir_url( __FILE__ ) . 'css/calendario-admin.css', array( 'google-fonts' ) );
			
			wp_register_script( 'moment', plugin_dir_url( __FILE__ ) . 'node_modules/moment/moment.js', array(), '2.19.3' );
			wp_register_script( 'fullcalendar', plugin_dir_url( __FILE__ ) . 'node_modules/fullcalendar/dist/fullcalendar.js', array( 'jquery', 'moment' ), '3.7.0' );
			wp_register_script( 'calendario-admin', plugin_dir_url( __FILE__ ) . 'js/calendario-admin.js', array( 'jquery', 'jquery-ui-draggable', 'fullcalendar' ), '0.1dev' );
			
			wp_localize_script( 'calendario-admin', 'wpApiSettings', array(
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
		 * add_calendario_meta_boxes function. Adds meta boxes, man.
		 * 
		 * @access public
		 * @return void
		 */
		public function add_calendario_meta_boxes() {
			add_meta_box( 'calendario_schedule_draft', __( 'Unscheduled Draft', 'rhd' ), array( $this, 'build_schedule_draft_meta_box' ), 'post', 'side', 'high' );
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
		 * save_calendario_meta_boxes_data function. Saves or deletes data in Calendario meta boxes.
		 * 
		 * @access public
		 * @param mixed $post_id The post ID
		 * @return void
		 */
		public function save_calendario_meta_boxes_data( $post_id ) {
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
			$this->plugin_meta = get_plugin_data( __FILE__, true, false );
			wp_enqueue_style( 'fullcalendar' );
			wp_enqueue_style( 'calendario-admin' );
			wp_enqueue_script( 'calendario-admin' );
			
				echo "
				<div id='calendario'>
					<header class='plugin-header'>
						<h2 class='plugin-title'>{$this->plugin_meta['Name']}</h2>
					</header>
					
					<div id='calendario-workspace'>
						<div id='editorial-calendar' class='rhd-editorial-calendar'></div>
						<div id='drafts' class='rhd-drafts-area'>
							<h4>Unscheduled Drafts</h4>
							<ul class='rhd-drafts-list'></ul>
						</div>
					</div>
				</div>
				";
		}
		
		
		/**
		 * calendario_update_post function. Performs the requested post update.
		 * 	Returns true on success, false on failure. Fail prints errors to the log.
		 * 
		 * @access public
		 * @param array $post The one-to-one post data to update
		 * @param bool $make_unscheduled (default: null) True to convert to Unscheduled, false otherwise
		 * @return bool|string The post_status of the post, or false on error.
		 */
		public function calendario_update_post( array $post, bool $make_unscheduled = null ) {
			// Update the post
			$result = wp_update_post( $post, true );
			
			if ( is_wp_error( $result ) ) {
				self::log_error_message( $result );
				return false;
			} else {
				// If we're converting or not...
				if ( $make_unscheduled === true ) {
					$result = update_post_meta( $result, '_unscheduled', 'yes' );
				} else {
					delete_post_meta( $result, '_unscheduled' );
				}
				
				return ( $post['post_status'] ) ? $post['post_status'] : get_post_status( $post['ID'] );
			}
		}
		
		
		/**
		 * update_post_date function. Changes a post's post_date and post_date_gmt meta.
		 * 
		 * @access public
		 * @param int $post_id The post ID
		 * @param string $new_date The new post date
		 * @param string $post_status Current post status
		 * @return void
		 */
		public function update_post_date( int $post_id, string $new_date, string $post_status ) {
			$post_type = get_post_type( $post_id );
			
			// Exit if this is a published or trashed post
			if ( $post_type == 'publish' || $post_type == 'trash' )
				return;
				
			// Format the date
			$new_date = self::format_post_date( $new_date );
			
			$post = array(
						'ID'			=> $post_id,
						'post_date'		=> $new_date[0],
						'post_date_gmt'	=> $new_date[1],
						'post_status'	=> $post_status
					);
			
			self::calendario_update_post( $post, false );
		}
		
		
		/**
		 * unschedule_draft function.
		 * 
		 * @access public
		 * @param int $post_id
		 * @param string $date The post_date value
		 * @return void
		 */
		public function unschedule_draft( int $post_id, string $date ) {
			$date_formatted = self::format_post_date( $date );
			
			$post = array(
				'ID'			=> $post_id,
				'post_date'		=> $date_formatted[0],
				'post_date_gmt'	=> $date_formatted[1],
				'post_status'	=> 'draft'
			);
			
			self::calendario_update_post( $post, true );
		}
		
		
		/**
		 * convert_draft_to_future function. Converts drafts to future posts, and adds post date.
		 * 
		 * @access public
		 * @param int $post
		 * @param string $new_date (default: null)
		 * @return void
		 * TODO: Deprecate
		 */
		public function convert_draft_to_future( int $post_id, string $new_date = null ) {
			$status = get_post_status( $post_id );
			$saved_date = get_post_meta( $post_id, '_rhd_cal_future_date', true );
			
			if ( $new_date ) {
				$new_date = $this->format_post_date( $new_date );
			} elseif ( $saved_date ) {
				$new_date = $this->format_post_date( $saved_date );
			} else {
				$new_date = array( null, null );
			}
			
			// Exit if not a draft
			if ( $status != 'draft' )
				return false;
			
			$this->calendario_update_post(
				array(
					'ID'			=> $post_id,
					'post_status'	=> 'future',
					'post_date'		=> $new_date[0],
					'post_date_gmt'	=> $new_date[1]
				),
				false
			);
		}
		
		
		/**
		 * convert_future_to_draft function. Converts future posts to drafts
		 * 
		 * @access public
		 * @param int $post
		 * @return void
		 * TODO: Deprecate
		 */
		public function convert_future_to_draft( int $post_id ) {
			$status = get_post_status( $post_id );
			
			// Exit with error for any posts not future in the future
			if ( $status != 'future' )
				return false;
			
			$this->calendario_update_post(
				array(
					'ID'			=> $post_id,
					'post_status'	=> 'draft',
				)
			);
			
			// Save the old publish date to a meta field
			update_post_meta( $post_id, '_rhd_cal_future_date', get_the_date( self::RHD_DATE_FORMAT, $post_id ) );
		}
		
		
		/**
		 * convert_to_unscheduled_draft function. Converts posts to "Unscheduled Drafts"
		 * 
		 * @access public
		 * @param int $post
		 * @return void
		 * TODO: Deprecate
		 */
		public function convert_to_unscheduled_draft( int $post_id ) {
			$status = get_post_status( $post_id );
			
			$this->calendario_update_post(
				array(
					'ID'			=> $post_id,
					'post_status'	=> 'draft'
				)
			);
		}
	}
}


/* ==========================================================================
	Fire it up...
   ========================================================================== */

register_activation_hook( __FILE__, array( 'RHD_Calendario', 'plugin_activation' ) );
register_deactivation_hook( __FILE__, array( 'RHD_Calendario', 'plugin_deactivation' ) );

RHD_Calendario::get_instance();