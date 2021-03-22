import React, { useContext, useEffect } from "react";
import PostList from "./PostList";
import { useFetchTrashedPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const {
		posts: { trashed },
		postsDispatch,
	} = useContext(PostsContext);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	const isLoading = useFetchTrashedPosts();

	return (
		<PostList
			className="trash"
			date={false}
			posts={trashed}
			allowDrag={true}
			loadingState={isLoading}
		/>
	);
}
