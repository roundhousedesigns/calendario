import React from "react";
import PostList from "./PostList";
import NewPostButton from "./common/NewPostButton";
import { useDayPosts } from "../lib/hooks";

export default function DayPosts({
	posts,
	date,
	allowDrag,
	allowDrop,
	title,
	loadingState,
}) {
	const dayPosts = useDayPosts(posts, date);

	const renderPostList = () => {
		let listProps = {
			className: "dayPosts", // make this a prop/change conditionally
			date: date,
			posts: dayPosts,
			allowDrop: true,
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
				<NewPostButton day={date} unscheduled={false} />
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
