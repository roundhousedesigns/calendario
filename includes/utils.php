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