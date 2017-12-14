/**
 * Main Page
 *
 * @package RHD_Calendario
 */
 
// Available: wpApiSettings { root, nonce }
 
(function($) {
	$(document).ready( function() {
		$("#editorial-calendar").fullCalendar({
			eventSources: [
				{
					url: wpApiSettings.root + 'rhd/v1/cal/future',
					type: 'GET',
					cache: false,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					color: 'blue'
				},
				{
					url: wpApiSettings.root + 'rhd/v1/cal/scheduled',
					type: 'GET',
					cache: false,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					color: 'gray'
				},
			],
			editable: true,
			eventDrop: function( event, delta, revertFunc ) {
				$.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
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
			url: wpApiSettings.root + 'rhd/v1/cal/unscheduled',
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			success: function( data ) {
				var postList = $.parseHTML( data );
				$(".rhd-drafts-list").append( postList );
			}
		} );
	} );
})(jQuery);