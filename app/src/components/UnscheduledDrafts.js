import React, { useContext, useState, useEffect } from "react";
import PostList from "./PostList";
import { routeBase } from "../lib/utils";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const { posts: refetch, postsDispatch } = useContext(PostsContext);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useEffect(() => {
		let url = `${routeBase}/unscheduled`;

		const fetchData = async () => {
			try {
				const res = await fetch(url);
				const data = await res.json();
				setPosts(data);
			} catch (error) {
				console.log("REST error", error.message);
			}
		};

		fetchData();

		return function cleanup() {
			setPosts([]);
		};
	}, [refetch]);

	return (
		<PostList className="unscheduledDrafts" date={false} posts={posts} />
	);
}
