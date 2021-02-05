import { createContext } from "react";

const DragContext = createContext(null);
export default DragContext;

export function dragReducer(state, action) {
	switch (action.type) {
		case "START":
			return {
				isDragging: true,
				dragIndex: action.dragIndex ? action.dragIndex : null,
				hoverIndex: action.hoverIndex ? action.hoverIndex : null,
				post: action.post,
			};

		case "END": {
			return {
				isDragging: false,
				dragIndex: null,
				post: {},
			};
		}

		default:
			return state;
	}
}
