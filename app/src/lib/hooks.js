import { useState, useEffect, useContext /* useRef */ } from "react";
import { wp, dateFormat } from "../lib/utils";
import { format, isSameDay } from "date-fns";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

import { DEBUG_MODE } from "../lib/utils";

const { routeBase, nonce } = wp;

const headers = DEBUG_MODE !== true ? { "X-WP-Nonce": nonce } : {};

/**
 * Uses localStorage to save view-specific user options.
 *
 * @param {any} defaultValue The default option value
 * @param {string} key The option key
 * @returns {[state, setter]} The useState state and setter
 */
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

/**
 * Get posts for a specified calendar day.
 *
 * @param {array} posts The posts
 * @param {Date} date The calendar day
 * @returns {array} The calendar day's posts
 */
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

/**
 * Retrieves 'scheduled' posts from the server
 * @param {Date} start The range's start
 * @param {Date} end The range's end
 * @returns {boolean} The current loading state
 */
export const useFetchScheduledPosts = (start, end) => {
	const {
		posts: { refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (start !== null && end !== null) {
			let startDate = format(start, dateFormat.date);
			let endDate = format(end, dateFormat.date);
			let url = `${routeBase}/posts/scheduled/${startDate}/${endDate}`;

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
	}, [start, end, refetch, postsDispatch]);

	return isLoading;
};

/**
 * Retrieves 'unscheduled' posts from the server
 *
 * @returns {boolean} The current loading state
 */
export const useFetchUnscheduledPosts = () => {
	const {
		posts: { refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let url = `${routeBase}/posts/unscheduled`;

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

/**
 * Retrieves the set of post statuses from the server
 *
 * @returns {boolean} The current loading state
 */
export const useFetchPostStatuses = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { viewOptionsDispatch } = useContext(ViewContext);

	useEffect(() => {
		let url = `${routeBase}/statuses`;

		const fetchData = async () => {
			setIsLoading(true);

			try {
				const res = await fetch(url, {
					headers,
				});
				const data = await res.json();

				viewOptionsDispatch({
					type: "SET_POST_STATUSES",
					postStatuses: data,
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
	}, [viewOptionsDispatch]);

	return isLoading;
};

/**
 * Retrieves all terms of a taxonomy
 *
 * @param {string} name The taxonomy name (slug) to fetch
 * @returns {boolean} The current loading state
 */
export const useFetchTaxonomyTerms = (name) => {
	const {
		posts: { taxonomies },
		postsDispatch,
	} = useContext(PostsContext);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Only fetch categories if not already set
		if (isEmpty(taxonomies[name])) {
			let url = `${routeBase}/tax/${name}`;

			const fetchData = async () => {
				setIsLoading(true);

				try {
					const res = await fetch(url, {
						headers,
					});
					const data = await res.json();

					postsDispatch({
						type: "SET_TAXONOMY_TERMS",
						name,
						taxonomy: data.taxonomy,
						terms: data.terms,
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
	}, [name, taxonomies, postsDispatch]);

	return isLoading;
};

/**
 * Retrieves 'scheduled' posts from the server
 * @param {Object} ref The element's ref
 * @param {Function} end The handler function
 * @returns {void}
 */
export const useClickOutside = (ref, handler) => {
	useEffect(() => {
		let startedInside = false;
		let startedWhenMounted = false;

		const listener = (event) => {
			// Do nothing if `mousedown` or `touchstart` started inside ref element
			if (startedInside || !startedWhenMounted) return;
			// Do nothing if clicking ref's element or descendent elements
			if (!ref.current || ref.current.contains(event.target)) return;

			handler(event);
		};

		const validateEventStart = (event) => {
			startedWhenMounted = ref.current;
			startedInside = ref.current && ref.current.contains(event.target);
		};

		document.addEventListener("mousedown", validateEventStart);
		document.addEventListener("touchstart", validateEventStart);
		document.addEventListener("click", listener);

		return () => {
			document.removeEventListener("mousedown", validateEventStart);
			document.removeEventListener("touchstart", validateEventStart);
			document.removeEventListener("click", listener);
		};
	}, [ref, handler]);
};
