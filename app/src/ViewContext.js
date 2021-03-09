import { createContext } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
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
