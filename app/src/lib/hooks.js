import { isSameDay } from "date-fns";
import { isEmpty } from "lodash";

export function useDayPosts(posts, date) {
	let dayPosts = [];
	posts.forEach((post) => {
		if (isSameDay(date, new Date(post.post_date))) {
			dayPosts.push(post);
		}
	});

	return dayPosts;
}

export function useCurrentPost(posts) {
	if (!isEmpty(posts.currentPost)) {
		return posts.currentPost;
	} else {
		return {};
	}
}
