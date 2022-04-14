import { omit, isEmpty, isEqual } from 'lodash';
import {
	format,
	parseISO,
	getHours,
	getMinutes,
	setHours,
	setMinutes,
	isValid,
} from 'date-fns';

export const DEBUG_MODE =
	process.env.REACT_APP_DEBUG_MODE === 'true' ? true : false;

export const wp =
	DEBUG_MODE === true
		? {
				nonce: 0,
				// routeBase: 'http://localhost/wp-json/calendario/v1',
				tz: 'America/New_York',
				routeBase: 'http://localhost/backend/wp-json/calendario/v1',
				adminUrl: '',
				version: '<version>',
				freemius: {
					pro: false,
					trialLink:
						'https://checkout.freemius.com/mode/dialog/plugin/8136/plan/13973/?trial=free',
				},
				pluginUrl: '//localhost/backend/wp-content/plugins/calendario/',
				trashUrl: '',
				defaultStatusColors: {
					publish: '#eb6e6f',
					future: '#d9eee1',
					draft: '#ffc90d',
					pending: '#f6bc98',
					private: '#eb6e6f',
				},
				presetStatusColors: [
					'#ffc90d',
					'#8F3C3D',
					'#f27121',
					'#474750',
					'#c1bfb8',
					'#d9eee1',
					'#64b181',
					'#aaaae8',
					'#f6bc98',
					'#eb6e6f',
				],
				postStatuses: {
					publish: {
						name: 'Published',
						color: '#00A193',
					},
					future: {
						name: 'Scheduled',
						color: '#F7C900',
					},
					draft: {
						name: 'Draft',
						color: '#B8B8B8',
					},
					pending: {
						name: 'Pending Review',
						color: '#EB867B',
					},
					private: {
						name: 'Private',
						color: '#252B6F',
					},
				},
				postAuthors: {
					1: 'Author 1',
					5: 'Author 2',
				},
		  }
		: {
				...window.rhdReactPlugin,
		  };

export const prepareInitialPostStatuses = (statuses) => {
	// Don't overwrite visibility, if set
	for (let status in statuses) {
		statuses[status].visible =
			'visible' in statuses[status] ? statuses[status].visible : true;
	}

	return statuses;
};

export const dateFormat = {
	day: 'd',
	date: 'yyyy-MM-dd',
	dayName: 'EEEE',
	monthShort: 'MMM',
	fullDate: 'EEEE,  MMMM dd, yyyy',
	fullDateTime: 'EEEE,  MMMM dd, yyyy @ h:mm aa',
	daylessDate: 'MMMM dd, yyyy',
};

/**
 * Shifts a `post_date` from the database to or from local timezone.
 *
 * @param {Date} date
 * @param {boolean} unshift TRUE to shift back to original timezone.
 * @returns Date The shfited (or unshifted) Date.
 */
export const localTZShift = (date, unshift = false) => {
	let stamp = date.getTime();
	let offset = date.getTimezoneOffset() * 60000;

	if (unshift === false) {
		// Compensate for local timezone to mimic UTC
		return new Date(stamp + offset);
	} else {
		// Return to backend timezone
		return new Date(stamp - offset);
	}
};

/**
 * Produces a filtered list of post status objects.
 *
 * @param {Array} exclude keys to exclude.
 * @return {Object} The filtered postStatuses object.
 */
export function filterStatusList(statuses, exclude = []) {
	let filtered = statuses;
	if (exclude.length > 0) {
		for (let key in filtered) {
			if (exclude.includes(key)) {
				filtered = omit(filtered, key);
			}
		}
	}

	return filtered;
}

/**
 * Checks whether or not the user has customized the color palette.
 *
 * @param {Object} statuses
 * @returns {boolean}
 */
export function haveColorsChanged(statuses) {
	const { defaultStatusColors } = wp;
	let currentStatusColors = {};
	for (const status in statuses) {
		currentStatusColors[status] = statuses[status].color;
	}

	return !isEqual(defaultStatusColors, currentStatusColors);
}

/**
 * Retrieves a calendar day's key (format: yyyy-MM-dd)
 *
 * @param {Date}
 * @returns {string}
 */
export const dayKey = (date) => format(date, dateFormat.date);

/**
 * Checks if a date is between 2 dates.
 *
 * @param {Date} date The target date
 * @param {Date} min Start of the range
 * @param {Date} max End of the range
 * @returns
 */
export const dateIsBetween = (date, min, max) =>
	date.getTime() >= min.getTime() && date.getTime() <= max.getTime();

/**
 * Determines if an item is being dragged is coming from the Unscheduled drafts area.
 *
 * @param {Post} item Dragged post
 * @param {string} item.source.droppableId The drop area ID
 * @returns {boolean} True if unscheduled, false otherwise
 */
export const isDraggingUnscheduled = ({ source: { droppableId } }) =>
	droppableId === 'unscheduled' ? true : false;

/**
 * Retrieves a list of posts.
 *
 * @param {string} id
 * @param {Array|Object} posts All posts
 * @returns {Array} The posts list
 */
export const getPostList = (id, posts) => {
	let list;
	if (id === 'unscheduled') {
		list = posts.unscheduled;
	} else {
		list = posts.scheduled[id];
	}

	return list;
};

/**
 * Loops through scheduled posts and groups them by their `post_date_day` property.
 *
 * @param {Array} posts Scheduled posts currently in view range.
 * @returns {Array} The filtered posts list.
 */
export const setScheduledPosts = (posts) => {
	var scheduledPosts = posts;

	posts.forEach((post, index) => {
		// cast the date as a Date object
		const { post_date, tzShifted } = post;
		let date = new Date(post_date);

		if (isValid(date) && !tzShifted) {
			let offsetDate = localTZShift(date);
			scheduledPosts[index].post_date = offsetDate;
			scheduledPosts[index].post_date_day = dayKey(offsetDate);
			scheduledPosts[index].tzShifted = true;
		}
	});

	let grouped = [];
	scheduledPosts.forEach((post) => {
		(grouped[post.post_date_day] ||= []).push(post);
	});

	return grouped;
};

/**
 *
 * @param {Object|Array} list The post list
 * @param {number} startIndex
 * @param {number} endIndex
 * @returns
 */
export const reorderUnscheduled = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 *
 * @param {Array} source The "from" post list
 * @param {Array} destination The "to" post list
 * @param {DroppableList} droppableSource
 * @param {DroppableList} droppableDestination
 * @returns {Object}
 */
export const moveItem = (
	source,
	destination,
	droppableSource,
	droppableDestination
) => {
	const sourceClone = Array.from(source);
	const destClone = !isEmpty(destination) ? Array.from(destination) : [];
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	let destinationIndex =
		droppableDestination.index !== undefined
			? droppableDestination.index
			: !isEmpty(destination)
			? destination.length
			: 0;

	destClone.splice(destinationIndex, 0, removed);

	const result = {
		[droppableSource.droppableId]: sourceClone,
		[droppableDestination.droppableId]: destClone,
		sourceId: droppableSource.droppableId,
		destinationId: droppableDestination.droppableId,
	};

	return result;
};

/**
 * Prepares the post_date for a dragged post's destination using
 * its droppableID.
 *
 * @param {Date} post_date_from The original post date (before dragging/editing/updating).
 * @param {string} droppableId The destination ID
 * @returns {Date} The destination post date.
 */
export const draggedPostDestination = (post_date_from, droppableId) => {
	let post_date = post_date_from;

	if (droppableId !== 'unscheduled') {
		// post_date = new Date(droppableId); // The new date
		post_date = parseISO(droppableId); // The new date

		// Conserve the existing date's time value
		const time = {
			h: getHours(post_date_from),
			m: getMinutes(post_date_from),
		};
		post_date = setHours(post_date, time.h);
		post_date = setMinutes(post_date, time.m);
	}

	return post_date;
};

/**
 * Converts non-allowed unscheduled post statuses to "draft"
 *
 * @param {string} post_status
 * @param {boolean} unscheduled
 * @returns {string} The filtered post status
 */
export function filterPostStatus(post_status, unscheduled) {
	let allowedUnscheduledStatuses = ['draft', 'private', 'pending'];
	let status = post_status;

	if (unscheduled === true) {
		status = allowedUnscheduledStatuses.includes(status) ? status : 'draft';
	}

	return status;
}

/**
 * Sanitizes post parameters for sending to the server. Add to this to sanitize more fields.
 *
 * @param {Object} params The post parameters
 * @returns {Object} The sanitized post parameters
 */
export function sanitizeParamsForUpdate(params) {
	for (let key in params) {
		switch (key) {
			case 'post_date':
				if (params[key] instanceof Date) {
					params[key] = params[key].toISOString();
				}
				break;

			default:
				break;
		}
	}

	return params;
}
