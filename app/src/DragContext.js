import { createContext } from "react";

const DragContext = createContext(null);
export default DragContext;

export const initialDrag = {
	post: {},
	isDragging: false,
	draggedFrom: null,
	draggedTo: null,
	overUnscheduled: false,
};

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
			return {
				...state,
				draggedTo: action.draggedOver,
				overUnscheduled: true,
			};

		case "DRAGGING_OVER_CALENDAR":
			return {
				...state,
				draggedTo: initialDrag.draggedTo,
				overUnscheduled: false,
			};

		case "END": {
			return initialDrag;
		}

		default:
			return state;
	}
}
