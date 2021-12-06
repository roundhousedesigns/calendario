<?php
/**
 * Functions.php
 *
 * phpcs:disable WordPress.Arrays.ArrayKeySpacingRestrictions.NoSpacesAroundArrayKeys
 *
 * @package callboard
 */

/**
 * Validates a date string.
 *
 * @param string $date The date to validate.
 * @param string $format The date format.
 */
function rhd_validate_date( $date, $format = 'Y-m-d' ) {
	$d = DateTime::createFromFormat( $format, $date );
	return $d && $d->format( $format ) === $date;
}

/**
 * Formats a date string
 *
 * @param string $date_string The date string to format.
 */
function rhd_wp_prepare_date( $date_string ) {
	if ( ! is_string( $date_string ) ) {
		return;
	}

	$date = new DateTime( $date_string );

	$date_formatted = array(
		'post_date'     => $date->format( RHD_WP_DATE_FORMAT ),
		'post_date_gmt' => get_gmt_from_date( $date_string ),
	);

	return $date_formatted;
}

/**
 * Get the furthest-future post date
 *
 * @return string|boolean The post date, or false if no posts found.
 */
function rhd_get_futuremost_date() {
	$posts = get_posts(
		array(
			'post_status'    => array( 'any' ),
			'posts_per_page' => 1,
		)
	);

	return $posts ? rhd_end_of_day( $posts[0]->post_date ) : false;
}

/**
 * Returns a formatted date set to the start of the requested day usable in WP_Query.
 *
 * @param DateTime|string $date The date to manipulate.
 * @return string The formatted date string
 */
function rhd_start_of_day( $date ) {
	if ( gettype( $date ) === 'string' ) {
		$date_obj = new DateTime( $date );
	} elseif ( ! is_a( $date, 'DateTime' ) ) {
		$date_obj = $date;
	} else {
		return false;
	}

	$date_obj->setTime( 0, 0, 0 );

	return $date_obj->format( RHD_WP_DATE_FORMAT );
}

/**
 * Returns a formatted date set to the end of the requested day usable in WP_Query.
 *
 * @param DateTime|string $date The date to manipulate.
 * @return string The formatted date string.
 */
function rhd_end_of_day( $date ) {
	if ( gettype( $date ) === 'string' ) {
		$date_obj = new DateTime( $date );
	} elseif ( ! is_a( $date, 'DateTime' ) ) {
		$date_obj = $date;
	} else {
		return false;
	}

	$date_obj->setTime( 23, 59, 59 );

	return $date_obj->format( RHD_WP_DATE_FORMAT );
}

/**
 * Get an array of term IDs attached to a post, by taxonomy
 *
 * @param int|WP_Post $post The post object or post ID.
 * @param string      $taxonomy The taxonomy name (slug).
 * @return array Array of term IDs
 */
function rhd_get_term_ids( $post, $taxonomy ) {
	$ids   = array();
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
		array(
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'post_type'      => 'post',
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'meta_query'     => array(
				array(
					'key'     => RHD_UNSCHEDULED_INDEX_META_KEY,
					'compare' => 'EXISTS',
				),
			),
		)
	);

	return count( $p );
}

/**
 * Gets post status => color pairs
 *
 * @return array $pairs The array of status/color pairs
 */
function rhd_post_status_default_color_pairs() {
	$pairs = array();

	foreach ( RHD_POST_STATUS_DEFAULTS as $status => $props ) {
		$pairs[$status] = $props['color'];
	}

	return $pairs;
}

/**
 * Runs the query for all unscheduled posts
 *
 * @return array The queried posts.
 */
function rhd_query_unscheduled_items() {
	return get_posts(
		array(
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'meta_query'     => array(
				array(
					'key'     => RHD_UNSCHEDULED_INDEX_META_KEY,
					'compare' => 'EXISTS',
				),
			),
			'orderby'        => 'meta_value_num',
			'order'          => 'ASC',
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_key'       => RHD_UNSCHEDULED_INDEX_META_KEY,
			'posts_per_page' => -1,
			'post_status'    => array( 'private', 'draft', 'pending' ),
		)
	);
}

/**
 * Creates an array of unscheduled post IDs
 *
 * @return array The queried post IDs.
 */
function rhd_get_unscheduled_item_ids() {
	$posts = rhd_query_unscheduled_items();

	$ids = array();
	foreach ( $posts as $post ) {
		$ids[] = $post->ID;
	}

	return $ids;
}

/**
 * Retrieves saved post status color values
 *
 * @return array $statuses The colors associated with each status ('status' => 'color')
 */
function rhd_prepare_post_statuses() {
	$colors   = get_option( RHD_POST_STATUS_COLOR_OPTION_KEY );
	$statuses = RHD_POST_STATUS_DEFAULTS;

	foreach ( $statuses as $status => $props ) {
		$statuses[$status]['color'] = $colors[$status];
	}

	return $statuses;
}

/**
 * Extracts the taxonomy terms from a prepared item.
 *
 * @param array $item Post data being prepared for database storage.
 * @return array The taxonomy terms for use in wp_set_object_terms().
 */
function rhd_extract_item_taxonomy_terms( &$item ) {
	$tax_index = array_search( 'tax_input', array_keys( $item ), true );

	return false !== $tax_index ? array_splice( $item, $tax_index, 1 ) : array();
}

/**
 * Check for saved post status colors, and set defaults if not present.
 *
 * @return void
 */
function rhd_set_post_status_colors() {
	$colors = get_option( 'rhd_calendario_post_status_colors' );
	if ( false === $colors ) {
		$statuses = RHD_POST_STATUS_DEFAULTS;
		$colors   = array();

		foreach ( $statuses as $status => $props ) {
			$colors[$status] = $props['color'];
		}

		update_option( RHD_POST_STATUS_COLOR_OPTION_KEY, $colors );
	}
}
