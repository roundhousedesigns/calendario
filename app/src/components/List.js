import React, { useContext, useEffect, useState } from "react";
import PostList from "./PostList";
import { format } from "date-fns";
import { routeBase, dateFormat } from "../lib/utils";

import PostsContext from "../PostsContext";

export default function List() {
	const {
		posts: { refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useEffect(() => {
		let startDate = format(new Date(), dateFormat.date);

		let url = `${routeBase}/scheduled/${startDate}`;
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
	}, [refetch]);

	return (
		<PostList
			className="view view__list"
			posts={posts}
			date={false}
			allowDrag={false}
		/>
	);
}
