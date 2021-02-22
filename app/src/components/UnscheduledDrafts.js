import React, { useContext, useEffect } from "react";
import PostList from "./PostList";
import { routeBase } from "../lib/utils";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const {
		posts: { unscheduled, refetch },
		postsDispatch,
	} = useContext(PostsContext);

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

				postsDispatch({
					type: "SET_UNSCHEDULED",
					posts: data.posts,
					unscheduled: true,
				});
			} catch (error) {
				console.log("REST error", error.message);
			}
		};

		fetchData();
	}, [postsDispatch, refetch]);

	return (
		<PostList
			className="unscheduledDrafts"
			date={false}
			posts={unscheduled}
			allowDrag={true}
		/>
	);
}
