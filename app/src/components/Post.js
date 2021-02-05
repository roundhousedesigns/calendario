import React, { useContext, useEffect, useState } from "react";
import DragContext from "../DragContext";
import { postStatuses } from "../lib/utils";

export default function Post({ post }) {
	const { dragDispatch } = useContext(DragContext);
	const [colors, setColors] = useState({});

	useEffect(() => {
		setColors({
			color: postStatuses[post.post_status].color,
			backgroundColor: postStatuses[post.post_status].backgroundColor,
		});
	}, [post.post_status]);

	const handleDragStart = () => {
		dragDispatch({
			type: "START",
			post: post,
		});
	};

	const handleDragEnd = () => {
		dragDispatch({
			type: "END",
		});
	};

	return post ? (
		<li
			className={`post status__${post.post_status}`}
			draggable={true}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			style={{
				backgroundColor: colors.backgroundColor,
				color: colors.color,
			}}
		>
			{post.post_title}
		</li>
	) : null;
}
