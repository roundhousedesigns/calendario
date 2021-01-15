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
		color: "red",
		editable: true,
	},
};

export function getThisMonth() {
	let thisMonth = new Date();
	thisMonth.setDate(1);
	return thisMonth;
}

export function dateToMDY(date = null) {
	// TODO: validate date object?
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

export function updatePost(id, start, post_status, set_unscheduled, args = {}) {
	let date = dateToMDY(start);

	let apiUrl = `${routeBase}/posts/update/${id}/${date}/${post_status}/${
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
 * @return {boolean|undefined} Undefined if object passed is not of type Date
 */
export function dateIsBeforeNow(date) {
	if (date instanceof Date) {
		return date < new Date();
	} else {
		return undefined;
	}
}
