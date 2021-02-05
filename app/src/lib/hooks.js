import { isSameDay } from "date-fns";

export function useDayPosts(posts, date) {
	let dayPosts = [];
	posts.forEach((post) => {
		if (isSameDay(date, new Date(post.post_date))) {
			dayPosts.push(post);
		}
	});

	return dayPosts;
}
