<?php
/**
 * Calendario REST routes.
 *
 * @package rhd
 *
 * phpcs:disable WordPress.Arrays.ArrayKeySpacingRestrictions.NoSpacesAroundArrayKeys
 */

/**
 * Class Calendario_Route.
 */
class Calendario_Route extends WP_REST_Controller {
	/**
	 * Initialization.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		$version     = '1';
		$namespace   = 'calendario/v' . $version;
		$post_base   = 'posts';
		$tax_base    = 'tax';
		$status_base = 'statuses';

		register_rest_route(
			$namespace,
			'/' . $post_base . '/scheduled/(?P<start>.*?)(/(?P<end>.*))?',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_scheduled_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array( $this->get_range_endpoint_args() ),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $post_base . '/unscheduled',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_unscheduled_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $tax_base . '/(?P<taxonomy>\w+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_taxonomy_terms' ),
					'permission_callback' => array( $this, 'options_permissions_check' ),
					'args'                => array( $this->get_taxonomy_endpoint_args() ),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $post_base . '/update/(?P<ID>\d+)/(?P<user_id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array( $this->get_update_post_endpoint_args() ),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $post_base . '/new/(?P<user_id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => array( $this->get_create_post_endpoint_args() ),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $post_base . '/trash/(?P<ID>\d+)/(?P<user_id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'trash_item' ),
					'permission_callback' => array( $this, 'trash_item_permissions_check' ),
					'args'                => array( $this->get_update_post_endpoint_args() ),
				),
			)
		);

		register_rest_route(
			$namespace,
			'/' . $status_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_post_statuses' ),
					'permission_callback' => array( $this, 'options_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_post_statuses' ),
					'permission_callback' => array( $this, 'options_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Check if a given request has access to create items.
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function create_item_permissions_check( $request ) {
		// DEBUG.
		return true;

		$user = wp_get_current_user();
		return user_can( $user, 'edit_others_posts' );
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Options permissions check.
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function options_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to update a specific item
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to trash a specific item
	 *
	 * @param  WP_REST_Request $request Full data about the request.
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
		return array(
			'start' => array(
				'description'       => esc_html__( 'Start date', 'calendario' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_date_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),
			'end'   => array(
				'description'       => esc_html__( 'End date', 'calendario' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_date_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),
		);
	}

	/**
	 * Get argument schema for taxonomy data.
	 */
	public function get_taxonomy_endpoint_args() {
		return array(
			'taxonomy' => array(
				'description'       => esc_html__( 'Taxonomy name', 'calendario' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),
		);
	}

	/**
	 * Get argument schema for update post data.
	 */
	public function get_update_post_endpoint_args() {
		return array(
			'post_id' => array(
				'description'       => esc_html__( 'Post ID', 'calendario' ),
				'type'              => 'int',
				'validate_callback' => array( $this, 'validate_integer' ),
				'sanitize_callback' => 'absint',
				'required'          => true,
			),
			'user_id' => array(
				'description'       => esc_html__( 'User ID', 'calendario' ),
				'type'              => 'int',
				'validate_callback' => array( $this, 'validate_integer' ),
				'sanitize_callback' => 'absint',
				'required'          => true,
			),
		);
	}

	/**
	 * Get argument schema for new post data.
	 */
	public function get_create_post_endpoint_args() {
		return array(
			'user_id' => array(
				'description'       => esc_html__( 'User ID', 'calendario' ),
				'type'              => 'int',
				'validate_callback' => array( $this, 'validate_integer' ),
				'sanitize_callback' => 'absint',
				'required'          => true,
			),
		);
	}

	/**
	 * Get endpoint args.
	 */
	public function get_item_endpoint_args() {
		return array(
			'ID'          => array(
				'description'       => esc_html__( 'Post ID', 'calendario' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_integer' ),
				'sanitize_callback' => 'absint',
				'required'          => true,
			),

			'post_date'   => array(
				'description'       => esc_html__( 'New post date', 'calendario' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_date_string' ),
				'sanitize_callback' => array( $this, 'sanitize_string' ),
				'required'          => true,
			),

			'post_status' => array(
				'description'       => esc_html__( 'New post status', 'calendario' ),
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
				'description'       => esc_html__( 'Post ID', 'calendario' ),
				'type'              => 'string',
				'validate_callback' => array( $this, 'validate_integer' ),
				'sanitize_callback' => 'absint',
				'required'          => true,
			),
		);
	}

	/**
	 * Validate strings
	 *
	 * @param  mixed           $value   Value of the my-arg parameter.
	 * @param  WP_REST_Request $request Current request object.
	 * @param  string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return true|WP_Error   True if the data is valid, WP_Error otherwise.
	 */
	public function validate_string( $value, $request, $param ) {
		$atts = $request->get_attributes();

		if ( isset( $atts['args'][$param] ) ) {

			$arg = $atts['args'][$param];

			if ( 'string' === $arg['type'] && ! is_string( $value ) ) {
				return new WP_Error(
					'rest_invalid_param',
					sprintf(
						// Translators: %s: Name of the parameter, %s: "string".
						esc_html__( '%1$s is not of type %2$s.', 'calendario' ),
						$param,
						'string'
					),
					array( 'status' => 400 )
				);
			}
		} else {
			return new WP_Error(
				'rest_invalid_param',
				sprintf(
					// Translators: %s: Name of the parameter.
					esc_html__( '%s was not specified as an argument', 'calendario' ),
					$param
				),
				array( 'status' => 400 )
			);
		}

		return true;
	}

	/**
	 * Validate integers
	 *
	 * @param  mixed           $value   Value of the my-arg parameter.
	 * @param  WP_REST_Request $request Current request object.
	 * @param  string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return true|WP_Error   True if the data is valid, WP_Error otherwise.
	 */
	public function validate_integer(
		$value,
		$request,
		$param
	) {
		$atts = $request->get_attributes();

		if ( isset( $atts['args'][$param] ) ) {

			$arg = $atts['args'][$param];

			if ( 'integer' === $arg['type'] && ! is_int( $value ) ) {
				return new WP_Error(
					'rest_invalid_param',
					sprintf(
						// Translators: %s: Name of the parameter, %s: "string".
						esc_html__( '%1$s is not of type %2$s.', 'calendario' ),
						$param,
						'string'
					),
					array( 'status' => 400 )
				);
			}
		} else {
			return new WP_Error(
				'rest_invalid_param',
				sprintf(
					// Translators: %s: Name of the parameter.
					esc_html__( '%s was not specified as an argument', 'calendario' ),
					$param
				),
				array( 'status' => 400 )
			);
		}

		return true;
	}

	/**
	 * Validate date strings
	 *
	 * @param  mixed           $value   Value of the my-arg parameter.
	 * @param  WP_REST_Request $request Current request object.
	 * @param  string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return true|WP_Error   True if the data is valid, WP_Error otherwise.
	 */
	public function validate_date_string(
		$value,
		$request,
		$param
	) {
		$atts = $request->get_attributes();

		if ( isset( $atts['args'][$param] ) ) {

			$arg = $atts['args'][$param];

			if ( 'string' === $arg['type'] && ! is_string( $value ) ) {
				return new WP_Error(
					'rest_invalid_param',
					sprintf(
						// Translators: %s: Name of the parameter, %s: "string".
						esc_html__( '%1$s is not of type %2$s.', 'calendario' ),
						$param,
						'string'
					),
					array( 'status' => 400 )
				);
			} elseif ( rhd_validate_date( $value ) === false ) {
				return new WP_Error(
					'rest_invalid_param',
					sprintf(
						// Translators: %s: Name of the parameter.
						esc_html__( '%1$s is not a valid date.', 'calendario' ),
						$param
					),
					array( 'status' => 400 )
				);
			}
		} else {
			return new WP_Error(
				'rest_invalid_param',
				sprintf(
					// Translators: %s: Name of the parameter.
					esc_html__( '%s was not specified as an argument', 'calendario' ),
					$param
				),
				array( 'status' => 400 )
			);
		}

		return true;
	}

	/**
	 * Sanitize strings.
	 *
	 * @param  mixed           $value   Value of the my-arg parameter.
	 * @param  WP_REST_Request $request Current request object.
	 * @param  string          $param   The name of the parameter in this case, 'my-arg'.
	 * @return mixed|WP_Error  The sanitize value, or a WP_Error if the data could not be sanitized.
	 */
	public function sanitize_string( $value, $request, $param ) {
		$attributes = $request->get_attributes();

		if ( isset( $attributes['args'][$param] ) ) {

			$argument = $attributes['args'][$param];

			if ( 'string' === $argument['type'] ) {
				return sanitize_text_field( $value );
			}
		} else {
			return new WP_Error(
				'rest_invalid_param',
				sprintf(
					// Translators: %s: Name of the parameter.
					esc_html__( '%s was not registered as a request argument.', 'calendario' ),
					$param
				),
				array( 'status' => 400 )
			);
		}

		// If we got this far then something went wrong don't use user input.
		return new WP_Error(
			'rest_api_sad',
			esc_html__( 'Something went terribly wrong.', 'calendario' ),
			array( 'status' => 500 )
		);
	}

	/**
	 * Get a collection of items
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_scheduled_items( $request ) {
		$body = $request->get_params();

		$start = isset( $body['start'] ) && $body['start'] ? $body['start'] : null;
		$end   = isset( $body['end'] ) && $body['end'] ? $body['end'] : rhd_get_futuremost_date();

		// Force the date range to the beginning of the day 'start' and the end of day 'end'.
		$start = rhd_start_of_day( $start );
		$end   = rhd_end_of_day( $end );

		$items = get_posts(
			array(
				'posts_per_page' => -1,
				'post_status'    => 'any',
				'orderby'        => 'date',
				'order'          => 'ASC',
				'inclusive'      => true,
				'date_query'     => array(
					'before' => $end,
					'after'  => $start,
				),
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'meta_query'     => array(
					array(
						'key'     => RHD_UNSCHEDULED_INDEX_META_KEY,
						'compare' => 'NOT EXISTS',
					),
				),
			)
		);

		$data = array(
			'posts'     => array(),
			'dateRange' => array(
				'start' => $start,
				'end'   => $end,
			),
		);

		foreach ( $items as $item ) {
			$data['posts'][] = $this->prepare_item_for_response( $item, $request );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get a collection of items
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_unscheduled_items( $request ) {
		$items = rhd_query_unscheduled_items();

		$data = array(
			'posts' => array(),
		);

		foreach ( $items as $item ) {
			$data['posts'][] = $this->prepare_item_for_response( $item, $request );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get a collection of taxonomy terms
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_taxonomy_terms( $request ) {
		$params = $request->get_params();

		if ( isset( $params['taxonomy'] ) ) {
			$tax = get_taxonomy( $params['taxonomy'] );

			$terms = get_terms(
				array(
					'taxonomy'   => $tax->name,
					'hide_empty' => false,
				)
			);

			$data = array(
				'taxonomy' => array(
					'slug'          => $tax->name,
					'name'          => $tax->labels->name,
					'singular_name' => $tax->labels->singular_name,
				),
				'terms'    => array(),
			);

			foreach ( $terms as $term ) {
				$data['terms'][] = array(
					'term_id' => $term->term_id,
					'name'    => $term->name,
					'slug'    => $term->slug,
				);
			}
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Create or update one item from the collection
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		$item  = $this->prepare_existing_item_for_database( $request );
		$terms = rhd_extract_item_taxonomy_terms( $item );

		// Update the post.
		$result = wp_update_post( $item );

		// Add taxonomy data and return success response.
		if ( $result && ! is_wp_error( $result ) ) {
			$tax_result = $this->update_post_taxonomy_terms( $result, $terms );

			if ( ! is_wp_error( $tax_result ) ) {
				return new WP_REST_Response( $result, 200 );
			}
		}

		return new WP_Error( 'cant-update', __( 'message', 'calendario' ), array( 'status' => 500 ) );
	}

	/**
	 * Create a new item
	 *
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		$item  = $this->prepare_new_item_for_database( $request );
		$terms = rhd_extract_item_taxonomy_terms( $item );

		// Create the post.
		$result = wp_insert_post( $item );

		// Add taxonomy data and return success response.
		if ( $result && ! is_wp_error( $result ) ) {
			$tax_result = $this->update_post_taxonomy_terms( $result, $terms );

			if ( ! is_wp_error( $tax_result ) ) {
				return new WP_REST_Response( $result, 200 );
			}
		}

		// TODO Improve this error message.
		return new WP_Error( 'error-updating', __( 'Error updating post or post terms.', 'calendario' ), array( 'status' => 500 ) );
	}

	/**
	 * Delete one item from the collection.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function trash_item( $request ) {
		$id = $this->prepare_item_for_trash( $request );

		$trashed = wp_delete_post( $id, false );

		if ( $trashed ) {
			return new WP_REST_Response( $trashed->ID, 200 );
		}

		return new WP_Error( 'cant-trash', __( 'message', 'calendario' ), array( 'status' => 500 ) );
	}

	/**
	 * Updates post taxnomy terms
	 *
	 * @param int   $id The post ID to update.
	 * @param array $taxonomies The taxonomy data.
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
			return new WP_Error( 'cant-update-taxonomies', __( 'message', 'calendario' ), array( 'status' => 500 ) );
		}
	}

	/**
	 * Gets post status data.
	 *
	 * @param  WP_REST_Request $request Full data about the request.
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
	 * @param  WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_post_statuses( $request ) {
		$body = $request->get_params();

		$result = update_option( RHD_POST_STATUS_COLOR_OPTION_KEY, $body );

		if ( false !== $result ) {
			return new WP_REST_Response( 'Post status colors updated.', 200 );
		}

		return new WP_Error( 'colors-not-updated', __( 'message', 'calendario' ), array( 'status' => 200 ) );
	}

	/**
	 * Moves an unscheduled draft post to a new position in the list,
	 *   or adds a post to the list at the desired position.
	 *
	 * @param int $id Post ID.
	 * @param int $new_index The new index for this post.
	 * @return void
	 */
	protected function reorder_unscheduled_drafts( $id, $new_index ) {
		$current_index = get_post_meta( $id, RHD_UNSCHEDULED_INDEX_META_KEY, true );

		if ( $current_index === $new_index ) {
			return;
		}

		$posts = rhd_get_unscheduled_item_ids();

		$new_index = false === $new_index ? count( $posts ) : $new_index;

		if ( '' === $current_index || $current_index < 0 ) {
			// Newly unscheduled, insert at position.
			array_splice( $posts, $new_index, 0, $id );
		} else {
			// Reordering.
			$old = array_splice( $posts, $current_index, 1 );
			array_splice( $posts, $new_index, 0, $old );
		}

		$len = count( $posts );
		for ( $i = 0; $i < $len; $i++ ) {
			$result = update_post_meta( $posts[$i], RHD_UNSCHEDULED_INDEX_META_KEY, $i );
		}

	}

	/**
	 * Adds a 'meta_input' array arg to append this post to the unscheduled drafts list.
	 *
	 * @param array   $item The args array for wp_update_post/wp_insert_post.
	 * @param boolean $new True if this is a new item, or the item is not yet set as unscheduled.
	 * @return void
	 */
	protected function prepare_item_for_unscheduled( &$item, $new ) {
		if ( $new ) {
			$item['meta_input'][RHD_UNSCHEDULED_INDEX_META_KEY] = rhd_unscheduled_draft_count();
		}
	}

	/**
	 * Prepare the item for create or update operation
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_Error|array  $prepared_item
	 */
	protected function prepare_existing_item_for_database( $request ) {
		$params = $request->get_params();
		$item   = array();

		if ( ! isset( $params['ID'] ) ) {
			return;
		}

		$item = array(
			'ID'         => $params['ID'],
			'meta_input' => array(
				'_edit_last' => $params['user_id'],
			),
		);

		// Handle unscheduled post order and statuses.
		$this->prepare_scheduled_unscheduled( $item, $params );

		// Post data.
		if ( isset( $params['params'] ) ) {
			$this->prepare_item_params_for_database( $item, $params['params'] );
		}

		return $item;
	}

	/**
	 * Prepare the item for create operation
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_Error|array  $prepared_item
	 */
	protected function prepare_new_item_for_database( $request ) {
		$params = $request->get_params();
		$item   = array(
			'ID'      => 0,
			'user_id' => $params['user_id'],
		);

		$this->prepare_scheduled_unscheduled( $item, $params );

		// Post data.
		if ( isset( $params['params'] ) ) {
			$this->prepare_item_params_for_database( $item, $params['params'] );
		}

		return $item;
	}

	/**
	 * Reorders unscheduled posts and filters allowed post statuses.
	 *
	 * @param array $item The args array for wp_update_post/wp_insert_post.
	 * @param array $params The post data.
	 * @return void
	 */
	protected function prepare_scheduled_unscheduled( &$item, $params ) {
		if ( isset( $params['unscheduled'] ) && true === $params['unscheduled'] ) {
			if ( 0 === $item['ID'] ) {
				$this->prepare_item_for_unscheduled( $item, true );
			} else {
				$new_index = isset( $params['new_index'] ) ? $params['new_index'] : false;
				$this->prepare_item_for_unscheduled( $item, false );
				$this->reorder_unscheduled_drafts( $item['ID'], $new_index );
			}
		} else {
			delete_post_meta( $item['ID'], RHD_UNSCHEDULED_INDEX_META_KEY );
		}
	}

	/**
	 * Processes post data for merging with wp_update_post/wp_insert_post args array.
	 *
	 * @param array $item  The args array for wp_update_post/wp_insert_post.
	 * @param array $params The post params.
	 * @return void
	 */
	protected function prepare_item_params_for_database( &$item, $params ) {
		$this->prepare_post_date_for_database( $item, $params );
		$this->prepare_tax_input_for_database( $item, $params );

		// Remaining params.
		$skip = array( 'post_date', 'taxonomies' );

		foreach ( $params as $key => $value ) {
			if ( ! isset( $item[$key] ) && ! in_array( $key, $skip, true ) ) {
				$item[$key] = $value;
			}
		}
	}

	/**
	 * Sets up the 'post_date' and 'post_date_gmt' params for storage
	 *
	 * @param array $item The args array for wp_update_post/wp_insert_post.
	 * @param array $params The post params.
	 * @return void
	 */
	protected function prepare_post_date_for_database( &$item, $params ) {
		if ( isset( $params['post_date'] ) ) {
			if ( isset( $params['post_status'] ) && in_array( $params['post_status'], array( 'draft', 'pending' ), true ) ) {
				$item['edit_date'] = true;
			}

			$date        = new DateTime( $params['post_date'] );
			$date_string = $date->format( RHD_WP_DATE_FORMAT );
			$post_date   = array(
				'post_date'     => $date_string,
				'post_date_gmt' => get_gmt_from_date( $date_string, RHD_WP_DATE_FORMAT ),
			);

			$item = array_merge( $item, $post_date );
		}
	}

	/**
	 * Sets up the 'tax_input' param for storage
	 *
	 * @param array $item  The args array for wp_update_post/wp_insert_post.
	 * @param array $params The post params.
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
	 * @param  WP_REST_Request $request Request object.
	 * @return WP_Error|int    Post ID to trash
	 */
	protected function prepare_item_for_trash( $request ) {
		$params = $request->get_params();

		return $params['ID'];
	}

	/**
	 * Prepare the item for the REST response
	 *
	 * @param  mixed           $item    WordPress representation of the item.
	 * @param  WP_REST_Request $request Request object.
	 * @return array
	 */
	public function prepare_item_for_response( $item, $request ) {
		$post_date = new DateTime( $item->post_date );

		return array(
			'id'           => $item->ID,
			'post_title'   => $item->post_title,
			'post_name'    => $item->post_name,
			'post_date'    => $post_date->format( 'c' ),
			'post_status'  => $item->post_status,
			'post_excerpt' => $item->post_excerpt,
			'image'        => get_the_post_thumbnail_url( $item->ID, 'post-thumbnail' ),
			'edit_link'    => get_edit_post_link( $item->ID ),
			'view_link'    => get_the_permalink( $item->ID ),
			'taxonomies'   => array(
				'category' => rhd_get_term_ids( $item->ID, 'category' ),
				'post_tag' => rhd_get_term_ids( $item->ID, 'post_tag' ),
			),
		);

	}

}
