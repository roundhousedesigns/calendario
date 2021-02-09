import { createContext } from "react";
import { format } from "date-fns";
import { dateFormat } from "./lib/utils";

const PostsContext = createContext({});
export default PostsContext;

export function postsReducer(state, action) {
	switch (action.type) {
		case "POPULATE":
			return {
				scheduled: action.scheduled,
				unscheduled: action.unscheduled,
			};

		case "UNSCHEDULE":
			return {
				...state,
				scheduled: state.scheduled.filter(
					(item) => item.id !== action.post.id
				), // remove previously scheduled post from calendar
				unscheduled: action.posts,
			};

		case "CALENDAR":
			var post = action.post;
			post.post_date = format(action.newDate, dateFormat.date);

			// If the post already exists (i.e. post already scheduled), remove the original
			var scheduled = state.scheduled.filter(
				(item) => item.id !== post.id
			);

			scheduled.push(post);

			return {
				...state,
				scheduled: scheduled,
				unscheduled: state.unscheduled.filter(
					(item) => item.id !== post.id
				),
				currentPost:
					state.currentPost.id === post.id ? post : state.currentPost,
			};

		case "CLICK":
			return {
				...state,
				currentPost: {
					...action.post,
					unscheduled: action.unscheduled,
				},
			};

		case "UNCLICK":
			return {
				...state,
				currentPost: {},
			};

		case "UPDATE_POST":
			let searchType =
				state.currentPost.unscheduled === true
					? "unscheduled"
					: "scheduled";

			let updatedPosts = state[searchType];

			const postIndex = updatedPosts.findIndex(
				(post) => action.post.id === post.id
			);

			// TODO: Decide on editing this data and THEN firing REST update, or just using REST update + responses and rerender
			updatedPosts[postIndex] = action.post;

			return {
				...state,
				[searchType]: updatedPosts,
			};

		default:
			return state;
	}
}

export const initialPosts = {
	scheduled: [],
	unscheduled: [],
	currentPost: {},
};
