<?php
class Calendario_Route extends WP_REST_Controller {
	function __construct() {
		add_action( 'rest_api_init', [$this, 'register_routes'] );
	}

	public function register_routes() {
		$version     = '1';
		$namespace   = 'calendario/v' . $version;
		$post_base   = 'posts';
		$tax_base    = 'tax';
		$status_base = 'statuses';

		register_rest_route( $namespace, '/' . $post_base . '/scheduled/(?P<start>.*?)(/(?P<end>.*))?', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_scheduled_items'],
				'permission_callback' => [$this, 'get_items_permissions_check'],
				'args'                => [$this->get_range_endpoint_args()],
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/unscheduled', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_unscheduled_items'],
				'permission_callback' => [$this, 'get_items_permissions_check'],
			],
		] );

		register_rest_route( $namespace, '/' . $tax_base . '/(?P<taxonomy>\w+)', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_taxonomy_terms'],
				'permission_callback' => [$this, 'options_permissions_check'],
				'args'                => [$this->get_taxonomy_endpoint_args()],
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/update/(?P<ID>\d+)/(?P<user_id>\d+)', [
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'update_item'],
				'permission_callback' => [$this, 'update_item_permissions_check'],
				'args'                => [$this->get_update_post_endpoint_args()],
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/new/(?P<user_id>\d+)', [
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'create_item'],
				'permission_callback' => [$this, 'create_item_permissions_check'],
				'args'                => [$this->get_create_post_endpoint_args()],
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/trash/(?P<ID>\d+)/(?P<user_id>\d+)', [
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'trash_item'],
				'permission_callback' => [$this, 'trash_item_permissions_check'],
				'args'                => [$this->get_update_post_endpoint_args()],
			],
		] );

		register_rest_route( $namespace, '/' . $status_base, [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_post_statuses'],
				'permission_callback' => [$this, 'options_permissions_check'],
			],
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'update_post_statuses'],
				'permission_callback' => [$this, 'options_permissions_check'],
			],
		] );
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		return true;
	}

	/**
	 * @param WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function options_permissions_check( $request ) {
		return true;
	}

	/**
	 * Check if a given request has access to create items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function create_item_permissions_check( $request ) {
		$params = $request->get_params();

		if ( ! isset( $params['user_id'] ) ) {
			return false;
		}

		return user_can( $params['user_id'], 'edit_others_posts' );
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
	 * Check if a given request has access to trash a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function trash_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Get argument schema for post data.
	 *
	 * @return array $args
	 */
	public function get_range_endpoint_args() {
		return [
			'start' => [
				'description'       => esc_html__( 'Start date', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_date_string'],
				'sanitize_callback' => [$this, 'sanitize_string'],
				'required'          => true,
			],
			'end'   => [
				'description'       => esc_html__( 'End date', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_date_string'],
				'sanitize_callback' => [$this, 'sanitize_string'],
				'required'          => true,
			],
		];
	}

	/**
	 * Get argument schema for taxonomy data.
	 */
	public function get_taxonomy_endpoint_args() {
		return [
			'taxonomy' => [
				'description'       => esc_html__( 'Taxonomy name', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_string'],
				'sanitize_callback' => [$this, 'sanitize_string'],
				'required'          => true,
			],
		];
	}

	/**
	 * Get argument schema for update post data.
	 */
	public function get_update_post_endpoint_args() {
		return [
			'post_id' => [
				'description'       => esc_html__( 'Post ID', 'rhd' ),
				'type'              => 'int',
				'validate_callback' => [$this, 'validate_integer'],
				'sanitize_callback' => 'absint',
				'required'          => true,
			],
			'user_id' => [
				'description'       => esc_html__( 'User ID', 'rhd' ),
				'type'              => 'int',
				'validate_callback' => [$this, 'validate_integer'],
				'sanitize_callback' => 'absint',
				'required'          => true,
			],
		];
	}

	/**
	 * Get argument schema for new post data.
	 */
	public function get_create_post_endpoint_args() {
		return [
			'user_id' => [
				'description'       => esc_html__( 'User ID', 'rhd' ),
				'type'              => 'int',
				'validate_callback' => [$this, 'validate_integer'],
				'sanitize_callback' => 'absint',
				'required'          => true,
			],
		];
	}

	/**
	 * Get endpoint args.
	 */
	public function get_item_endpoint_args() {
		return [
			'ID'          => [
				'description'       => esc_html__( 'Post ID', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_integer'],
				'sanitize_callback' => 'absint',
				'required'          => true,
			],

			'post_date'   => [
				'description'       => esc_html__( 'New post date', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_date_string'],
				'sanitize_callback' => [$this, 'sanitize_string'],
				'required'          => true,
			],

			'post_status' => [
				'description'       => esc_html__( 'New post status', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_string'],
				'sanitize_callback' => [$this, 'sanitize_string'],
				'required'          => false,
				'default'           => '',
			],
		];
	}

	/**
	 * Get endpoint args for updating a post.
	 *
	 * @return array
	 */
	public function get_update_item_endpoint_args() {
		return [
			'ID' => [
				'description'       => esc_html__( 'Post ID', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_integer'],
				'sanitize_callback' => 'absint',
				'required'          => true,
			],
		];
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
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s.', 'rhd' ), $param, 'string' ), ['status' => 400] );
			}
		} else {
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not specified as an argument', 'rhd' ), $param ), ['status' => 400] );
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
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s.', 'rhd' ), $param, 'string' ), ['status' => 400] );
			}
		} else {
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not specified as an argument', 'rhd' ), $param ), ['status' => 400] );
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
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not of type %2$s.', 'rhd' ), $param, 'string' ), ['status' => 400] );
			} elseif ( rhd_validate_date( $value ) === false ) {
				return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%1$s is not a valid date.', 'rhd' ), $param ), ['status' => 400] );
			}
		} else {
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not specified as an argument', 'rhd' ), $param ), ['status' => 400] );
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
			return new WP_Error( 'rest_invalid_param', sprintf( esc_html__( '%s was not registered as a request argument.', 'rhd' ), $param ), ['status' => 400] );
		}

		// If we got this far then something went wrong don't use user input.
		return new WP_Error( 'rest_api_sad', esc_html__( 'Something went terribly wrong.', 'rhd' ), ['status' => 500] );
	}

	/**
	 * Get a collection of items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_scheduled_items( $request ) {
		$body = $request->get_params();

		$start = isset( $body['start'] ) && $body['start'] ? $body['start'] : null;
		$end   = isset( $body['end'] ) && $body['end'] ? $body['end'] : rhd_get_futuremost_date();

		// Force the date range to the beginning of the day 'start' and the end of day 'end'
		$start = rhd_start_of_day( $start );
		$end   = rhd_end_of_day( $end );

		$items = get_posts( [
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'orderby'        => 'date',
			'order'          => 'ASC',
			'inclusive'      => true,
			'date_query'     => [
				'before' => $end,
				'after'  => $start,
			],
			'meta_query'     => [
				[
					'key'     => RHD_UNSCHEDULED_INDEX_META_KEY,
					'compare' => 'NOT EXISTS',
				],
			],
		] );

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
		$items = rhd_query_unscheduled_items();

		$data = [
			'posts' => [],
		];

		foreach ( $items as $item ) {
			$data['posts'][] = $this->prepare_item_for_response( $item, $request );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get a collection of taxonomy terms
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_taxonomy_terms( $request ) {
		$params = $request->get_params();
		if ( isset( $params['taxonomy'] ) ) {
			$tax = get_taxonomy( $params['taxonomy'] );

			$terms = get_terms( array(
				'taxonomy'   => $tax->name,
				'hide_empty' => false,
			) );

			$data = [
				'taxonomy' => [
					'slug'          => $tax->name,
					'name'          => $tax->labels->name,
					'singular_name' => $tax->labels->singular_name,
				],
				'terms'    => [],
			];

			foreach ( $terms as $term ) {
				$data['terms'][] = [
					'term_id' => $term->term_id,
					'name'    => $term->name,
					'slug'    => $term->slug,
				];
			}
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Create or update one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		$item  = $this->prepare_existing_item_for_database( $request );
		$terms = rhd_extract_item_taxonomy_terms( $item );

		// Update the post
		$result = wp_update_post( $item );

		// Add taxonomy data and return success response
		if ( $result !== false && ! is_wp_error( $result ) ) {
			$this->update_post_taxonomy_terms( $result, $terms );

			return new WP_REST_Response( 'Updated post ' . $result, 200 );
		}

		return new WP_Error( 'cant-update', __( 'message', 'rhd' ), ['status' => 500] );
	}

	/**
	 * Create a new item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		$item = $this->prepare_new_item_for_database( $request );

		$taxonomies = rhd_extract_item_taxonomy_terms( $item );

		// Create the post
		$result = wp_insert_post( $item );

		// Add taxonomy data and return success response
		if ( ! is_wp_error( $result ) && $result !== 0 ) {
			$tax_result = $this->update_post_taxonomy_terms( $result, $taxonomies );

			if ( ! is_wp_error( $tax_result ) ) {
				return new WP_REST_Response( 'Updated post ' . $result, 200 );
			}
		}

		// TODO meaningful error message for tax and/or wp_insert_post result
		return new WP_Error( 'error-updating', __( 'message', 'rhd' ), ['status' => 500] );
	}

	/**
	 * Delete one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function trash_item( $request ) {
		$id = $this->prepare_item_for_trash( $request );

		$trashed = wp_delete_post( $id, false );

		if ( $trashed ) {
			return new WP_REST_Response( 'Post trashed.', 200 );
		}

		return new WP_Error( 'cant-trash', __( 'message', 'rhd' ), ['status' => 500] );
	}

	/**
	 * Updates post taxnomy terms
	 *
	 * @param int $id The post ID to update
	 * @param array $taxonomies The taxonomy data
	 * @return array|WP_Error The result of wp_set_object_terms() if true, WP_Error otherwise.
	 */
	protected function update_post_taxonomy_terms( $id, $taxonomies ) {
		if ( empty( $taxonomies['tax_input'] ) || ! isset( $taxonomies['tax_input'] ) ) {
			return;
		}

		foreach ( $taxonomies['tax_input'] as $taxonomy => $terms ) {
			$result = wp_set_object_terms( $id, $terms, $taxonomy, false );
		}

		if ( is_wp_error( $result ) ) {
			return new WP_Error( 'cant-update-taxonomies', __( 'message', 'rhd' ), ['status' => 500] );
		}
	}

	/**
	 * Gets post status data.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_post_statuses( $request ) {
		$statuses = rhd_prepare_post_statuses();

		if ( $statuses ) {
			return new WP_REST_Response( $statuses, 200 );
		}

		return new WP_REST_Response( false, 200 );
	}

	/**
	 * Updates an option in the database using update_option().
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_post_statuses( $request ) {
		// $data = $this->prepare_post_statuses_for_database( $request );
		$body = $request->get_params();

		$result = update_option( RHD_POST_STATUS_COLOR_OPTION_KEY, $body );

		if ( $result !== false ) {
			return new WP_REST_Response( 'Post status colors updated.', 200 );
		}

		return new WP_Error( 'colors-not-updated', __( 'message', 'rhd' ), ['status' => 200] );
	}

	/**
	 * Moves an unscheduled draft post to a new position in the list,
	 *   or adds a post to the list at the desired position.
	 *
	 * @param int Post ID
	 * @param int The new index for this post
	 * @return void
	 */
	protected function reorder_unscheduled_drafts( $id, $newIndex ) {
		$currentIndex = get_post_meta( $id, RHD_UNSCHEDULED_INDEX_META_KEY, true );

		if ( $currentIndex === $newIndex ) {
			return;
		}

		$posts = rhd_get_unscheduled_item_ids();

		$newIndex = $newIndex === false ? count( $posts ) : $newIndex;

		if ( $currentIndex === '' || $currentIndex < 0 ) {
			// newly unscheduled, insert at position
			array_splice( $posts, $newIndex, 0, $id );
		} else {
			// reordering
			$old = array_splice( $posts, $currentIndex, 1 );
			array_splice( $posts, $newIndex, 0, $old );
		}

		for ( $i = 0; $i < count( $posts ); $i++ ) {
			$result = update_post_meta( $posts[$i], RHD_UNSCHEDULED_INDEX_META_KEY, $i );
		}
	}

	/**
	 * Adds a 'meta_input' array arg to append this post to the unscheduled drafts list.
	 *
	 * @param array &$item The args array for wp_update_post/wp_insert_post
	 * @return void
	 */
	protected function prepare_new_item_for_unscheduled( &$item ) {
		$item['meta_input'][RHD_UNSCHEDULED_INDEX_META_KEY] = rhd_unscheduled_draft_count();
	}

	/**
	 * Prepare the item for create or update operation
	 *
	 * @param WP_REST_Request $request Request object
	 * @return WP_Error|array $prepared_item
	 */
	protected function prepare_existing_item_for_database( $request ) {
		$params = $request->get_params();
		$item   = [];
		if ( ! isset( $params['ID'] ) ) {
			return;
		}

		$item = [
			'ID'         => $params['ID'],
			'meta_input' => [
				'_edit_last' => $params['user_id'],
			],
		];

		// Handle unscheduled post order and statuses
		$this->prepare_scheduled_unscheduled( $item, $params );

		// Post data
		if ( isset( $params['params'] ) ) {
			$this->prepare_item_params_for_database( $item, $params['params'] );
		}

		return $item;
	}

	/**
	 * Prepare the item for create operation
	 *
	 * @param WP_REST_Request $request Request object
	 * @return WP_Error|array $prepared_item
	 */
	protected function prepare_new_item_for_database( $request ) {
		$params = $request->get_params();
		$item   = ['ID' => 0, 'user_id' => $params['user_id']];

		$this->prepare_scheduled_unscheduled( $item, $params );

		// Post data
		if ( isset( $params['params'] ) ) {
			$this->prepare_item_params_for_database( $item, $params['params'] );
		}

		return $item;
	}

	/**
	 * Reorders unscheduled posts and filters allowed post statuses.
	 *
	 * @param array &$item The args array for wp_update_post/wp_insert_post
	 * @param array $params The post data
	 * @return void
	 */
	protected function prepare_scheduled_unscheduled( &$item, $params ) {
		if ( isset( $params['unscheduled'] ) && $params['unscheduled'] === true ) {
			if ( $item['ID'] === 0 ) {
				$this->prepare_new_item_for_unscheduled( $item );
			} elseif ( isset( $params['newIndex'] ) ) {
				$this->reorder_unscheduled_drafts( $item['ID'], $params['newIndex'] );
			}

			// Make sure post is either Draft or Private
			$post_status = get_post_status( $item['ID'] );
			if ( $post_status !== 'draft' && $post_status !== 'private' ) {
				$item['post_status'] = 'draft';
			}
		} else {
			delete_post_meta( $item['ID'], RHD_UNSCHEDULED_INDEX_META_KEY );
		}
	}

	/**
	 * Processes post data for merging with wp_update_post/wp_insert_post args array.
	 *
	 * @param array &$item The args array for wp_update_post/wp_insert_post
	 * @param array $params The post params
	 * @return void
	 */
	protected function prepare_item_params_for_database( &$item, $params ) {
		$this->prepare_post_date_for_database( $item, $params );
		$this->prepare_tax_input_for_database( $item, $params );

		// Remaining params
		$skip = ['post_date', 'taxonomies'];
		foreach ( $params as $key => $value ) {
			if ( ! isset( $item[$key] ) && ! in_array( $key, $skip ) ) {
				$item[$key] = $value;
			}
		}
	}

	/**
	 * Sets up the 'post_date' and 'post_date_gmt' params for storage
	 *
	 * @param array &$item The args array for wp_update_post/wp_insert_post
	 * @param array $params The post params
	 * @return void
	 */
	protected function prepare_post_date_for_database( &$item, $params ) {
		if ( isset( $params['post_date'] ) ) {
			$post_date             = rhd_wp_prepare_date( $params['post_date'] );
			$item['post_date']     = $post_date['post_date'];
			$item['post_date_gmt'] = $post_date['post_date_gmt'];
		}
	}

	/**
	 * Sets up the 'tax_input' param for storage
	 *
	 * @param array &$item The args array for wp_update_post/wp_insert_post
	 * @param array $params The post params
	 * @return void
	 */
	protected function prepare_tax_input_for_database( &$item, $params ) {
		if ( isset( $params['taxonomies'] ) ) {
			foreach ( $params['taxonomies'] as $taxonomy => $terms ) {
				$item['tax_input'][$taxonomy] = $terms;
			}
		}
	}

	/**
	 * Prepare the item for trash operation
	 *
	 * @param WP_REST_Request $request Request object
	 * @return WP_Error|int Post ID to trash
	 */
	protected function prepare_item_for_trash( $request ) {
		$params = $request->get_params();

		return $params['ID'];
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
			'id'           => $item->ID,
			'post_title'   => $item->post_title,
			'post_date'    => $post_date->format( 'Y-m-d H:i:s' ),
			'post_status'  => $item->post_status,
			'post_excerpt' => $item->post_excerpt,
			'image'        => get_the_post_thumbnail_url( $item->ID, 'post-thumbnail' ),
			'edit_link'    => get_edit_post_link( $item->ID ),
			'view_link'    => get_the_permalink( $item->ID ),
			'taxonomies'   => [
				'category' => rhd_get_term_ids( $item->ID, 'category' ),
				'post_tag' => rhd_get_term_ids( $item->ID, 'post_tag' ),
			],
		];
	}
}
