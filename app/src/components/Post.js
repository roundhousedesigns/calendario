import React, { useContext, useEffect, useState } from 'react';
import PostLinks from './PostLinks';
import { Draggable } from 'react-beautiful-dnd';
import { isEmpty } from 'lodash';
import { decode } from 'html-entities';
import { wp } from '../lib/utils';

import PostsContext from '../PostsContext';
import DragContext from '../DragContext';
import ViewContext from '../ViewContext';

export default function Post({ post, index, unscheduled, dragDisabled }) {
	const {
		posts: { currentPost, isUpdating },
		postsDispatch,
	} = useContext(PostsContext);
	const {
		draggedPost: { isDragging },
	} = useContext(DragContext);
	const {
		viewOptions: { postStatuses },
	} = useContext(ViewContext);

	const { id, post_title, post_status, post_date_day } = post;

	const {
		freemius: { trialLink },
	} = wp;

	const [color, setColor] = useState('');

	useEffect(() => {
		if (postStatuses === undefined || isEmpty(postStatuses)) {
			return;
		}

		setColor(postStatuses[post_status].color);
	}, [post_status, postStatuses]);

	const handleClick = (e) => {
		// Skip if clicking a QuickLink button
		if (e.target.classList.contains('icon')) {
			return;
		}

		if (e.target.classList.contains('post-id-0')) {
			window.open(trialLink, '_blank');
		} else {
			postsDispatch({
				type: 'SET_CURRENTPOST',
				post: post,
				unscheduled,
			});
		}
	};

	function getStyles(snapshot) {
		let classes = ['post', `post-id-${id} status__${post_status}`];

		if (
			(unscheduled === false && postStatuses[post_status].visible === true) ||
			unscheduled === true
		) {
			classes.push('visible');
		} else {
			classes.push('hidden');
		}

		if (!isEmpty(currentPost) && currentPost.id === id) {
			classes.push('currentPost');
		}

		if (snapshot.isDragging) {
			classes.push('dragging');
		}

		if (snapshot.draggingOver === 'unscheduled') {
			classes.push('over__unscheduled');
		} else if (snapshot.draggingOver !== null) {
			classes.push('over__calendar');
		} else {
			classes.push('over__none');
		}

		// Cute effect...not useful.
		// if (isUpdating === post_date_day) {
		// 	classes.push('loading');
		// }

		return classes.join(' ');
	}

	return !isEmpty(postStatuses) ? (
		<Draggable
			draggableId={`${id}`}
			index={index}
			isDragDisabled={isUpdating || dragDisabled ? true : false}
		>
			{({ innerRef, draggableProps, dragHandleProps }, snapshot) => (
				<li
					ref={innerRef}
					{...draggableProps}
					{...dragHandleProps}
					key={id}
					className={getStyles(snapshot)}
					data-index={index}
					onClick={handleClick}
				>
					<div
						className="postData"
						style={{
							backgroundColor: color,
						}}
					>
						<p className="postData__title">
							{decode(post_title, { scope: 'strict' })}
						</p>
					</div>
					{!isDragging && isUpdating !== post_date_day && id !== 0 ? (
						<PostLinks
							style={{
								backgroundColor: color.replace(/,1\)/, ',0.75)'),
							}}
							post={post}
							unscheduled={unscheduled}
						/>
					) : (
						''
					)}
				</li>
			)}
		</Draggable>
	) : null;
}
