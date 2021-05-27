import React, { useContext } from "react";
import PostsContext from "../PostsContext";

export default function RefetchButton() {
	const { postsDispatch } = useContext(PostsContext);

	const handleRefetchClick = () => {
		postsDispatch({
			type: "REFETCH",
		});
	};

	return (
		<button
			className="icon refetchButton control"
			onClick={handleRefetchClick}
			title="Refresh Posts"
		>
			sync
		</button>
	);
}
