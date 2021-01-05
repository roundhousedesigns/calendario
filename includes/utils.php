<?php

/**
 * Validates a date string.
 *
 * @param string $date   The date to validate
 * @param string $format The date format
 */
function rhd_validate_date( $date, $format = 'Y-m-d' ) {
	$d = DateTime::createFromFormat( $format, $date );
	return $d && $d->format( $format ) === $date;
}

/**
 * Formats a date string
 *
 * @param string $date The date string to format
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