import React, { useContext } from "react";
import Post from "./Post";
import { isToday, isPast } from "date-fns";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function PostList({ posts, className, date }) {
	const { postsDispatch } = useContext(PostsContext);
	const { draggedPost, draggedPostDispatch } = useContext(DragContext);

	const handleDragOver = (e) => {
		e.preventDefault();

		if (e.currentTarget.classList.contains("unscheduledDrafts")) {
			let draggedTo = e.target.dataset.index
				? Number(e.target.dataset.index)
				: false;

			draggedPostDispatch({
				type: "DRAGGING_OVER_UNSCHEDULED",
				draggedTo: draggedTo,
			});
		}
	};

	// TODO: Cache drag handlers and/or figure out polling?
	const handleDrop = () => {
		if (date === false) {
			// unscheduled
			postsDispatch({
				type: "UNSCHEDULE",
				post: draggedPost.post,
				posts: draggedPost.updatedUnscheduledOrder,
			});
		} else {
			// calendar
			postsDispatch({
				type: "CALENDAR",
				post: draggedPost.post,
				newDate: date,
			});
		}

		draggedPostDispatch({
			type: "END",
		});
	};

	const renderPostList = () => {
		let listProps = {
			className: `postList ${className}`,
			onDragOver: handleDragOver,
		};

		if (!isToday(date) && !isPast(date)) {
			listProps.onDrop = handleDrop;
		} else {
			listProps.className += " dropDisabled";
		}

		return (
			<ul {...listProps}>
				{posts.map((post, index) => (
					<Post post={post} key={post.id} index={index} />
				))}
			</ul>
		);
	};

	return renderPostList();
}
