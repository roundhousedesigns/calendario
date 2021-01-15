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

		case "UPDATE":
			var { events } = state;

			events.forEach((item, index, events) => {
				if (action.updateEvent.id === item.id) {
					Object.keys(action.updateEvent.props).forEach((prop) => {
						events[index][prop] = action.updateEvent.props[prop];
					});
				}
			});

			return {
				...state,
				events: events,
			};

		default:
			return state;
	}
}
