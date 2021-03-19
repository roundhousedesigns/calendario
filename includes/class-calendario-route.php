<?php
class Calendario_Route extends WP_REST_Controller {
	function __construct() {
		add_action( 'rest_api_init', [$this, 'register_routes'] );
	}

	public function register_routes() {
		$version   = '1';
		$namespace = 'calendario/v' . $version;
		$post_base = 'posts';
		$user_base = 'user';

		register_rest_route( $namespace, '/' . $post_base . '/scheduled/(?P<start>.*?)(/(?P<end>.*))?', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_items'],
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

		register_rest_route( $namespace, '/' . $post_base . '/trashed', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_trashed_items'],
				'permission_callback' => [$this, 'get_items_permissions_check'],
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/tax/(?P<taxonomy>\w+)', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_taxonomy_terms'],
				'permission_callback' => [$this, 'get_items_permissions_check'],
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/update/(?P<ID>\d+)', [
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'update_item'],
				'permission_callback' => [$this, 'update_item_permissions_check'],
				'args'                => $this->get_endpoint_args_for_item_schema(),
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/new', [
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'create_item'],
				'permission_callback' => [$this, 'update_item_permissions_check'],
				'args'                => $this->get_endpoint_args_for_item_schema(),
			],
		] );

		register_rest_route( $namespace, '/' . $post_base . '/trash/(?P<ID>\d+)', [
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'trash_item'],
				'permission_callback' => [$this, 'update_item_permissions_check'],
				'args'                => $this->get_endpoint_args_for_item_schema(),
			],
		] );

		register_rest_route( $namespace, '/' . $user_base . '/(?P<option>[\w]+)/(?P<value>[\w]+)', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [$this, 'get_user_option'],
				'permission_callback' => [$this, 'user_permissions_check'],
				'args'                => [$this->get_user_option_endpoint_args()],
			],
			[
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => [$this, 'update_user_option'],
				'permission_callback' => [$this, 'user_permissions_check'],
				'args'                => [$this->get_user_option_endpoint_args()],
			],
		] );
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
					'key'     => RHD_UNSCHEDULED_INDEX,
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
		$items = $this->query_unscheduled_items();

		$data = [
			'posts' => [],
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
	public function get_trashed_items( $request ) {
		$items = get_posts( [
			'posts_per_page' => -1,
			'post_status'    => 'trash',
		] );

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
	 * Runs the query for all unscheduled posts
	 *
	 * @return array The queried posts.
	 */
	protected function query_unscheduled_items() {
		return get_posts( [
			'meta_query'     => [
				[
					'key'     => RHD_UNSCHEDULED_INDEX,
					'compare' => 'EXISTS',
				],
			],
			'orderby'        => 'meta_value_num',
			'order'          => 'ASC',
			'meta_key'       => RHD_UNSCHEDULED_INDEX,
			'posts_per_page' => -1,
			'post_status'    => 'any',
		] );
	}

	/**
	 * Creates an array of unscheduled post IDs
	 *
	 * @return array The queried post IDs.
	 */
	protected function get_unscheduled_item_ids() {
		$posts = $this->query_unscheduled_items();

		$ids = [];
		foreach ( $posts as $post ) {
			$ids[] = $post->ID;
		}

		return $ids;
	}

	/**
	 * Create or update one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		$item = $this->prepare_item_for_database( $request );

		if ( array_key_exists( 'tax_input', $item ) ) {
			// Update categories and tags ('tax_input' doesn't work without assign_terms privileges)
			$tax_index  = array_search( 'tax_input', array_keys( $item ) );
			$taxonomies = array_splice( $item, $tax_index, 1 );

			if ( ! empty( $taxonomies['tax_input'] ) ) {
				$result = [];
				foreach ( $taxonomies['tax_input'] as $taxonomy => $terms ) {
					$result = wp_set_object_terms( $item['ID'], $terms, $taxonomy, false );
				}

				if ( is_wp_error( $result ) ) {
					return new WP_Error( 'cant-update-taxonomies', __( 'message', 'rhd' ), ['status' => 500] );
				}
			}
		}

		// Update the post
		$result = wp_update_post( $item );

		if ( $result !== false && ! is_wp_error( $result ) ) {
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
		$item = $this->prepare_item_for_database( $request );

		// Update categories and tags ('tax_input' doesn't work without assign_terms privileges)
		$tax_index  = array_search( 'tax_input', array_keys( $item ) );
		$taxonomies = array_splice( $item, $tax_index, 1 );

		// Update the post
		$result = wp_insert_post( $item );

		if ( ! empty( $taxonomies['tax_input'] ) && ! is_wp_error( $result ) ) {
			foreach ( $taxonomies['tax_input'] as $taxonomy => $terms ) {
				$terms_result = wp_set_object_terms( $result, $terms, $taxonomy, false );
			}

			if ( is_wp_error( $terms_result ) ) {
				return new WP_Error( 'cant-update-taxonomies', __( 'message', 'rhd' ), ['status' => 500] );
			}
		}

		if ( $result !== 0 && ! is_wp_error( $result ) ) {
			return new WP_REST_Response( 'Updated post ' . $result, 200 );
		}

		return new WP_Error( 'cant-update', __( 'message', 'rhd' ), ['status' => 500] );
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
			$result = update_post_meta( $items[$i], RHD_UNSCHEDULED_INDEX, $i );
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

		return new WP_Error( 'user-not-updated', __( 'message', 'rhd' ), ['status' => 200] );
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
				'required'          => false,
			],
		];
	}

	public function get_user_option_endpoint_args() {
		return [
			'option' => [
				'description'       => esc_html__( 'User option name', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_string'],
				'sanitize_callback' => [$this, 'sanitize_string'],
				'required'          => true,
			],
			'value'  => [
				'description'       => esc_html__( 'User option value', 'rhd' ),
				'type'              => 'string',
				'validate_callback' => [$this, 'validate_string'],
				'sanitize_callback' => [$this, 'sanitize_string'],
				'required'          => false,
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
	 * Check if a given request has access to trash a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function trash_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	protected function reorder_unscheduled_post( $id, $newIndex ) {
		$currentIndex = get_post_meta( $id, RHD_UNSCHEDULED_INDEX, true );
		if ( $currentIndex === $newIndex ) {
			return;
		}

		$posts = $this->get_unscheduled_item_ids();

		$newIndex = $newIndex === false ? count( $posts ) : $newIndex;

		if ( $currentIndex === '' ) {
			// newly unscheduled, insert at position
			array_splice( $posts, $newIndex, 0, $id );
		} else {
			$old = array_splice( $posts, $currentIndex, 1 );
			array_splice( $posts, $newIndex, 0, $old );
			// reordering
		}

		$i = 0;
		foreach ( $posts as $id ) {
			update_post_meta( $id, RHD_UNSCHEDULED_INDEX, $i );
			$i++;
		}
	}

	/**
	 * Prepare the item for create or update operation
	 *
	 * @param WP_REST_Request $request Request object
	 * @return WP_Error|array $prepared_item
	 */
	protected function prepare_item_for_database( $request ) {
		$params = $request->get_params();

		$item = ['ID' => isset( $params['ID'] ) ? $params['ID'] : 0];

		// Existing posts
		$item = [
			'ID' => isset( $params['ID'] ) ? $params['ID'] : 0,
		];

		if ( isset( $params['unscheduled'] ) && $params['unscheduled'] === true ) {
			if ( $item['ID'] === 0 ) {
				// New post
				$item['meta_input'] = [
					RHD_UNSCHEDULED_INDEX => rhd_unscheduled_draft_count(),
				];
			} else {
				$draggedTo = isset( $params['draggedTo'] ) ? $params['draggedTo'] : false;
				$this->reorder_unscheduled_post( $params['ID'], $draggedTo );

				// Make sure post is either Draft or Private
				$post_status = get_post_status( $item['ID'] );
				if ( $post_status !== 'draft' && $post_status !== 'private' ) {
					$item['post_status'] = 'draft';
				}
			}

		} else {
			delete_post_meta( $params['ID'], RHD_UNSCHEDULED_INDEX );
		}

		if ( isset( $params['params'] ) ) {
			foreach ( $params['params'] as $key => $value ) {
				if ( $key === 'post_date' ) {
					// Post Date
					$date                  = rhd_wp_prepare_date( $params['params']['post_date'] );
					$item['post_date']     = $date['post_date'];
					$item['post_date_gmt'] = $date['post_date_gmt'];
				} elseif ( $key === 'taxonomies' ) {
					// Taxonomy terms
					$item['tax_input'] = [];
					foreach ( $params['params']['taxonomies'] as $taxonomy => $terms ) {
						$item['tax_input'][$taxonomy] = $terms;
					}
				} else {
					$item[$key] = $value;
				}
			}
		}

		return $item;
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

		return [
			'user_id' => $user_id,
			'option'  => $params['option'],
			'value'   => $params['value'],
		];
	}

	/**
	 * Prepares the item for returning a user option
	 */
	public function prepare_user_option_for_response( $request ) {
		$option = $request->get_param( 'option' );

		// DEV
		$user_id = 1;
		// $user_id = get_current_user_id();

		return [
			'user_id' => $user_id,
			'option'  => $option,
		];
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

	/**
	 * Get the query params for collections
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return [
			'page'     => [
				'description'       => 'Current page of the collection.',
				'type'              => 'integer',
				'default'           => 1,
				'sanitize_callback' => 'absint',
			],
			'per_page' => [
				'description'       => 'Maximum number of items to be returned in result set.',
				'type'              => 'integer',
				'default'           => 10,
				'sanitize_callback' => 'absint',
			],
			'search'   => [
				'description'       => 'Limit results to those matching a string.',
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			],
		];
	}
}
