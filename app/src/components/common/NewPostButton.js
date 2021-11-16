import React, { useContext } from 'react';

import PostsContext from '../../PostsContext';

export default function NewPostButton({ day, unscheduled }) {
	const { postsDispatch } = useContext(PostsContext);

	const handleNewPost = (e) => {
		e.preventDefault();

		postsDispatch({
			type: 'CREATE_NEW_POST',
			post_date: day ? day : new Date(),
			unscheduled: unscheduled ? unscheduled : false,
		});
	};

	return (
		<button className="icon newPost" onClick={handleNewPost}>
			add_circle
		</button>
	);
}
