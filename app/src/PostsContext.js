import { createContext } from "react";

const PostsContext = createContext({});
export default PostsContext;

export const initialPosts = {
	currentPost: {
		id: null,
		post_title: "",
		post_status: "",
		post_date: "",
		unscheduled: null,
	},
	refetch: false,
	dateRange: {
		start: "",
		end: "",
	},
	unscheduled: [],
	scheduled: [],
};

export function postsReducer(state, action) {
	switch (action.type) {
		case "SET_SCHEDULED":
			let scheduledPosts = action.posts;

			// cast the date as a Date object
			scheduledPosts.forEach((post, index) => {
				scheduledPosts[index].post_date = new Date(post.post_date);
			});

			return {
				...state,
				dateRange: {
					start: action.start,
					end: action.end,
				},
				scheduled: scheduledPosts,
			};

		case "SET_UNSCHEDULED":
			let unscheduledPosts = action.posts;

			// cast the date as a Date object
			unscheduledPosts.forEach((post, index) => {
				unscheduledPosts[index].post_date = new Date(post.post_date);
			});

			return {
				...state,
				unscheduled: unscheduledPosts,
			};

		case "REFETCH":
			return {
				...state,
				refetch: !state.refetch,
			};

		case "SET_CURRENTPOST":
			return {
				...state,
				currentPost: {
					...action.post,
					unscheduled: action.unscheduled,
				},
			};

		case "NEW_POST":
			return {
				...state,
				currentPost: {
					id: 0,
					post_date: action.post_date,
					unscheduled: action.unscheduled,
				},
			};

		case "UPDATE_CURRENTPOST_FIELD":
			return {
				...state,
				currentPost: {
					...state.currentPost,
					[action.field]: action.value,
				},
			};

		case "UNSET_CURRENTPOST":
			return {
				...state,
				currentPost: initialPosts.currentPost,
			};

		default:
			return state;
	}
}
