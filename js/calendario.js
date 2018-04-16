/**
 * Main Page
 *
 * @package RHD_Calendario
 */

/* ==========================================================================
	Globals
   ========================================================================== */

// Localized: wpApiSettings { root, nonce }

var postColors = {
	'draft':	'gray',
	'future':	'blue',
	'publish':	'black'
};

var $calendario = jQuery('#editorial-calendar');
var $draftsList = jQuery('.unscheduled-drafts-list');


(function() {
	function initCalendar() {
		// Event sources
		var futurePosts = {
			url: wpApiSettings.root + 'rhd/v1/cal/future',
			type: 'GET',
			cache: false,
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			color: postColors.future,
		};	
		var publishedPosts = {
			url: wpApiSettings.root + 'rhd/v1/cal/published',
			type: 'GET',
			cache: false,
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			color: postColors.publish,
			startEditable: false
		};
		var datedDraftPosts = {
			url: wpApiSettings.root + 'rhd/v1/cal/drafts',
			type: 'GET',
			cache: false,
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			color: postColors.draft,
			success: function() {
				jQuery('.unscheduled-drafts-list li').each(function(){
					jQuery(this).data( 'event', {
						post_id: parseInt( jQuery(this).attr('data-ID' ) )
					});
				});
			}
		};
		
		// fullCalendar setup
		$calendario.fullCalendar({
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
			eventRender: function( event, eventElement ) {
				// Refresh status-xxx classes
				eventElement
					.removeClass( 'status-future status-publish status-draft')
					.addClass("status-" + event.post_status);
			},
			eventClick: function( event, jsEvent ) { // Toggle draft/future status
				var newPostStatus;
				var newColor;
				var eventData;
				
				// Only toggle status if the date is after rightNow
				if ( event.start.format() < rightNow() ) {
					return;	
				}
				
				// Toggle status and event color
				if ( event.post_status == 'draft' ) {
					newPostStatus = 'future';
					newColor = postColors.future;
				} else if ( event.post_status == 'future' ) {
					newPostStatus = 'draft';
					newColor = postColors.draft;
				}
				
				eventData = {
					post_id: event.post_id,
					post_status: newPostStatus,
					start: event.start.format(),
					color: newColor
				};
				
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: eventData,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					success: function() {
						event.post_status = newPostStatus;
						event.color = newColor;
						
						// Update event
						$calendario.fullCalendar( 'updateEvent', event );
					}
				} );
			},
			eventDrop: function( event ) { // Moving events around the calendar
				// If moving to a date before today, make sure "future" posts are converted to "draft" to prevent the post from publishing
				var newPostStatus;
				var newColor;
				var eventData;
				
				console.info("before: ", event.start.format());
				
				if ( event.post_status == "future" && event.start.format() <= rightNow() ) {
					newPostStatus = "draft";
					newColor = postColors.draft;
				} else {
					newPostStatus = event.post_status;
					newColor = postColors[event.post_status];
				}
				
				eventData = {
					post_id: event.post_id,
					new_date: event.start.format(),
					post_status: newPostStatus,
					color: newColor
				};
				
				console.log('COMEON: ', eventData.new_date);
				
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: eventData,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					success: function() {
						// Update event to new values
						event.post_status = newPostStatus;
						event.color = newColor;
						event.start = eventData.new_date;
						$calendario.fullCalendar( 'updateEvent', event );
						
						console.info("after: ", eventData.new_date);
					}
				} );
			},
			drop: function(){ // External event dropped ONTO calendar
				jQuery(this).remove();
			},
			eventReceive: function( event ) { // Fired after fullCalendar.drop(). Dropping an event ONTO the calendar from an external source.
				var eventData = {
					post_id: event.post_id,
					new_date: event.start.format(),
					post_status: "draft"
				};
				
				// Update the post in the database
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: eventData,
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
				} );
			},
			eventDragStop: function( event, jsEvent ) { // Used for moving events OFF of the calendar
				// Exit if not dropping onto the Unscheduled Drafts area
				if( jsEvent.target.id != "calendario-unscheduled-drafts" )
					return;
					
				var eventData = {
					title: event.title,
					post_id: event.post_id,
					start: event.start.format(),
					post_status: "draft" // All posts moving to external area become drafts
				};
				
				var $el = jQuery( "<li class='unscheduled-draft status-draft fc-event'>" ).appendTo( '.unscheduled-drafts-list' ).text( eventData.title );
				
				$el
					.draggable( {
						revert: true,
						revertDuration: 0
					} )
					.data( 'event', eventData );

				// Update the post in the database
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/unschedule',
					type: 'POST',
					data: eventData,
					beforeSend: function( xhr ) {							
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						
						// Remove the event from the calendar
						jQuery('#editorial-calendar').fullCalendar( 'removeEvents', event._id );
					},
					complete: function() {
						jQuery('.unscheduled-drafts-list li').addClass('load-complete');
					}
				} ).done( setupExternalEvents );
			},
		} );
		
		// Populate that bizznazz
		$calendario.fullCalendar('addEventSource', futurePosts);
		$calendario.fullCalendar('addEventSource', publishedPosts);
		$calendario.fullCalendar('addEventSource', datedDraftPosts);
	}
	
	
	function getUnscheduledDrafts() {
		jQuery.ajax( {
			url: wpApiSettings.root + 'rhd/v1/cal/all-unscheduled',
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			success: function( data ) {
				var postList = jQuery.parseHTML( data );
				$draftsList.append( postList );
				
				jQuery('.unscheduled-drafts-list li').addClass('load-complete');
				
				setupExternalEvents();
			}
		} );
	}
	
	
	function setupExternalEvents() {
		jQuery('.unscheduled-drafts-list li')
			.each(function() {
				jQuery(this)
					.draggable( {
						revert: true,
						revertDuration: 0
					} );
				
				var eventData = jQuery(this).data('event');
				
				var newEventData = {
					color: postColors.draft,
					className: 'status-draft'
				};
				
				jQuery.extend(true, eventData, newEventData);
				
				jQuery(this).data('event', eventData);
			}
		);
	}
	
	function initStatusToggles() {
		jQuery(".event-toggle").on("click", function(){
			var $this = jQuery(this);
			
			$this.toggleClass("filter-hidden");
			jQuery("#editorial-calendar .status-" + $this.data('status')).toggleClass('filter-hidden');
		});
	}
	
	
	function rightNow() {
		var d = new Date();
		return d.toISOString();
	}
	
	// DOM Ready
	jQuery(document).ready( function() {
		initCalendar();
		initStatusToggles();
		getUnscheduledDrafts();
	} );
	
} )(jQueryRHD);