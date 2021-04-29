import React, { useContext } from "react";
import PostList from "./PostList";
import AdminLinks from "./AdminLinks";
import NewPostButton from "./common/NewPostButton";
import { useFetchUnscheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const {
		posts: { unscheduled },
	} = useContext(PostsContext);

	useFetchUnscheduledPosts();

	return (
		<>
			<PostList
				className="unscheduledDrafts"
				date={false}
				renderPosts={unscheduled}
			/>
			<NewPostButton unscheduled={true} />
			<AdminLinks />
		</>
	);
}
