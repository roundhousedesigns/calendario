import React, { useContext } from "react";
import PostList from "./PostList";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const {
		posts: { unscheduled },
	} = useContext(PostsContext);

	return (
		<PostList
			className="unscheduledDrafts"
			date={false}
			posts={unscheduled}
		/>
	);
}
