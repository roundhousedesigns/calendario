import React, { useContext } from "react";
import DragContext from "../DragContext";

export default function Post({ post }) {
	const { dragDispatch } = useContext(DragContext);

	const handleDragStart = (e) => {
		// e.preventDefault();

		dragDispatch({
			type: "START",
			post: post,
		});
	};

	const handleDragEnd = (e) => {
		e.preventDefault();

		dragDispatch({
			type: "END",
		});
	};

	return post ? (
		<li
			className="post"
			draggable={true}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			{post.post_title}
		</li>
	) : null;
}
