/**
 * Main Page
 *
 * @package RHD_Calendario
 */

/* ==========================================================================
	Globals
   ========================================================================== */

// Localized: wpApiSettings { root, nonce }

function getServerDate() {
	// Ask for the date
	jQuery.ajax( {
		url: wpApiSettings.root + 'rhd/v1/cal/today',
		type: 'GET',
		cache: false,
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		},
		success: function( data ) {
			return data;
		}
	} );
}


(function() {
	var postColors = {
		'draft':	'gray',
		'future':	'blue',
		'publish':	'black'
	};
	
	var $calendario = jQuery('#editorial-calendar');
	var $draftsList = jQuery('.unscheduled-drafts-list');
	
	// Unscheduled Draft restore when dragging external event fails
	var $tempEvent;
	
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
				'right': 'newPostButton prev,next'
			},
			customButtons: {
				newPostButton: {
					text: 'New Draft',
					click: function( event ) {
						openNewPostModal( event );
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
				if ( moment( dropLocation.start ).isBefore( getServerDate() ) ) {
					return false;
				} else { // 
					return true;
				}
			},
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
						// Prohibit interaction with dates before "today" (server time)
						if ( moment(event.start).isBefore(getServerDate()) ) {
							xhr.abort();
						} else {  
							xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						}
					},
					success: function() {
						event.post_status = newPostStatus;
						event.color = newColor;
						
						// Update event
						$calendario.fullCalendar( 'updateEvent', event );
					}
				} );
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
						if ( event.post_id ) {
							xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
							
							// Clear temp variable
							$tempEvent = '';
						} else {
							xhr.abort();
							$tempEvent.appendTo($draftsList);
						}
					},
					success: function( data ) {
						// console.info( event.post_id );
					}
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
				
				var $el; // New external event placeholder
					
				// Update the post in the database
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/unschedule',
					type: 'POST',
					data: eventData,
					beforeSend: function( xhr ) {							
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						
						// Create the external list item, and then remove the event from the calendar
						$el = buildUnscheduledPost( eventData );
						jQuery('#editorial-calendar').fullCalendar( 'removeEvents', event._id );
					},
					success: function() {
						$el.addClass('load-complete');
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
	
	
	function buildUnscheduledPost( eventData ) {
		var $el = jQuery( "<li class='unscheduled-draft status-draft fc-event'>" ).appendTo( '.unscheduled-drafts-list' ).text( eventData.title );
		
		$el
			.draggable( {
				revert: true,
				revertDuration: 0
			} )
			.data( 'event', eventData );
	
		return $el;
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
	
	
	function openNewPostModal( event ) {
		var $el; // New external event placeholder
		
		vex.dialog.open({
			afterOpen: function() {
				/*
				// Fallback?
				jQuery("#modal_post_date").datepicker({
					dateFormat: "mm-dd-yy"
				});
				*/
			},
			message: 'New Draft Post',
			input: [
				'<input name="post_title" type="text" placeholder="Post Title" required />',
				'<textarea name="post_content" placeholder="Post Content"></textarea>',
				'<input type="date" name="post_date" id="modal_post_date" />',
				'<select name="post_status" required /><option value="draft">Draft</option><option value="unsched">Unscheduled Draft</option></select>',
			].join(''),
			buttons: [
				jQuery.extend({}, vex.dialog.buttons.YES, { text: 'Update' }),
				jQuery.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
			],
			callback: function( data ) {
				if (!data) {
					console.log('Cancelled');
				} else {
					jQuery.ajax({
						url: wpApiSettings.root + 'rhd/v1/cal/add',
						type: 'POST',
						data: {
							post_title: data.post_title,
							post_date: moment(data.post_date).toISOString(),
							post_status: data.post_status,
							post_content: data.post_content
						},
						beforeSend: function( xhr ) {
							xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						},
						success: function( data ) {
							if ( data ) {
								var eventData = {
									title: data.post_title,
									start: moment(data.post_date).toISOString(),
									post_id: data.post_id,
									post_status: data.post_status,
									color: postColors[data.post_status]
								};
								
								if ( data._unsched === true ) {
									$el = buildUnscheduledPost( eventData );
									$el.addClass('load-complete');
								} else {
									$calendario.fullCalendar( 'renderEvent', eventData );
								}
							} else {
								console.log( 'Something went wrong.' );
							}
						}
					} );
				}
			}
		});
	}
		
	
	// DOM Ready
	jQuery(document).ready( function() {
		initCalendar();
		initStatusToggles();
		
		getUnscheduledDrafts();
	} );
	
} )(jQueryRHD);