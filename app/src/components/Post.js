import React, { useContext, useEffect, useState } from 'react';
import PostLinks from './PostLinks';
import Icon from './common/Icon';
import { Draggable } from 'react-beautiful-dnd';
import { isEmpty } from 'lodash';
import { decode } from 'html-entities';

import PostsContext from '../PostsContext';
import DragContext from '../DragContext';
import ViewContext from '../ViewContext';

export default function Post({ post, index, unscheduled }) {
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

	const { id, post_title, post_status, edit_lock } = post;

	const [color, setColor] = useState('');
	const [animationRequestId, setAnimationRequestId] = useState(null);
	const [linksActive, setLinksActive] = useState(false);

	useEffect(() => {
		if (postStatuses === undefined || isEmpty(postStatuses)) {
			return;
		}

		setColor(postStatuses[post_status].color);
	}, [post_status, postStatuses]);

	function animateLinks(element, { timing, draw, duration }) {
		let start = performance.now();

		setAnimationRequestId(() =>
			requestAnimationFrame(function animate(time) {
				let timeFraction = (time - start) / duration;

				let progress = timing(timeFraction);
				draw(element, progress);
			})
		);

		setLinksActive(true);
	}

	function stopAnimateLinks(element) {
		element.currentTarget.style.paddingBottom = 0;
		cancelAnimationFrame(animationRequestId);

		setLinksActive(false);
	}

	const handleMouseDown = (e) => {
		// TODO REST check for edit_lock?
	};

	const handleClick = (e) => {
		// Skip if clicking a QuickLink button
		if (e.target.classList.contains('icon')) {
			return;
		}

		// TODO REST check for edit_lock?

		if (!edit_lock) {
			postsDispatch({
				type: 'SET_CURRENTPOST',
				post: post,
				unscheduled,
			});
		}
	};

	const handleMouseEnter = (e) => {
		animateLinks(e.currentTarget, {
			timing: function (timeFraction) {
				return timeFraction;
			},
			draw: function (element, progress) {
				element.style.paddingBottom = progress + 30 + 'px';
			},
			duration: 50,
		});
	};

	const handleMouseLeave = (e) => {
		stopAnimateLinks(e);
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

		if (isUpdating || edit_lock) {
			classes.push('locked');
		}

		return classes.join(' ');
	}

	return !isEmpty(postStatuses) ? (
		<Draggable
			draggableId={`${id}`}
			index={index}
			isDragDisabled={isUpdating || edit_lock ? true : false}
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
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onMouseDown={handleMouseDown}
				>
					<div
						className="postData"
						style={{
							backgroundColor: color,
						}}
					>
						<p className="postData__title">
							{decode(post_title, { scope: 'strict' })}
							{edit_lock ? (
								<Icon className="lock" tooltip="Currently being edited.">
									lock
								</Icon>
							) : (
								''
							)}
						</p>
					</div>
					{!isDragging ? (
						<PostLinks
							style={{
								backgroundColor: color.replace(/,1\)/, ',0.75)'),
							}}
							active={linksActive}
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
