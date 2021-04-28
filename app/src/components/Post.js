import React, { useContext, useEffect, useState } from "react";
import PostLinks from "./PostLinks";
import { Draggable } from "react-beautiful-dnd";
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
		// if (isDragging) {
		// 	if (draggedTo === Number(index)) {
		// 		classes.push("dropArea");

		// 		if (draggedFrom === false) {
		// 			classes.push("fromNowhere");
		// 		} else if (draggedFrom < draggedTo) {
		// 			classes.push("fromAbove");
		// 		} else if (draggedFrom > draggedTo) {
		// 			classes.push("fromBelow");
		// 		}
		// 	}

		// 	if (draggedFrom === Number(index)) {
		// 		classes.push("dragging");
		// 	}
		// }

		if (
			(unscheduled === false &&
				postStatuses[post.post_status].visible === true) ||
			unscheduled === true
		) {
			classes.push("visible");
		} else {
			classes.push("hidden");
		}

		if (!isEmpty(currentPost) && currentPost.id === post.id) {
			classes.push("currentPost");
		}

		return (
			<Draggable
				draggableId={`${post.id}`}
				index={index}
				// TODO: fix logic
				// isDragDisabled={
				// 	allowDrag === true || (!isToday(date) && !isPast(date))
				// 		? true
				// 		: false
				// }
			>
				{(provided, snapshot) => (
					<li
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						// id={post.id}
						key={post.id}
						className={classes.join(" ")}
						data-index={index}
						// draggable={
						// allowDrag === true ||
						// (!isToday(date) && !isPast(date))
						// 	? true
						// 	: false
						// }
						// onDragStart={handleDragStart}
						// onDragEnd={handleDragEnd}
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
				)}
			</Draggable>
		);
	};

	return !isEmpty(postStatuses) ? renderPost() : null;
}
