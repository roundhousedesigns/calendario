/**
 * Calendario - Modals
 *
 * @package RHD_Calendario
 */
 
let currentVex; // A vex instance
 
/**
 * openNewPostModal function. Opens the "New Post" Vex modal
 * 
 * @return {void}
 */
function openNewPostModal() {
	let $el; // New external event placeholder
	
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
					}
				} ).done( function( data ) {
					if ( data ) {
						let eventData = {
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
				} );
			}
		}
	});
}


/**
 * openQuickEditModal function. Opens the custom "Quick Edit" Vex modal
 * 
 * @param {object} event The clicked JavaScript event.
 * @param {boolean} unsched Whether or not the post is an "unscheduled draft."
 * @return {void}
 */
function openQuickEditModal( event, unsched ) {
	let $el; // New external event placeholder
	let prettyDate = '';
	let disabled = ( event.post_status == 'publish' ) ? 'disabled' : false;
	let publishText = '';
	let buttonYesText = 'Update';
	let buttonNoText = 'Cancel';
	let hideYesButtonStyle = '';
	
	if ( disabled ) {
		publishText = ' (Published)';
		buttonNoText = 'Ok';
		hideYesButtonStyle = '<style>.vex-dialog-buttons button[type="submit"] { display: none; }</style>';
	}
	
	/* 
	 * Selective status display
	 *  - If post is published, lock inputs.
	 *  - If post is in the past and is a draft, show 'publish' and 'draft'
	 *  - If post is in the future, show 'draft', 'future', and 'unscheduled'
	 */
	let statusSelectHTML = '<label for="post_status" class="screen-reader-text">Post Status</label><select name="post_status" required ' + disabled + '/>&nbsp;';
	if( moment(event.start).isAfter( getServerTime() ) ) {
		statusSelectHTML += '<option value="draft">Draft</option><option value="future">Future</option><option value="unsched">Unscheduled</option>';
	} else {
		statusSelectHTML += '<option value="publish">Published</option><option value="draft">Draft</option>';
	}
	statusSelectHTML += '</select>';
	
	if ( unsched === true ) {
		statusSelectHTML = statusSelectHTML.replace(/value=\"unsched\"/i, 'value="unsched" selected');
	} else {
		let findRegEx = new RegExp('value="' + event.post_status + '"');
		let replaceSelect = 'value="' + event.post_status + '" selected';
		
		statusSelectHTML = statusSelectHTML.replace(findRegEx, replaceSelect);
	}
	
	// Open the dialog
	currentVex = vex.dialog.open({
		afterOpen: function() {
			quickEditTrashPostHandler();
			
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
				'<label for="post_title" class="screen-reader-text"></label><input name="post_title" placeholder="Title" type="text" value="' + event.title + '" required ' + disabled + '/>',
				'<label for="post_date" class="screen-reader-text"></label><input type="date" name="post_date" placeholder="mm/dd/yyyy" value="' + event.start.format('YYYY-MM-DD') + '" required ' + disabled + ' />',
				statusSelectHTML,
				'<div class="post-links">',
					'<a class="post-edit-link" href="' + wpApiSettings.homeUrl + 'wp-admin/post.php?post=' + event.post_id + '&action=edit">Edit Post</a>',
					'<a class="post-trash-link" href="' + wpApiSettings.homeUrl + 'wp-admin/post.php?post=' + event.post_id + '&action=trash">Trash Post</a>',
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
						
						let eventData = {
							post_id: event.post_id,
							title: data.post_title,
							post_status: "draft" // All posts moving to external area become drafts
						};
						
						// Create the external list item, and then remove the event from the calendar
						$el = buildUnscheduledPost( eventData );
						
						// Refresh cached $calendario selector
						$calendario = jQuery('#editorial-calendar');
						$calendario.fullCalendar( 'removeEvents', event._id );
					}
				} ).done( function(data) {
					$el.setupExternalEvent().addClass('load-complete');
				} );
			} else { // Update the post normally
				jQuery.ajax({
					url: wpApiSettings.root + 'rhd/v1/cal/update',
					type: 'POST',
					data: {
						post_id: event.post_id,
						post_title: data.post_title,
						post_date: moment(data.post_date).format(),
						post_status: data.post_status
					},
					beforeSend: function( xhr ) {
						xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
					}
				} ).done( function() {						
					//event.start = moment(data.post_date).toISOString();
					event.post_status = data.post-status;
					event.color = postColors[data.post_status];
					event.title = data.post_title;
					event.start = moment(data.post_date).format()
					
					$calendario.fullCalendar( 'updateEvent', event );
				} );
			}
		}
	});
}