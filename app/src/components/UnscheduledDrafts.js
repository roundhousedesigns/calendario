import React, { useContext } from 'react';
import PostList from './PostList';
import AdminLinks from './AdminLinks';
import Loading from './common/Loading';
import NewPostButton from './common/NewPostButton';

import { useFetchUnscheduledPosts } from '../lib/hooks';

import PostsContext from '../PostsContext';

export default function UnscheduledDrafts() {
	const { posts, postsDispatch } = useContext(PostsContext);

	const { unscheduled } = posts;

	var isLoading = useFetchUnscheduledPosts(posts, postsDispatch);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<PostList
						className="unscheduledDrafts"
						date={false}
						posts={unscheduled}
					/>
					<NewPostButton unscheduled={true} />
				</>
			)}
			<AdminLinks />
		</>
	);
}
