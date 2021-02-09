import React, { useContext, useEffect, useState } from "react";
import { postStatuses } from "../lib/utils";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function Post({ post, index }) {
	const {
		posts: { unscheduled },
	} = useContext(PostsContext);
	const { draggedPost, dragDispatch } = useContext(DragContext);
	const [colors, setColors] = useState({});
	const [isDraggedOver, setIsDraggedOver] = useState(false);

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

	const handleDragOver = () => {
		setIsDraggedOver(true);
	};

	const handleDragLeave = () => {
		setIsDraggedOver(false);
	};

	const handleDragEnd = () => {
		dragDispatch({
			type: "END",
		});
	};

	const handleDrop = () => {
		setIsDraggedOver(false);

		dragDispatch({
			type: "END",
		});
	};

	return post ? (
		<li
			className={`post status__${post.post_status} ${
				draggedPost.isDragging &&
				draggedPost.draggedTo === Number(index)
					? "dropArea"
					: ""
			} ${isDraggedOver ? "draggedOver" : ""}`}
			data-index={index}
			draggable={true}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDragEnd={handleDragEnd}
			onDrop={handleDrop}
		>
			<p
				className="post-data"
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
