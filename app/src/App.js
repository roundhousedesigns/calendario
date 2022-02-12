import React, { useEffect, useReducer, useRef } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import Icon from './components/common/Icon';
import { useStickyState, useUpdatePost } from './lib/hooks';
import {
	dateIsBetween,
	isDraggingUnscheduled,
	reorderUnscheduled,
	getPostList,
	moveItem,
	draggedPostDestination,
	filterPostStatus,
} from './lib/utils';
import { differenceInWeeks, addWeeks } from 'date-fns';
import { DragDropContext } from 'react-beautiful-dnd';

import PostsContext, { postsReducer, initialPosts } from './PostsContext';
import DragContext, { dragReducer, initialDrag } from './DragContext';
import ViewContext, { viewReducer, initialViewOptions } from './ViewContext';

import 'react-datepicker/dist/react-datepicker.css';

export default function App() {
	const [posts, postsDispatch] = useReducer(postsReducer, initialPosts);
	const [draggedPost, draggedPostDispatch] = useReducer(
		dragReducer,
		initialDrag
	);
	const [viewOptions, viewOptionsDispatch] = useReducer(
		viewReducer,
		initialViewOptions
	);
	const [view, setView] = useStickyState(
		{
			viewMode: 'calendar',
		},
		'viewOptions'
	);

	const {
		viewRange: { start, end },
	} = viewOptions;

	const todayRef = useRef();
	const mainRef = useRef();

	const {
		unscheduled: unscheduledPosts,
		scheduled: scheduledPosts,
		currentPost,
	} = posts;

	useEffect(() => {
		// Update the context initially
		viewOptionsDispatch({
			type: 'SET_VIEW_MODE',
			viewMode: view.viewMode,
		});
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		// Store the values if it's updated elsewhere
		setView({
			viewMode: viewOptions.viewMode,
		});
	}, [setView, viewOptions.viewMode]);

	useEffect(() => {
		postsDispatch({ type: 'FETCH' });
	}, []);

	/**
	 * Send the update
	 */
	useUpdatePost(posts, postsDispatch, draggedPost, draggedPostDispatch);

	const isOverUnscheduled = (droppableId) =>
		droppableId === 'unscheduled' ? true : false;

	const handleTodayClick = () => {
		const today = new Date();

		if (dateIsBetween(today, start, end)) {
			mainRef.current.scroll({
				top: todayRef.current.offsetTop,
				behavior: 'smooth',
			});
		} else {
			const weekDiff = differenceInWeeks(end, start);

			viewOptionsDispatch({
				type: 'SET_RANGE',
				start: today,
				end: addWeeks(today, weekDiff),
			});
		}

		postsDispatch({ type: 'FETCH' });
	};

	const onDragStart = (item) => {
		let draggingUnscheduled = isDraggingUnscheduled(item);

		let postList;
		if (draggingUnscheduled === true) {
			postList = unscheduledPosts;
		} else {
			postList = scheduledPosts[item.source.droppableId];
		}

		const post = postList.find((p) => {
			return Number(item.draggableId) === Number(p.id);
		});
		let currentIndex = isDraggingUnscheduled(item)
			? item.source.draggableId
			: false;

		draggedPostDispatch({
			type: 'START',
			post: post,
			draggingUnscheduled,
			currentIndex,
		});
	};

	const onDragUpdate = (item) => {
		if (item.destination === null) {
			return;
		}

		let overUnscheduled = isOverUnscheduled(item.source.droppableId);

		// only dispatch if an update is necessary
		if (overUnscheduled === true) {
			draggedPostDispatch({
				type: 'DRAGGING_OVER_UNSCHEDULED',
				draggedOver: item.destination.index,
			});
		} else if (draggedPost.overUnscheduled === true) {
			draggedPostDispatch({
				type: 'DRAGGING_OVER_CALENDAR',
			});
		}
	};

	const onDragEnd = (item) => {
		const { source, destination } = item;
		const {
			post: { id, post_date: post_date_from, post_status },
		} = draggedPost;

		// dropped outside a list
		if (!destination) {
			return;
		}

		let overUnscheduled = isOverUnscheduled(destination.droppableId);

		const post_date = draggedPostDestination(
			post_date_from,
			destination.droppableId
		);

		if (overUnscheduled && source.droppableId === destination.droppableId) {
			// Reorder
			const items = reorderUnscheduled(
				getPostList(source.droppableId, posts),
				source.index,
				destination.index
			);

			postsDispatch({
				type: 'SET_UNSCHEDULED',
				posts: items,
			});
		} else if (source.droppableId !== destination.droppableId) {
			// Move
			const result = moveItem(
				getPostList(source.droppableId, posts),
				getPostList(destination.droppableId, posts),
				source,
				destination
			);

			postsDispatch({
				type: 'MOVE_POST',
				source: result[source.droppableId],
				destination: result[destination.droppableId],
				sourceId: result.sourceId,
				destinationId: result.destinationId,
			});
		}

		// Run the update
		postsDispatch({
			type: 'PREPARE_UPDATE',
			id,
			unscheduled: overUnscheduled,
			params: {
				post_date,
				post_status: filterPostStatus(post_status, overUnscheduled),
			},
			newIndex: overUnscheduled ? destination.index : null,
		});

		// If doing a post edit, save the post date
		if (currentPost.id === id) {
			postsDispatch({
				type: 'UPDATE_CURRENTPOST_FIELD',
				field: 'post_date',
				value: post_date,
			});
		}

		draggedPostDispatch({ type: 'END' });
	};

	const appClass = () => {
		const { sidebarOpen } = viewOptions;

		let classes = ['calendarioMain'];

		if (sidebarOpen === true) {
			classes.push('sidebarOpen');
		} else {
			classes.push('sidebarClosed');
		}

		return classes.join(' ');
	};

	return (
		<>
			<div className="mobileOrientationCheck">
				<div className="message">
					<Icon>screen_rotation</Icon>
					<p className="caption">Please rotate your device</p>
				</div>
			</div>
			<div className={appClass()}>
				<ViewContext.Provider value={{ viewOptions, viewOptionsDispatch }}>
					<PostsContext.Provider value={{ posts, postsDispatch }}>
						<Header handleTodayClick={handleTodayClick} />
						<DragContext.Provider value={{ draggedPost, draggedPostDispatch }}>
							<DragDropContext
								onDragEnd={onDragEnd}
								onDragStart={onDragStart}
								onDragUpdate={onDragUpdate}
							>
								<Sidebar />
								<Main ref={mainRef} todayRef={todayRef} />
							</DragDropContext>
						</DragContext.Provider>
					</PostsContext.Provider>
				</ViewContext.Provider>
			</div>
		</>
	);
}
