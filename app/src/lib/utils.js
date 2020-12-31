const postStatuses = [
	{
		status: "publish",
		color: "blue",
	},
	{
		status: "future",
		color: "green",
	},
	{
		status: "draft",
		color: "gray",
	},
	{
		status: "pending",
		color: "red",
	},
];

export const routeBase = window.rhdReactPlugin.restBase;

export const eventSources = (baseMonth) => {
	//TODO: validate base object
	let start = baseMonth;

	let postsRoute = `${routeBase}/${dateToMDY(start)}`;

	return postStatuses.map((item, index) => {
		return {
			url: postsRoute + "/" + item.status,
			color: item.color,
		};
	});
};

export function dateToMDY(date = null) {
	// TODO: validate date object
	if (date) {
		return (
			(date.getMonth() > 8
				? date.getMonth() + 1
				: "0" + (date.getMonth() + 1)) +
			"/" +
			(date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
			"/" +
			date.getFullYear()
		);
	} else {
		return "";
	}
}
