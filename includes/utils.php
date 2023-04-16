<?php
/**
 * Utility functions.
 *
 * phpcs:disable WordPress.Arrays.ArrayKeySpacingRestrictions.NoSpacesAroundArrayKeys
 *
 * @package calendario
 */

/**
 * Validates a date string.
 *
 * @param string $date   The date to validate.
 * @param string $format The date format.
 */
function rhd_validate_date( $date, $format = 'Y-m-d' ) {
	$d = DateTime::createFromFormat( $format, $date );
	return $d && $d->format( $format ) === $date;
}

/**
 * Get the furthest-future post date
 *
 * @return string|boolean The post date, or false if no posts found.
 */
function rhd_get_futuremost_date() {
	$posts = get_posts(
		[
			'post_status'    => [ 'any' ],
			'posts_per_page' => 1,
		]
	);

	return $posts ? rhd_set_datetime_time( $posts[0]->post_date, 23, 59, 59 ) : false;
}

/**
 * Returns a formatted date set to the start of the requested day usable in WP_Query.
 *
 * @param  string $date The date to manipulate.
 * @param  string $h    Hours (1-24)
 * @param  string $m    Minutes (1-59)
 * @param  string $s    Seconds (1-59)
 * @return string The formatted date string
 */
function rhd_set_datetime_time( $date, $h, $m, $s ) {
	if ( ! $date ) {
		return false;
	}

	$date_obj = new DateTime( $date );
	$date_obj->setTime( $h, $m, $s );

	return $date_obj->format( RHD_WP_DATE_FORMAT );
}

/**
 * Get an array of term IDs attached to a post, by taxonomy
 *
 * @param  int|WP_Post $post     The post object or post ID.
 * @param  string      $taxonomy The taxonomy name (slug).
 * @return array       Array of term IDs
 */
function rhd_get_term_ids( $post, $taxonomy ) {
	$ids   = [];
	$terms = get_the_terms( $post, $taxonomy );
	if ( $terms ) {
		$ids = wp_list_pluck( $terms, 'term_id' );
	}

	return $ids;
}

/**
 * Gets the number of Unscheduled Draft posts
 *
 * @return int The post count
 */
function rhd_unscheduled_draft_count() {
	$p = get_posts(
		[
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'post_type'      => 'post',
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'meta_query'     => [
				[
					'key'     => RHD_UNSCHEDULED_INDEX_META_KEY,
					'compare' => 'EXISTS',
				],
			],
		]
	);

	return count( $p );
}

/**
 * Runs the query for all unscheduled posts
 *
 * @return array The queried posts.
 */
function rhd_query_unscheduled_items() {
	return get_posts(
		[
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'meta_query'     => [
				[
					'key'     => RHD_UNSCHEDULED_INDEX_META_KEY,
					'compare' => 'EXISTS',
				],
			],
			'orderby'        => 'meta_value_num',
			'order'          => 'ASC',
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_key'       => RHD_UNSCHEDULED_INDEX_META_KEY,
			'posts_per_page' => -1,
			'post_status'    => [ 'private', 'draft', 'pending' ],
		]
	);
}

/**
 * Creates an array of unscheduled post IDs
 *
 * @return array The queried post IDs.
 */
function rhd_get_unscheduled_item_ids() {
	$posts = rhd_query_unscheduled_items();

	$ids = [];
	foreach ( $posts as $post ) {
		$ids[] = $post->ID;
	}

	return $ids;
}

/**
 * Retrieves a list of users that can edit others' posts.
 *
 * @return array The authors, keyed by user ID.
 */
function rhd_prepare_post_authors() {
	$users = get_users( [
		'role__in' => [ 'author', 'editor', 'administrator' ],
	] );

	$authors = [];
	foreach ( $users as $user ) {
		$first = get_user_meta( $user->ID, 'first_name', true );
		$last  = get_user_meta( $user->ID, 'last_name', true );

		$authors[$user->ID] = $first || $last ? "$first $last" : $user->display_name;
	}

	return $authors;
}

/**
 * Extracts the taxonomy terms from a prepared item.
 *
 * @param  array $item Post data being prepared for database storage.
 * @return array The taxonomy terms for use in wp_set_object_terms().
 */
function rhd_extract_item_taxonomy_terms( &$item ) {
	$tax_index = array_search( 'tax_input', array_keys( $item ), true );

	return false !== $tax_index ? array_splice( $item, $tax_index, 1 ) : [];
}

/**
 * Checks if a post is edit-locked. Duplicates functionality found in `wp_check_post_lock()`
 *   which is only available in the WP post editor.
 *
 * @param  int          $id The post ID.
 * @return string|false A descriptive user string if locked, false otherwise.
 */
function rhd_check_post_lock( $id ) {
	$lock = get_post_meta( $id, '_edit_lock', true );

	if ( ! $lock ) {
		return false;
	}

	$lock    = explode( ':', $lock );
	$time    = $lock[0];
	$user_id = isset( $lock[1] ) ? $lock[1] : get_post_meta( $id, '_edit_last', true );

	if ( ! get_userdata( $user_id ) ) {
		return false;
	}

	/**
	 * This filter is documented in wp-admin/includes/ajax-actions.php
	 */
	$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

	// Omit the check if the current user is the locking user (differs from `wp_check_post_lock`).
	if ( $time && $time > time() - $time_window ) {
		$user = [
			'first_name' => get_user_meta( $user_id, 'first_name', true ),
			'last_name'  => get_user_meta( $user_id, 'last_name', true ),
		];

		return sprintf(
			'%1$s %2$s (ID: %3$d)',
			wp_strip_all_tags( $user['first_name'], true ),
			wp_strip_all_tags( $user['last_name'], true ),
			$user_id
		);
	}

	return false;
}

/**
 * Retrieves saved post status color values
 *
 * @return array $statuses The colors associated with each status ('status' => 'color')
 */
function rhd_prepare_post_statuses() {
	$colors = get_option( RHD_POST_STATUS_COLOR_OPTION_KEY );

	$statuses = RHD_POST_STATUS_DEFAULTS;

	foreach ( $statuses as $status => $props ) {
		$statuses[$status]['color'] = $colors[$status];
	}

	return $statuses;
}

/**
 * Gets post status => color pairs
 *
 * @return array $pairs The array of status/color pairs
 */
function rhd_post_status_default_color_pairs() {
	$pairs = [];

	foreach ( RHD_POST_STATUS_DEFAULTS as $status => $props ) {
		$pairs[$status] = $props['color'];
	}

	return $pairs;
}
