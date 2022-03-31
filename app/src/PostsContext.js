import { createContext } from 'react';
import {
	localTZShift,
	setScheduledPosts,
	flattenScheduledPosts,
	dayKey,
} from './lib/utils';
import { isEqual, uniqBy, isEmpty } from 'lodash';

const PostsContext = createContext({});
export default PostsContext;

export const initialPosts = {
	currentPost: {
		id: null,
		post_title: '',
		post_status: '',
		post_date: '',
		post_author: '',
		comment_status: '',
		unscheduled: null,
	},
	updatePost: {
		updateNow: false, // Toggle value to trigger post update.
		trash: false,
		id: null,
		params: {},
		newIndex: null,
		unscheduled: false,
	},
	fetchPosts: false, // Toggle value to trigger fetching scheduled and unscheduled.
	dateRange: {
		start: '',
		end: '',
	},
	isUpdating: '',
	unscheduled: [],
	scheduled: [],
	trashed: [],
	taxonomies: {},
};

export function postsReducer(state, action) {
	switch (action.type) {
		case 'SET_SCHEDULED': {
			let oldRaw = flattenScheduledPosts(state.scheduled);
			let newRaw = action.posts;

			let scheduledPosts;

			if (isEqual(oldRaw, newRaw) || isEmpty(newRaw)) {
				return state;
			} else {
				scheduledPosts = uniqBy([...newRaw, ...oldRaw], 'id');
			}

			return {
				...state,
				dateRange: {
					start: action.start ? action.start : state.dateRange.start,
					end: action.end ? action.end : state.dateRange.end,
				},
				scheduled: setScheduledPosts(scheduledPosts),
			};
		}

		case 'SET_UNSCHEDULED': {
			var { posts: unscheduledPosts } = action;

			// cast the date as a Date object
			unscheduledPosts.forEach((post, index) => {
				unscheduledPosts[index].post_date = new Date(post.post_date);
			});

			return {
				...state,
				unscheduled: unscheduledPosts,
			};
		}

		case 'MOVE_POST': {
			var { scheduled, unscheduled } = state;
			const { source, sourceId, destination, destinationId } = action;

			if (action.sourceId === 'unscheduled') {
				unscheduled = source;
			} else {
				scheduled[sourceId] = source;
			}

			if (destinationId === 'unscheduled') {
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

		case 'SET_TAXONOMY_TERMS': {
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

		case 'APPEND_TAXONOMY_TERM': {
			return {
				...state,
				taxonomies: {
					...state.taxonomies,
					[action.name]: {
						...state.taxonomies[action.name],
						terms: [action.term, ...state.taxonomies[action.name].terms],
					},
				},
			};
		}

		case 'SET_CURRENTPOST': {
			return {
				...state,
				currentPost: {
					...action.post,
					unscheduled: action.unscheduled,
				},
			};
		}

		case 'UNSET_CURRENTPOST': {
			return {
				...state,
				currentPost: initialPosts.currentPost,
			};
		}

		case 'FETCH': {
			return {
				...state,
				fetchPosts: !state.fetchPosts,
			};
		}

		case 'CREATE_NEW_POST': {
			return {
				...state,
				currentPost: {
					id: 0,
					post_date: action.post_date,
					post_status: 'draft',
					unscheduled: action.unscheduled,
					taxonomies: {},
				},
			};
		}

		case 'UPDATE_CURRENTPOST_FIELD': {
			return {
				...state,
				currentPost: {
					...state.currentPost,
					[action.field]: action.value,
				},
			};
		}

		case 'PREPARE_UPDATE': {
			const { id, params, newIndex, unscheduled } = action;
			const index =
				unscheduled && newIndex === -1 ? unscheduled.length : newIndex;

			const post_date_unshifted = params.post_date;

			// THE DATE GETS FUCKED IN HERE SOMEWHERE

			let postData;
			if (unscheduled) {
				postData = params;
			} else {
				let dateUnoffset = localTZShift(params.post_date, true);
				postData = {
					...params,
					post_date: dateUnoffset,
					post_date_unshifted,
				};
			}

			return {
				...state,
				updatePost: {
					updateNow: true,
					id,
					unscheduled,
					params: postData,
					newIndex: index,
				},
			};
		}

		case 'PRE_UPDATE_POST': {
			// Disable the 'updateNow' flag
			return {
				...state,
				updatePost: {
					...state.updatePost,
					updateNow: false,
				},
			};
		}

		// case 'ADD_POST': {
		// 	const { droppableId } = action;
		// 	const {
		// 		updatePost: { id, params },
		// 	} = state;
		// 	let { scheduled, unscheduled } = state;

		// 	const post = {
		// 		id,
		// 		...params,
		// 	};

		// 	if (droppableId === 'unscheduled') {
		// 		unscheduled.push(post);
		// 	} else {
		// 		if (scheduled.hasOwnProperty(droppableId)) {
		// 			scheduled[droppableId].push(post);
		// 		} else {
		// 			scheduled = {
		// 				...scheduled,
		// 				[droppableId]: [post],
		// 			};
		// 		}
		// 	}

		// 	return {
		// 		...state,
		// 		scheduled,
		// 		unscheduled,
		// 		isUpdating: droppableId,
		// 	};
		// }

		case 'UPDATE_POST': {
			const { droppableId } = action;
			let {
				updatePost: { id, params, updateNow },
				scheduled,
				unscheduled,
			} = state;
			const isUnscheduled = droppableId === 'unscheduled' ? true : false;

			// Cast the date as a Date
			// TODO fix to non mutation
			params.post_date = localTZShift(new Date(params.post_date), true);

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
				if (key in scheduled) {
					scheduled[key].forEach((item, index) => {
						if (item.id === id) {
							scheduled[key][index] = {
								...scheduled[key][index],
								...params,
							};
						}
					});
				}
			}

			return {
				...state,
				scheduled,
				unscheduled,
				isUpdating: droppableId,
			};
		}

		case 'REMOVE_POST': {
			const { droppableId } = action;
			const {
				updatePost: { id },
			} = state;
			let { scheduled, unscheduled } = state;

			if (droppableId === 'unscheduled') {
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

		case 'UPDATE_COMPLETE': {
			return {
				...state,
				isUpdating: initialPosts.isUpdating,
				fetchPosts: true,
				updatePost: initialPosts.updatePost,
			};
		}

		case 'SEND_TO_TRASH': {
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

		case 'FETCH_COMPLETE': {
			return {
				...state,
				fetchPosts: false,
			};
		}

		default: {
			return state;
		}
	}
}
