import React, { useContext, useEffect, useState } from "react";
import { postStatuses } from "../lib/utils";
import { isEmpty } from "lodash";
import { isPast, isToday } from "date-fns";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function Post({ post, index }) {
	const {
		postsDispatch,
		posts: { unscheduled, currentPost },
	} = useContext(PostsContext);
	const { draggedPost, draggedPostDispatch } = useContext(DragContext);
	const [colors, setColors] = useState({});
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		setDate(new Date(post.post_date));
	}, [post.post_date]);

	useEffect(() => {
		setColors({
			color: postStatuses[post.post_status].color,
			backgroundColor: postStatuses[post.post_status].backgroundColor,
		});
	}, [post.post_status]);

	const handleDragStart = (e) => {
		let draggingUnscheduled = e.currentTarget.parentNode.classList.contains(
			"unscheduledDrafts"
		)
			? true
			: false;

		draggedPostDispatch({
			type: "START",
			post: post,
			draggedFrom: draggingUnscheduled
				? Number(e.currentTarget.dataset.index)
				: false,
			originalUnscheduledOrder: unscheduled,
		});
	};

	const handleDragEnd = () => draggedPostDispatch({ type: "END" });

	const handleDrop = () => {
		draggedPostDispatch({
			type: "END",
		});
	};

	const handleClick = (e) => {
		let unscheduled =
			e.target.classList.contains("unscheduledDrafts") ||
			e.target.parentNode.classList.contains("unscheduledDrafts")
				? true
				: false;

		postsDispatch({
			type: "SET_CURRENTPOST",
			post: post,
			unscheduled: unscheduled,
		});
	};

	const renderPost = () => {
		let classes = ["post", `status__${post.post_status}`];
		if (draggedPost.isDragging) {
			if (
				draggedPost.draggedTo === Number(index) &&
				draggedPost.draggedTo !== draggedPost.draggedFrom
			) {
				classes.push("dropArea");
			}

			if (draggedPost.draggedFrom === Number(index)) {
				classes.push("dragging");
			}
		}

		if (!isEmpty(currentPost) && currentPost.id === post.id) {
			classes.push("currentPost");
		}

		return (
			<li
				className={classes.join(" ")}
				data-index={index}
				draggable={isToday(date) || isPast(date) ? false : true}
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
		);
	};

	return post ? renderPost() : null;
}
