<?php
// TODO make global?
$date_string_format = 'Y-m-d H:i:s';

/**
 * Validates a date string.
 *
 * @param string $date   The date to validate
 * @param string The date format
 */
function rhd_validate_date( $date, $format = 'Y-m-d' ) {
	$d = DateTime::createFromFormat( $format, $date );
	return $d && $d->format( $format ) === $date;
}

/**
 * Formats a date string
 *
 * @param string $date The date string to format
 * @param array Contains post_date and post_date_gmt date strings
 */
function rhd_wp_prepare_date( $date_string ) {
	global $date_string_format;

	if ( ! is_string( $date_string ) ) {
		return;
	}

	$from_format = 'Y-m-d g:i A';

	$date     = DateTime::createFromFormat( $from_format, $date_string );
	$date_gmt = DateTime::createFromFormat( $from_format, $date_string );
	$date_gmt->setTimezone( new DateTimeZone( 'GMT' ) );

	$date_formatted = array(
		'post_date'     => $date->format( $date_string_format ),
		'post_date_gmt' => $date_gmt->format( $date_string_format ),
	);

	return $date_formatted;
}

/**
 * Returns the proper color string associated with a post status.
 *
 * @param string $post_status a registered post status
 * @return string
 */
function rhd_get_status_color( $post_status ) {
	if ( isset( RHD_CALENDARIO_POST_STATUS_COLORS[$post_status] ) ) {
		return RHD_CALENDARIO_POST_STATUS_COLORS[$post_status]['color'];
	} else {
		return RHD_CALENDARIO_POST_STATUS_COLORS['default']['color'];
	}
}

/**
 * Get the furthest-future post date
 *
 * @return string|boolean The post date, or false if no posts found.
 */
function rhd_get_futuremost_date() {
	$posts = get_posts( array(
		'post_status'    => array( 'any' ),
		'posts_per_page' => 1,
	) );

	return $posts ? rhd_end_of_day( $posts[0]->post_date ) : false;
}

/**
 * Returns a formatted date set to the start of the requested day usable in WP_Query.
 *
 * @param DateTime|string $date The date to manipulate
 * @return string The formatted date string
 */
function rhd_start_of_day( $date ) {
	global $date_string_format;

	if ( gettype( $date ) === 'string' ) {
		$date_obj = new DateTime( $date );
	} elseif ( ! is_a( $date, 'DateTime' ) ) {
		$date_obj = $date;
	} else {
		return false;
	}

	$date_obj->setTime( 0, 0, 0 );

	return $date_obj->format( $date_string_format );
}

/**
 * Returns a formatted date set to the end of the requested day usable in WP_Query.
 *
 * @param DateTime|string $date The date to manipulate
 * @return string The formatted date string
 */
function rhd_end_of_day( $date ) {
	global $date_string_format;

	if ( gettype( $date ) === 'string' ) {
		$date_obj = new DateTime( $date );
	} elseif ( ! is_a( $date, 'DateTime' ) ) {
		$date_obj = $date;
	} else {
		return false;
	}

	$date_obj->setTime( 23, 59, 59 );

	return $date_obj->format( $date_string_format );
}

/**
 * Get an array of term IDs attached to a post, by taxonomy
 *
 * @param int|WP_Post $post The post object or post ID
 * @param string $taxonomy The taxonomy name (slug)
 * @return array Array of term IDs
 */
function rhd_get_term_ids( $post, $taxonomy ) {
	$ids = [];
	if ( $terms = get_the_terms( $post, $taxonomy ) ) {
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
	$p = get_posts( [
		'posts_per_page' => -1,
		'post_status'    => 'any',
		'post_type'      => 'post',
		'meta_query'     => [
			[
				'key'     => RHD_UNSCHEDULED_INDEX,
				'compare' => 'EXISTS',
			],
		],
	] );

	return count( $p );
}