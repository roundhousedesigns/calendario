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
			editable: true,
			droppable: true,
			eventSources: [
				{
					url: wpApiSettings.root + 'rhd/v1/cal/future',
					type: 'GET',
					cache: false,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					color: futureColor,
				},
				{
					url: wpApiSettings.root + 'rhd/v1/cal/drafts',
					type: 'GET',
					cache: false,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					color: draftColor,
				},
			],
			eventDrop: function( event, delta, revertFunc ) {
				$.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						postID: event.post_id,
						newDate: event.start.format(),
						postStatus: event.post_status,
						makeUnscheduled: false
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
						makeUnscheduled: false
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						
						// Remove this from the side list
						$this.remove();
					}
				});
			},
			eventDragStop: function( event, jsEvent, ui, view ) {
				// If event is dragged off to the Unscheduled Drafts area
				if( isEventOverDiv( jsEvent.clientX, jsEvent.clientY ) ) {
					$('#editorial-calendar').fullCalendar( 'removeEvents', event._id );
					var el = $( "<li class='rhd-draft ui-draggable' data-ID='" + event.post_id + "'>" ).appendTo( '.rhd-drafts-list' ).text( event.title );
					
					el.draggable({
						zIndex: 999,
						revert: false, 
						revertDuration: 0 
					});
					
					el.data( 'event', { title: event.title } );
					
					// Update the post in the database
					$.ajax( {
						url: wpApiSettings.root + 'rhd/v1/cal/update',
						type: 'POST',
						data: {
							postID: event.post_id,
							postStatus: 'draft',
							makeUnscheduled: true
						},
						beforeSend: function( xhr ) {
							xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						}
					} );
				}
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
				$(".rhd-drafts-list .ui-draggable").draggable({
					// revert: true, // draggable animation
				});
				
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
	
	var isEventOverDiv = function(x, y) {

		var external_events = $( '#drafts' );
		var offset = external_events.offset();
		offset.right = external_events.width() + offset.left;
		offset.bottom = external_events.height() + offset.top;
		
		// Compare
		if (x >= offset.left
			&& y >= offset.top
			&& x <= offset.right
			&& y <= offset .bottom) { return true; }
		return false;	
	};
	
})(jQuery);