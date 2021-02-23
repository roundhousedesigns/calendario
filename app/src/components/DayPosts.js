import React from "react";
import PostList from "./PostList";
import { useDayPosts } from "../lib/hooks";
import { isToday, isPast } from "date-fns";

export default function DayPosts({
	posts,
	date,
	allowDrag,
	allowDrop,
	title,
	renderEmpty,
}) {
	const dayPosts = useDayPosts(posts, date);

	const renderPostList = () => {
		// if ((dayPosts && dayPosts.length > 0) || renderEmpty === true) {
		let listProps = {
			className: "dayPosts", // make this a prop/change conditionally
			date: date,
			posts: dayPosts,
		};

		// Drag control
		if (allowDrag !== "undefined" && allowDrag !== null) {
			listProps.allowDrag = allowDrag;
		}

		// Drop control
		if (!isToday(date) && !isPast(date) && allowDrop !== false) {
			listProps.allowDrop = true;
		} else {
			listProps.allowDrop = false;
		}

		const renderList = <PostList {...listProps} />;

		if (title) {
			return (
				<div className="listDay">
					<h4 className="listDay__title">{title}</h4>
					{renderList}
				</div>
			);
		} else {
			return renderList;
		}
		// } else {
		// 	return null;
		// }
	};

	return renderPostList();
}
