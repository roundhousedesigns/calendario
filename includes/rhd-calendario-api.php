<?php
/**
 * Calendario REST Endpoints
 *
 * @package WordPress
 * @subpackage rhdwp-hannah
 * @requires 
 **/


if ( !class_exists( 'RHD_Calendario_Server' ) ) {
	class RHD_Calendario_Server extends WP_REST_Controller {
		
		// namespace and version
		var $my_namespace = 'rhd/v';
		var $my_version = '1';
		
		public function register_routes() {
			$namespace = $this->my_namespace . $this->my_version;
			
			register_rest_route( $namespace, '/cal/drafts', array(
				array(
					'methods'	=> WP_REST_Server::ALLMETHODS,
					'callback'	=> array( $this, 'load_draft_list' ),
					'permission_callback' => function () {
						if ( current_user_can( 'edit_others_posts' ) && current_user_can( 'delete_others_posts' ) && current_user_can( 'publish_posts' ) ) {
							return true;
						} else {
							return false;
						}
					}
				)
			));
		}
		
		/**
		 * hook_rest_server function. Registers custom REST endpoints.
		 * 
		 * @access public
		 * @return void
		 */
		public function hook_rest_server(){
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}
		
		/**
		 * load_draft_list function.
		 * 
		 * @access public
		 * @param WP_REST_Request $request
		 * @return void
		 *
		 * TODO: Maybe allow for more post types in the future?
		 */
		public function load_draft_list( WP_REST_Request $request ) {		
			$args = array(
				'post_type' 		=> 'post',
				'posts_per_page' 	=> -1,
				'post_status'		=> 'draft'
			);
			
			$posts = get_posts( $args );
			
			$output = '';
			foreach( $posts as $post ) {
				$output .= '<li class="rhd-draft">' . apply_filters( 'the_title', $post->post_title ) . '</li>';
			}
					
			return $output;
		}
	}
}

$RHD_Calendario_Server = new RHD_Calendario_Server();
$RHD_Calendario_Server->hook_rest_server();