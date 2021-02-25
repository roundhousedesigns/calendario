import { createContext } from "react";
import { addMonths, subMonths } from "date-fns";

const ViewContext = createContext({});
export default ViewContext;

// function viewRangeReducer(state, action) {
// 	switch (action.type) {
// 		case "SET":
// 			return {
// 				...state,
// 				start: action.start,
// 				end: action.end,
// 			};

// 		// case "END":
// 		// 	return {
// 		// 		...state,
// 		// 		end: action.end,
// 		// 	};

// 		case "NEXT_MONTH":
// 			return {
// 				...state,
// 				start: addMonths(state.start, 1),
// 				end: addMonths(state.end, 1),
// 			};

// 		case "PREV_MONTH":
// 			return {
// 				...state,
// 				start: subMonths(state.start, 1),
// 				end: subMonths(state.end, 1),
// 			};

// 		case "RESET":
// 			return initialViewRange;

// 		default:
// 			return state;
// 	}
// }

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
	viewMode: "calendar",
	monthCount: 1,
	viewRange: {
		start: new Date(),
		end: new Date(),
	},
};
