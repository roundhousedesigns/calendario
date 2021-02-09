import { createContext } from "react";
import arrayMove from "array-move";

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
				originalUnscheduledOrder: action.originalUnscheduledOrder,
			};

		case "DRAGGING_OVER_UNSCHEDULED":
			let updatedUnscheduledOrder = state.originalUnscheduledOrder;

			if (state.draggedTo === false) {
				// for now, just add to end of list.
				// TODO: position before/after
				updatedUnscheduledOrder = [
					...new Set([...state.originalUnscheduledOrder, state.post]),
				];
			} else {
				// reordering
				let draggedFrom = null;

				if (state.draggedFrom === false) {
					draggedFrom = updatedUnscheduledOrder.length;

					updatedUnscheduledOrder = [
						...new Set([
							...state.originalUnscheduledOrder,
							state.post,
						]),
					];
				} else {
					draggedFrom = state.draggedFrom;
				}

				if (draggedFrom !== action.draggedTo) {
					updatedUnscheduledOrder = arrayMove(
						updatedUnscheduledOrder,
						draggedFrom,
						action.draggedTo
					);
				}
			}

			return {
				...state,
				draggedTo: action.draggedTo,
				updatedUnscheduledOrder: updatedUnscheduledOrder,
			};

		case "END": {
			return {
				post: {},
				isDragging: false,
				draggedFrom: null,
				draggedTo: null,
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
	originalUnscheduledOrder: [],
	updatedUnscheduledOrder: [],
};
