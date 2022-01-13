import { createContext } from 'react';
import { wp } from './lib/utils';
import {
	addWeeks,
	subWeeks,
	startOfWeek,
	endOfWeek,
	differenceInWeeks,
} from 'date-fns';

const ViewContext = createContext({});
export default ViewContext;

export const initialViewOptions = {
	viewMode: '',
	viewRange: {
		start: null,
		end: null,
	},
	postStatuses: {},
	postStatusColorsChanged: false,
	sidebarOpen: true,
};

const { defaultStatusColors } = wp;

export function viewReducer(state, action) {
	switch (action.type) {
		case 'SET_VIEW_MODE': {
			const { viewMode } = action;
			const {
				viewRange: { start, end },
			} = state;

			return {
				...state,
				viewMode,
				viewRange: {
					start: viewMode === 'calendar' ? startOfWeek(start) : start,
					end: viewMode === 'calendar' ? endOfWeek(end) : end,
				},
			};
		}

		case 'SET_RANGE': {
			const { viewMode, viewRange } = state;
			const start = action.start ? action.start : viewRange.start;
			const end = action.end ? action.end : viewRange.end;

			return {
				...state,
				viewRange: {
					start: viewMode === 'list' ? start : startOfWeek(start),
					end: viewMode === 'list' ? end : endOfWeek(end),
				},
			};
		}

		case 'CHANGE_MONTH': {
			const { viewMode, viewRange } = state;
			const { direction } = action;
			const weekCount = differenceInWeeks(viewRange.end, viewRange.start);
			let newStart, newEnd;

			if (direction === 'next') {
				newStart = addWeeks(viewRange.start, weekCount);
				newEnd = addWeeks(viewRange.end, weekCount);
			} else if (direction === 'previous') {
				newStart = subWeeks(viewRange.start, weekCount);
				newEnd = subWeeks(viewRange.end, weekCount);
			}

			return {
				...state,
				viewRange: {
					start: viewMode === 'list' ? newStart : startOfWeek(newStart),
					end: viewMode === 'list' ? newEnd : endOfWeek(newEnd),
				},
			};
		}

		case 'SET_POST_STATUSES': {
			let statuses = action.postStatuses;

			// Don't overwrite visibility, if set
			for (let status in statuses) {
				statuses[status].visible =
					'visible' in statuses[status] ? statuses[status].visible : true;
			}

			return {
				...state,
				postStatuses: statuses,
			};
		}

		case 'TOGGLE_POST_STATUS': {
			return {
				...state,
				postStatuses: {
					...state.postStatuses,
					[action.postStatus]: {
						...state.postStatuses[action.postStatus],
						visible: !state.postStatuses[action.postStatus].visible,
					},
				},
			};
		}

		case 'SET_POST_STATUS_COLOR': {
			return {
				...state,
				postStatuses: {
					...state.postStatuses,
					[action.postStatus]: {
						...state.postStatuses[action.postStatus],
						color: action.color,
					},
				},
				postStatusColorsChanged: true,
			};
		}

		case 'POST_STATUS_UPDATE_COMPLETE': {
			return {
				...state,
				postStatusColorsChanged: false,
			};
		}

		case 'RESET_POST_STATUS_COLORS': {
			let reset = state.postStatuses;
			const statusKeys = Object.keys(state.postStatuses);

			for (let status of statusKeys) {
				reset[status].color = defaultStatusColors[status];
			}

			return {
				...state,
				postStatuses: { ...reset },
				postStatusColorsChanged: true,
			};
		}

		case 'TOGGLE_SIDEBAR': {
			const { sidebarOpen } = state;

			return {
				...state,
				sidebarOpen: !sidebarOpen,
			};
		}

		default: {
			return state;
		}
	}
}
