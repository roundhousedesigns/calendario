export const samplePosts = {
	scheduled: [
		{
			id: 1,
			post_title: "Test Post 1",
			post_status: "draft",
			post_date: "02-10-2021", // will be more accurate and have post time, as well
		},
		{
			id: 2,
			post_title: "Test Post 2",
			post_status: "future",
			post_date: "02-13-2021", // will be more accurate and have post time, as well
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
	],
};

export const dateFormat = {
	day: "d",
	date: "MM-dd-yyyy",
};
