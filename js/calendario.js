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

var $calendarioWrap = jQuery('#calendario');
var $calendario = jQuery('#editorial-calendar');
var $draftsList = jQuery('#calendario-unscheduled-drafts');


function getServerTime() {
	return moment().utcOffset($calendarioWrap.data('server-gmt-offset'));
}


function getUnscheduledDrafts() {
	jQuery.get( {
		url: wpApiSettings.root + 'rhd/v1/cal/unscheduled',
		method: 'GET',
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
		}
	} ).done(function( data ){
		if ( data ) {
			var events = JSON.parse(data);
			var len = events.length;

			for ( var i = 0; i < len; i++ ) {
				var $el = buildUnscheduledPost( events[i] );
				
				$draftsList.append( $el );
				$el.setupExternalEvent().addClass('load-complete');
			}
		}
	});
	
	$draftsList.on('click', 'li', function(e) {
		openQuickEditModal( jQuery(this).data('event'), true );
	});
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


function initStatusToggles() {
	jQuery("#calendario-event-toggles").on("click", ".event-toggle", function(){
		var $this = jQuery(this);
		
		$this.toggleClass("filter-hidden");
		$calendario.find(".status-" + $this.data('filter')).toggleClass('filter-hidden');
	});
}


function quickEditTrashPostHandler() {
	// Trash Post link handler
	jQuery(".post-trash-link").on("click", function(e){
		e.preventDefault();
		
		var $modal = jQuery(this).parents(".calendario-modal");
		
		jQuery.ajax({
			url: wpApiSettings.root + 'wp/v2/posts/' + $modal.data('post-id'),
			type: 'DELETE',
			cache: false,
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			}
		} ).done( function() {
			$calendario.fullCalendar( 'removeEvents', $modal.data('event-id') );
			currentVex.close();
		} );
	});
}


/* ==========================================================================
	jQuery plugin functions
   ========================================================================== */

jQuery.fn.setupExternalEvent = function() {
	var $this = jQuery(this);
	
	var eventData = $this.data('event');
	
	var newEventData = {
		color: postColors.draft,
		className: 'status-draft'
	};
	jQuery.extend(true, eventData, newEventData);
	
	$this
		.data('event', eventData)
		.draggable( {
			revert: true,
			revertDuration: 0
		} );
	
	return $this;
};


/* ==========================================================================
	DOM READY
   ========================================================================== */

jQuery(document).ready( function() {
	initPage();
	initStatusToggles();
	getUnscheduledDrafts();
	
	// View change listeners (TESTING)
	jQuery("#add-week-before").click(function(e){
		e.preventDefault();
		$calendario.fullCalendar('option', 'visibleRange', {
			start: startDate.subtract(1, 'weeks'),
			end: endDate
		});
	});
	
	jQuery("#add-week-after").click(function(e){
		e.preventDefault();
		$calendario.fullCalendar('option', 'visibleRange', {
			start: startDate,
			end: endDate.add(1, 'weeks')
		});
	});
} );