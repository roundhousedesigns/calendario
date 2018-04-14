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


(function() {
	jQuery(document).ready( function() {
		jQuery("#editorial-calendar").fullCalendar( {
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
						jQuery('.rhd-drafts-list li').each(function(){
							jQuery(this).data( 'event', {
								post_id: parseInt( jQuery(this).attr('data-ID' ) )
							});
						});
					}
				},
			],
			eventClick: function( event ) {
				
			},
			eventDrop: function( event ) { // Moving events around the calendar
				jQuery.ajax( {
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
				jQuery(this).remove(); // Remove the event from the external area
			},
			eventReceive: function( event ) { // Used for moving events ONTO the calendar from an external source (in this case, Unscheduled Drafts)
				// Update the post in the database
				jQuery.ajax( {
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
			eventDragStop: function( event, jsEvent ) { // Used for moving events OFF of the calendar
				// If event is dragged to the Unscheduled Drafts area
				if( isEventOverDiv( jsEvent.clientX, jsEvent.clientY ) ) {
					var $el = jQuery( "<li class='rhd-draft status-draft fc-event'>" ).appendTo( '.rhd-drafts-list' ).text( event.title );

					jQuery('#editorial-calendar').fullCalendar( 'removeEvents', event._id );
					
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
					jQuery.ajax( {
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

		var external_events = jQuery( '#drafts' );
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
		jQuery.ajax( {
			url: wpApiSettings.root + 'rhd/v1/cal/all-unscheduled',
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			success: function( data ) {
				var postList = jQuery.parseHTML( data );
				jQuery(".rhd-drafts-list").append( postList );
				jQuery(".rhd-drafts-area").addClass('events-load-complete');
				
				setupExternalEvents();
			}
		} );
	}
	
	function setupExternalEvents() {
		jQuery(".rhd-drafts-list li")
			.each(function() {
				jQuery(this)
					.draggable( {
						revert: true,
						revertDuration: 0
					} );
				
				var eventData = jQuery(this).data('event');
				
				var newEventData = {
					title: jQuery(this).text(),
					color: draftColor,
					className: 'status-draft'
				};
				
				jQuery.extend(true, eventData, newEventData);
				
				jQuery(this).data('event', eventData);
			}
		);
	}
	
} )(jQueryRHD);