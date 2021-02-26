import React, { useContext, useEffect } from "react";
import PostList from "./PostList";
import NewPostButton from "./common/NewPostButton";
import { useFetchUnscheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";

export default function UnscheduledDrafts() {
	const {
		posts: { unscheduled },
		postsDispatch,
	} = useContext(PostsContext);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useFetchUnscheduledPosts();

	return (
		<>
			<PostList
				className="unscheduledDrafts"
				date={false}
				posts={unscheduled}
				allowDrag={true}
			/>
			<NewPostButton unscheduled={true} />
		</>
	);
}
