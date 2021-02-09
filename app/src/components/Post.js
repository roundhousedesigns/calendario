import React, { useContext, useEffect, useState } from "react";
import { postStatuses } from "../lib/utils";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function Post({ post, index }) {
	const {
		postsDispatch,
		posts: { unscheduled, currentPost },
	} = useContext(PostsContext);
	const { draggedPost, dragDispatch } = useContext(DragContext);
	const [colors, setColors] = useState({});

	useEffect(() => {
		setColors({
			color: postStatuses[post.post_status].color,
			backgroundColor: postStatuses[post.post_status].backgroundColor,
		});
	}, [post.post_status]);

	const handleDragStart = (e) => {
		let draggingUnscheduled = e.currentTarget.parentNode.classList.contains(
			"unscheduled-drafts"
		)
			? true
			: false;

		dragDispatch({
			type: "START",
			post: post,
			draggedFrom: draggingUnscheduled
				? Number(e.currentTarget.dataset.index)
				: false,
			originalUnscheduledOrder: unscheduled,
		});
	};

	const handleDragEnd = () => {
		dragDispatch({
			type: "END",
		});
	};

	const handleDrop = () => {
		dragDispatch({
			type: "END",
		});
	};

	const handleClick = (e) => {
		let unscheduled =
			e.target.classList.contains("unscheduled-drafts") ||
			e.target.parentNode.classList.contains("unscheduled-drafts")
				? true
				: false;
		
		postsDispatch({
			type: "CLICK",
			post: post,
			unscheduled: unscheduled,
		});
	};

	return post ? (
		<li
			className={`post status__${post.post_status}${
				draggedPost.isDragging &&
				draggedPost.draggedTo === Number(index) &&
				draggedPost.draggedTo !== draggedPost.draggedFrom
					? " dropArea"
					: ""
			}${
				draggedPost.isDragging &&
				draggedPost.draggedFrom === Number(index)
					? " dragging"
					: ""
			}${
				!isEmpty(currentPost) && currentPost.id === post.id
					? " currentPost"
					: ""
			}`}
			data-index={index}
			draggable={true}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDrop={handleDrop}
			onClick={handleClick}
		>
			<p
				className="postData"
				style={{
					backgroundColor: colors.backgroundColor,
					color: colors.color,
				}}
			>
				{post.post_title}
			</p>
		</li>
	) : null;
}
