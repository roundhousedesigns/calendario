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
		$("#editorial-calendar").fullCalendar( {
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
					success: function() {
						$('.rhd-drafts-list li').each(function(){
							$(this).data( 'event', {
								post_id: parseInt( $(this).attr('data-ID' ) )
							});
						});
					}
				},
			],
			eventDrop: function( event, delta, revertFunc ) { // Moving events around the calendar
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
			},
			drop: function(){ // External event dropped ONTO calendar
				$(this).remove(); // Remove the event from the external area
			},
			eventReceive: function( event ) { // Used for moving events ONTO the calendar from an external source (in this case, Unscheduled Drafts)
				console.log('hilooo');
				
				// Update the post in the database
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
			},
			eventDragStop: function( event, jsEvent, ui, view ) { // Used for moving events OFF of the calendar
				// If event is dragged to the Unscheduled Drafts area
				if( isEventOverDiv( jsEvent.clientX, jsEvent.clientY ) ) {
					var $el = $( "<li class='rhd-draft status-draft fc-event'>" ).appendTo( '.rhd-drafts-list' ).text( event.title );

					$('#editorial-calendar').fullCalendar( 'removeEvents', event._id );
					
					$el.draggable( {
						revert: true,
						revertDuration: 0
					} );
					
					$el.data( 'event', {
						title: event.title,
						post_id: event.post_id,
						start: event.start.format()
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
						},
						complete: function() {
							
						}
					} ).done( setupExternalEvents );
				}
			},
		} );
		
		// Get all drafts
		getUnscheduledDrafts();
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
	
	
	function getUnscheduledDrafts() {
		$.ajax( {
			url: wpApiSettings.root + 'rhd/v1/cal/all-unscheduled',
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			success: function( data ) {
				var postList = $.parseHTML( data );
				$(".rhd-drafts-list").append( postList );
				
				setupExternalEvents();
			}
		} );
	}
	
	function setupExternalEvents() {
		$(".rhd-drafts-list li")
			.each(function() {
				$(this)
					.draggable( {
						revert: true,
						revertDuration: 0
					} );
				
				var eventData = $(this).data('event');
				
				var newEventData = {
					title: $(this).text(),
					color: draftColor,
					className: 'status-draft'
				};
				
				$.extend(true, eventData, newEventData);
				
				$(this).data('event', eventData);
			}
		);
	}
	
} )(jQuery);