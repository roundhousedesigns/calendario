import React, { useContext, useEffect, useReducer } from "react";
import Post from "./Post";
import { dateFormat, routeBase, filterUnchangedParams } from "../lib/utils";
import { updateReducer, initialUpdateState } from "../lib/updatePost";
import { isToday, isPast, format } from "date-fns";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function PostList({ posts, className, allowDrag, date }) {
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

			const fetchData = async () => {
				try {
					const response = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
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
				} catch (error) {
					console.log(error.message);
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
	};

	const renderPostList = () => {
		let listProps = {
			className: `postList ${className}`,
			onDragOver: handleDragOver,
		};

		if (!isToday(date) && !isPast(date)) {
			listProps.onDrop = handleDrop;
		} else {
			listProps.className += " dropDisabled";
		}

		return (
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
		);
	};

	return renderPostList();
}
