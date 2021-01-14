// export const routeBase = window.rhdReactPlugin.restBase; // Live URL
export const routeBase = "http://localhost/wp-json/calendario/v1";

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

// function prepareEventForUpdate(event, overrides) {
// 	console.log('overrides.post_status', overrides.post_status);

// 	var eventData = {
// 		id: event.id,
// 		start: event.start,
// 		post_status: overrides.post_status
// 			? overrides.post_status
// 			: event.post_status,
// 		set_unscheduled: overrides.set_unscheduled
// 			? overrides.set_unscheduled
// 			: event.set_unscheduled,
// 	};

// 	if ( eventData.post_status === undefined ) {
// 		console.log(eventData.id, 'STATUS UNDEFINED');
// 		eventData.post_status = 'draft';
// 	}

// 	eventData.start = dateToMDY(eventData.start);
// 	eventData.set_unscheduled = eventData.set_unscheduled ? 1 : 0;

// 	return eventData;
// }

export function updatePost(id, start, post_status, set_unscheduled) {
	let date = dateToMDY(start);

	let apiUrl = `${routeBase}/posts/update/${id}/${date}/${post_status}/${
		set_unscheduled ? 1 : 0
	}`;

	console.log("url", apiUrl);
	// return;

	fetch(apiUrl, { method: "POST" })
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
