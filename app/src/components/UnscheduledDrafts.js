import React, { useContext } from "react";
import Post from "./Post";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const {unscheduled} = useContext(PostsContext);

	return (
		<ul className="unscheduled-drafts">
			{unscheduled.map((post, index) => {
				return <Post post={post} key={index} />;
			})}
		</ul>
	);
}
