import React, { useContext, useEffect, useState } from 'react';
import PostList from './PostList';
import NewPostButton from './common/NewPostButton';
import DragContext from '../DragContext';
import Loading from './common/Loading';

import PostsContext from '../PostsContext';
import { dayKey } from '../lib/utils';

export default function DayPosts({ posts, date, title }) {
	const {
		draggedPost: { isDragging },
	} = useContext(DragContext);
	const {
		posts: {
			updatePost: {
				params: { post_date_unshifted },
			},
		},
	} = useContext(PostsContext);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (post_date_unshifted && dayKey(post_date_unshifted) === dayKey(date)) {
			setIsLoading(true);
		}
		
		return () => {
			setIsLoading(false);
		};
	}, [post_date_unshifted]);

	const renderPostList = () => {
		const renderList = (
			<>
				{!isDragging ? <NewPostButton day={date} unscheduled={false} /> : null}
				<PostList className="dayPosts" date={date} posts={posts} />
			</>
		);

		if (title) {
			return (
				<>
					<h4 className="title">{title}</h4>
					{renderList}
				</>
			);
		} else {
			return renderList;
		}
	};

	return isLoading ? <Loading /> : renderPostList();
}
