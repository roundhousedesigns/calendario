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
