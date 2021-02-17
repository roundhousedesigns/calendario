import { useState, useEffect, useRef, useReducer } from "react";
import { format, isSameDay } from "date-fns";
import { routeBase, dateFormat } from "../lib/utils";

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

export const useDayPosts = (posts, date) => {
	let dayPosts = [];
	posts.forEach((post) => {
		if (isSameDay(date, new Date(post.post_date))) {
			dayPosts.push(post);
		}
	});

	return dayPosts;
};

export const useFetchPosts = (
	scheduled = false,
	params = { start: null, end: null }
) => {
	const cache = useRef({});
	const postBase = scheduled === true ? "calendar" : "unscheduled";
	const initialState = {
		status: "idle",
		error: null,
		data: [],
	};
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case "FETCHING":
				return { ...state, status: "fetching" };

			case "FETCHED":
				return {
					...state,
					status: "fetched",
					data: action.data,
				};

			case "FETCH_ERROR":
				return { ...state, status: "error", error: action.data };

			default:
				return state;
		}
	}, initialState);
	let url = `${routeBase}/${postBase}`;

	if (scheduled === true) {
		const startDate = format(params.start, dateFormat.date);
		const endDate =
			params.end !== null ? format(params.end, dateFormat.date) : null;

		url = `${url}/${startDate}/${endDate}`;
	}

	useEffect(() => {
		let cancelRequest = false;

		const fetchData = async () => {
			dispatch({ type: "FETCHING" });

			if (cache.current[url]) {
				const data = cache.current[url];
				dispatch({ type: "FETCHED", data: data });
			} else {
				try {
					const response = await fetch(url);
					const data = await response.json();
					cache.current[url] = data; // set response in cache;
					dispatch({ type: "FETCHED", data: data });
				} catch (error) {
					if (cancelRequest) return;
					dispatch({ type: "FETCH_ERROR", data: error.message });
				}
			}
		};

		fetchData();

		return function cleanup() {
			cancelRequest = true;
		};
	}, [url, postBase]);

	return state;
};
