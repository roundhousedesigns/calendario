import Widget from "../components/common/Widget";
import { omit, isEmpty, isEqual } from "lodash";
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
				pluginUrl: "//localhost/wp-content/plugins/rhdwp-calendario/",
				postsUrl: "",
				trashUrl: "",
				blogUrl: "//localhost",
				defaultStatusColors: {
					publish: "dodgerblue",
					future: "olivedrab",
					draft: "darkgray",
					pending: "orange",
					private: "brown",
				},
				presetStatusColors: [
					"darkgray",
					"violet",
					"darkorchid",
					"dodgerblue",
					"skyblue",
					"olivedrab",
					"mediumseagreen",
					"lightsalmon",
					"orange",
					"brown",
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
 * Renders a styled Widget.
 *
 * @param {string} title
 * @param {string} className
 * @param {*} children The widget content
 * @returns
 */
export const renderWidget = (title, className, children) => {
	return (
		<Widget title={title} className={`widget__${className}`}>
			{children}
		</Widget>
	);
};

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
 * @param {Post} item Dragged item
 * @returns {boolean} True if unscheduled, false otherwise
 */
export const isDraggingUnscheduled = (item) =>
	item.source.droppableId === "unscheduled" ? true : false;

/**
 *
 * @param {Post} item Dragged item
 * @returns {boolean} True if dragged item is over 'unscheduled' area, false otherwise
 */
export const isOverUnscheduled = (item) =>
	item.destination.droppableId === "unscheduled" ? true : false;

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
 * @param {Array} source
 * @param {Array} destination
 * @param {Object} droppableSource
 * @param {string} droppableSource.droppableId List ID
 * @param {number} [droppableSource.index = null] The starting index of the item to move
 * @param {Object} droppableDestination
 * @param {string} droppableDestination.droppableId List ID
 * @param {number} [droppableDestination.index = null] The ending index of the item to move
 * @returns
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
 * Filters and formats the post_date param during drag and drop operations.
 *
 * @param {Date} post_date
 * @param {string} droppableId
 * @param {boolean} overUnscheduled
 * @returns {DraggedPostDate}
 */
export const draggedPostDate = (post_date, droppableId, overUnscheduled) => {
	let date, formatted;

	if (overUnscheduled === true) {
		formatted = format(post_date, dateFormat.dateTime);
	} else {
		date = parseISO(droppableId);

		const time = {
			h: getHours(post_date),
			m: getMinutes(post_date),
		};
		date = setHours(date, time.h);
		date = setMinutes(date, time.m);

		formatted = format(date, dateFormat.dateTime);
	}

	return { date, formatted };
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
