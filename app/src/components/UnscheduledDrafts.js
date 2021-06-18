import React, { useContext } from "react";
import PostList from "./PostList";
import AdminLinks from "./AdminLinks";
import NewPostButton from "./common/NewPostButton";
import { useFetchUnscheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const { posts, postsDispatch } = useContext(PostsContext);

	const { unscheduled } = posts;

	useFetchUnscheduledPosts(posts, postsDispatch);

	return (
		<>
			<PostList
				className="unscheduledDrafts"
				date={false}
				posts={unscheduled}
			/>
			<NewPostButton unscheduled={true} />
			<AdminLinks />
		</>
	);
}
