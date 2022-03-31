import React, { useEffect, useState, useContext } from 'react';
import Post from './Post';
import Loading from './common/Loading';
import { dateFormat, dayKey } from '../lib/utils';
import { Droppable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

import PostsContext from '../PostsContext';

export default function PostList({ posts, className, date, showDropOutline }) {
	const [hovered, setHovered] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const {
		posts: {
			updatePost: {
				params: { post_date_unshifted },
			},
		},
	} = useContext(PostsContext);

	useEffect(() => {
		if (
			post_date_unshifted &&
			date &&
			dayKey(post_date_unshifted) === dayKey(date)
		) {
			setIsLoading(true);
		}

		return () => {
			setIsLoading(false);
		};
	}, [post_date_unshifted, date]);

	const droppableId =
		date === false ? 'unscheduled' : format(date, dateFormat.date);

	return (
		<Droppable droppableId={droppableId}>
			{({ innerRef, droppableProps, placeholder }, snapshot) => (
				<>
					{isLoading ? <Loading /> : null}
					<ul
						ref={innerRef}
						{...droppableProps}
						className={`postList ${className} ${
							snapshot.isDraggingOver ? 'draggingOver' : 'idle'
						}`}
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
						style={hovered ? { marginBottom: 0 } : null}
					>
						{!isEmpty(posts) ? (
							posts.map((post, index) => (
								<Post
									post={post}
									key={post.id}
									index={index}
									unscheduled={droppableId === 'unscheduled' ? true : false}
								/>
							))
						) : (
							<li
								className={
									isEmpty(posts) && showDropOutline ? 'placeholder' : ''
								}
							></li>
						)}
						{placeholder}
					</ul>
				</>
			)}
		</Droppable>
	);
}
