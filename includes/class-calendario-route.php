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

		register_rest_route( $namespace, '/' . $post_base . '/scheduled/(?P<start>.*?)(/(?P<end>.*))?', array(
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

		register_rest_route( $namespace, '/' . $post_base . '/update/(?P<ID>\d+)', array(
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
	}

	/**
	 * Get a collection of items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$body = $request->get_params();

		$start = isset( $body['start'] ) && $body['start'] ? $body['start'] : null;
		$end   = isset( $body['end'] ) && $body['end'] ? $body['end'] : rhd_get_futuremost_date();

		// Force the date range to the beginning of the day 'start' and the end of day 'end'
		$start = rhd_end_of_day( $start );
		$end   = rhd_end_of_day( $end );

		$items = get_posts( array(
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'orderby'        => 'date',
			'order'          => 'ASC',
			'inclusive'      => true,
			'date_query'     => array(
				'before' => $end,
				'after'  => $start,
			),
			'meta_query'     => array(
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

		$data = [
			'posts'     => [],
			'dateRange' => [
				'start' => $start,
				'end'   => $end,
			],
		];

		foreach ( $items as $item ) {
			$data['posts'][] = $this->prepare_item_for_response( $item, $request );
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

		$data = [
			'posts' => [],
		];

		foreach ( $items as $item ) {
			$data['posts'][] = $this->prepare_item_for_response( $item, $request );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	// public function get_item( $request ) {
	// 	$data = $this->prepare_item_for_response( $item, $request );

	// 	//return a response or error based on some conditional
	// 	if ( 1 == 1 ) {
	// 		return new WP_REST_Response( $data, 200 );
	// 	} else {
	// 		return new WP_Error( 'code', __( 'message', 'rhd' ) );
	// 	}
	// }

	/**
	 * Update one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		$item = $this->prepare_item_for_database( $request );

		// Update the post
		$result = wp_update_post( $item );

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
			return new WP_REST_Response( 'Option updated.', 200 );
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
			'start' => array(
				'description'       => esc_html__( 'Start date', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_date_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),
			'end'   => array(
				'description'       => esc_html__( 'End date', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_date_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => false,
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
		return true; // DEV ONLY; NO AUTHENTICATION
		// return current_user_can( 'edit_others_posts' );
	}

	/**
	 * Check if a given request has access to update a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_item_permissions_check( $request ) {
		return true; // DEV ONLY; NO AUTHENTICATION
		// return $this->create_item_permissions_check( $request );
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
		$params   = $request->get_params();
		$postData = json_decode( $request->get_body(), true );

		$item = [
			'ID' => $params['ID'],
		];

		if ( $postData['unscheduled'] === true ) {
			$item['meta_input'] = [
				RHD_UNSCHEDULED_META_KEY => 1,
			];
		} else {
			$item['meta_input'] = [
				RHD_UNSCHEDULED_META_KEY => 0,
			];
		}

		foreach ( $postData['params'] as $key => $value ) {
			if ( $key === 'post_date' ) {
				$date = rhd_wp_format_date( $value );

				$item['post_date']     = $date['post_date'];
				$item['post_date_gmt'] = $date['post_date_gmt'];

			} else {
				$item[$key] = $value;
			}
		}

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
			'post_title'  => $item->post_title,
			'post_date'   => $post_date->format( 'Y-m-d H:i:s' ),
			'post_status' => $item->post_status,
		];
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