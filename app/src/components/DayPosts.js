import React from "react";
import Post from "./Post";

export default function DayPosts({ dateKey, posts }) {
	if (dateKey in posts) {
		return (
			<ul className="post-list">
				{posts[dateKey].map((post, index) => {
					return <Post post={post} key={index} />;
				})}
			</ul>
		);
	} else {
		return null;
	}
}
