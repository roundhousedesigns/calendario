import { createContext } from "react";

const DragContext = createContext(null);
export default DragContext;

export function dragReducer(state, action) {
	switch (action.type) {
		case "START":
			return {
				isDragging: true,
				post: action.post,
			};

		case "END": {
			return {
				isDragging: false,
				post: {},
			};
		}

		default:
			return state;
	}
}
