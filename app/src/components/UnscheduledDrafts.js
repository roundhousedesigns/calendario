import React, { useContext } from "react";
import PostList from "./PostList";

import PostsContext from "../PostsContext";
import { useFetch } from "../lib/hooks";

export default function UnscheduledDrafts() {
	const {
		posts: { unscheduled },
	} = useContext(PostsContext);

	const fetchStatus = useFetch(false);

	return fetchStatus === "fetching" ? (
		"Loading..."
	) : (
		<PostList
			className="unscheduledDrafts"
			date={false}
			posts={unscheduled}
		/>
	);
}
