export const initialUpdateState = {
	updateNow: false,
	trash: false,
	post: {},
	params: {},
	newIndex: null,
	unscheduled: false,
};

export function updateReducer(state, action) {
	switch (action.type) {
		case "UPDATE":
			return {
				updateNow: true,
				post: action.post,
				params: action.params,
				newIndex: action.newIndex,
				unscheduled: action.unscheduled,
			};

		case "UPDATING":
			return {
				...state,
				updateNow: false,
			};

		case "TRASH":
			return {
				trash: true,
				updateNow: true,
				params: action.params,
			};

		case "COMPLETE":
			return initialUpdateState;

		default:
			return state;
	}
}
