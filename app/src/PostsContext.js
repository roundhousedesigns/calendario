import { createContext } from "react";
import { dateFormat, dayKey } from "./lib/utils";
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
	refetch: false, // Toggle value to trigger refetch
	dateRange: {
		start: "",
		end: "",
	},
	isUpdating: null,
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

		case "MOVE_POST": {
			//TODO kill this and let UPDATE_POST handle
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

		case "CREATE_NEW_POST": {
			return {
				...state,
				currentPost: {
					id: 0,
					post_date: action.post_date,
					post_status: "draft",
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

		case "PREPARE_UPDATE": {
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

		case "UPDATE_INIT": {
			return {
				...state,
				updatePost: {
					...state.updatePost,
					updateNow: false,
				},
			};
		}

		case "ADD_POST": {
			const { droppableId } = action;
			const {
				updatePost: { id, params },
			} = state;
			let { scheduled, unscheduled } = state;

			const post = {
				id,
				...params,
			};

			if (droppableId === "unscheduled") {
				unscheduled.push(post);
			} else {
				if (scheduled.hasOwnProperty(droppableId)) {
					scheduled[droppableId].push(post);
				} else {
					scheduled = {
						...scheduled,
						[droppableId]: [post],
					};
				}
			}

			return {
				...state,
				scheduled,
				unscheduled,
				isUpdating: droppableId,
			};
		}

		case "UPDATE_POST": {
			const { droppableId, unscheduled: isUnscheduled } = action;
			let {
				updatePost: { id, params },
				scheduled,
				unscheduled,
			} = state;

			// Cast the date as a Date
			if (typeof params.post_date === "string") {
				params.post_date = new Date(params.post_date);
			}

			if (isUnscheduled) {
				unscheduled.forEach((item, index) => {
					if (item.id === id) {
						unscheduled[index] = {
							...unscheduled[index],
							...params,
						};
					}
				});
			} else {
				const key = dayKey(params.post_date);
				scheduled[key].forEach((item, index) => {
					if (item.id === id) {
						scheduled[key][index] = {
							...scheduled[key][index],
							...params,
						};
					}
				});
			}

			return {
				...state,
				scheduled,
				unscheduled,
				isUpdating: droppableId,
			};
		}

		case "REMOVE_POST": {
			const { droppableId } = action;
			const {
				updatePost: { id },
			} = state;
			let { scheduled, unscheduled } = state;

			if (droppableId === "unscheduled") {
				unscheduled = unscheduled.filter((item) => item.id !== id);
			} else {
				scheduled[droppableId] = scheduled[droppableId].filter(
					(item) => item.id !== id
				);
			}

			return {
				...state,
				scheduled,
				unscheduled,
				isUpdating: droppableId,
			};
		}

		case "UPDATE_SUCCESS": {
			return {
				...state,
				isUpdating: initialPosts.isUpdating,
				updatePost: initialPosts.updatePost,
			};
		}

		case "UPDATE_ERROR": {
			console.log("Update error", action.data);

			return {
				...state,
				isUpdating: initialPosts.isUpdating,
				refetch: !state.refetch,
				updatePost: initialPosts.updatePost,
			};
		}

		case "SEND_TO_TRASH": {
			const { id, params, unscheduled } = action;
			return {
				...state,
				updatePost: {
					updateNow: true,
					trash: true,
					id,
					params,
					unscheduled,
				},
			};
		}

		default: {
			return state;
		}
	}
}
