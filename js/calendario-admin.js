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
			},
			editable: true,
			eventDrop: function( event, delta, revertFunc ) {
				$.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/future',
					type: 'POST',
					data : {
						postID : event.post_id,
						newDate : event.start.format(),
						postStatus : event.post_status
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					success: function() {
						console.log('success');
					},
					error: function(a,b,c) {
						console.log(a);
						console.log(b);
						console.log(c);
					}
				} );
				
				/*
				if ( ! confirm( "Are you sure about this change?") ) {
					revertFunc();
				}
				*/
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