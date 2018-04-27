/**
 * Calendario - View
 *
 * @package RHD_Calendario
 */

/*  AVAILABLE GLOBALS:
 * 	postColors = {
		'draft':	'gray',
		'future':	'blue',
		'publish':	'black',
		'pending':	'green'
	}
 *	$calendario - The initialized fullCalendar instance
 *	$calendarioWrap - The element wrapper containing $calendario
 *	$draftsList - The Unscheduled Drafts <ul> element
 */

let startDate;
let endDate;
const totalWeeksShown = 60; // # of weeks to display on the calendar.

let $tempEvent; // Unscheduled Draft restore when dragging external event fails

/**
 * initPage function. The big bad initialization function for the whole Calendar admin page.
 * 
 * @returns {void}
 */
function initPage() {
	// Event sources
	let futurePosts = {
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
	let publishedPosts = {
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
	let draftPosts = {
		url: wpApiSettings.root + 'rhd/v1/cal/drafts',
		type: 'GET',
		data: {
			post_status: 'draft'
		},
		cache: false,
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		},
		color: postColors.draft
	};
	let pendingPosts = {
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
	
	// fullCalendar initialization
	$calendario.fullCalendar({
		defaultView: 'week',
		views: {
			week: {
				type: 'basic',
				visibleRange: function(currentDate) {
					let startOfMonth = getServerTime().clone().date(1);
					let coupleMonthsAgo = startOfMonth.clone().subtract(2, 'months');
					
					startDate = coupleMonthsAgo.subtract(coupleMonthsAgo.day(), 'days'); // Find the most recent past Sunday
					endDate = startDate.clone().add(totalWeeksShown, 'weeks');
					
					return {
						start: startDate,
						end: endDate
					};
				}
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
					let post_type;
					let last;
					
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
					} ).done( function( data ) {
							// Refresh cached $calendario selector
							$calendario = jQuery("#editorial-calendar");
							$calendario.fullCalendar( 'gotoDate', data );
					} );
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
			if ( moment(dropLocation.start).isAfter( getServerTime(), 'day' ) ) {
				return true;
			} else {
				return false;
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
			let newPostStatus;
			let newColor;
			let eventData;
			
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
			} ).done( function( result ) {
					if ( result === true ) {
						// Update event to new values
						event.post_status = newPostStatus;
						event.color = newColor;
						event.start = eventData.new_date;
						$calendario.fullCalendar( 'updateEvent', event );
					} else {
						// console.log( "Moving posts to today or earlier is prohibited" );
					}
			} );
		},
		drop: function( date ){ // External event dropped ONTO calendar
			$tempEvent = jQuery(this).detach();
		},
		eventDestroy: function( event, element, view ) {
			// console.info("event:", event, "element:", element, "view:", view);
		},
		eventReceive: function( event ) { // Fired after fullCalendar.drop(). Dropping an event ONTO the calendar from an external source.
			let eventData = {
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
				}
			} ).done( function(data) {
				// console.log(data.post_id);
			} );
		},
		eventDragStop: function( event, jsEvent ) { // Used for moving events OFF of the calendar
			// Exit if not dropping onto the Unscheduled Drafts area
			if( jsEvent.target.id != "calendario-unscheduled-drafts" ) {
				return;
			}
			
			let $el; // New external event placeholder
			
			let eventData = {
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
				}
			} ).done( function(data) {
				$el.setupExternalEvent().addClass('load-complete');
			} );
		},
		eventAfterAllRender: function() {
			$calendario.addClass('load-complete');
			//console.info('eventAfterAllRender');
		}
	} );
	
	// Populate that bizznazz
	$calendario.fullCalendar('addEventSource', futurePosts);
	$calendario.fullCalendar('addEventSource', publishedPosts);
	$calendario.fullCalendar('addEventSource', draftPosts);
	$calendario.fullCalendar('addEventSource', pendingPosts);
}