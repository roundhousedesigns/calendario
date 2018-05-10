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
let $tempEvent; // Unscheduled Draft restore when dragging external event fails.
let fcInit = false; // Gets set to true on the first fullCalendar load.


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
		defaultDate: moment( $calendario.data("oldest") ),
		eventSources: [ futurePosts, publishedPosts, draftPosts, pendingPosts ],
		views: {
			week: {
				type: 'basic',
				visibleRange: function() {
					let firstPostDate = moment( $calendario.data("oldest") );
					let latestPostDate = moment( $calendario.data("latest") );
					
					let startDate = firstPostDate.date(1).subtract(firstPostDate.day(), 'days'); // Find the closest past Sunday to the start of the month
					
					/*
					let i = 1;
					let overshootDate = startDate.clone();
					while ( overshootDate.isBefore(latestPostDate) ) {
						overshootDate.add(1, 'months');
						i++;
					}
					let endDate = overshootDate.clone().add(6, 'weeks').day(7); // Line it up so we still get a month view!
					*/
					
					// Just make it big and long, baby
					let endDate = startDate.clone().add(150, 'weeks');
					
					return {
						start: startDate,
						end: endDate
					};
				},
			}
		},
		height: 'parent',
		header: {
			'left': 'scrollToToday scrollToDate scrollToLatest',
			'center': 'title',
			'right': 'newPostButton'
		},
		titleFormat: '[Editorial Calendar]',
		customButtons: {
			scrollToToday: {
				text: 'Today',
				click: function() {
					scrollToDate( moment(), 500 );
				},
			},
			scrollToDate: {
				text: 'Go To Date',
				click: function() {
					
				}
			},
			scrollToLatest: {
				text: 'Latest Post',
				click: function() {
					scrollToDate( moment($calendario.data("latest")), 500);
				},
			},
			newPostButton: {
				text: 'New Draft',
				click: function( event ) {
					openNewPostModal( event );
				}
			},
		},
		dayRender: function( date, cell ) {
			// Set a class on the first of every month and add the Month Name
			if ( date.date() == 1 ) {
				let fomLabel = '<span class="first-of-month-label month-name">' + date.format('YYYY') + ' &bull; ' + date.format('MMMM') + '</span>';
				
				cell.addClass('first-of-month');
				cell.html( fomLabel + cell.html() );
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
				post_date: event.start.format(),
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
						event.start = eventData.post_date;
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
				post_date: event.start.format(),
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
			// Scroll to Today on first load
			if ( fcInit === false ) {
				scrollToDate(moment(), 0);
				fcInit = true;
			}
			
			$calendario.addClass('load-complete');
		}
	} );
}