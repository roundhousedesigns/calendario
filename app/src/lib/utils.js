import { omit, isEmpty } from "lodash";

// export const routeBase = window.rhdReactPlugin.restBase; // Live URL
export const routeBase = "http://localhost/wp-json/calendario/v1/posts";

export const samplePosts = {
	scheduled: [
		{
			id: 1,
			post_title: "Test Post 1",
			post_status: "draft",
			post_date: "02-15-2021", // will be more accurate and have post time, as well
		},
		{
			id: 2,
			post_title: "Test Post 2",
			post_status: "future",
			post_date: "02-13-2021", // will be more accurate and have post time, as well
		},
		{
			id: 6,
			post_title: "Test Post 6",
			post_status: "future",
			post_date: "02-14-2021", // will be more accurate and have post time, as well
		},
	],
	unscheduled: [
		{
			id: 3,
			post_title: "Test Post 3",
			post_status: "draft",
			post_date: "02-16-2021", // will be more accurate and have post time, as well
		},
		{
			id: 4,
			post_title: "Test Post 4",
			post_status: "pending",
			post_date: "02-22-2021", // will be more accurate and have post time, as well
		},
		{
			id: 5,
			post_title: "Test Post 5",
			post_status: "pending",
			post_date: "02-22-2021", // will be more accurate and have post time, as well
		},
	],
};

export const postStatuses = {
	publish: {
		name: "Publish",
		backgroundColor: "cornflowerblue",
		color: "white",
	},
	draft: {
		name: "Draft",
		backgroundColor: "silver",
		color: "white",
	},
	future: {
		name: "Future",
		backgroundColor: "lightseagreen",
		color: "white",
	},
	pending: {
		name: "Pending",
		backgroundColor: "lightcoral",
		color: "white",
	},
	private: {
		name: "Private",
		backgroundColor: "maroon",
		color: "white",
	},
};

export const dateFormat = {
	day: "d",
	// date: "MM-dd-yyyy",
	date: "yyyy-MM-dd",
	year: "yyyy",
	dayName: "EEEE",
	monthName: "MMMM",
};

/**
 * Tests if a post contains ANY empty data (is incomplete/empty post)
 *
 * @param {object} post
 */
export function isEmptyPost(post) {
	return Object.values(post).some(
		(prop) => prop !== null && prop !== "" && prop !== undefined
	);
}

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
 * Updates a post via the REST API.
 *
 * @param {object} post The post object
 * @param {object} updateParams Key/value pairs of post attributes to update
 * @returns {object} The fetch result and/or error message
 */
export const updatePost = (post, updateParams) => {
	const { id } = post;

	let url = `${routeBase}/update/${id}`;

	// Only include updated values
	if (updateParams.length > 0) {
		for (let key in updateParams) {
			if (updateParams[key] === post[key]) {
				updateParams = omit(updateParams, key);
			}
		}
	}

	let result = {
		data: "",
		error: false,
	};

	if (isEmpty(updateParams)) {
		return { data: "Update not necessary.", error: true };
	}

	const fetchData = async () => {
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updateParams),
			});
			const data = await response.json();

			result = {
				data,
				error: false,
			};
		} catch (error) {
			result = {
				data: error,
				error: true,
			};
		}
	};

	fetchData();

	return result;
};
