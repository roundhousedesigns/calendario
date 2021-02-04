import { createContext } from "react";

const PostsContext = createContext({});
export default PostsContext;

export function postsReducer(state, action) {
	return action.posts ? action.posts : state.posts;
}
