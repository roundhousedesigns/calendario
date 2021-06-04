import React, { useContext } from "react";
import PostLink from "./common/PostLink";
import { getPostList, moveItem, dayKey, filterPostStatus } from "../lib/utils";
import { decode } from "html-entities";

import PostsContext from "../PostsContext";

export default function PostLinks({ post, unscheduled }) {
	const { id, edit_link, view_link } = post;
	const { posts, postsDispatch } = useContext(PostsContext);

	const unschedulePost = (e) => {
		e.preventDefault();

		const { post_date, post_status } = post;
		const sourceId = dayKey(post_date);
		const destinationId = "unscheduled";

		const result = moveItem(
			getPostList(sourceId, posts),
			getPostList(destinationId, posts),
			{ droppableId: sourceId },
			{ droppableId: destinationId }
		);

		postsDispatch({
			type: "MOVE_POST",
			source: result[sourceId],
			destination: result[destinationId],
			sourceId,
			destinationId,
		});

		postsDispatch({
			type: "PREPARE_UPDATE",
			id,
			params: {
				post_status: filterPostStatus(post_status, true),
			},
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
			type: "MOVE_POST",
			source: result[sourceId],
			destination: result[destinationId],
			sourceId,
			destinationId,
		});

		postsDispatch({
			type: "PREPARE_UPDATE",
			id,
			unscheduled: false,
		});
	};

	const trashPost = () => {
		const { post_date } = post;
		postsDispatch({
			type: "SEND_TO_TRASH",
			id: id,
			params: {
				post_date,
			},
			unscheduled
		});
	};

	return (
		<div className="postLinks">
			<PostLink
				icon="view"
				title="View Post"
				onClick={() => window.open(view_link, "_blank")}
				target="_blank"
			>
				open_in_new
			</PostLink>
			<PostLink
				icon="edit"
				title="Edit Post in a new tab"
				onClick={() => window.open(decode(edit_link), "_blank")}
			>
				mode_edit
			</PostLink>
			{unscheduled ? (
				<PostLink
					icon="schedule"
					title="Schedule this post"
					onClick={schedulePost}
				>
					event_available
				</PostLink>
			) : (
				<PostLink
					icon="unschedule"
					title="Unschedule this post"
					onClick={unschedulePost}
				>
					event_busy
				</PostLink>
			)}
			<PostLink icon="trash" title="Trash this post" onClick={trashPost}>
				delete_forever
			</PostLink>
		</div>
	);
}
