import React, { useContext } from "react";
import { isToday, isPast } from "date-fns";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function PostList({ children, className, date }) {
	const { postsDispatch } = useContext(PostsContext);
	const { draggedPost } = useContext(DragContext);
	const dropAction = date === false ? "UNSCHEDULE" : "SCHEDULE";

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

	let listProps = {
		className: `post-list ${className}`,
		onDragOver: handleDragOver,
	};

	if (!isToday(date) && !isPast(date)) {
		listProps.onDrop = handleDrop;
	} else {
		listProps.className += " drop-disabled";
	}

	return <ul {...listProps}>{children}</ul>;
}
