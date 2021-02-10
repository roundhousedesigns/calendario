import { isSameDay } from "date-fns";
import { omit } from "lodash";

export function useDayPosts(posts, date) {
	let dayPosts = [];
	posts.forEach((post) => {
		if (isSameDay(date, new Date(post.post_date))) {
			dayPosts.push(post);
		}
	});

	return dayPosts;
}

export function useUnscheduledStatuses(postStatuses) {
	const exclude = ["publish", "future"];
	let newStatuses = postStatuses;

	for (let key in postStatuses) {
		if (exclude.includes(key)) {
			newStatuses = omit(newStatuses, key);
		}
	}

	return newStatuses;
}
