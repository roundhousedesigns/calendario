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
	unscheduled: [],
	scheduled: [],
};

export function postsReducer(state, action) {
	switch (action.type) {
		case "SET":
			let posts = action.posts;

			// cast the date as a Date object
			posts.forEach((post, index) => {
				posts[index].post_date = new Date(post.post_date);
			});

			let postArea =
				action.unscheduled === true ? "unscheduled" : "scheduled";

			return {
				...state,
				[postArea]: posts,
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

		case "UPDATE_CURRENTPOST_FIELD":
			return {
				...state,
				currentPost: {
					...state.currentPost,
					[action.field]: action.value,
				},
			};

		// TODO Is this necessary? Not currently used but maybe...
		case "UNSET_CURRENTPOST":
			return {
				...state,
				currentPost: initialPosts.currentPost,
			};

		default:
			return state;
	}
}
