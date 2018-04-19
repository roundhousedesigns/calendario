/**
 * Calendario - Base
 *
 * @package RHD_Calendario
 */

/* ==========================================================================
	Globals
   ========================================================================== */

// Localized: wpApiSettings { homeUrl, root, nonce }
var serverDate;

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
	jQuery.get( {
		url: wpApiSettings.root + 'rhd/v1/cal/today',
		cache: false,
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		}
	} ).done( function(data) {
		returnServerDate(data);
	} );
}


/**
 * returnServerDate function. Callback function for getServerDate() to store the returned value to global scope.
 * 
 * @access public
 * @param mixed date
 * @return void
 */
function returnServerDate(date) {
	serverDate = date;
}


function getUnscheduledDrafts() {
	jQuery.get( {
		url: wpApiSettings.root + 'rhd/v1/cal/unscheduled',
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
	
	setupExternalEvents();
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

	
// DOM Ready
jQuery(document).ready( function() {
	initPage();
	initStatusToggles();
	
	// Get the current server date
	getServerDate();
} );