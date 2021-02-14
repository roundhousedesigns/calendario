import { useState, useEffect, useRef, useContext } from "react";
import { format, isSameDay } from "date-fns";
import { routeBase, dateFormat } from "../lib/utils";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";

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

export const useFetch = (
	calendar = false,
	startMonth = null,
	endMonth = null
) => {
	const { postsDispatch } = useContext(PostsContext);
	const cache = useRef({});
	const [data, setData] = useState([]);
	const [status, setStatus] = useState("idle");
	const postBase = calendar === true ? "calendar" : "unscheduled";
	var url = `${routeBase}/${postBase}`;

	if (calendar === true) {
		const startDate = format(startMonth, dateFormat.date);
		const endDate = format(endMonth, dateFormat.date);

		url = `${url}/${startDate}/${endDate}`;
	}

	useEffect(() => {
		const fetchData = async () => {
			setStatus("fetching");
			if (cache.current[url]) {
				const res = cache.current[url];
				setData(res);
				setStatus("fetched");
			} else {
				const response = await fetch(url);
				const res = await response.json();
				cache.current[url] = data; // set response in cache;
				setData(res);
				setStatus("fetched");
			}

			if (!isEmpty(data)) {
				postsDispatch({
					type: "INIT",
					[postBase]: data,
				});
			}
		};

		fetchData();
	}, [url, data, postBase, postsDispatch]);

	return status;
};

export const useUpdatePost = (url) => {};
