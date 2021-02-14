import React, { useContext, useEffect } from "react";
import PostList from "./PostList";
import { routeBase } from "../lib/utils";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const {
		posts: { unscheduled },
		postsDispatch,
	} = useContext(PostsContext);

	useEffect(() => {
		fetch(`${routeBase}/unscheduled/`)
			.then((response) => response.json())
			.then((data) => {
				postsDispatch({
					type: "INIT",
					unscheduled: data,
				});
			});
	}, [postsDispatch]);

	return (
		<PostList
			className="unscheduledDrafts"
			date={false}
			posts={unscheduled}
		/>
	);
}
