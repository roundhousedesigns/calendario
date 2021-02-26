import { omit } from "lodash";
import Widget from "../components/common/Widget";

export const nonce = window.rhdReactPlugin.nonce; // Live
// export const nonce = null; //dev

export const routeBase = window.rhdReactPlugin.restBase; // Live
// export const routeBase = "http://localhost/wp-json/calendario/v1/posts"; // Dev

export const postStatuses = window.rhdReactPlugin.postStatuses; // Live
// Dev
// export const postStatuses = {
// 	publish: {
// 		name: "Publish",
// 		backgroundColor: "cornflowerblue",
// 		color: "white",
// 	},
// 	draft: {
// 		name: "Draft",
// 		backgroundColor: "silver",
// 		color: "white",
// 	},
// 	future: {
// 		name: "Future",
// 		backgroundColor: "lightseagreen",
// 		color: "white",
// 	},
// 	pending: {
// 		name: "Pending",
// 		backgroundColor: "lightcoral",
// 		color: "white",
// 	},
// 	private: {
// 		name: "Private",
// 		backgroundColor: "maroon",
// 		color: "white",
// 	},
// };

export const dateFormat = {
	day: "d",
	date: "yyyy-MM-dd",
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
	let filtered = postStatuses;
	if (exclude.length > 0) {
		for (let key in postStatuses) {
			if (exclude.includes(key)) {
				filtered = omit(filtered, key);
			}
		}
	}

	return filtered;
}

/**
 *
 * @param {object} params  Key/value post parameters to update
 * @param {*} post The post to check against
 * @returns {object} The filtered params object
 */
export function filterUnchangedParams(params, post) {
	if (params.length > 0) {
		for (let key in params) {
			if (params[key] === post[key]) {
				params = omit(params, key);
			}
		}
	}

	return params;
}

export const renderWidget = (title, className, children) => {
	return (
		<Widget title={title} className={`widget__${className}`}>
			{children}
		</Widget>
	);
};

export const fetchReducer = (state, action) => {
	switch (action.type) {
		case "FETCHING":
			return { ...state, status: "fetching" };

		case "FETCHED":
			return { ...state, status: "fetched", data: action.data };

		case "FETCH_ERROR":
			return { ...state, status: "error", error: action.data };

		default:
			return state;
	}
};
