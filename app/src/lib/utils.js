import Widget from "../components/common/Widget";
import { omit } from "lodash";

export const DEBUG_MODE =
	process.env.REACT_APP_DEBUG_MODE === "true" ? true : false;

export const wp =
	DEBUG_MODE !== true
		? {
				...window.rhdReactPlugin,
		  }
		: {
				nonce: 0,
				routeBase: "http://localhost/wp-json/calendario/v1/posts",
				postStatuses: {
					publish: {
						name: "Published",
						backgroundColor: "cornflowerblue",
						color: "white",
					},
					draft: {
						name: "Draft",
						backgroundColor: "silver",
						color: "white",
					},
					future: {
						name: "Scheduled",
						backgroundColor: "lightseagreen",
						color: "white",
					},
					pending: {
						name: "Pending Review",
						backgroundColor: "lightcoral",
						color: "white",
					},
					private: {
						name: "Private",
						backgroundColor: "maroon",
						color: "white",
					},
				},
				wpLinks: {
					adminUrl: "",
					postsUrl: "",
					trashUrl: "",
					blogUrl: "//localhost",
				},
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
export function filterStatusList(exclude = []) {
	let filtered = wp.postStatuses;
	if (exclude.length > 0) {
		for (let key in wp.postStatuses) {
			if (exclude.includes(key)) {
				filtered = omit(filtered, key);
			}
		}
	}

	return filtered;
}

/**
 * Filters unchanged values from a post object.
 *
 * @param {object} params  Key/value post parameters to update
 * @param {object} post The post to check against
 * @returns {object} The filtered params object
 */
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
 *
 * @param {Date} date The target date
 * @param {*} min Start of the range
 * @param {*} max End of the range
 * @returns
 */
export const dateIsBetween = (date, min, max) =>
	date.getTime() >= min.getTime() && date.getTime() <= max.getTime();
