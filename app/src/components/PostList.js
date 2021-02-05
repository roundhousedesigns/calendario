import React, { useContext } from "react";
import Post from "./Post";
import { isToday, isPast } from "date-fns";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function PostList({ posts, className, date }) {
	const { postsDispatch } = useContext(PostsContext);
	const { draggedPost } = useContext(DragContext);
	const dropAction = date === false ? "UNSCHEDULE" : "CALENDAR";

	const handleDragOver = (e) => {
		e.preventDefault();

		// indexes and reordering items while dragging, setting calendar date currently over
	};

	const handleDrop = (e) => {
		postsDispatch({
			type: dropAction,
			post: draggedPost.post,
			newDate: date,
		});
	};

	const renderPost = (post, index) => {
		return <Post post={post} key={index} />;
	};

	let listProps = {
		className: `post-list ${className}`,
		onDragOver: handleDragOver,
	};

	if (!isToday(date) && !isPast(date)) {
		listProps.onDrop = handleDrop;
	} else {
		listProps.className += " drop-disabled";
	}

	return (
		<ul {...listProps}>{posts.map((post, i) => renderPost(post, i))}</ul>
	);
}
