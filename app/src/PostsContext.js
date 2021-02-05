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
				),
				unscheduled: [...new Set([...state.unscheduled, action.post])],
			};

		case "SCHEDULE":
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
			};

		// case "reorderUnscheduled":
		// do things

		default:
			return state;
	}
}
