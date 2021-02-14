import { createContext } from "react";

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

		default:
			return state;
	}
}

export const initialViewOptions = {
	viewMode: "calendar",
	monthCount: 1,
};
