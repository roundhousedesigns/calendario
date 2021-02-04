import React from "react";
import Post from "./Post";
import PostList from "./PostList";
import { isSameDay } from "date-fns";

export default function DayPosts({ date, posts }) {
	return posts ? (
		<PostList className="scheduled-posts" date={date}>
			{posts.map((post, index) => {
				return isSameDay(date, new Date(post.post_date)) ? (
					<Post post={post} key={index} />
				) : null;
			})}
		</PostList>
	) : null;
}
