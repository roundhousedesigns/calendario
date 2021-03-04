import { useState, useEffect, useContext } from "react";
import { format, isSameDay } from "date-fns";
import { nonce, routeBase, dateFormat } from "../lib/utils";

import PostsContext from "../PostsContext";

// TODO: DEV MODE
import { DEBUG_MODE } from "../lib/utils";

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
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (start !== null && end !== null) {
			let startDate = format(start, dateFormat.date);
			let endDate = format(end, dateFormat.date);
			let url = `${routeBase}/scheduled/${startDate}/${endDate}`;

			// TODO: DEV MODE
			var headers = {};
			if (DEBUG_MODE !== true) {
				headers["X-WP-Nonce"] = nonce;
			}
			// ODOT

			const fetchData = async () => {
				setIsLoading(true);

				try {
					const res = await fetch(url, {
						headers,
					});
					const data = await res.json();

					postsDispatch({
						type: "SET_SCHEDULED",
						posts: data.posts,
						start: data.dateRange.start,
						end: data.dateRange.end,
					});

					setIsLoading(false);
				} catch (error) {
					console.log("REST error", error.message);
					setIsLoading(false);
				}
			};

			fetchData();

			return () => {
				setIsLoading(false);
			};
		}
	}, [start, end, postsDispatch]);

	return isLoading;
};

export const useFetchUnscheduledPosts = () => {
	const {
		posts: { refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let url = `${routeBase}/unscheduled`;

		// TODO: DEV MODE
		var headers = {};
		if (DEBUG_MODE !== true) {
			headers["X-WP-Nonce"] = nonce;
		}
		// ODOT

		const fetchData = async () => {
			setIsLoading(true);

			try {
				const res = await fetch(url, {
					headers,
				});
				const data = await res.json();

				postsDispatch({
					type: "SET_UNSCHEDULED",
					posts: data.posts,
					unscheduled: true,
				});

				setIsLoading(false);
			} catch (error) {
				console.log("REST error", error.message);
				setIsLoading(false);
			}
		};

		fetchData();

		return () => {
			setIsLoading(false);
		};
	}, [postsDispatch, refetch]);

	return isLoading;
};

export const useFetchTrashedPosts = () => {
	const {
		posts: { refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let url = `${routeBase}/trashed`;

		// TODO: DEV MODE
		var headers = {};
		if (DEBUG_MODE !== true) {
			headers["X-WP-Nonce"] = nonce;
		}
		// ODOT

		const fetchData = async () => {
			setIsLoading(true);

			try {
				const res = await fetch(url, {
					headers,
				});
				const data = await res.json();

				postsDispatch({
					type: "SET_UNSCHEDULED",
					posts: data.posts,
					unscheduled: true,
				});

				setIsLoading(false);
			} catch (error) {
				console.log("REST error", error.message);
				setIsLoading(false);
			}
		};

		fetchData();

		return () => {
			setIsLoading(false);
		};
	}, [postsDispatch, refetch]);

	return isLoading;
};
