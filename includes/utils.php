<?php

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
function rhd_wp_format_date( $date_string ) {
	if ( ! is_string( $date_string ) ) {
		return;
	}

	$from_format = 'm-d-Y';
	$to_format   = 'Y-m-d H:i:s';

	$date     = DateTime::createFromFormat( $from_format, $date_string );
	$date_gmt = DateTime::createFromFormat( $from_format, $date_string );
	$date_gmt->setTimezone( new DateTimeZone( 'GMT' ) );

	$date_formatted = array(
		'post_date'     => $date->format( $to_format ),
		'post_date_gmt' => $date_gmt->format( $to_format ),
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