import React, { useContext } from "react";
import Post from "./Post";
import { isToday, isPast, format } from "date-fns";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";
import { updatePost, dateFormat } from "../lib/utils";

export default function PostList({ posts, className, allowDrag, date }) {
	const { postsDispatch } = useContext(PostsContext);
	const { draggedPost, draggedPostDispatch } = useContext(DragContext);

	const handleDragOver = (e) => {
		e.preventDefault();

		if (allowDrag !== false) {
			if (e.currentTarget.classList.contains("unscheduledDrafts")) {
				let draggedTo = e.target.dataset.index
					? Number(e.target.dataset.index)
					: false;

				if (draggedTo === false) {
					let mouseY = e.pageY - e.currentTarget.offsetTop;
					const listItems = e.currentTarget.childNodes;
					let itemCount = listItems.length;

					if (mouseY < listItems[0].offsetTop) {
						draggedTo = 0;
					} else {
						draggedTo = itemCount;
					}
				}

				draggedPostDispatch({
					type: "DRAGGING_OVER_UNSCHEDULED",
					draggedTo: draggedTo,
				});
			}
		}
	};

	const handleDrop = () => {
		updatePost(draggedPost.post, {
			post_date: format(date, dateFormat.date),
		});

		draggedPostDispatch({
			type: "END",
		});

		postsDispatch({
			type: "REFETCH",
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
					<Post
						post={post}
						order={posts}
						key={post.id}
						index={index}
						allowDrag={allowDrag}
					/>
				))}
			</ul>
		);
	};

	return renderPostList();
}
