/**
 * Calendario - View
 *
 * @package RHD_Calendario
 */
 
	
// Unscheduled Draft restore when dragging external event fails
var $tempEvent;

function initPage() {
	// Event sources
	var futurePosts = {
		url: wpApiSettings.root + 'rhd/v1/cal/future',
		type: 'GET',
		data: {
			post_status: 'future'
		},
		cache: false,
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		},
		color: postColors.future,
	};
	var publishedPosts = {
		url: wpApiSettings.root + 'rhd/v1/cal/published',
		type: 'GET',
		data: {
			post_status: 'publish'
		},
		cache: false,
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		},
		color: postColors.publish,
		startEditable: false
	};
	var draftPosts = {
		url: wpApiSettings.root + 'rhd/v1/cal/drafts',
		type: 'GET',
		data: {
			post_status: 'draft'
		},
		cache: false,
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		},
		color: postColors.draft,
		success: function() {
			/* WHAT IS THIS WHYYY??
			jQuery('#calendario-unscheduled-drafts li').each(function(){
				jQuery(this).data( 'event', {
					post_id: parseInt( jQuery(this).attr('data-ID' ) )
				});
			});
			*/
		}
	};
	var pendingPosts = {
		url: wpApiSettings.root + 'rhd/v1/cal/pending',
		type: 'GET',
		data: {
			post_status: 'pending'
		},
		cache: false,
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		},
		color: postColors.pending,
		startEditable: false
	};
	
	// fullCalendar setup
	$calendario.fullCalendar({
		defaultView: 'week',
		views: {
			week: {
				type: 'basic',
				duration: { weeks: 10 }
			}
		},
		header: {
			'left': 'today latestPostDate',
			'center': 'title',
			'right': 'newPostButton prev,next'
		},
		customButtons: {
			newPostButton: {
				text: 'New Draft',
				click: function( event ) {
					openNewPostModal( event );
				}
			},
			latestPostDate: {
				text: 'Latest Post',
				click: function( event ) {
					var post_type, last;
					
					if ( ! post_type ) {
						post_type = 'post';
					} else {
						post_type = event.post_type;
					}
					
					jQuery.get({
						url: wpApiSettings.root + 'rhd/v1/cal/lastpostdate',
						beforeSend: function( xhr ) {
							xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );	
						},
						cache: true,
						data: {
							post_type: post_type,
						},
						success: function( data ) {
							console.log(data);
							
							// Refresh cached $calendario selector
							$calendario = jQuery("#editorial-calendar");
							$calendario.fullCalendar( 'gotoDate', moment( data ) );
						}
					});
				}
			}
		},
		editable: true,
		droppable: true,
		dropAccept: '.unscheduled-draft',
		dragRevertDuration: 0,
		validRange: {
			start: $calendario.data('event-valid-start')
		},
		eventAllow: function(dropLocation, draggedEvent) {
			// Prohibit interaction with dates before and including "today" (server time),			
			if ( moment( dropLocation.start ).isBefore( serverDate, 'day' ) ) {
				return false;
			} else {
				return true;
			}
		},
		eventRender: function( event, eventElement ) {
			// Refresh status-xxx classes
			eventElement
				.removeClass( 'status-future status-publish status-draft')
				.addClass("status-" + event.post_status);
		},
		eventClick: function( event ) { // Open Quick Edit modal
			openQuickEditModal( event, false );
		},
		eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) { // Moving events around the calendar				
			var newPostStatus;
			var newColor;
			var eventData;
			
			eventData = {
				post_id: event.post_id,
				new_date: event.start.format(),
				post_status: event.post_status,
				color: postColors[event.post_status]
			};
			
			jQuery.ajax( {
				url: wpApiSettings.root + 'rhd/v1/cal/update',
				type: 'POST',
				data: eventData,
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
				},
				success: function( result ) {
					if ( result === true ) {
						// Update event to new values
						event.post_status = newPostStatus;
						event.color = newColor;
						event.start = eventData.new_date;
						$calendario.fullCalendar( 'updateEvent', event );
					} else {
						// console.log( "Moving posts to today or earlier is prohibited" );
					}
				}
			} );
		},
		drop: function( date ){ // External event dropped ONTO calendar
			$tempEvent = jQuery(this).detach();
		},
		eventReceive: function( event ) { // Fired after fullCalendar.drop(). Dropping an event ONTO the calendar from an external source.
			var eventData = {
				post_id: parseInt(event.post_id),
				new_date: event.start.format(),
				post_status: "draft"
			};
			
			// Update the post in the database
			jQuery.ajax( {
				url: wpApiSettings.root + 'rhd/v1/cal/update',
				type: 'POST',
				data: eventData,
				beforeSend: function( xhr ) {
					if ( event.post_id !== undefined ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						
						// Clear temp variable
						$tempEvent = '';
					} else {
						xhr.abort();
						$tempEvent.appendTo($draftsList);
						console.log('no post id');
					}
				},
				success: function() {
					//console.info( event.post_id );
				}
			} );
		},
		eventDragStop: function( event, jsEvent ) { // Used for moving events OFF of the calendar
			// Exit if not dropping onto the Unscheduled Drafts area
			if( jsEvent.target.id != "calendario-unscheduled-drafts" )
				return;
			
			var $el; // New external event placeholder
			
			var eventData = {
				title: event.title,
				post_id: event.post_id,
				start: event.start.format(),
				post_status: "draft" // All posts moving to external area become drafts
			};
				
			// Update the post in the database
			jQuery.ajax( {
				url: wpApiSettings.root + 'rhd/v1/cal/unschedule',
				type: 'POST',
				data: eventData,
				beforeSend: function( xhr ) {							
					xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					
					// Create the external list item, and then remove the event from the calendar
					$el = buildUnscheduledPost( eventData );
					
					// Refresh cached $calendario selector
					$calendario = jQuery('#editorial-calendar');
					$calendario.fullCalendar( 'removeEvents', event._id );
				},
				success: function() {
					$el.addClass('load-complete');
				}
			} ).done( setupExternalEvents );
		},
		eventAfterAllRender: function() {
			$calendario.addClass('load-complete');
		}
	} );
	
	// Populate that bizznazz
	$calendario.fullCalendar('addEventSource', futurePosts);
	$calendario.fullCalendar('addEventSource', publishedPosts);
	$calendario.fullCalendar('addEventSource', draftPosts);
	$calendario.fullCalendar('addEventSource', pendingPosts);
	
	getUnscheduledDrafts();
}