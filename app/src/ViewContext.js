import { createContext } from "react";
import { addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { postStatuses } from "./lib/utils";

const ViewContext = createContext({});
export default ViewContext;

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

		case "TOGGLE_STATUS":
			return {
				...state,
				statuses: {
					...state.statuses,
					[action.status]: !state.statuses[action.status],
				},
			};

		default:
			return state;
	}
}

var statuses = {};
for (const status in postStatuses) {
	statuses[status] = true;
}

export const initialViewOptions = {
	viewMode: "",
	viewRange: {
		start: null,
		end: null,
	},
	statuses,
};
