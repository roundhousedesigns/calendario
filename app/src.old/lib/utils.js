// export const routeBase = window.rhdReactPlugin.restBase; // Live URL
export const routeBase = "http://localhost/wp-json/calendario/v1";

// export const postStatuses = window.rhdReactPlugin.postStatuses; // Live value
export const postStatuses = {
	publish: {
		color: "blue",
		editable: false,
	},
	future: {
		color: "green",
		editable: true,
	},
	draft: {
		color: "gray",
		editable: true,
	},
	pending: {
		color: "purple",
		editable: true,
	},
	private: {
		color: "red",
		editable: true,
	},
};

export function getToday() {
	let today = new Date();
	today.setHours(0, 0, 0);

	return today;
}

/**
 * Gets a Date object representing the first day of the current month.
 *
 * @returns {Date}
 */
export function getThisMonth() {
	let thisMonth = new Date();
	thisMonth.setDate(1);
	return thisMonth;
}

/**
 * Converts a Date to a formatted M-D-Y string.
 *
 * @param {Date} date
 * @returns {string}
 */
export function dateToMDY(date = null) {
	if (date) {
		return (
			(date.getMonth() > 8
				? date.getMonth() + 1
				: "0" + (date.getMonth() + 1)) +
			"-" +
			(date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
			"-" +
			date.getFullYear()
		);
	} else {
		return "";
	}
}

/**
 * Send a POST request to update a post through the REST API.
 *
 * @param {int} id
 * @param {Date} date
 * @param {string} post_status
 * @param {boolean} set_unscheduled
 * @param {object} args
 * @returns {boolean}
 */
export function updatePost(id, date, post_status, set_unscheduled, args = {}) {
	let formattedDate = dateToMDY(date);

	// Force future posts w/ "publish" status to "future"
	if (isFutureDate(date) && post_status === "publish") {
		post_status = "future";
	}

	let apiUrl = `${routeBase}/posts/update/${id}/${formattedDate}/${post_status}/${
		set_unscheduled ? 1 : 0
	}`;

	fetch(apiUrl, {
		method: "POST",
		body: JSON.stringify(args),
	})
		.then((response) => {
			response.json();
			if (!response.ok) {
				return false;
			}
		})
		.then((data) => {
			// console.log(data);
		});

	return true;
}

/**
 *
 * @param {Date} date The date to check
 * @returns {boolean|undefined} Undefined if object passed is not of type Date
 */
export function isFutureDate(date) {
	if (date instanceof Date) {
		return new Date() < date;
	} else {
		return undefined;
	}
}

/**
 * Advance a date `i` number of months.
 *
 * @param {Date} date A date
 * @param {int} num How many months to increment
 * @returns {Date}
 */
export function addMonths(date, num) {
	let newDate = new Date(date);
	newDate.setMonth(date.getMonth() + num);

	return newDate;
}

/**
 * Capitalizes the first letter in a string.
 *   Does NOT capitalize more than the first word!
 *
 * @param {string} string
 * @returns {string}
 */
export function firstToUpper(string) {
	return string[0].toUpperCase() + string.slice(1);
}
