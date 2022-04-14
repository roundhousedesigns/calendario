import React, { useContext } from 'react';
import PostList from './PostList';
import NewPostButton from './common/NewPostButton';
import Icon from './common/Icon';
import { wp } from '../lib/utils';

import { useFetchUnscheduledPosts } from '../lib/hooks';
import PostsContext from '../PostsContext';
import ProWrapper from './common/ProWrapper';

export default function UnscheduledDrafts() {
	const { posts, postsDispatch } = useContext(PostsContext);
	const { trashUrl } = wp;

	const { unscheduled } = posts;

	useFetchUnscheduledPosts(posts, postsDispatch);

	return (
		<>
			<div className="draftsArea">
				<PostList
					className="unscheduledDrafts"
					date={false}
					posts={unscheduled}
					showDropOutline={true}
					freePostLimit={3}
				/>
				<ProWrapper>
					<NewPostButton unscheduled={true} />
				</ProWrapper>
				<div className="adminLinks">
					<a rel="noreferrer" href={trashUrl} target="_blank">
						Trashed Posts <Icon tooltip="Open in new window">open_in_new</Icon>
					</a>
				</div>
			</div>
		</>
	);
}
