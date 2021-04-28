import React, { useContext, useEffect } from "react";
import PostList from "./PostList";
import NewPostButton from "./common/NewPostButton";
import DragContext from "../DragContext";
import { isDraggingUnscheduled } from "../lib/utils";

export default function DayPosts({
	posts,
	date,
	allowDrag,
	allowDrop,
	title,
	loadingState,
}) {
	const {
		draggedPost: { isDragging },
	} = useContext(DragContext);

	const renderPostList = () => {
		let listProps = {
			className: "dayPosts", // TODO: make this a prop/change conditionally (what was this note?)
			date: date,
			renderPosts: posts,
			loadingState,
		};

		// Drag control
		if (allowDrag !== "undefined" && allowDrag !== null) {
			listProps.allowDrag = allowDrag;
		}

		// Drop control
		listProps.allowDrop = allowDrop !== false ? true : false;

		const renderList = (
			<>
				{!isDragging ? (
					<NewPostButton day={date} unscheduled={false} />
				) : null}
				<PostList {...listProps} />
			</>
		);

		if (title) {
			return (
				<>
					<h4 className="title">{title}</h4>
					{renderList}
				</>
			);
		} else {
			return renderList;
		}
	};

	return renderPostList();
}
