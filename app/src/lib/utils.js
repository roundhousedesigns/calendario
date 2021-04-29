import Widget from "../components/common/Widget";
import { omit, isEmpty, isEqual } from "lodash";
import { format } from "date-fns";

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
 * @param {array} exclude keys to exclude.
 * @return {object} The filtered postStatuses object.
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
 * Filters unchanged values from a post object.
 *
 * @param {object} params  Key/value post parameters to update
 * @param {object} post The post to check against
 * @returns {object} The filtered params object
 */
// TODO bumpy road, clean it up
export function filterUnchangedParams(params, post) {
	if (params.length > 0) {
		for (let key in params) {
			if (Array.isArray(params[key])) {
				if (
					params[key].length === post[key].length &&
					params[key].every(
						(value, index) => value === post[key][index]
					)
				);
			} else {
				if (params[key] === post[key]) {
					params = omit(params, key);
				}
			}
		}
	}

	return params;
}

/**
 * Renders a styled Widget.
 *
 * @param {string} title
 * @param {string} className
 * @param {*} children
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
 *
 * @param {Date} date The target date
 * @param {*} min Start of the range
 * @param {*} max End of the range
 * @returns
 */
export const dateIsBetween = (date, min, max) =>
	date.getTime() >= min.getTime() && date.getTime() <= max.getTime();

/**
 *
 * @param {Post} item Dragged item // TODO figure out documenting this "Post" type for post arrays
 * @returns {boolean} True if unscheduled, false otherwise
 */
export const isDraggingUnscheduled = (item) =>
	item.source.droppableId === "unscheduled" ? true : false;

/**
 *
 * @param {Post} item Dragged item // TODO figure out documenting this "Post" type for post arrays
 * @returns {boolean} True if dragged item is over 'unscheduled' area, false otherwise
 */
export const isOverUnscheduled = (item) =>
	item.destination.droppableId === "unscheduled" ? true : false;

/**
 * Retrieves a list of posts.
 *
 * @param {string} id
 * @param {array|object} posts All posts
 * @returns {array} The posts list
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
 * @param {*} list
 * @param {*} startIndex
 * @param {*} endIndex
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
 * @param {*} source
 * @param {*} destination
 * @param {*} droppableSource
 * @param {*} droppableDestination
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

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {
		[droppableSource.droppableId]: sourceClone,
		[droppableDestination.droppableId]: destClone,
		sourceId: droppableSource.droppableId,
		destinationId: droppableDestination.droppableId,
	};

	return result;
};
