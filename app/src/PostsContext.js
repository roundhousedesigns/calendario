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
		id: null,
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
		case "SET_SCHEDULED": {
			let { posts: scheduledPosts } = action;

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
		}

		case "SET_UNSCHEDULED": {
			let { posts: unscheduledPosts } = action;

			// cast the date as a Date object
			unscheduledPosts.forEach((post, index) => {
				unscheduledPosts[index].post_date = new Date(post.post_date);
			});

			return {
				...state,
				unscheduled: unscheduledPosts,
			};
		}

		case "MOVE": {
			let { scheduled, unscheduled } = state;
			const { source, sourceId, destination, destinationId } = action;

			if (action.sourceId === "unscheduled") {
				unscheduled = source;
			} else {
				scheduled[sourceId] = source;
			}

			if (destinationId === "unscheduled") {
				unscheduled = destination;
			} else {
				scheduled[destinationId] = destination;
			}

			return {
				...state,
				unscheduled,
				scheduled,
			};
		}

		case "SET_TAXONOMY_TERMS": {
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
		}

		case "SET_CURRENTPOST": {
			return {
				...state,
				currentPost: {
					...action.post,
					unscheduled: action.unscheduled,
				},
			};
		}

		case "REFETCH": {
			return {
				...state,
				refetch: !state.refetch,
			};
		}

		case "NEW_POST": {
			return {
				...state,
				currentPost: {
					id: 0,
					post_date: action.post_date,
					unscheduled: action.unscheduled,
					taxonomies: {},
				},
			};
		}

		case "UPDATE_CURRENTPOST_FIELD": {
			return {
				...state,
				currentPost: {
					...state.currentPost,
					[action.field]: action.value,
				},
			};
		}

		case "UNSET_CURRENTPOST": {
			return {
				...state,
				currentPost: initialPosts.currentPost,
			};
		}

		case "UPDATE": {
			const { id, params, newIndex, unscheduled } = action;

			return {
				...state,
				updatePost: {
					updateNow: true,
					id,
					params,
					newIndex,
					unscheduled,
				},
			};
		}

		case "UPDATING": {
			return {
				...state,
				updatePost: {
					...state.updatePost,
					updateNow: false,
				},
			};
		}

		case "TRASH": {
			const { id, params } = action;
			return {
				...state,
				updatePost: {
					updateNow: true,
					trash: true,
					id,
					params,
				},
			};
		}

		case "COMPLETE": {
			return {
				...state,
				updatePost: initialPosts.updatePost,
			};
		}

		default: {
			return state;
		}
	}
}
