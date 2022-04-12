import { useState, useEffect } from 'react';
import { wp, dateFormat } from '../lib/utils';
import { format, addDays, subDays } from 'date-fns';
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
	const { fetchPosts } = posts;
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (start !== null && end !== null && fetchPosts) {
			// expand the range by 1 in either direction to allow timezone wiggle room
			let startDate = format(subDays(start, 1), dateFormat.date);
			let endDate = format(addDays(end, 1), dateFormat.date);

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

				postsDispatch({ type: 'FETCH_COMPLETE' });
			};

			fetchData();
		}

		return () => {
			setIsLoading(false);
		};
	}, [start, end, fetchPosts, postsDispatch]);

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
	const { fetchPosts } = posts;
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (fetchPosts) {
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

				postsDispatch({ type: 'FETCH_COMPLETE' });
			};

			fetchData();
		}

		return () => {
			setIsLoading(false);
		};
	}, [postsDispatch, fetchPosts]);

	return isLoading;
};

/**
 * Sends updated post status colors to the server.
 *
 * @param {Object} postStatuses The set of post statuses.
 * @param {boolean} postStatusColorsChanged True if colors have been changed and an update is required, false otherwise
 * @param {Function} viewOptionsDispatch ViewContext reducer
 */
export const useUpdateStatusColors = (
	postStatuses,
	postStatusColorsChanged,
	viewOptionsDispatch
) => {
	useEffect(() => {
		if (isEmpty(postStatuses) || !postStatusColorsChanged) {
			return;
		}

		let url = `${routeBase}/status`;

		const fetchData = async () => {
			let colors = {};
			let headers = {
				'Content-Type': 'application/json',
			};
			if (DEBUG_MODE === false) {
				headers['X-WP-Nonce'] = nonce;
			}

			for (let status in postStatuses) {
				colors[status] = postStatuses[status].color;
			}

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers,
					body: JSON.stringify(colors),
				});

				// const data = await response.json(); // If you need to catch the response...

				await response.json();
			} catch (error) {
				console.log(error.message);
			}

			viewOptionsDispatch({
				type: 'POST_STATUS_UPDATE_COMPLETE',
			});
		};

		fetchData();
	}, [postStatuses, postStatusColorsChanged, viewOptionsDispatch]);
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
				} catch (error) {
					console.log('REST error', error.message);
				}

				setIsLoading(false);
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
 * Creates a new taxonomy term on the server.
 *
 * @param {Object} newTerm The new term's parameters.
 * @param {Function} postsDispatch PostsContext reducer.
 * @param {Function} newTermDispatch NewTermDispatch reducer.
 */
export const useAddTaxonomyTerm = (newTerm, postsDispatch, newTermDispatch) => {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (newTerm.taxonomy && newTerm.term && newTerm.update) {
			let url = `${routeBase}/tax/${newTerm.taxonomy}`;

			newTermDispatch({ type: 'UPDATING' });

			const sendUpdate = async () => {
				setIsLoading(true);

				try {
					const response = await fetch(url, {
						method: 'POST',
						headers,
						body: JSON.stringify(newTerm),
					});
					const data = await response.json();

					if (data && !isEmpty(data)) {
						newTermDispatch({ type: 'CLEAR' });
						postsDispatch({
							type: 'APPEND_TAXONOMY_TERM',
							name: data.taxonomy,
							term: data.term,
						});
					} else {
						throw new Error('No taxonomy term data recieved.');
					}
				} catch (error) {
					console.log(error.message);
				}

				setIsLoading(false);
			};

			sendUpdate();
		}
	});

	return isLoading;
};

/**
 * Updates existing or adds new posts to the database.
 *
 * @param {Object} posts PostsContext store
 * @param {Function} postsDispatch PostsContext reducer
 * @param {Object} draggedPost DragContext store
 * @param {Function} draggedPostDispatch DragContext reducer
 * @returns {void}
 */
export const useUpdatePost = (
	posts,
	postsDispatch,
	draggedPost,
	draggedPostDispatch
) => {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const {
			updatePost: { updateNow, id, params, unscheduled, newIndex, trash },
		} = posts;

		if (updateNow === true && id !== undefined) {
			const date = params.post_date_unshifted
				? params.post_date_unshifted
				: params.post_date;

			const droppableId =
				unscheduled === true ? 'unscheduled' : format(date, dateFormat.date);

			postsDispatch({
				type: 'PRE_UPDATE_POST',
			});

			/**
			 * Check if this is a new post, a post to trash, or an existing post,
			 * and set the proper URL
			 */
			let url = `${routeBase}/posts/`;
			if (trash === true) {
				url += `trash/${id}`;
				postsDispatch({ type: 'REMOVE_POST', droppableId });
			} else if (id === 0) {
				url += `new`;
			} else {
				url += `update/${id}`;
				postsDispatch({
					type: 'UPDATE_POST',
					droppableId,
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
				setIsLoading(true);

				try {
					const response = await fetch(url, {
						method: 'POST',
						headers,
						body: JSON.stringify(postData),
					});
					const data = await response.json();

					if (data && data > 0) {
						postsDispatch({ type: 'UPDATE_COMPLETE' });
					}

					draggedPostDispatch({
						type: 'END',
					});
				} catch (error) {
					console.log(error.message);
				}

				setIsLoading(false);
			};

			sendUpdate();

			return () => {
				setIsLoading(false);
			};
		}
	}, [posts, draggedPost, draggedPostDispatch, postsDispatch]);

	return isLoading;
};

/**
 * Detects a click outside the EditPost modal.
 *
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
