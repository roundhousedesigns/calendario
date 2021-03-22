import React, { useContext, useEffect, useReducer, useState } from "react";
import Post from "./Post";
import Loading from "./common/Loading";
import {
	dateFormat,
	filterUnchangedParams,
	wp,
	DEBUG_MODE,
} from "../lib/utils";
import { updateReducer, initialUpdateState } from "../lib/updatePost";
import { format, getHours, getMinutes, setHours, setMinutes } from "date-fns";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function PostList({
	posts,
	className,
	allowDrag,
	allowDrop,
	date,
	loadingState,
}) {
	const { routeBase, nonce } = wp;
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const {
		draggedPost: { post, draggedTo, draggedFrom, overUnscheduled },
		draggedPostDispatch,
	} = useContext(DragContext);
	const [updatePost, updatePostDispatch] = useReducer(
		updateReducer,
		initialUpdateState
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (loadingState === undefined || loadingState === null) {
			return;
		}

		setIsLoading(loadingState);

		return () => {
			setIsLoading(false);
		};
	}, [loadingState]);

	// Fire the update!
	useEffect(() => {
		if (updatePost.updateNow === true && post.id !== "undefined") {
			updatePostDispatch({
				type: "UPDATING",
			});

			let url = `${routeBase}/update/${post.id}`;
			let postData = {
				params: filterUnchangedParams(updatePost.params, post),
				unscheduled: updatePost.unscheduled,
			};

			if (draggedTo !== null) {
				postData.draggedTo = draggedTo;
			}

			if (isEmpty(postData)) {
				return { data: "Update not necessary.", error: true };
			}

			// TODO: DEV MODE
			var headers = {
				"Content-Type": "application/json",
			};
			if (DEBUG_MODE !== true) {
				headers["X-WP-Nonce"] = nonce;
			}
			// ODOT

			const fetchData = async () => {
				setIsLoading(true);

				try {
					const response = await fetch(url, {
						method: "POST",
						headers,
						body: JSON.stringify(postData),
					});
					// const data = await response.json(); // If you need to catch the response...
					await response.json();

					postsDispatch({
						type: "REFETCH",
					});
					draggedPostDispatch({
						type: "END",
					});
					updatePostDispatch({
						type: "COMPLETE",
					});

					setIsLoading(false);
				} catch (error) {
					console.log(error.message);
					setIsLoading(false);
				}
			};

			fetchData();
		}
	}, [
		routeBase,
		nonce,
		updatePost,
		draggedTo,
		draggedPostDispatch,
		post,
		postsDispatch,
	]);

	const handleDragOver = (e) => {
		e.preventDefault();

		if (allowDrag === false) return;

		if (e.currentTarget.classList.contains("unscheduledDrafts")) {
			let overNow = Number(e.target.dataset.index);

			let draggedOver = false;
			if (draggedFrom === overNow) {
				return;
			} else {
				draggedOver = Number.isNaN(overNow) ? false : overNow;
			}

			if (draggedOver !== draggedTo) {
				if (draggedOver === false) {
					let targetRect = e.currentTarget.getBoundingClientRect();
					let mouseY = e.clientY - targetRect.top;
					const listItems = e.currentTarget.childNodes;
					let itemCount = listItems.length;

					if (
						listItems.length === 0 ||
						mouseY < listItems[0].offsetTop
					) {
						draggedOver = 0;
					} else if (mouseY >= listItems[itemCount - 1].offsetTop) {
						draggedOver = itemCount;
					} else {
						draggedOver = itemCount - 1;
					}
				}

				draggedPostDispatch({
					type: "DRAGGING_OVER_UNSCHEDULED",
					draggedOver,
				});
			}
		} else if (overUnscheduled === true) {
			draggedPostDispatch({
				type: "DRAGGING_OVER_SCHEDULED",
			});
		}
	};

	const handleDrop = () => {
		if (allowDrop !== false) {
			let dropDate, time, post_date;

			if (date === false) {
				post_date = format(post.post_date, dateFormat.dateTime);
			} else {
				dropDate = date;
				time = {
					h: getHours(post.post_date),
					m: getMinutes(post.post_date),
				};
				dropDate = setHours(dropDate, time.h);
				dropDate = setMinutes(dropDate, time.m);

				post_date = format(dropDate, dateFormat.dateTime);
			}

			updatePostDispatch({
				type: "UPDATE",
				params: {
					post_date,
				},
				unscheduled: overUnscheduled,
			});

			if (currentPost.id === post.id) {
				postsDispatch({
					type: "UPDATE_CURRENTPOST_FIELD",
					field: "post_date",
					value: date,
				});
			}
		}
	};

	const renderPostList = () => {
		let listProps = {
			className: `postList ${className}`,
			onDragOver: handleDragOver,
		};

		if (allowDrop !== false) {
			listProps.onDrop = handleDrop;
		} else {
			listProps.className += " dropDisabled";
		}

		return (
			<>
				<Loading className={isLoading ? "active" : null} />
				<ul {...listProps}>
					{posts.map((post, index) => (
						<Post
							post={post}
							key={post.id}
							index={index}
							unscheduled={date === false ? true : false}
							allowDrag={allowDrag}
						/>
					))}
				</ul>
			</>
		);
	};

	return renderPostList();
}
