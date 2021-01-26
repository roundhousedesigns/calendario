import { createRef, useEffect, useState } from "react";
import { routeBase } from "./utils";

export const useCalendarRefs = (viewMonthCount) => {
	let refs = [];
	for (let i = 0; i < viewMonthCount; i++) {
		refs[i] = createRef();
	}

	return refs;
};

export const useToday = () => {
	const [today, setToday] = useState(null);

	useEffect(() => {
		let today = new Date();
		today.setHours(0, 0, 0);

		setToday(today);
	}, []);

	return today;
};

export const useFutureMost = () => {
	const [futuremostDate, setFuturemostDate] = useState(null);
	useEffect(() => {
		fetch(`${routeBase}/posts/futuremost`)
			.then((response) => response.json())
			.then((future) => {
				setFuturemostDate(new Date(future));
			});
	}, []);

	return futuremostDate;
};

// export const useFetch = (url, options) => {
// 	const [response, setResponse] = useState([]);
// 	const [error, setError] = useState(null);

// 	const fetchData = async (url, options) => {
// 		try {
// 			const res = await fetch(url, options);
// 			const json = await res.json();
// 			setResponse(json);
// 		} catch (error) {
// 			setError(error);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchData(url, options);
// 	}, [url, options]);

// 	return { response, error };
// };

export const useStickyState = (defaultValue, key) => {
	const [value, setValue] = useState(() => {
		const stickyValue = window.localStorage.getItem(key);
		return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
	});

	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);
	return [value, setValue];
};
