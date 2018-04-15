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

var $calendario = jQuery("#editorial-calendar");


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
			color: futureColor,
		};	
		var publishedPosts = {
			url: wpApiSettings.root + 'rhd/v1/cal/published',
			type: 'GET',
			cache: false,
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			color: publishedColor,
			startEditable: false
		};
		var datedDraftPosts = {
			url: wpApiSettings.root + 'rhd/v1/cal/drafts',
			type: 'GET',
			cache: false,
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			color: draftColor,
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
				// Remove any existing status classes
				eventElement.removeClass( 'status-future status-publish status-draft');
				
				// Apply status-specific classes to events for simple filtering
				if ( event.post_status == 'future' ) {
					eventElement.addClass("status-future");
				} else if ( event.post_status == 'publish' ) {
					eventElement.addClass("status-publish");
				} else if ( event.post_status == 'draft' ) {
					eventElement.addClass("status-draft");
				}
			},
			eventClick: function( event, jsEvent ) { // Toggle draft/future status
				var newPostStatus, newColor;
				
				// Toggle status and event color
				if ( event.post_status == 'draft' ) {
					newPostStatus = 'future';
					newColor = futureColor;
				} else if ( event.post_status == 'future' ) {
					newPostStatus = 'draft';
					newColor = draftColor;
				}
				
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						post_id: event.post_id,
						post_status: newPostStatus,
						start: event.start.format(),
						color: newColor
					},
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
				jQuery(this).remove();
			},
			eventReceive: function( event ) { // Fired after fullCalendar.drop(). Dropping an event ONTO the calendar from an external source.
				// Update the post in the database
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						post_id: event.post_id,
						new_date: event.start.format(),
						post_status: "draft"
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
				} );
			},
			eventDragStop: function( event, jsEvent ) { // Used for moving events OFF of the calendar
				// If event is dragged to the Unscheduled Drafts area
				if( jsEvent.target.id == "calendario-unscheduled-drafts-list" ) {
					var elData = {
						title: event.title,
						post_id: event.post_id,
						start: event.start.format(),
						post_status: "draft" // All posts moving to external area become drafts
					};
					
					var $el = jQuery( "<li class='cal-draft status-draft fc-event'>" ).appendTo( '.unscheduled-drafts-list' ).text( elData.title );
	
					jQuery('#editorial-calendar').fullCalendar( 'removeEvents', event._id );
					
					$el
						.draggable( {
							revert: true,
							revertDuration: 0
						} )
						.data( 'event', elData );

					// Update the post in the database
					jQuery.ajax( {
						url: wpApiSettings.root + 'rhd/v1/cal/unschedule',
						type: 'POST',
						data: {
							title: elData.title,
							post_id: elData.post_id,
							new_date: elData.start, // Send the existing date to stop the date reverting to 'right exactly now'
							post_status: elData.post_status
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
				jQuery(".unscheduled-drafts-list").append( postList );
				jQuery(".unscheduled-drafts-list").addClass('events-load-complete');
				
				setupExternalEvents();
			}
		} );
	}
	
	
	function setupExternalEvents() {
		jQuery(".unscheduled-drafts-list li")
			.each(function() {
				jQuery(this)
					.draggable( {
						revert: true,
						revertDuration: 0
					} );
				
				var eventData = jQuery(this).data('event');
				
				var newEventData = {
					color: draftColor,
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
	
	// DOM Ready
	jQuery(document).ready( function() {
		initCalendar();
		initStatusToggles();
		getUnscheduledDrafts();
	} );
	
} )(jQueryRHD);