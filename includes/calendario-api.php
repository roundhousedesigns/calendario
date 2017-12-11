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
					'permission_callback' => array( $this, 'check_user_permissions' )
				)
			));
			
			register_rest_route( $namespace, '/cal/future', array(
				array(
					'methods'	=> WP_REST_Server::ALLMETHODS,
					'callback'	=> array( $this, 'load_future_posts' ),
					//'permission_callback' => array( $this, 'check_user_permissions' )
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
		 * check_user_permissions function. Makes sure user is allowed to perform necessary operations before proceeding.
		 * 
		 * @access private
		 * @return void
		 */
		public function check_user_permissions() {
			if ( ! current_user_can( 'edit_others_posts' ) || ! current_user_can( 'delete_others_posts' ) || ! current_user_can( 'publish_posts' ) ) {
				return new WP_Error( 'rest_forbidden', esc_html__( 'You do not have permission to perform this operation.', 'rhd' ) );
			} else {
				return true;
			}
		}
		
		
		/**
		 * load_draft_list function. Loads 'draft' posts and creats basic list item HTML.
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
		
		
		/**
		 * load_future_posts function. Loads 'future' posts into JSON data.
		 * 
		 * @access public
		 * @param WP_REST_Request $request
		 * @return void
		 *
		 * TODO: Maybe allow for more post types in the future?
		 */
		public function load_future_posts( WP_REST_Request $request ) {			
			// Get params
			$start = $request->get_param( 'start' );
			$end = $request->get_param( 'end' );
			
			$args = array(
				'post_type' 		=> 'post',
				'posts_per_page' 	=> -1,
				'post_status'		=> 'future',
				'date_query'		=> array(
										array(
											'after'		=> $start,
											'before'	=> $end
										),
										'inclusive'	=> true
				)
			);
			$posts = get_posts( $args );
			
			$postdata = array();
			$i = 0;
			foreach ( $posts as $post ) {
				$date = new DateTime( $post->post_date );
				
				$postdata[$i] = array(
					'title'		=> apply_filters( 'the_title', $post->post_title ),
					'start'		=> $date->format( 'c' ), // Format date to ISO8601
				);
				
				++$i;
			}
			wp_reset_postdata();
			
			return wp_json_encode( $postdata );
		}
	}
}

$RHD_Calendario_Server = new RHD_Calendario_Server();
$RHD_Calendario_Server->hook_rest_server();