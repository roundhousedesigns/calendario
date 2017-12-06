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

if ( ! class_exists( 'RHD_Calendario' ) ) {
	class RHD_Calendario
	{
		protected $output;
		protected $plugin_meta;
		
		public function __construct() {
			add_action( 'admin_enqueue_scripts', array( $this, 'assets' ) );
			add_action( 'admin_menu', array( $this, 'create_plugin_page' ) );
		}
		
		public function assets() {
			wp_register_style( 'rhd-cal-styles', plugin_dir_url( __FILE__ ) . 'css/rhd-cal-styles.css' );
			wp_register_style( 'fullcalendar', plugin_dir_url( __FILE__ ) . 'node_modules/fullcalendar/dist/fullcalendar.css' );
			
			wp_register_script( 'moment', plugin_dir_url( __FILE__ ) . 'node_modules/moment/moment.js', array(), '2.19.3' );
			wp_register_script( 'fullcalendar', plugin_dir_url( __FILE__ ) . 'node_modules/fullcalendar/dist/fullcalendar.js', array( 'jquery', 'moment' ), '3.7.0' );
			wp_register_script( 'rhd-cal-admin', plugin_dir_url( __FILE__ ) . 'js/rhd-cal-admin.js', array( 'jquery', 'fullcalendar' ), '0.1dev' );
		}
		
		public function create_plugin_page() {
			add_submenu_page( 'edit.php', 'Calendario', 'Calendario', 'manage_options', 'rhd-calendario-page', array( $this, 'calendario_page' ) );
		}
		
		public function calendario_page() {
			$this->plugin_meta = get_plugin_data( __FILE__, true, false );
			wp_enqueue_script( 'rhd-cal-admin' );
			
			// Reset and override possible existing output (necessary?)
			$this->output = "<h1>{$this->plugin_meta['Name']}</h1>";
			
			$this->output .= "
				{$temp_meta}
				<div id='calendario-wrapper'>
					<div id='calendar'></div>
				</div>
				";
			
			echo $this->output;
		}
	}
}

$main = new RHD_Calendario();