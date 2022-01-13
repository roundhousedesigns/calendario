import React, { useContext } from 'react';
import PostList from './PostList';
import NewPostButton from './common/NewPostButton';
import DragContext from '../DragContext';

export default function DayPosts({ posts, date, title }) {
	const {
		draggedPost: { isDragging },
	} = useContext(DragContext);

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

	return renderPostList();
}
