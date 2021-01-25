import { createContext } from "react";

const PostModalContext = createContext(null);
export default PostModalContext;

export function postModalReducer(state, action) {
	switch (action.type) {
		case "OPEN":
			return {
				...state,
				show: true,
				post: {
					id: action.post.id,
					title: action.post.title,
					post_date: action.post.post_date,
					post_status: action.post.post_status,
					unscheduled: action.post.unscheduled,
				},
			};
		case "CLOSE":
			return {
				...state,
				show: false,
				post: {},
			};

		default:
			return state;
	}
}
