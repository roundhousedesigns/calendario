import React, { useContext, useEffect, useState } from "react";
import PostLinks from "./PostLinks";
import { Draggable } from "react-beautiful-dnd";
import { isEmpty } from "lodash";
import { decode } from "html-entities";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";
import ViewContext from "../ViewContext";

export default function Post({ post, index, unscheduled }) {
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const {
		draggedPost: { isDragging },
	} = useContext(DragContext);
	const {
		viewOptions: { postStatuses },
	} = useContext(ViewContext);

	const [color, setColor] = useState("");

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
			<Draggable draggableId={`${post.id}`} index={index}>
				{(provided, snapshot) => (
					<li
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						key={post.id}
						className={classes.join(" ")}
						data-index={index}
						onClick={handleClick}
					>
						<div
							className="postData"
							style={{
								backgroundColor: color,
							}}
						>
							{decode(post.post_title, { scope: "strict" })}
							<PostLinks
								className={isDragging ? "disabled" : "active"}
								post={post}
								unscheduled={unscheduled}
							/>
						</div>
					</li>
				)}
			</Draggable>
		);
	};

	return !isEmpty(postStatuses) ? renderPost() : null;
}
