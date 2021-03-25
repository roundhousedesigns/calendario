import { createContext } from "react";

const DragContext = createContext(null);
export default DragContext;

export function dragReducer(state, action) {
	switch (action.type) {
		case "START":
			return {
				post: action.post,
				isDragging: true,
				draggedFrom:
					action.draggedFrom >= 0 ? action.draggedFrom : false,
			};

		case "DRAGGING_OVER_UNSCHEDULED":
			console.log("well");
			return {
				...state,
				draggedTo: action.draggedOver,
				overUnscheduled: true,
			};

		case "END": {
			return initialDrag;
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
	overUnscheduled: false,
};
