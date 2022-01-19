import React, { useContext } from 'react';
import PostList from './PostList';
import Loading from './common/Loading';
import NewPostButton from './common/NewPostButton';
import Icon from './common/Icon';
import { wp } from '../lib/utils';

import { useFetchUnscheduledPosts } from '../lib/hooks';
import PostsContext from '../PostsContext';

export default function UnscheduledDrafts() {
	const { posts, postsDispatch } = useContext(PostsContext);
	const { trashUrl } = wp;

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
						showDropOutline={true}
					/>
					<NewPostButton unscheduled={true} />
				</>
			)}
			<div className="adminLinks">
				<a rel="noreferrer" href={trashUrl} target="_blank">
					Trashed Posts <Icon tooltip="Open in new window">open_in_new</Icon>
				</a>
			</div>
		</>
	);
}
