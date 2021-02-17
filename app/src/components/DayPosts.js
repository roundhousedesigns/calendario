import React from "react";
import PostList from "./PostList";
import { useDayPosts } from "../lib/hooks";

export default function DayPosts({ posts, date }) {
	const dayPosts = useDayPosts(posts, date);

	return posts ? (
		<PostList className="calendarPosts" date={date} posts={dayPosts} />
	) : null;
}
