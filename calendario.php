<?php
/*
Plugin Name: Calendario
Plugin URI: https://roundhouse-designs.com/calendario
Description: The professional blogger's editorial calendar for WordPress.
Version: 0.1dev
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


/* ==========================================================================
	Setup
   ========================================================================== */

// Version control
define ( 'RHD_CALENDARIO_VERSION', '0.1dev' );

register_activation_hook(__FILE__, 'rhd_cal_plugin_activation');
if ( !function_exists( 'rhd_cal_plugin_activation' ) ) {
	function rhd_cal_plugin_activation() {
		// Set up 
	}

}

register_deactivation_hook(__FILE__, 'rhd_cal_plugin_deactivation');
if ( !function_exists( 'rhd_cal_plugin_deactivation' ) ) {
	function rhd_cal_plugin_deactivation() {
		// Welp, I've been deactivated - are there some things I should clean up?
	}
}


/* ==========================================================================
	Core
   ========================================================================== */

if ( !class_exists( 'RHD_Calendario' ) ) {

	/**
	 * RHD_Calendario class.
	 */

	class RHD_Calendario
	{
		protected $output;
		protected $plugin_meta;
		public const RHD_DATE_FORMAT = 'Y-m-d H:i:s';
		
		
		/**
		 * __construct function. Fires on class creation.
		 * 
		 * @access public
		 * @return void
		 */
		public function __construct() {
			add_action( 'admin_enqueue_scripts', array( $this, 'assets' ) );
			add_action( 'admin_menu', array( $this, 'create_plugin_page' ) );
		}
		
		
		/**
		 * log_error_message function. Prints a WP_Error string.
		 * 
		 * @access public
		 * @param mixed $result
		 * @return void
		 */
		public function log_error_message( $result ) {
			$error_string = "Calendario: ";
			
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
		 * format_post_date function. Formats a time string into RHD_DATE_FORMAT, and
		 *	returns an array: [0] => formatted time, [1] => formatted time (GMT)
		 * 
		 * @access public
		 * @param string $date
		 * @return array
		 */
		public function format_post_date( string $date ) {
			$time = new DateTime( $date );
			$time_gmt = new DateTime( $date );
			$time_gmt->setTimezone( new DateTimeZone('GMT') );
			
			$time_formatted = array();
			
			$time_formatted[0] = $time->format( self::RHD_DATE_FORMAT );
			$time_formatted[1] = $time_gmt->format( self::RHD_DATE_FORMAT );
			
			return $time_formatted;
		}
		
		
		/**
		 * assets function. Registers external stylesheets and scripts.
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
			wp_register_script( 'calendario-admin', plugin_dir_url( __FILE__ ) . 'js/calendario-admin.js', array( 'jquery', 'fullcalendar' ), '0.1dev' );
		}
		
				
		/**
		 * create_plugin_page function. Creates the submenu!
		 * 
		 * @access public
		 * @return void
		 */
		public function create_plugin_page() {
			add_submenu_page( 'edit.php', 'Calendario', 'Calendario', 'manage_options', 'rhd-calendario-page', array( $this, 'calendario_page' ) );
		}
		
		
		/**
		 * calendario_page function. The main workspace. Tasty!
		 * 
		 * @access public
		 * @return void
		 */
		public function calendario_page() {
			$this->plugin_meta = get_plugin_data( __FILE__, true, false );
			wp_enqueue_style( 'fullcalendar' );
			wp_enqueue_style( 'calendario-admin' );
			wp_enqueue_script( 'calendario-admin' );
			
			$this->output = "
				<div id='calendario'>
					{$debug}
					<header class='plugin-header'>
						<h2 class='plugin-title'>{$this->plugin_meta['Name']}</h2>
					</header>
					
					<div id='calendario-workspace'>
						<div id='editorial-calendar' class='rhd-editorial-calendar'></div>
						<div id='drafts' class='rhd-drafts-area'><h4>Les Drafts</h4></div>
					</div>
				</div>
				";
			
			echo $this->output;
		}
		
		
		/**
		 * calendario_update_post function. Performs the requested post update.
		 * 	Returns true on success, false on failure. Fail prints errors to the log.
		 * 
		 * @access public
		 * @param array $params
		 * @return boolean
		 */
		public function calendario_update_post( array $props ) {
			// Update the post
			$result = wp_update_post( $props, true );
			
			if ( is_wp_error( $result ) ) {
				$this->log_error_message( $result );
				return false;
			} else {
				return true;
			}
		}
		
		
		/**
		 * change_future_date function.
		 * 
		 * @access public
		 * @param int $post_id
		 * @param string $new_date
		 * @return void
		 */
		public function change_future_date( int $post_id, string $new_date ) {
			$status = get_post_status( $post_id );
			$new_date = $this->format_post_date( $new_date );
			
			// Exit if not a future post
			if ( $status != 'future' )
				return false;
			
			$this->calendario_update_post(
				array(
					'ID'		=> $post_id,
					'post_date'	=> $new_date[0],
					'post_date_gmt' => $new_date[1]
				)
			);
		}
		
		
		/**
		 * convert_draft_to_future function. Converts drafts to future posts, and adds post date.
		 * 
		 * @access public
		 * @param int $post
		 * @param string $new_date (default: null)
		 * @return void
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
				)
			);
		}
		
		
		/**
		 * convert_future_to_draft function. Converts future posts to drafts
		 * 
		 * @access public
		 * @param int $post
		 * @return void
		 */
		public function convert_future_to_draft( int $post_id ) {
			$this->log_error_message( 'hi' );
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
	}
}

$main = new RHD_Calendario();