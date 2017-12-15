<?php
/**
 * Calendario REST Endpoints
 *
 * @package WordPress
 * @subpackage calendario
 **/

if ( !class_exists( 'RHD_Calendario_Server' ) ) {
	class RHD_Calendario_Server extends WP_REST_Controller {
		
		// namespace and version
		var $my_namespace = 'rhd/v';
		var $my_version = '1';
		
		public function register_routes() {
			$namespace = $this->my_namespace . $this->my_version;
			
			// Get All Unscheduled Drafts
			register_rest_route( $namespace, '/cal/unscheduled', array(
				array(
					'methods'	=> WP_REST_Server::READABLE,
					'callback'	=> array( $this, 'get_unscheduled_draft_list' ),
					'permission_callback'	=> array( $this, 'check_user_permissions' )
				)
			) );
			
			// Populate Calendar - Scheduled Posts
			register_rest_route( $namespace, '/cal/future', array(
				array(
					'methods'	=> WP_REST_Server::READABLE,
					'callback'	=> array( $this, 'populate_calendar_future' ),
					'permission_callback'	=> array( $this, 'check_user_permissions' )
				)
			) );
			
			// Populate Calendar - Scheduled Drafts
			register_rest_route( $namespace, '/cal/drafts', array(
				array(
					'methods'	=> WP_REST_Server::READABLE,
					'callback'	=> array( $this, 'populate_calendar_scheduled_drafts' ),
					'permission_callback'	=> array( $this, 'check_user_permissions' )
				)
			) );
			
			// Update Post
			register_rest_route( $namespace, '/cal/update', array(
				array(
					'methods'	=> WP_REST_Server::EDITABLE,
					'callback'	=> array( $this, 'update_post_date' ),
					'permission_callback'	=> array( $this, 'check_user_permissions' )
				)
			) );
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
		 * @return bool True if the current user has the requested permissions, otherwise false.
		 */
		public function check_user_permissions() {
			if ( ! current_user_can( 'edit_others_posts' ) || ! current_user_can( 'delete_others_posts' ) || ! current_user_can( 'publish_posts' ) ) {
				return new WP_Error( 'rest_forbidden', esc_html__( 'You do not have permission to perform this operation.', 'rhd' ) );
			} else {
				return true;
			}
		}
		
		
		/**
		 * get_unscheduled_draft_list function. Loads 'draft' posts and creats basic list item HTML.
		 * 
		 * @access public
		 * @param WP_REST_Request $request
		 * @return string HTML Output
		 *
		 * TODO: Maybe allow for more post types in the future?
		 */
		public function get_unscheduled_draft_list( WP_REST_Request $request ) {		
			$args = array(
				'post_type' 	=> 'post',
				'posts_per_page'	=> -1,
				'post_status'	=> 'draft',
				'meta_query'	=> array(
									array(
										'key'	=> '_unscheduled',
										'value'	=> 'yes',
									)
								)
			);
			$posts = get_posts( $args );
			
			$output = '';
			if ( $posts ) {
				foreach( $posts as $post ) {
					$title	= get_the_title( $post );
					$start	= get_the_date( 'c', $post );
					$post_id = absint( $post->ID );
					
					$output .= "<li class='rhd-draft ui-draggable' data-ID='{$post_id}'>{$title}</li>";
				}
			}
			return $output;
		}
		
		
		/**
		 * populate_calendar_future function. Loads 'future' posts and returns JSON data for a Fullcalendar event feed.
		 * 
		 * @access public
		 * @param WP_REST_Request $request
		 * @return WP_REST_Response
		 *
		 * TODO: Maybe allow for more post types in the future?
		 */
		public function populate_calendar_future( WP_REST_Request $request ) {			
			// Get params
			$start = $request->get_param( 'start' );
			$end = $request->get_param( 'end' );
			
			$args = array(
				'post_type' 	=> 'post',
				'posts_per_page' 	=> -1,
				'post_status'	=> array( 'future' ),
				'date_query'	=> array(
									array(
										'after'		=> $start,
										'before'	=> $end
									),
									'inclusive'	=> true,
				)
			);
			$posts = get_posts( $args );
			
			if ( $posts ) {
				$postdata = array();
				$i = 0;
				foreach ( $posts as $post ) {
					$date = new DateTime( $post->post_date );
					
					$postdata[$i] = array(
						'title'		=> apply_filters( 'the_title', $post->post_title ),
						'start'		=> $date->format( 'c' ), // Format date to ISO8601
						'post_id'	=> $post->ID,
						'post_status'	=> $post->post_status
					);
					
					++$i;
				}
				
				// Set up REST Response
				$response = new WP_REST_Response( $postdata );
				$response->header( 'Content-type', 'application/json');
				$response->set_status( 200 );
				
				return $response;
			} else {
				return new WP_Error( 'no_events', __( 'No events to display.', 'rhd' ) );
			}
		 }
		 
		 
		 /**
		 * populate_calendar_scheduled_drafts function. Loads "scheduled drafts" and returns JSON data for a Fullcalendar event feed.
		 * 
		 * @access public
		 * @param WP_REST_Request $request
		 * @return WP_REST_Response
		 *
		 * TODO: Maybe allow for more post types in the future?
		 */
		public function populate_calendar_scheduled_drafts( WP_REST_Request $request ) {			
			// Get params
			$start = $request->get_param( 'start' );
			$end = $request->get_param( 'end' );
			
			$args = array(
				'post_type' 	=> 'post',
				'posts_per_page' 	=> -1,
				'post_status'	=> array( 'draft' ),
				'date_query'	=> array(
									array(
										'after'		=> $start,
										'before'	=> $end
									),
									'inclusive'	=> true,
				
								),
				'meta_query'	=> array(
									'relation'	=> 'OR',
									array(
										'key'	=> '_unscheduled',
										'value'	=> 'yes',
										'compare'	=> '!='
									),
									array(
										'key'	=> '_unscheduled',
										'compare'	=> 'NOT EXISTS'
									)
								)
			);
			$posts = get_posts( $args );
			
			if ( $posts ) {
				$postdata = array();
				$i = 0;
				foreach ( $posts as $post ) {
					$date = new DateTime( $post->post_date );
					
					$postdata[$i] = array(
						'title'		=> apply_filters( 'the_title', $post->post_title ),
						'start'		=> $date->format( 'c' ), // Format date to ISO8601
						'post_id'	=> $post->ID,
						'post_status'	=> $post->post_status
					);
					
					++$i;
				}
				
				// Set up REST Response
				$response = new WP_REST_Response( $postdata );
				$response->header( 'Content-type', 'application/json');
				$response->set_status( 200 );
				
				return $response;
			} else {
				return new WP_Error( 'no_events', __( 'No events to display.', 'rhd' ) );
			}
		 }
		 
		 
		/**
		 * update_post_date function. 
		 * 
		 * @access public
		 * @param WP_REST_Request $request
		 * @return void
		 *
		 * TODO: Make sure not trying to change date to today's or prior date (i.e. already published)
		 */
		public function update_post_date( WP_REST_Request $request ) {
			$post_id = $request->get_param( 'postID' );
			$new_date = ( $request->get_param( 'newDate' ) ) ? $request->get_param( 'newDate' ) : '';
			$post_status = $request->get_param( 'postStatus' );
			
			$make_unscheduled = $request->get_param( 'makeUnscheduled' );
			$make_unscheduled = ($make_unscheduled === 'true');
			
			if ( $make_unscheduled === true )
				$post_status = 'draft';
			
			RHD_Calendario::update_post_date( $post_id, $new_date, $post_status, $make_unscheduled );
		}
	}
}

$RHD_Calendario_Server = new RHD_Calendario_Server();
$RHD_Calendario_Server->hook_rest_server();