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
				'callback'	=> array( $this, 'populate_calendar' ),
				'permission_callback'	=> array( $this, 'check_user_permissions' )
			)
		) );
		
		// Populate Calendar - Drafts ("Dated")
		register_rest_route( $namespace, '/cal/drafts', array(
			array(
				'methods'	=> WP_REST_Server::READABLE,
				'callback'	=> array( $this, 'populate_calendar' ),
				'permission_callback'	=> array( $this, 'check_user_permissions' )
			)
		) );
		
		// Populate Calendar - Pending
		register_rest_route( $namespace, '/cal/pending', array(
			array(
				'methods'	=> WP_REST_Server::READABLE,
				'callback'	=> array( $this, 'populate_calendar' ),
				'permission_callback'	=> array( $this, 'check_user_permissions' )
			)
		) );
		
		// Populate Calendar - Published
		register_rest_route( $namespace, '/cal/published', array(
			array(
				'methods'	=> WP_REST_Server::READABLE,
				'callback'	=> array( $this, 'populate_calendar' ),
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
		
		// Get latest post date
		register_rest_route( $namespace, '/cal/lastpostdate', array(
			array(
				'methods'	=> WP_REST_Server::READABLE,
				'callback'	=> array( $this, 'get_last_post_date' ),
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
	 * get_last_post_date function. Retrieves the latest post date.
	 * 
	 * @access public
	 * @param WP_Rest_Request $request
	 * @return string $last_date The last post date retrieved
	 */
	public function get_last_post_date( WP_Rest_Request $request ) {
		$post_type = ( $request->get_param( 'post_type' ) ) ? $request->get_param( 'post_type' ) : false; // Don't allow unspecified post types
		
		if ( ! $post_type )
			return;
		
		$args = array(
			'post_type'	=> $post_type,
			'post_status'	=> array( 'publish', 'draft', 'pending', 'future' ),
			'posts_per_page'	=> -1,
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
			$last_date = $posts[0]->post_date;
		}
		
		return $last_date;
	}
	
	
	/**
	 * populate_calendar function. Loads posts and returns JSON data for a fullCalendar event feed.
	 * 
	 * @access public
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 *
	 * TODO: Maybe allow for more post types in the future?
	 */
	public function populate_calendar( WP_REST_Request $request ) {			
		// Get params
		$start = $request->get_param( 'start' );
		$end = $request->get_param( 'end' );
		$post_status = $request->get_param( 'post_status' );
		
		$args = array(
			'post_type' 	=> 'post',
			'posts_per_page' 	=> -1,
			'post_status'	=> $post_status,
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
			for ( $i = 0; $i < count( $posts ); $i++ ) {
				$date = new DateTime( $posts[$i]->post_date );
				
				$postdata[$i] = array(
					'title'		=> RHD_Calendario::format_post_title_display( $posts[$i]->post_title ),
					'start'		=> $date->format( 'c' ), // Format date to ISO8601
					'post_id'	=> $posts[$i]->ID,
					'post_status'	=> $posts[$i]->post_status,
					'className'	=> "status-" . $posts[$i]->post_status
				);
				
/*
				$today = new DateTime( current_time( 'Y-m-d' ) );
				$today = $today->format( 'Y-m-d' );
				$event_date = $date->format( 'Y-m-d' );
				
				if ( $today == $event_date ) {
					$postdata[$i]['editable'] = false;
				}
*/
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
		
		if ( $posts ) {
			$event_data = array();
			foreach( $posts as $post ) {
				$event_data[] = array(
					'post_id'	=> $post->ID,
					'title'		=> RHD_Calendario::format_post_title_display( get_the_title( $post ) ),
					'start'		=> get_the_date( 'c', $post ),
					'post_status'	=> 'draft'
				);
			}
		} else {
			$event_data = false;
		}
				
		// Set up REST Response
		$response = new WP_REST_Response( json_encode( $event_data ) );
		$response->header( 'Content-type', 'application/json');
		$response->set_status( 200 );
		
		return $response;
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
		$post_id = $request->get_param( 'post_id' );
		$post_date = ( $request->get_param( 'post_date' ) ) ? $request->get_param( 'post_date' ) : '';
		$post_status = ( $request->get_param( 'post_status' ) ) ? $request->get_param( 'post_status' ) : '';
		$post_title = ( $request->get_param( 'post_title' ) ) ? $request->get_param( 'post_title' ) : '';
		
		RHD_Calendario::update_post( $post_id, $post_date, $post_status, $post_title );
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
			$response->header( 'Content-type', 'application/json' );
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
		$date = ( $request->get_param( 'post_date' ) ) ? $request->get_param( 'post_date' ) : '';
					
		RHD_Calendario::unschedule_draft( $post_id, $date );
	}	
}

$RHD_Calendario_Server = new RHD_Calendario_Server();
$RHD_Calendario_Server->hook_rest_server();