/**
 * Calendario - Base
 *
 * @package RHD_Calendario
 */

/* ==========================================================================
	Globals
   ========================================================================== */

// Localized: wpApiSettings { homeUrl, root, nonce }
var postColors = {
	'draft':	'gray',
	'future':	'blue',
	'publish':	'black',
	'pending':	'green'
};

var $calendario = jQuery('#editorial-calendar');
var $draftsList = jQuery('#calendario-unscheduled-drafts');


/**
 * getServerDate function. Retrieves the local server time.
 * 
 * @access public
 * @return void
 */
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


function getUnscheduledDrafts() {
	jQuery.ajax( {
		url: wpApiSettings.root + 'rhd/v1/cal/all-unscheduled',
		method: 'GET',
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		},
		success: function( data ) {
			if ( data ) {
				var events = JSON.parse(data);
				var len = events.length;

				for ( var i = 0; i < len; i++ ) {
					var $el = buildUnscheduledPost( events[i] );
					
					$draftsList.append( $el );
					$el.addClass('load-complete');
				}	
			}
		}
	} );
}


function buildUnscheduledPost( eventData ) {
	var $el = jQuery( "<li class='unscheduled-draft status-draft fc-event'>" ).appendTo( '#calendario-unscheduled-drafts' ).text( eventData.title );
	
	$el
		.data( 'event', eventData )
		.draggable( {
			revert: true,
			revertDuration: 0
		} );

	return $el;
}


function setupExternalEvents() {
	jQuery('#calendario-unscheduled-drafts li')
		.each(function() {
			var $this = jQuery(this);
			
			$this.draggable( {
				revert: true,
				revertDuration: 0
			} );
			
			var eventData = $this.data('event');
			
			var newEventData = {
				color: postColors.draft,
				className: 'status-draft'
			};
			jQuery.extend(true, eventData, newEventData);
			
			$this.data('event', eventData);
			
			jQuery('#calendario-unscheduled-drafts li').click(function(){
				openQuickEditModal( eventData, true );
			});
		}
	);
}

function initStatusToggles() {
	jQuery(".event-toggle").on("click", function(){
		var $this = jQuery(this);
		
		$this.toggleClass("filter-hidden");
		$calendario.find(".status-" + $this.data('status')).toggleClass('filter-hidden');
	});
}


function togglePostStatus( event ) {
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
}

	
// DOM Ready
jQuery(document).ready( function() {
	initPage();
	initStatusToggles();
} );