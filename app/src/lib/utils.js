// import Widget from "../components/common/Widget";
import { omit, find, isEmpty, isEqual } from "lodash";
import {
	format,
	parseISO,
	getHours,
	getMinutes,
	setHours,
	setMinutes,
} from "date-fns";

export const DEBUG_MODE =
	process.env.REACT_APP_DEBUG_MODE === "true" ? true : false;

export const wp =
	DEBUG_MODE === true
		? {
				nonce: 0,
				routeBase: "http://localhost/wp-json/calendario/v1",
				user: 1,
				adminUrl: "",
				pluginUrl: "//localhost/wp-content/plugins/calendario/",
				postsUrl: "",
				trashUrl: "",
				blogUrl: "//localhost",
				defaultStatusColors: {
					publish: "#eb6e6f",
					future: "#d9eee1",
					draft: "#ffc90d",
					pending: "#f6bc98",
					private: "#eb6e6f",
				},
				presetStatusColors: [
					"#ffc90d",
					"#8F3C3D",
					"#f27121",
					"#474750",
					"#c1bfb8",
					"#d9eee1",
					"#64b181",
					"#aaaae8",
					"#f6bc98",
					"#eb6e6f",
				],
		  }
		: {
				...window.rhdReactPlugin,
		  };

export const dateFormat = {
	day: "d",
	date: "yyyy-MM-dd",
	dateTime: "yyyy-MM-dd h:mm aa",
	year: "yyyy",
	dayName: "EEEE",
	monthName: "MMMM",
	monthShort: "MMM",
	fullDate: "EEEE,  MMMM dd, yyyy",
	daylessDate: "MMMM dd, yyyy",
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
	droppableId === "unscheduled" ? true : false;

/**
 * Retrieves a list of posts.
 *
 * @param {string} id
 * @param {Array|Object} posts All posts
 * @returns {Array} The posts list
 */
export const getPostList = (id, posts) => {
	let list;
	if (id === "unscheduled") {
		list = posts.unscheduled;
	} else {
		list = posts.scheduled[id];
	}

	return list;
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
 * @param {Date} post_date
 * @param {string} droppableId
 * @returns {draggedPostDestination}
 */
export const draggedPostDestination = (post_date_source, droppableId) => {
	let post_date = post_date_source;

	if (droppableId !== "unscheduled") {
		post_date = parseISO(droppableId); // The new date

		// Conserve the existing date's time value
		const time = {
			h: getHours(post_date_source),
			m: getMinutes(post_date_source),
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
	let allowedUnscheduledStatuses = ["draft", "private", "pending"];
	let status = post_status;

	if (unscheduled === true) {
		status = allowedUnscheduledStatuses.includes(status) ? status : "draft";
	}

	return status;
}

/**
 * Strips a slug from a permalink
 *
 * @param {string} url The permalink
 * @param {string} slug The post slug
 * @returns {string} The filtered URL
 */
export const stripPermalinkSlug = (url) => {
	// Remove trailing slash, if necessary
	if (url.substr(-1) === "/") {
		url = url.slice(0, -1);
	}

	let parts = url.split("/");
	parts.pop();

	return `${parts.join("/")}/`;
};

/**
 * Sanitizes post parameters for sending to the server
 *
 * @param {Object} params The post parameters
 * @returns {Object} The sanitized post parameters
 */
export function sanitizeParamsForUpdate(params) {
	for (let key in params) {
		switch (key) {
			case "post_date":
				if (params[key] instanceof Date) {
					params[key] = format(params[key], dateFormat.dateTime);
				}
				break;

			default:
				break;
		}
	}

	return params;
}

/**
 *
 * @param {int} id
 * @param {Array} scheduled Scheduled posts, keyed by day
 * @param {Array} unscheduled Unscheduled posts
 * @returns {string|null} The post's droppableId, or null if not found
 */
export function getPostSourceDroppableId(id, scheduled, unscheduled) {
	let droppableId = null;
	let found = find(unscheduled, { id: id });

	if (found) {
		droppableId = "unscheduled";
	} else {
		for (let key in scheduled) {
			found = find(scheduled[key], { id: id });
			if (found) {
				droppableId = dayKey(found.post_date);
				break;
			}
		}
	}

	return droppableId;
}
