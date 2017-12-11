/**
 * Main Page
 *
 * @package RHD_Calendario
 */
 
// Available: wpApiSettings { root, nonce }
 
(function($) {
	$(document).ready( function() {
		
		$("#editorial-calendar").fullCalendar({
			
			events: {
				url: wpApiSettings.root + 'rhd/v1/cal/future',
				type: 'GET',
				cache: false,
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
				}
			}
			
		});
		
		// Get all drafts
		$.ajax( {
			url: wpApiSettings.root + 'rhd/v1/cal/drafts',
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			success: function( data ) {
				var draftsList = $.parseHTML( data );
				$(".rhd-drafts-list").append( draftsList );
			}
		} );
	} );
})(jQuery);