import React from "react";

export const useCalendarRefs = (viewMonthCount) => {
	let refs = [];
	for (let i = 0; i < viewMonthCount; i++) {
		refs[i] = React.createRef();
	}

	console.log('refs run');
	return refs;
};
