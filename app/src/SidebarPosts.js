import { createContext } from "react";

const SidebarPostsContext = createContext(null);
export default SidebarPostsContext;

export function sidebarPostsReducer(state, action) {
	switch (action.type) {
		case "POPULATE":
			return {
				events: action.events,
			};
		case "ADD":
			return {
				...state,
				events: [...state.events, action.event],
			};

		case "REMOVE":
			return {
				...state,
				events: state.events.filter(
					(item) => item.id !== action.event.id
				),
			};

		default:
			return state;
	}
}
