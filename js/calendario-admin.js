/**
 * Main Page
 *
 * @package RHD_Calendario
 */
 
// Available: wpApiSettings { root, nonce }
 
(function($) {
	$(document).ready( function() {
		
		$("#editorial-calendar").fullCalendar();
		
		// Get all drafts
		$.ajax( {
			url: wpApiSettings.root + 'rhd/v1/cal/drafts', // default: wp/v2/posts?status=draft
			method: 'GET',
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			success: function( data ) {
				var draftsList = $.parseHTML( data );
				$("#drafts").append( draftsList );
			},
			error: function(a,b,c) {
				console.log(a);
				console.log(b);
				console.log(c);
			}
		} );


/*
		REST POST EXAMPLE:
		
		$.ajax( {
			url: wpApiSettings.root + 'wp/v2/posts/1',
			method: 'POST',
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
			},
			data:{
				'title' : 'Hello Moon'
			}
		} ).done( function ( response ) {
			// maybe something flashy
		} );
*/
		

	} );
})(jQuery);