const STATUSES = [
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
export const routeBase = "http://localhost/wp-json/calendario/v1/posts/";

export function eventSources(baseMonth = "") {
	if (!baseMonth) {
		return;
	}

	let start = baseMonth;

	let postsRoute = `${routeBase}/${dateToMDY(start)}`;

	return STATUSES.map((item, index) => {
		return {
			url: postsRoute + "/" + item.status,
			color: item.color,
		};
	});
}

export function dateToMDY(date = null) {
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
