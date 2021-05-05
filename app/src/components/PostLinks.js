import React, { useContext } from "react";
import { getPostList, moveItem, dayKey } from "../lib/utils";
import { decode } from "html-entities";

import PostsContext from "../PostsContext";

export default function PostLinks({ post, className, unscheduled }) {
	const { id, edit_link, view_link } = post;
	const { posts, postsDispatch } = useContext(PostsContext);

	const unschedulePost = (e) => {
		e.preventDefault();

		const { post_date } = post;
		const sourceId = dayKey(post_date);
		const destinationId = "unscheduled";

		const result = moveItem(
			getPostList(sourceId, posts),
			getPostList(destinationId, posts),
			{ droppableId: sourceId },
			{ droppableId: destinationId }
		);

		postsDispatch({
			type: "MOVE",
			source: result[sourceId],
			destination: result[destinationId],
			sourceId,
			destinationId,
		});

		postsDispatch({
			type: "UPDATE",
			post,
			unscheduled: true,
		});
	};

	const schedulePost = (e) => {
		e.preventDefault();

		const { id, post_date } = post;
		const sourceId = "unscheduled";
		const source = getPostList(sourceId, posts);
		const destinationId = dayKey(post_date);
		const destination = getPostList(destinationId, posts);

		const result = moveItem(
			source,
			destination,
			{
				droppableId: sourceId,
				index: source.findIndex((item) => item.id === id),
			},
			{ droppableId: destinationId }
		);

		postsDispatch({
			type: "MOVE",
			source: result[sourceId],
			destination: result[destinationId],
			sourceId,
			destinationId,
		});

		postsDispatch({
			type: "UPDATE",
			post,
			unscheduled: false,
		});
	};

	const trashPost = () => {
		postsDispatch({
			type: "TRASH",
			post,
			params: {
				id: id,
			},
		});
	};

	return (
		<div className={`postLinks ${className}`}>
			<button
				className="icon top left icon__view"
				onClick={() => window.open(view_link, "_blank")}
				target="_blank"
				rel="noreferrer"
				title="View Post"
			>
				open_in_new
			</button>
			<button
				className="icon top right icon__edit"
				onClick={() => window.open(decode(edit_link), "_blank")}
				target="_blank"
				rel="noreferrer"
				title="Edit Post in a new tab"
			>
				mode_edit
			</button>
			{unscheduled ? (
				<button
					className="icon icon__schedule bottom right"
					onClick={schedulePost}
					title="Schedule this post"
				>
					event_available
				</button>
			) : (
				<button
					className="icon icon__unschedule bottom right"
					onClick={unschedulePost}
					title="Unschedule this post"
				>
					drafts
				</button>
			)}
			<button
				className="icon icon__trash bottom left"
				onClick={trashPost}
				title="Trash this post"
			>
				delete_forever
			</button>
		</div>
	);
}
