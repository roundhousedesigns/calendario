import { createContext } from "react";

const DragContext = createContext(null);
export default DragContext;

export const initialDrag = {
	post: {},
	isDragging: false,
	currentIndex: null,
	newIndex: null,
	overUnscheduled: false,
};

export function dragReducer(state, action) {
	switch (action.type) {
		case "START": {
			return {
				...state,
				post: action.post,
				isDragging: true,
				currentIndex:
					action.currentIndex >= 0 ? action.currentIndex : false,
			};
		}

		case "DRAGGING_OVER_UNSCHEDULED": {
			return {
				...state,
				newIndex: action.draggedOver,
				overUnscheduled: true,
			};
		}

		case "DRAGGING_OVER_CALENDAR": {
			return {
				...state,
				newIndex: initialDrag.newIndex,
				overUnscheduled: false,
			};
		}

		case "END": {
			return initialDrag;
		}

		default: {
			return state;
		}
	}
}
