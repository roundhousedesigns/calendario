import React from "react";
import PostList from "./PostList";
import { useDayPosts } from "../lib/hooks";

export default function DayPosts({ date, posts }) {
	const dayPosts = useDayPosts(posts, date);

	return posts ? (
		<PostList className="scheduled-posts" date={date} posts={dayPosts} />
	) : null;
}
