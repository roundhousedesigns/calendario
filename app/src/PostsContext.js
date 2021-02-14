import { createContext } from "react";
import { format } from "date-fns";
import { dateFormat } from "./lib/utils";

const PostsContext = createContext({});
export default PostsContext;

export function postsReducer(state, action) {
	
	switch (action.type) {
		case "INIT":
			return {
				...state,
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

		case "UPDATE_MONTH_COUNT":
			return {
				...state,
				monthCount: action.monthCount,
			};

		case "SET_CURRENTPOST":
			return {
				...state,
				currentPost: {
					...action.post,
					unscheduled: action.unscheduled,
				},
			};

		case "UNSET_CURRENTPOST":
			return {
				...state,
				currentPost: initialPosts.currentPost,
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

			updatedPosts[postIndex] = action.post;

			return {
				...state,
				[searchType]: updatedPosts,
				currentPost: action.post,
			};

		default:
			return state;
	}
}

// TODO Change 'scheduled' key to 'calendar'
export const initialPosts = {
	scheduled: [],
	unscheduled: [],
	monthCount: 1,
	currentPost: {
		id: null,
		post_title: "",
		post_status: "",
		post_date: "",
		unscheduled: null,
	},
};
