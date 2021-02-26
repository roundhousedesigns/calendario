import React, { useContext, useEffect, /*useRef,*/ useState } from "react";
import { postStatuses } from "../lib/utils";
import { isEmpty } from "lodash";
import { isPast, isToday } from "date-fns";
import { decode } from "html-entities";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function Post({ post, index, allowDrag, order }) {
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const { draggedPost, draggedPostDispatch } = useContext(DragContext);
	const [colors, setColors] = useState({});
	const [date, setDate] = useState(new Date());
	// const node = useRef();

	useEffect(() => {
		setDate(new Date(post.post_date));
	}, [post.post_date]);

	useEffect(() => {
		setColors({
			color: postStatuses[post.post_status].color,
			backgroundColor: postStatuses[post.post_status].backgroundColor,
		});
	}, [post.post_status]);

	// useEffect(() => {
	// 	const handleClickOutside = (e) => {
	// 		// TODO figure out how to include editPost component also -- currentPost getting unset before submit
	// 		if (node.current && node.current.contains(e.target)) {
	// 			// inside click
	// 			return;
	// 		}

	// 		// outside click
	// 		postsDispatch({
	// 			type: "UNSET_CURRENTPOST",
	// 		});
	// 	};

	// 	if (!isEmpty(currentPost)) {
	// 		document.addEventListener("mousedown", handleClickOutside);
	// 	} else {
	// 		document.removeEventListener("mousedown", handleClickOutside);
	// 	}

	// 	return function cleanup() {
	// 		document.removeEventListener("mousedown", handleClickOutside);
	// 	};
	// }, [currentPost, postsDispatch]);

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
			originalUnscheduledOrder: order,
		});
	};

	const handleDragEnd = () => draggedPostDispatch({ type: "END" });

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
		let classes = [
			"post",
			`post-id-${post.id} status__${post.post_status}`,
		];
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
				// ref={node}
				className={classes.join(" ")}
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
				<p
					className="postData"
					style={{
						backgroundColor: colors.backgroundColor,
						color: colors.color,
					}}
				>
					{decode(post.post_title, { scope: "strict" })}
				</p>
			</li>
		);
	};

	return post ? renderPost() : null;
}
