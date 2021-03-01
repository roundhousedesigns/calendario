import React, { useContext, useEffect, useReducer, useState } from "react";
import Post from "./Post";
import Loading from "./common/Loading";
import {
	dateFormat,
	routeBase,
	filterUnchangedParams,
	nonce,
	DEBUG_MODE,
} from "../lib/utils";
import { updateReducer, initialUpdateState } from "../lib/updatePost";
import { format } from "date-fns";
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
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const {
		draggedPost: { post },
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
	}, [updatePost, draggedPostDispatch, post, postsDispatch]);

	const handleDragOver = (e) => {
		e.preventDefault();

		if (allowDrag !== false) {
			if (e.currentTarget.classList.contains("unscheduledDrafts")) {
				let draggedTo = e.target.dataset.index
					? Number(e.target.dataset.index)
					: false;

				if (draggedTo === false) {
					let mouseY = e.pageY - e.currentTarget.offsetTop;
					const listItems = e.currentTarget.childNodes;
					let itemCount = listItems.length;

					if (
						listItems.length === 0 ||
						mouseY < listItems[0].offsetTop
					) {
						draggedTo = 0;
					} else {
						draggedTo = itemCount;
					}
				}

				draggedPostDispatch({
					type: "DRAGGING_OVER_UNSCHEDULED",
					draggedTo: draggedTo,
				});
			}
		}
	};

	const handleDrop = () => {
		if (allowDrop !== false) {
			updatePostDispatch({
				type: "UPDATE",
				params: {
					post_date:
						date === false
							? format(post.post_date, dateFormat.date)
							: format(date, dateFormat.date),
				},
				unscheduled: date === false ? true : false,
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
				{isLoading ? <Loading /> : null}
				<ul {...listProps}>
					{posts.map((post, index) => (
						<Post
							post={post}
							order={posts}
							key={post.id}
							index={index}
							allowDrag={allowDrag}
						/>
					))}
				</ul>
			</>
		);
	};

	return renderPostList();
}
