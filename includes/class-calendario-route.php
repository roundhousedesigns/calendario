<?php
class Calendario_Route extends WP_REST_Controller {
	function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		$version   = '1';
		$namespace = 'calendario/v' . $version;
		$post_base = 'posts';
		$user_base = 'user';

		register_rest_route( $namespace, '/' . $post_base . '/scheduled/(?P<start>.*?)', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array( $this->get_range_endpoint_args() ),
			),
		) );

		register_rest_route( $namespace, '/' . $post_base . '/unscheduled', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_unscheduled_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
		) );

		register_rest_route( $namespace, '/' . $post_base . '/futuremost', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_futuremost_item' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
		) );

		register_rest_route( $namespace, '/' . $post_base . '/update/(?P<ID>\d+)/(?P<post_date>[0-9-]+)/(?P<post_status>.*?)/(?P<set_unscheduled>\d)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema(),
			),
		) );

		register_rest_route( $namespace, '/' . $post_base . '/updateUnscheduledDraftOrder/(?P<ids>.*?)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_unscheduled_post_order' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema(),
			),
		) );

		register_rest_route( $namespace, '/' . $user_base . '/(?P<option>[\w]+)/(?P<value>[\w]+)', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_user_option' ),
				'permission_callback' => array( $this, 'user_permissions_check' ),
				'args'                => array( $this->get_user_option_endpoint_args() ),
			),
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_user_option' ),
				'permission_callback' => array( $this, 'user_permissions_check' ),
				'args'                => array( $this->get_user_option_endpoint_args() ),
			),
		) );

		// register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)', array(
		// 	array(
		// 		'methods'             => WP_REST_Server::READABLE,
		// 		'callback'            => array( $this, 'get_item' ),
		// 		'permission_callback' => array( $this, 'get_item_permissions_check' ),
		// 		'args'                => array(
		// 			'context' => array(
		// 				'default' => 'view',
		// 			),
		// 		),
		// 	),
		// 	array(
		// 		'methods'             => WP_REST_Server::EDITABLE,
		// 		'callback'            => array( $this, 'update_item' ),
		// 		'permission_callback' => array( $this, 'update_item_permissions_check' ),
		// 		'args'                => $this->get_endpoint_args_for_item_schema( false ),
		// 	),
		// 	array(
		// 		'methods'             => WP_REST_Server::DELETABLE,
		// 		'callback'            => array( $this, 'delete_item' ),
		// 		'permission_callback' => array( $this, 'delete_item_permissions_check' ),
		// 		'args'                => array(
		// 			'force' => array(
		// 				'default' => false,
		// 			),
		// 		),
		// 	),
		// ) );

		// register_rest_route( $namespace, '/' . $base . '/schema', array(
		// 	'methods'  => WP_REST_Server::READABLE,
		// 	'callback' => array( $this, 'get_public_item_schema' ),
		// ) );
	}

	/**
	 * Get a collection of items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$items = get_posts( array(
			'post_status' => 'any',
			'inclusive'   => true,
			'date_query'  => array(
				'after' => isset( $request['start'] ) ? $request['start'] : null,
			),
			'meta_query'  => array(
				'relation' => 'OR',
				array(
					'key'   => RHD_UNSCHEDULED_META_KEY,
					'value' => 0,
				),
				array(
					'key'     => RHD_UNSCHEDULED_META_KEY,
					'compare' => 'NOT EXISTS',
				),
			),
		) );

		$data = [];

		foreach ( $items as $item ) {
			$data[] = $this->prepare_item_for_response( $item, $request );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get a collection of items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_unscheduled_items( $request ) {
		$items = get_posts( array(
			'meta_query'     => array(
				array(
					'key'     => RHD_UNSCHEDULED_META_KEY,
					'compare' => '=',
					'value'   => 1,
				),
			),
			'orderby'        => 'meta_value_num',
			'order'          => 'ASC',
			'meta_key'       => RHD_UNSCHEDULED_META_KEY,
			'posts_per_page' => -1,
			'post_status'    => 'any',
		) );

		$data = [];
		foreach ( $items as $item ) {
			$data[] = $this->prepare_unscheduled_item_for_response( $item, $request );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get the furthest-future unpublished post
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_futuremost_item( $request ) {
		$posts = get_posts( array(
			'post_status'    => array( 'any' ),
			'posts_per_page' => 1,
		) );

		if ( $posts ) {
			$data = $this->prepare_futuremost_item_for_response( $posts[0], $request );
		} else {
			$data = [];
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {
		//get parameters from request
		// $params = $request->get_params();
		$item = []; //do a query, call another class, etc
		$data = $this->prepare_item_for_response( $item, $request );

		//return a response or error based on some conditional
		if ( 1 == 1 ) {
			return new WP_REST_Response( $data, 200 );
		} else {
			return new WP_Error( 'code', __( 'message', 'rhd' ) );
		}
	}

	/**
	 * Update one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		$item = $this->prepare_item_for_database( $request );

		// Update the post
		$result = wp_update_post( array(
			'ID'          => $item['ID'],
			'post_date'   => $item['post_date'],
			'post_status' => $item['post_status'],
		) );

		if ( ! is_wp_error( $result ) ) {
			$unscheduled_meta = get_post_meta( $item['ID'], RHD_UNSCHEDULED_META_KEY, true );
			if ( $item['set_unscheduled'] == false && $unscheduled_meta ) {
				// error_log( 'post becomes SCHEDULED.' );
				$result = delete_post_meta( $item['ID'], RHD_UNSCHEDULED_META_KEY );
			} elseif ( $item['set_unscheduled'] == true ) {
				// error_log( 'post becomes UNSCHEDULED.' );
				$result = update_post_meta( $item['ID'], RHD_UNSCHEDULED_META_KEY, 1 );
			} else {
				// error_log( 'Nothing to do.' );
			}
		}

		if ( $result !== false && ! is_wp_error( $result ) ) {
			return new WP_REST_Response( 'Updated post ' . $item['ID'], 200 );
		}

		return new WP_Error( 'cant-update', __( 'message', 'rhd' ), array( 'status' => 500 ) );
	}

	/**
	 * Update all unscheduled items with new indices.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_unscheduled_post_order( $request ) {
		$items = $this->prepare_unscheduled_items_for_database( $request );

		for ( $i = 0; $i < count( $items ); $i++ ) {
			$result = update_post_meta( $items[$i], RHD_UNSCHEDULED_META_KEY, $i );
		}

		return new WP_REST_Response( 'Unscheduled Draft order updated.', 200 );
	}

	/**
	 * Gets a user option using get_user_option().
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_user_option( $request ) {
		$item = $this->prepare_user_option_for_response( $request );

		$value = get_user_option( $item['option'], $item['user_id'] );

		if ( $value !== false ) {
			return new WP_REST_Response( $value, 200 );
		}

		return new WP_REST_Response( false, 200 );
	}

	/**
	 * Updates a user option in the database using update_user_option().
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_user_option( $request ) {
		$item = $this->prepare_user_option_for_database( $request );

		$result = update_user_option( $item['user_id'], $item['option'], $item['value'], false );

		if ( $result !== false ) {
			return new WP_REST_Response( 'View updated.', 200 );
		}

		return new WP_Error( 'user-not-updated', __( 'message', 'rhd' ), array( 'status' => 200 ) );
	}

	/**
	 * Delete one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_item( $request ) {
		$item = $this->prepare_item_for_database( $request );

		// $deleted = slug_some_function_to_delete_item( $item );
		// if ( $deleted ) {
		// 	return new WP_REST_Response( true, 200 );
		// }

		return new WP_Error( 'cant-delete', __( 'message', 'rhd' ), array( 'status' => 500 ) );
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		return true; /*<--use to make readable by all*/
		// return current_user_can( 'edit_others_posts' );
	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_item_permissions_check( $request ) {
		return $this->get_items_permissions_check( $request );
	}

	/**
	 * Check if the user is logged in.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function user_permissions_check( $request ) {
		return true;
		// return is_user_logged_in() && 0 !== get_current_user_id();
	}

	/**
	 * Get argument schema for post data.
	 *
	 * @return array $args
	 */
	public function get_range_endpoint_args() {
		return array(
			'start'       => array(
				'description'       => esc_html__( 'Start date', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_date_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),
			'post_status' => array(
				'description'       => esc_html__( 'Post status', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),
		);
	}

	public function get_user_option_endpoint_args() {
		return array(
			'option' => array(
				'description'       => esc_html__( 'User option name', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),
			'value'  => array(
				'description'       => esc_html__( 'User option value', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => false,
			),
		);
	}

	/**
	 * Get endpoint args.
	 */
	public function get_item_endpoint_args() {
		return array(
			'ID'          => array(
				'description'       => esc_html__( 'Post ID', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_integer' ),
				'sanitize_callback' => 'absint',
				'required'          => true,
			),

			'post_date'   => array(
				'description'       => esc_html__( 'New post date', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_date_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),

			'post_status' => array(
				'description'       => esc_html__( 'New post status', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => false,
				'default'           => '',
			),
		);
	}

	/**
	 * Get endpoint args for updating a post.
	 *
	 * @return array
	 */
	public function get_update_item_endpoint_args() {
		return array(
			'ID' => array(
				'description'       => esc_html__( 'Post ID', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_integer' ),
				'sanitize_callback' => 'absint',
				'required'          => true,
			),

			// 'post_date'   => array(
			// 	'description'       => esc_html__( 'New post date', 'rhd' ),
			// 	'type'              => 'string',
			// 	'validate_callback' => array( $this, 'validate_date_string' ),
			// 	'sanitize_callback' => array( $this, 'sanitize_string' ),
			// 	'required'          => true,
			// ),

			// 'unscheduled' => array(
			// 	'description'       => esc_html__( 'If the incoming post was an unscheduled post.', 'rhd' ),
			// 	'type'              => 'boolean',
			// 	'validate_callback' => array( $this, 'validate_string' ),
			// 	'sanitize_callback' => array( $this, 'sanitize_string' ),
			// 	'required'          => false,
			// 	'default'           => '',
			// ),
		);
	}

	/**
	 * Validate strings
	 *
	 * @param mixed           $value   Value of the my-arg parameter.
	 * @param WP_REST_Request $request Current request object.
	 * @param string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return true|WP_Error True if the data is valid, WP_Error otherwise.
	 */
	public function validate_string( $value, $request, $param ) {
		$atts = $request->get_attributes();

		if ( isset( $atts['args'][$param] ) ) {
			$arg = $atts['args'][$param];

			if ( 'string' === $arg['type'] && ! is_string( $value ) ) {
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s.', 'rhd' ), $param, 'string' ), array( 'status' => 400 ) );
			}
		} else {
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not specified as an argument', 'rhd' ), $param ), array( 'status' => 400 ) );
		}

		return true;
	}

	/**
	 * Validate integers
	 *
	 * @param mixed           $value   Value of the my-arg parameter.
	 * @param WP_REST_Request $request Current request object.
	 * @param string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return true|WP_Error True if the data is valid, WP_Error otherwise.
	 */
	public function validate_integer( $value, $request, $param ) {
		$atts = $request->get_attributes();

		if ( isset( $atts['args'][$param] ) ) {
			$arg = $atts['args'][$param];

			if ( 'integer' === $arg['type'] && ! is_int( $value ) ) {
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s.', 'rhd' ), $param, 'string' ), array( 'status' => 400 ) );
			}
		} else {
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not specified as an argument', 'rhd' ), $param ), array( 'status' => 400 ) );
		}

		return true;
	}

	/**
	 * Validate date strings
	 *
	 * @param mixed           $value   Value of the my-arg parameter.
	 * @param WP_REST_Request $request Current request object.
	 * @param string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return true|WP_Error True if the data is valid, WP_Error otherwise.
	 */
	public function validate_date_string( $value, $request, $param ) {
		$atts = $request->get_attributes();

		if ( isset( $atts['args'][$param] ) ) {
			$arg = $atts['args'][$param];

			if ( 'string' === $arg['type'] && ! is_string( $value ) ) {
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s.', 'rhd' ), $param, 'string' ), array( 'status' => 400 ) );
			} elseif ( rhd_validate_date( $value ) === false ) {
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not a valid date.', 'rhd' ), $param ), array( 'status' => 400 ) );
			}
		} else {
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not specified as an argument', 'rhd' ), $param ), array( 'status' => 400 ) );
		}

		return true;
	}

	/**
	 * Sanitize strings.
	 *
	 * @param mixed           $value   Value of the my-arg parameter.
	 * @param WP_REST_Request $request Current request object.
	 * @param string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return mixed|WP_Error The sanitize value, or a WP_Error if the data could not be sanitized.
	 */
	function sanitize_string( $value, $request, $param ) {
		$attributes = $request->get_attributes();

		if ( isset( $attributes['args'][$param] ) ) {
			$argument = $attributes['args'][$param];

			if ( 'string' === $argument['type'] ) {
				return sanitize_text_field( $value );
			}
		} else {
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not registered as a request argument.', 'rhd' ), $param ), array( 'status' => 400 ) );
		}

		// If we got this far then something went wrong don't use user input.
		return new WP_Error( 'rest_api_sad', esc_html__( 'Something went terribly wrong.', 'rhd' ), array( 'status' => 500 ) );
	}

	/**
	 * Check if a given request has access to create items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function create_item_permissions_check( $request ) {
		return true; /*<--use to make readable by all*/
		// return current_user_can( 'edit_others_posts' );
	}

	/**
	 * Check if a given request has access to update a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to delete a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function delete_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Prepare the item for create or update operation
	 *
	 * @param WP_REST_Request $request Request object
	 * @return WP_Error|object $prepared_item
	 */
	protected function prepare_item_for_database( $request ) {
		$params = $request->get_params();
		$date   = rhd_wp_format_date( $params['post_date'] );

		$item = [
			'ID'              => $params['ID'],
			'post_date'       => $date['post_date'],
			'post_date_gmt'   => $date['post_date_gmt'],
			'post_status'     => $params['post_status'],
			'set_unscheduled' => $params['set_unscheduled'] == 1 ? 1 : 0,
		];

		return $item;
	}

	/**
	 * Prepare post ids with their indexes for updating the database.
	 */
	protected function prepare_unscheduled_items_for_database( $request ) {
		$ids = explode( ';', $request->get_param( 'ids' ) );

		$posts = [];
		foreach ( $ids as $id ) {
			$posts[] = $id;
		}

		return $posts;
	}

	/**
	 * Prepare the item for updating a user option.
	 */
	public function prepare_user_option_for_database( $request ) {
		$params = $request->get_params();

		// DEV
		$user_id = 1;
		// $user_id = get_current_user_id();

		return array(
			'user_id' => $user_id,
			'option'  => $params['option'],
			'value'   => $params['value'],
		);
	}

	/**
	 * Prepares the item for returning a user option
	 */
	public function prepare_user_option_for_response( $request ) {
		$option = $request->get_param( 'option' );

		// DEV
		$user_id = 1;
		// $user_id = get_current_user_id();

		return array(
			'user_id' => $user_id,
			'option'  => $option,
		);
	}

	/**
	 * Prepare the item for the REST response
	 *
	 * @param mixed $item WordPress representation of the item.
	 * @param WP_REST_Request $request Request object.
	 * @return array
	 */
	public function prepare_item_for_response( $item, $request ) {
		$post_date = new DateTime( $item->post_date );

		return [
			'id'          => $item->ID,
			'title'       => $item->post_title,
			'start'       => $post_date->format( 'Y-m-d H:i:s' ),
			'post_status' => $item->post_status,
			'color'       => rhd_get_status_color( $item->post_status ),
			'editable'    => ( new DateTime() <= $post_date ) ? true : false,
		];
	}

	/**
	 * Prepare an 'unscheduled' item for the REST response
	 *
	 * @param mixed $item WordPress representation of the item.
	 * @param WP_REST_Request $request Request object.
	 * @return array
	 */
	public function prepare_unscheduled_item_for_response( $item, $request ) {
		return array(
			'title' => $item->post_title,
			'date'  => $item->post_date,
			'id'    => $item->ID,
		);
	}

	/**
	 * Prepare the futuremost data for the REST response
	 *
	 * @param mixed $item WordPress representation of the item.
	 * @param WP_REST_Request $request Request object.
	 * @return array
	 */
	public function prepare_futuremost_item_for_response( $item, $request ) {
		return $item->post_date;
	}

	/**
	 * Get the query params for collections
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return array(
			'page'     => array(
				'description'       => 'Current page of the collection.',
				'type'              => 'integer',
				'default'           => 1,
				'sanitize_callback' => 'absint',
			),
			'per_page' => array(
				'description'       => 'Maximum number of items to be returned in result set.',
				'type'              => 'integer',
				'default'           => 10,
				'sanitize_callback' => 'absint',
			),
			'search'   => array(
				'description'       => 'Limit results to those matching a string.',
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}
}