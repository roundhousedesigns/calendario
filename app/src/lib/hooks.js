import React from "react";

export const useCalendarRefs = (viewMonthCount) => {
	let refs = [];
	for (let i = 0; i < viewMonthCount; i++) {
		refs[i] = React.createRef();
	}

	return refs;
};

export const useStickyState = (defaultValue, key) => {
	const [value, setValue] = React.useState(() => {
		const stickyValue = window.localStorage.getItem(key);
		return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
	});
	React.useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);
	return [value, setValue];
};
