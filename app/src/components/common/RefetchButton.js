import React, { useContext } from 'react';
import PostsContext from '../../PostsContext';

export default function RefetchButton() {
	const { postsDispatch } = useContext(PostsContext);

	const handleRefetchClick = () => {
		postsDispatch({
			type: 'FETCH',
		});
	};

	return (
		<button
			className="icon fetchPostsButton control"
			onClick={handleRefetchClick}
			title="Refresh Posts"
		>
			sync
		</button>
	);
}
