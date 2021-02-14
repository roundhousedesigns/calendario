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
				calendar: action.calendar ? action.calendar : state.calendar,
				unscheduled: action.unscheduled
					? action.unscheduled
					: state.unscheduled,
			};

		case "UNSCHEDULE":
			// TODO Fetch (method: POST) to update REST
			return {
				...state,
				calendar: state.calendar.filter(
					(item) => item.id !== action.post.id
				), // remove previously calendar post from calendar
				unscheduled: action.posts,
			};

		case "CALENDAR":
			// TODO Fetch (method: POST) to update REST
			var post = action.post;
			post.post_date = format(action.newDate, dateFormat.date);

			// If the post already exists (i.e. post already calendar), remove the original
			var calendar = state.calendar.filter((item) => item.id !== post.id);

			calendar.push(post);

			return {
				...state,
				calendar: calendar,
				unscheduled: state.unscheduled.filter(
					(item) => item.id !== post.id
				),
				currentPost:
					state.currentPost.id === post.id ? post : state.currentPost,
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
			// TODO Fetch (method: POST) to update REST
			let viewType =
				state.currentPost.unscheduled === true
					? "unscheduled"
					: "calendar";

			let updatedPosts = state[viewType];

			const postIndex = updatedPosts.findIndex(
				(post) => action.post.id === post.id
			);

			updatedPosts[postIndex] = action.post;

			return {
				...state,
				[viewType]: updatedPosts,
				currentPost: action.post,
			};

		// TODO (Maybe) set up flag for bypassing cache/refetch source
		// case "REFETCH":
		// 	return {
		// 		...state,
		// 		refetch: true,
		// 	};

		default:
			return state;
	}
}

export const initialPosts = {
	calendar: [],
	unscheduled: [],
	currentPost: {
		id: null,
		post_title: "",
		post_status: "",
		post_date: "",
		unscheduled: null,
	},
	refetch: false,
};
