import React, { useContext, useEffect, useState } from "react";
import PostLinks from "./PostLinks";
import { isEmpty } from "lodash";
import { isPast, isToday } from "date-fns";
import { decode } from "html-entities";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";
import ViewContext from "../ViewContext";

export default function Post({ post, index, unscheduled, allowDrag }) {
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const {
		draggedPost: { isDragging, draggedFrom, draggedTo },
		draggedPostDispatch,
	} = useContext(DragContext);
	const {
		viewOptions: { postStatuses },
	} = useContext(ViewContext);

	const [date, setDate] = useState(new Date());
	const [color, setColor] = useState("");

	useEffect(() => {
		setDate(new Date(post.post_date));

		return () => {
			setDate(new Date());
		};
	}, [post.post_date]);

	useEffect(() => {
		if (postStatuses === undefined || isEmpty(postStatuses)) {
			return;
		}

		setColor(postStatuses[post.post_status].color);

		return () => {
			setColor("");
		};
	}, [post.post_status, postStatuses]);

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
		});
	};

	const handleDragEnd = () => draggedPostDispatch({ type: "END" });

	const handleClick = (e) => {
		// Skip if clicking a QuickLink button
		if (e.target.classList.contains("icon")) {
			return;
		}

		postsDispatch({
			type: "SET_CURRENTPOST",
			post: post,
			unscheduled,
		});
	};

	const renderPost = () => {
		let classes = [
			"post",
			`post-id-${post.id} status__${post.post_status}`,
		];
		if (isDragging) {
			if (draggedTo === Number(index)) {
				classes.push("dropArea");

				if (draggedFrom === false) {
					classes.push("fromNowhere");
				} else if (draggedFrom < draggedTo) {
					classes.push("fromAbove");
				} else if (draggedFrom > draggedTo) {
					classes.push("fromBelow");
				}
			}

			if (draggedFrom === Number(index)) {
				classes.push("dragging");
			}
		}

		if (!isEmpty(currentPost) && currentPost.id === post.id) {
			classes.push("currentPost");
		}

		return (
			<li
				id={post.id}
				className={classes.join(" ")}
				style={
					unscheduled === false &&
					postStatuses[post.post_status].visible === true
						? { visibility: "visible" }
						: unscheduled === true
						? { visibility: "visible" }
						: { visibility: "hidden" }
				}
				data-index={index}
				draggable={
					allowDrag === true || (!isToday(date) && !isPast(date))
						? true
						: false
				}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onClick={handleClick}
			>
				<PostLinks
					className={isDragging ? "disabled" : "active"}
					post={post}
					unscheduled={unscheduled}
				/>
				<p
					className="postData"
					style={{
						backgroundColor: color,
					}}
				>
					{decode(post.post_title, { scope: "strict" })}
				</p>
			</li>
		);
	};

	return post && !isEmpty(postStatuses) ? renderPost() : null;
}
