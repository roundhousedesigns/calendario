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
var publishedColor = 'black';


(function($) {
	$(document).ready( function() {
		$("#editorial-calendar").fullCalendar({
			header: {
				'left': 'today',
				'center': 'title',
				'right': 'prev,next'
			},
			customButtons: {
				newPostButton: 'New Post',
				click: function() {
					alert('this will create a new post. but not today, son.');
				}
			},
			editable: true,
			droppable: true,
			dragRevertDuration: 0,
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
					url: wpApiSettings.root + 'rhd/v1/cal/published',
					type: 'GET',
					cache: false,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					color: publishedColor,
					startEditable: false
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
			// Moving events around the calendar
			eventDrop: function( event, delta, revertFunc ) {
				$.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						post_id: event.post_id,
						new_date: event.start.format(),
						post_status: event.post_status
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
			// Dropped from an external source (in this case, Unscheduled Drafts)
			drop: function( date ) {
				// Set the date to wherever the dragged post was dropped
				var $this = $(this);
				$this.data('start', date.format());
				
				// Update the post in the database
				$.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						post_id: parseInt( $this.attr('data-id') ),
						new_date: date.format(),
						post_status: 'draft',
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						
						console.log(parseInt($this.attr('data-id')));
						
						// Remove this from the side list
						$this.remove();
					}
				});
			},
			// Used for moving events OFF the calendar
			eventDragStop: function( event, jsEvent, ui, view ) {
				// If event is dragged off to the Unscheduled Drafts area
				if( isEventOverDiv( jsEvent.clientX, jsEvent.clientY ) ) {
					console.log(event.post_id);
					
					$('#editorial-calendar').fullCalendar( 'removeEvents', event._id );
					var el = $( "<li class='rhd-draft status-draft fc-event' data-id='" + event.post_id + "'>" ).appendTo( '.rhd-drafts-list' ).text( event.title );
					
					el.draggable({
						revert: true,
						revertDuration: 0
					});
					
					el.data( 'event', {
						title: event.title,
						post_id: event.post_id
					} );
					
					// Update the post in the database
					$.ajax( {
						url: wpApiSettings.root + 'rhd/v1/cal/unschedule',
						type: 'POST',
						data: {
							post_id: event.post_id,
							new_date: event.start.format() // Send the existing date to stop the date reverting to 'right exactly now'
						},
						beforeSend: function( xhr ) {
							xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						}
					} );
				}
			},
			eventRender: function( event, element ) {
				// If this post doesn't have a `status-*` class, it's a draft, and we should by default add the `status-draft` class.
				if( event.className ){
					element.addClass( event.className );
				}
			}
		});
		
		// Get all drafts
		$.ajax( {
			url: wpApiSettings.root + 'rhd/v1/cal/all-unscheduled',
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			success: function( data ) {
				var postList = $.parseHTML( data );
				$(".rhd-drafts-list").append( postList );
				
				// Set up draggable objects
				$(".fc-event").draggable({
					revert: true,
					revertDuration: 0
				});
				
				$(".rhd-drafts-list li").each(function(){
					$(this).data('event',
						{
							title: $(this).text(),
							color: draftColor,
							className: 'status-draft'
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