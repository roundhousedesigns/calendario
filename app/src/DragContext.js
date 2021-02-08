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

export const initialDrag = {
	post: {},
	isDragging: false,
	draggedFrom: null,
	draggedTo: null,
	originalOrder: [],
	updatedOrder: [],
};
