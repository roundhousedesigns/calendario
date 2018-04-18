/**
 * Calendario - Modals
 *
 * @package RHD_Calendario
 */
 
var currentVex; // A vex instance
 
function openNewPostModal( event ) {
	var $el; // New external event placeholder
	
	currentVex = vex.dialog.open({
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
				//console.log('Cancelled');
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


function openQuickEditModal( event, unsched ) {
	var $el; // New external event placeholder
	var prettyDate = '';
	var disabled = ( event.post_status == 'publish' ) ? 'disabled' : false;
	var publishText = '';
	var buttonYesText = 'Update';
	var buttonNoText = 'Cancel';
	var hideYesButtonStyle = '';
	
	if ( disabled ) {
		publishText = ' (Published)';
		buttonNoText = 'Ok';
		hideYesButtonStyle = '<style>.vex-dialog-buttons button[type="submit"] { display: none; }</style>';
	}
	
	/* Selective status display
	**  - If post is published, lock inputs.
	**  - If post is in the past and is a draft, show 'publish' and 'draft'
	**  - If post is in the future, show 'draft', 'future', and 'unscheduled'
	*/
	var statusSelectHTML = '<select name="post_status" required ' + disabled + '/>';
	if( moment(event.start).isAfter( getServerDate() ) ) {
		statusSelectHTML += '<option value="draft">Draft</option><option value="future">Future</option><option value="unsched">Unscheduled</option>';
	} else {
		statusSelectHTML += '<option value="publish">Published</option><option value="draft">Draft</option>';
	}
	statusSelectHTML += '</select>';
	
	if ( unsched === true ) {
		statusSelectHTML = statusSelectHTML.replace(/value=\"unsched\"/i, 'value="unsched" selected');
	} else {
		var findRegEx = new RegExp('value="' + event.post_status + '"');
		var replaceSelect = 'value="' + event.post_status + '" selected';
		
		statusSelectHTML = statusSelectHTML.replace(findRegEx, replaceSelect);
	}
	
	// Open the dialog
	currentVex = vex.dialog.open({
		afterOpen: function() {
			/*
			// Fallback?
			jQuery("#modal_post_date").datepicker({
				dateFormat: "mm-dd-yy"
			});
			*/
		},
		message: 'Quick Edit' + publishText,
		input: [
			'<div class="calendario-modal" data-post-id="' + event.post_id + '" data-event-id="' + event._id + '">',
				'<input name="post_title" type="text" value="' + event.title + '" required ' + disabled + '/>',
				statusSelectHTML,
				'<div class="post-links">',
					'<a class="post-edit-link" href="' + wpApiSettings.homeUrl + 'wp-admin/post.php?post=' + event.post_id + '&action=edit">Edit Post</a>',
					'<a class="post-trash-link" href="' + wpApiSettings.homeUrl + 'wp-admin/post.php?post=' + event.post_id + '&action=edit">Trash Post</a>',
				'</div>',
			'</div>',
			hideYesButtonStyle
		].join(''),
		buttons: [
			jQuery.extend({}, vex.dialog.buttons.YES, { text: buttonYesText }),
			jQuery.extend({}, vex.dialog.buttons.NO, { text: buttonNoText })
		],
		callback: function( data ) {
			if (!data) {
				//console.log('Cancelled');
			} else if ( data.post_status == 'unsched' ) { // Make the post an Unscheduled Draft
				jQuery.ajax( {
					url: wpApiSettings.root + 'rhd/v1/cal/unschedule',
					type: 'POST',
					data: {
						post_id: event.post_id
					},
					beforeSend: function( xhr ) {							
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
						
						var eventData = {
							post_id: event.post_id,
							title: data.post_title,
							post_status: "draft" // All posts moving to external area become drafts
						};
						
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
			} else { // Update the post normally
				jQuery.ajax({
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						post_id: event.post_id,
						post_title: data.post_title,
						post_date: moment(data.post_date).toISOString(),
						post_status: data.post_status
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					},
					success: function() {						
						//event.start = moment(data.post_date).toISOString();
						event.post_status = data.post-status;
						event.color = postColors[data.post_status];
						event.title = data.post_title;
						
						$calendario.fullCalendar( 'updateEvent', event );
					}
				} );
			}
		}
	});
	
	jQuery(document).ready(function(){
		// Trash Post link handler
		jQuery(".post-trash-link").click(function(e){
			e.preventDefault();
			
			$modal = jQuery(this).parents(".calendario-modal");
			
			console.log(wpApiSettings.root + 'wp/v2/posts/');
			
			jQuery.ajax({
				url: wpApiSettings.root + 'wp/v2/posts/' + $modal.data('post-id'),
				type: 'DELETE',
				cache: false,
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
				},
				success: function() {
					$calendario.fullCalendar( 'removeEvents', $modal.data('event-id') );
					currentVex.close();
				}
			});
		});
	});
}