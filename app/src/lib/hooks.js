import React from "react";

export function useCalendarRefs(maxViewMonths) {
	let refs = [];
	for (let i = 0; i < maxViewMonths; i++) {
		refs[i] = React.createRef();
	}
	return refs;
}
