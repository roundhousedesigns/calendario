<?php
/**
 * Calendario REST Endpoints
 *
 * @package WordPress
 * @subpackage calendario
 **/


class RHD_Calendario_Server extends WP_REST_Controller {
	
	// namespace and version
	var $my_namespace = 'rhd/v';
	var $my_version = '1';
	
	public function register_routes() {
		$namespace = $this->my_namespace . $this->my_version;
		
		// Get WordPress local time
		register_rest_route( $namespace, '/cal/today', array(
			array(
				'methods'	=> WP_REST_Server::READABLE,
				'callback'	=> array( $this, 'get_server_date' ),
				'permission_callback'	=> array( $this, 'check_user_permissions' )
			)
		) );
		
		// Get All Unscheduled Drafts
		register_rest_route( $namespace, '/cal/all-unscheduled', array(
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
		
		// Populate Calendar - Published
		register_rest_route( $namespace, '/cal/published', array(
			array(
				'methods'	=> WP_REST_Server::READABLE,
				'callback'	=> array( $this, 'populate_calendar_published' ),
				'permission_callback'	=> array( $this, 'check_user_permissions' )
			)
		) );
		
		// Update Post
		register_rest_route( $namespace, '/cal/update', array(
			array(
				'methods'	=> WP_REST_Server::EDITABLE,
				'callback'	=> array( $this, 'update_post' ),
				'permission_callback'	=> array( $this, 'check_user_permissions' )
			)
		) );
		
		// Add New Post
		register_rest_route( $namespace, '/cal/add', array(
			array(
				'methods'	=> WP_REST_Server::EDITABLE,
				'callback'	=> array( $this, 'add_new_draft_post' ),
				'permission_callback'	=> array( $this, 'check_user_permissions' )
			)
		) );
		
		// Make "Unscheduled Draft"
		register_rest_route( $namespace, '/cal/unschedule', array(
			array(
				'methods'	=> WP_REST_Server::EDITABLE,
				'callback'	=> array( $this, 'unschedule_draft' ),
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
	 * get_server_date function. Retrieves the current date using the set time zone in WordPress.
	 * 
	 * @access public
	 * @param WP_REST_Request $request
	 * @return string The current date
	 */
	public function get_server_date( WP_REST_Request $request ) {
		$today = new DateTime( current_time( 'Y-m-d' ) );
		return $today->format( 'c' );
	}
	
	
	/**
	 * get_unscheduled_draft_list function. Loads 'draft' posts and creats basic list item HTML.
	 * 
	 * @access public
	 * @param WP_REST_Request $request
	 * @return string $output HTML Output
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
				
				$event_data = array(
					'post_id'	=> $post_id,
					'title'	=> $title,
					'start'	=> $start,
					'post_status'	=> 'draft'
				);
				
				$event_data_json = json_encode( $event_data );
				
				$output .= "<li class='unscheduled-draft status-draft fc-event ui-draggable' data-event='{$event_data_json}'>{$title}</li>";
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
			'post_status'	=> 'future',
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
					'title'		=> RHD_Calendario::format_post_title_display( $post->post_title ),
					'start'		=> $date->format( 'c' ), // Format date to ISO8601
					'post_id'	=> $post->ID,
					'post_status'	=> $post->post_status,
					'className'	=> "status-future"
				);
				
				$today = new DateTime( current_time( 'Y-m-d' ) );
				$today = $today->format( 'Y-m-d' );
				$event_date = $date->format( 'Y-m-d' );

				if ( $today == $event_date ) {
					$postdata[$i]['editable'] = false;
				}
				
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
	 * populate_calendar_published function. Loads published posts and returns JSON data for a Fullcalendar event feed.
	 * 
	 * @access public
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 *
	 * TODO: Maybe allow for more post types in the future?
	 */
	public function populate_calendar_published( WP_REST_Request $request ) {			
		// Get params
		$start = $request->get_param( 'start' );
		$end = $request->get_param( 'end' );
		
		$args = array(
			'post_type' 	=> 'post',
			'posts_per_page' 	=> -1,
			'post_status'	=> 'publish',
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
					'title'		=> RHD_Calendario::format_post_title_display( $post->post_title ),
					'start'		=> $date->format( 'c' ), // Format date to ISO8601
					'post_id'	=> $post->ID,
					'post_status'	=> $post->post_status,
					'className'	=> "status-publish"
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
	 * populate_calendar_scheduled_drafts function. Endpoint for loading "scheduled drafts" and returns JSON data for a Fullcalendar event feed.
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
			'post_status'	=> 'draft',
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
				
				// Normal $post->post_date won't work with drafts! Must query db.
				$date = new DateTime( $post->post_date ); // <---- (Sadness. ....also, why did I mark this as sadness? it seems to work...)
				
				$postdata[$i] = array(
					'title'			=> RHD_Calendario::format_post_title_display( $post->post_title ),
					'start'			=> $date->format( 'c' ), // Format date to ISO8601
					'post_id'		=> $post->ID,
					'post_status'	=> $post->post_status,
					'className'		=> "status-draft"
				);
				
				$today = new DateTime( current_time( 'Y-m-d' ) );
				$today = $today->format( 'Y-m-d' );
				$event_date = $date->format( 'Y-m-d' );

				if ( $today == $event_date ) {
					$postdata[$i]['editable'] = false;
				}
				
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
	 * update_post function. Endpoint for updating post dates.
	 * 
	 * @access public
	 * @param WP_REST_Request $request
	 * @return bool Success/failure
	 *
	 * TODO: Make sure not trying to change date to today's or prior date (i.e. already published)
	 */
	public function update_post( WP_REST_Request $request ) {
		$post_id = (int)$request->get_param( 'post_id' );
		$new_date = ( $request->get_param( 'new_date' ) ) ? $request->get_param( 'new_date' ) : '';
		$post_status = ( $request->get_param( 'post_status' ) ) ? $request->get_param( 'post_status' ) : '';
		
		$target_date = new DateTime( $new_date );
		$today = new DateTime( current_time( 'Y-m-d' ) );
		
		if ( $today < $target_date ) {
			RHD_Calendario::update_post( $post_id, $new_date, $post_status );
			return true;
		} else {
			return false;
		}
	}
	
	
	/**
	 * add_new_draft_post function. Endpoint for adding new posts.
	 * 
	 * @access public
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|bool Valid REST response on success, false on fail
	 *
	 * TODO: Make sure not trying to change date to today's or prior date (i.e. already published)
	 */
	public function add_new_draft_post( WP_REST_Request $request ) {
		$post_title = ( $request->get_param( 'post_title' ) ) ? $request->get_param( 'post_title' ) : '';
		$post_date = ( $request->get_param( 'post_date' ) ) ? $request->get_param( 'post_date' ) : ''; // Default: Right Now
		$post_status = ( $request->get_param( 'post_status' ) ) ? $request->get_param( 'post_status' ) : 'draft'; // Default: 'draft'
		$post_content = ( $request->get_param( 'post_content' ) ) ? $request->get_param( 'post_content' ) : '';
		
		$postdata = RHD_Calendario::add_new_draft_post( $post_title, $post_date, $post_status, $post_content );
		
		if ( $postdata ) {
			// Set up REST Response
			$response = new WP_REST_Response( $postdata );
			$response->header( 'Content-type', 'application/json');
			$response->set_status( 200 );
			
			return $response;
		} else {
			return false;
		}
	}
	
	
	/**
	 * unschedule_draft function. Endpoint for marking a post as an 'Unscheduled Draft.'
	 * 
	 * @access public
	 * @param WP_Rest_Request $request
	 * @return void
	 */
	public function unschedule_draft( WP_Rest_Request $request ) {
		$post_id = $request->get_param( 'post_id' );
		$date = ( $request->get_param( 'new_date' ) ) ? $request->get_param( 'new_date' ) : '';
					
		RHD_Calendario::unschedule_draft( $post_id, $date );
	}
}

$RHD_Calendario_Server = new RHD_Calendario_Server();
$RHD_Calendario_Server->hook_rest_server();