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
};

export function postsReducer(state, action) {
	switch (action.type) {
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

		// Not currently used but maybe...
		case "UNSET_CURRENTPOST":
			return {
				...state,
				currentPost: initialPosts.currentPost,
			};

		default:
			return state;
	}
}
