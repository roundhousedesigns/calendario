import { createContext } from "react";
import { addMonths, subMonths } from "date-fns";

const ViewContext = createContext({});
export default ViewContext;

export function viewReducer(state, action) {
	switch (action.type) {
		case "UPDATE_OPTION":
			return {
				...state,
				viewMode: action.viewMode ? action.viewMode : state.viewMode,
				monthCount: action.monthCount
					? action.monthCount
					: state.monthCount,
			};

		case "SET_RANGE":
			return {
				...state,
				viewRange: {
					start: action.start,
					end: action.end,
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

		// TODO see if RESET_VIEW is used...
		case "RESET_VIEW":
			return {
				...state,
				viewRange: initialViewOptions.viewRange,
			};

		default:
			return state;
	}
}

export const initialViewOptions = {
	viewMode: "",
	monthCount: 1,
	viewRange: {
		start: null,
		end: null,
	},
};
