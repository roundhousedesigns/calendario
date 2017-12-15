/**
 * Main Page
 *
 * @package RHD_Calendario
 */

/* ==========================================================================
	Globals
   ========================================================================== */

// Localized: wpApiSettings { root, nonce }

var draftColor = 'gray';
var futureColor = 'blue';


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
					color: futureColor
				},
				{
					url: wpApiSettings.root + 'rhd/v1/cal/drafts',
					type: 'GET',
					cache: false,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					color: draftColor
				},
			],
			editable: true,
			droppable: true,
			eventDrop: function( event, delta, revertFunc ) {
				$.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						postID: event.post_id,
						newDate: event.start.format(),
						postStatus: event.post_status,
						unscheduled: false
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
				} );
				
				/*
				if ( ! confirm( "Are you sure about this change?") ) {
					revertFunc();
				}
				*/
			},
			drop: function( date ) { // Dropped from an external source (in this case, Unscheduled Drafts)
				// Set the date to wherever the dragged post was dropped
				var $this = $(this);
				$this.data('start', date.format());
				
				// Update the post in the database
				$.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						postID: $this.attr('data-ID'),
						newDate: date.format(),
						postStatus: 'draft',
						unscheduled: true
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					success: function(){
						$this.remove();
					},
				});
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
				
				// Set up draggable objects
				$(".rhd-drafts-list .ui-draggable").draggable();
				
				$(".rhd-drafts-list li").each(function(){
					$(this).data('event',
						{
							title: $(this).text(),
							color: draftColor
						});
				});
			}
		} );
	} );
})(jQuery);