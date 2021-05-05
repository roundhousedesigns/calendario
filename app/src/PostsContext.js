import { createContext } from "react";
import { dateFormat } from "./lib/utils";
import { groupBy } from "lodash";
import { format } from "date-fns";

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
	updatePost: {
		updateNow: false,
		trash: false,
		post: {},
		params: {},
		newIndex: null,
		unscheduled: false,
	},
	refetch: false,
	dateRange: {
		start: "",
		end: "",
	},
	unscheduled: [],
	scheduled: [],
	trashed: [],
	taxonomies: {},
	locale: "",
};

export function postsReducer(state, action) {
	switch (action.type) {
		case "SET_SCHEDULED":
			let scheduledPosts = action.posts;

			// cast the date as a Date object
			scheduledPosts.forEach((post, index) => {
				scheduledPosts[index].post_date = new Date(post.post_date);
				scheduledPosts[index].post_date_day = format(
					scheduledPosts[index].post_date,
					dateFormat.date
				);
			});

			let scheduledByDate = groupBy(scheduledPosts, "post_date_day");

			return {
				...state,
				dateRange: {
					start: action.start ? action.start : state.dateRange.start,
					end: action.end ? action.end : state.dateRange.end,
				},
				scheduled: scheduledByDate,
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

		case "MOVE":
			let scheduled = state.scheduled;
			let unscheduled = state.unscheduled;

			if (action.sourceId === "unscheduled") {
				unscheduled = action.source;
			} else {
				scheduled[action.sourceId] = action.source;
			}

			if (action.destinationId === "unscheduled") {
				unscheduled = action.destination;
			} else {
				scheduled[action.destinationId] = action.destination;
			}

			return {
				...state,
				unscheduled,
				scheduled,
			};

		case "SET_TAXONOMY_TERMS":
			return {
				...state,
				taxonomies: {
					...state.taxonomies,
					[action.name]: {
						taxonomy: action.taxonomy,
						terms: action.terms,
					},
				},
			};

		case "SET_CURRENTPOST":
			return {
				...state,
				currentPost: {
					...action.post,
					unscheduled: action.unscheduled,
				},
			};

		case "REFETCH":
			return {
				...state,
				refetch: !state.refetch,
			};

		case "NEW_POST":
			return {
				...state,
				currentPost: {
					id: 0,
					post_date: action.post_date,
					unscheduled: action.unscheduled,
					taxonomies: {},
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

		case "UPDATE":
			return {
				...state,
				updatePost: {
					updateNow: true,
					post: action.post,
					params: action.params,
					newIndex: action.newIndex,
					unscheduled: action.unscheduled,
				},
			};

		case "UPDATING":
			return {
				...state,
				updatePost: {
					...state.updatePost,
					updateNow: false,
				},
			};

		case "TRASH":
			return {
				...state,
				updatePost: {
					updateNow: true,
					trash: true,
					post: action.post,
					params: action.params,
				},
			};

		case "COMPLETE":
			return {
				...state,
				updatePost: initialPosts.updatePost,
			};

		default:
			return state;
	}
}
