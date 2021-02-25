import {
	useState,
	useEffect /*useRef,*/ /*useReducer*/,
	useContext,
} from "react";
import { format, isSameDay } from "date-fns";
import { routeBase, dateFormat } from "../lib/utils";

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
	if (posts) {
		posts.forEach((post) => {
			if (isSameDay(date, new Date(post.post_date))) {
				dayPosts.push(post);
			}
		});
	}

	return dayPosts;
};

export const useFetchScheduledPosts = (start, end) => {
	const { postsDispatch } = useContext(PostsContext);

	useEffect(() => {
		if (start !== null && end !== null) {
			let startDate = format(start, dateFormat.date);
			let endDate = format(end, dateFormat.date);
			let url = `${routeBase}/scheduled/${startDate}/${endDate}`;

			const fetchData = async () => {
				try {
					const res = await fetch(url);
					const data = await res.json();

					postsDispatch({
						type: "SET_SCHEDULED",
						posts: data.posts,
						start: data.dateRange.start,
						end: data.dateRange.end,
					});
				} catch (error) {
					console.log("REST error", error.message);
				}
			};

			fetchData();
		}
	}, [start, end, postsDispatch]);
};
