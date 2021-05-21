import { createContext } from "react";
import { wp } from "./lib/utils";
import { addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

const ViewContext = createContext({});
export default ViewContext;

export const initialViewOptions = {
	viewMode: "",
	viewRange: {
		start: null,
		end: null,
	},
	postStatuses: {},
	sidebarOpen: true,
};

const { defaultStatusColors } = wp;

export function viewReducer(state, action) {
	switch (action.type) {
		case "UPDATE":
			return {
				...state,
				viewMode: action.viewMode ? action.viewMode : state.viewMode,
				viewRange: action.viewRange
					? action.viewRange
					: state.viewRange,
			};

		case "SET_RANGE":
			let range =
				state.viewMode !== "list"
					? {
							start: startOfWeek(action.start),
							end: endOfWeek(action.end),
					  }
					: { start: action.start, end: action.end };

			return {
				...state,
				viewRange: {
					start: range.start,
					end: range.end,
				},
			};

		case "SET_RANGE_START":
			return {
				...state,
				viewRange: {
					...state.viewRange,
					start:
						state.viewMode !== "list"
							? startOfWeek(action.date)
							: action.date,
				},
			};

		case "SET_RANGE_END":
			return {
				...state,
				viewRange: {
					...state.viewRange,
					end:
						state.viewMode !== "list"
							? endOfWeek(action.date)
							: action.date,
				},
			};

		case "NEXT_MONTH":
			return {
				...state,
				viewRange: {
					start: addMonths(state.viewRange.start, 1),
					end: addMonths(state.viewRange.end, 1),
				},
			};

		case "PREV_MONTH":
			return {
				...state,
				viewRange: {
					start: subMonths(state.viewRange.start, 1),
					end: subMonths(state.viewRange.end, 1),
				},
			};

		case "SET_POST_STATUSES":
			let statuses = action.postStatuses;

			// Don't overwrite visibility, if set
			for (let status in statuses) {
				statuses[status].visible =
					"visible" in statuses[status]
						? statuses[status].visible
						: true;
			}

			return {
				...state,
				postStatuses: statuses,
			};

		case "TOGGLE_POST_STATUS":
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

		case "SET_POST_STATUS_COLOR":
			return {
				...state,
				postStatuses: {
					...state.postStatuses,
					[action.postStatus]: {
						...state.postStatuses[action.postStatus],
						color: action.color,
					},
				},
			};

		case "RESET_POST_STATUS_COLORS":
			let reset = state.postStatuses;
			let statusKeys = Object.keys(state.postStatuses);

			for (let status of statusKeys) {
				reset[status].color = defaultStatusColors[status];
			}

			return {
				...state,
				postStatuses: { ...reset },
			};

		case "TOGGLE_SIDEBAR":
			return {
				...state,
				sidebarOpen: !state.sidebarOpen,
			};

		default:
			return state;
	}
}
