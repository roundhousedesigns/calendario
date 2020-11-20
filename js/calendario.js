/**
 * Calendario - Base
 *
 * @package RHD_Calendario
 */

/* ==========================================================================
	Globals
   ========================================================================== */

// Localized: wpApiSettings { homeUrl, root, nonce }
const postColors = {
	draft: 'gray',
	future: 'blue',
	publish: 'black',
	pending: 'green',
};

var $calendarioWrap = jQuery('#calendario');
var $calendario = jQuery('#editorial-calendar');
var $draftsList = jQuery('#calendario-unscheduled-drafts');

/**
 * getServerTime function. Retrieves the current time from the server.
 *
 * @return {object} The Moment object containing the current server time.
 */
function getServerTime() {
	return moment().utcOffset($calendarioWrap.data('server-gmt-offset'));
}

/**
 * setWorkspaceHeight function. Well...sets the workspace height.
 *
 * @access public
 * @return void
 */
function setWorkspaceHeight() {
	let percentFromTop =
		98 -
		(jQuery('#calendario-workspace').offset().top / jQuery(window).height()) *
			100;
	jQuery('#calendario-workspace').css('height', percentFromTop + 'vh');
}

/**
 * scrolltoDate function. Scrolls to a date in the calendar.
 *
 * @param {object} date A Moment object of the desired date to find.
 * @param {number} [animateTime=0] The animateTime scroll duration. 0 to disable.
 * @return {void}
 */
function scrollToDate(date, animateTime) {
	if (!animateTime) {
		animateTime = 0;
	}

	let startOfMonth = date.date(1).format('YYYY-MM-DD');
	let $startOfMonthEl = jQuery(".fc-day-top[data-date='" + startOfMonth + "']");
	let elPosition =
		$startOfMonthEl.parents('.fc-row').offset().top -
		$startOfMonthEl.parents('.fc-row').offsetParent().offset().top;

	jQuery('.fc-scroller').animate(
		{
			scrollTop: elPosition,
		},
		animateTime,
		'swing'
	);
}

/**
 * getUnscheduledDrafts function. Retrieves Unscheduled Draft posts from the server via AJAX.
 *
 * @return {void}
 */
function getUnscheduledDrafts() {
	jQuery
		.get({
			url: wpApiSettings.root + 'rhd/v1/cal/unscheduled',
			method: 'GET',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
			},
		})
		.done(function (data) {
			if (data) {
				let events = JSON.parse(data);
				let len = events.length;

				for (let i = 0; i < len; i++) {
					let $el = buildUnscheduledPost(events[i]);

					$draftsList.append($el);
					$el.setupExternalEvent().addClass('load-complete');
				}
			}
		});

	$draftsList.on('click', 'li', function (e) {
		openQuickEditModal(jQuery(this).data('event'), true);
	});
}

/**
 * buildUnscheduledPost function.
 *
 * @param {object} eventData The object containing the event data needed to build an Unscheduled Post list item.
 * @return {object} $el The new jQuery list item element.
 */
function buildUnscheduledPost(eventData) {
	let $el = jQuery("<li class='unscheduled-draft status-draft fc-event'>")
		.appendTo('#calendario-unscheduled-drafts')
		.text(eventData.title);

	$el.data('event', eventData).draggable({
		revert: true,
		revertDuration: 0,
	});

	return $el;
}

/**
 * initStatusToggles function. The status toggle event handler.
 *
 * @return {void}
 */
function initStatusToggles() {
	jQuery('#calendario-event-toggles').on('click', '.event-toggle', function () {
		let $this = jQuery(this);

		$this.toggleClass('filter-hidden');
		$calendario
			.find('.status-' + $this.data('filter'))
			.toggleClass('filter-hidden');
	});
}

/**
 * quickEditTrashPostHandler function. Sets up the ability to trash a post from the Quick Edit modal.
 *
 * @return {void}
 */
function quickEditTrashPostHandler() {
	// Trash Post link handler
	jQuery('.post-trash-link').on('click', function (e) {
		e.preventDefault();

		let $modal = jQuery(this).parents('.calendario-modal');

		jQuery
			.ajax({
				url: wpApiSettings.root + 'wp/v2/posts/' + $modal.data('post-id'),
				type: 'DELETE',
				cache: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
				},
			})
			.done(function () {
				$calendario.fullCalendar('removeEvents', $modal.data('event-id'));
				currentVex.close();
			});
	});
}

/* ==========================================================================
	jQuery plugin functions
   ========================================================================== */

jQuery.fn.setupExternalEvent = function () {
	let $this = jQuery(this);

	let eventData = $this.data('event');

	let newEventData = {
		color: postColors.draft,
		className: 'status-draft',
	};
	jQuery.extend(true, eventData, newEventData);

	$this.data('event', eventData).draggable({
		revert: true,
		revertDuration: 0,
	});

	return $this;
};

/* ==========================================================================
	DOM READY
   ========================================================================== */

jQuery(document).ready(function () {
	setWorkspaceHeight();
	initPage();
	initStatusToggles();
	getUnscheduledDrafts();
});
