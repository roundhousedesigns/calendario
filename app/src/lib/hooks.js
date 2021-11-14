import { useState, useEffect } from 'react';
import { wp, dateFormat } from '../lib/utils';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { sanitizeParamsForUpdate, DEBUG_MODE } from '../lib/utils';

const { routeBase, nonce } = wp;
var headers = {
	'Content-Type': 'application/json',
};

if (DEBUG_MODE === false) {
	headers['X-WP-Nonce'] = nonce;
}

/**
 * Uses localStorage to save view-specific user options.
 *
 * @param {*} defaultValue The default option value
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
 * Retrieves 'scheduled' posts from the server
 * @param {Date} start The range's start
 * @param {Date} end The range's end
 * @param {Object} posts PostsContext store
 * @param {Function} postsDispatch PostsContext reducer
 * @returns {boolean} The current loading state
 */
export const useFetchScheduledPosts = (start, end, posts, postsDispatch) => {
	const { refetch } = posts;
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
						type: 'SET_SCHEDULED',
						posts: data.posts,
						start: data.dateRange.start,
						end: data.dateRange.end,
					});

					setIsLoading(false);
				} catch (error) {
					console.log('REST error', error.message);
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
 * @param {Object} posts PostsContext store
 * @param {Function} postsDispatch PostsContext reducer
 * @returns {boolean} The current loading state
 */
export const useFetchUnscheduledPosts = (posts, postsDispatch) => {
	const { refetch } = posts;
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
					type: 'SET_UNSCHEDULED',
					posts: data.posts,
				});

				setIsLoading(false);
			} catch (error) {
				console.log('REST error', error.message);
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
 * @param {Function} viewOptionsDispatch ViewContext reducer
 * @returns {boolean} The current loading state
 */
export const useFetchPostStatuses = (viewOptionsDispatch) => {
	const [isLoading, setIsLoading] = useState(false);

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
					type: 'SET_POST_STATUSES',
					postStatuses: data,
				});

				setIsLoading(false);
			} catch (error) {
				console.log('REST error', error.message);
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
 * @param {Object} posts PostsContext store
 * @param {Function} postsDispatch PostsContext reducer
 * @returns {boolean} The current loading state
 */
export const useFetchTaxonomyTerms = (name, posts, postsDispatch) => {
	const { taxonomies } = posts;
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
						type: 'SET_TAXONOMY_TERMS',
						name,
						taxonomy: data.taxonomy,
						terms: data.terms,
					});

					setIsLoading(false);
				} catch (error) {
					console.log('REST error', error.message);
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
 *
 * @param {Object} posts PostsContext store
 * @param {Function} postsDispatch PostsContext reducer
 * @param {Object} draggedPost DragContext store
 * @param {Function} draggedPostDispatch DragContext reducer
 * @param {number} user User ID
 * @returns {void}
 */
export const useUpdate = (
	posts,
	postsDispatch,
	draggedPost,
	draggedPostDispatch,
	user
) => {
	useEffect(() => {
		const {
			updatePost: { updateNow, id, params, unscheduled, newIndex, trash },
		} = posts;

		if (updateNow === true && id !== undefined) {
			const droppableId =
				unscheduled === true
					? 'unscheduled'
					: format(new Date(params.post_date), dateFormat.date);

			postsDispatch({
				type: 'UPDATE_INIT',
			});

			/**
			 * Check if this is a new post, a post to trash, or an existing post,
			 * and set the proper URL
			 */
			let url = `${routeBase}/posts/`;
			if (trash === true) {
				url += `trash/${id}/${user}`;
				postsDispatch({ type: 'REMOVE_POST', droppableId });
			} else if (id === 0) {
				url += `new/${user}`;
				postsDispatch({ type: 'ADD_POST', droppableId });
			} else {
				url += `update/${id}/${user}`;
				postsDispatch({
					type: 'UPDATE_POST',
					droppableId,
					unscheduled,
				});
			}

			let postData = {
				params: sanitizeParamsForUpdate(params),
				unscheduled,
			};

			if (newIndex !== null) {
				postData.newIndex = newIndex;
			}

			const sendUpdate = async () => {
				try {
					const response = await fetch(url, {
						method: 'POST',
						headers,
						body: JSON.stringify(postData),
					});
					const data = await response.json();

					if (data && data > 0) {
						postsDispatch({ type: 'UPDATE_SUCCESS', id, params });
					} else {
						postsDispatch({
							type: 'UPDATE_ERROR',
							id,
							params,
							data,
						});
					}

					draggedPostDispatch({
						type: 'END',
					});
				} catch (error) {
					console.log(error.message);
				}

				postsDispatch({
					type: 'REFETCH',
				});
			};

			sendUpdate();
		}
	}, [user, posts, draggedPost, draggedPostDispatch, postsDispatch]);
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

		document.addEventListener('mousedown', validateEventStart);
		document.addEventListener('touchstart', validateEventStart);
		document.addEventListener('click', listener);

		return () => {
			document.removeEventListener('mousedown', validateEventStart);
			document.removeEventListener('touchstart', validateEventStart);
			document.removeEventListener('click', listener);
		};
	}, [ref, handler]);
};
