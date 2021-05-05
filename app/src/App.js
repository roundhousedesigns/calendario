import React, { useEffect, /*useState,*/ useReducer, useRef } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import { useStickyState } from "./lib/hooks";
import {
	dateIsBetween,
	isDraggingUnscheduled,
	isOverUnscheduled,
	reorderUnscheduled,
	getPostList,
	moveItem,
	wp,
	draggedPostDate,
	DEBUG_MODE,
} from "./lib/utils";
import { isEmpty } from "lodash";
import { DragDropContext } from "react-beautiful-dnd";

import PostsContext, { postsReducer, initialPosts } from "./PostsContext";
import DragContext, { dragReducer, initialDrag } from "./DragContext";
import ViewContext, { viewReducer, initialViewOptions } from "./ViewContext";

import "react-datepicker/dist/react-datepicker.css";

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
			viewMode: "calendar",
		},
		"viewOptions"
	);

	const todayRef = useRef();
	const mainRef = useRef();

	const { routeBase, user, nonce } = wp;

	useEffect(() => {
		// Update the context initially
		viewOptionsDispatch({
			type: "UPDATE",
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

	// Send the update!
	useEffect(() => {
		const {
			updatePost: {
				updateNow,
				post,
				params,
				unscheduled,
				newIndex,
				trash,
			},
		} = posts;

		if (updateNow === true && post.id !== "undefined") {
			postsDispatch({
				type: "UPDATING",
			});

			// Check if this is a new post, a post to trash, or an existing post,
			//   and set the proper URL
			let url = `${routeBase}/posts/`;
			if (trash === true) {
				url += `trash/${post.id}/${user}`;
			} else {
				if (post.id === 0) {
					url += `new/${user}`;
				} else {
					url += `update/${post.id}/${user}`;
				}
			}

			let headers = {
				"Content-Type": "application/json",
			};

			if (DEBUG_MODE !== true) {
				headers["X-WP-Nonce"] = nonce;
			}

			let postData = {
				params: !isEmpty(params) ? params : {},
				unscheduled,
			};

			if (newIndex !== null) {
				postData.newIndex = newIndex;
			}

			const fetchData = async () => {
				// setIsLoading(true);

				try {
					const response = await fetch(url, {
						method: "POST",
						headers,
						body: JSON.stringify(postData),
					});
					// const data = await response.json(); // If you need to catch the response...
					await response.json();

					draggedPostDispatch({
						type: "END",
					});

					postsDispatch({
						type: "COMPLETE",
					});

					postsDispatch({
						type: "REFETCH",
					});

					// setIsLoading(false);
				} catch (error) {
					console.log(error.message);
					// setIsLoading(false);
				}
			};

			fetchData();
		}
	}, [
		routeBase,
		user,
		nonce,
		posts,
		draggedPost,
		draggedPostDispatch,
		postsDispatch,
	]);

	const handleTodayClick = () => {
		const today = new Date();

		if (
			dateIsBetween(
				today,
				viewOptions.viewRange.start,
				viewOptions.viewRange.end
			)
		) {
			mainRef.current.scroll({
				top: todayRef.current.offsetTop,
				behavior: "smooth",
			});
		} else {
			viewOptionsDispatch({
				type: "SET_RANGE_START",
				date: today,
			});
		}
	};

	const onDragStart = (item) => {
		let draggingUnscheduled = isDraggingUnscheduled(item);

		let postList;
		if (draggingUnscheduled === true) {
			postList = posts.unscheduled;
		} else {
			postList = posts.scheduled[item.source.droppableId];
		}

		const post = postList.find((p) => {
			return Number(item.draggableId) === Number(p.id);
		});
		let currentIndex = isDraggingUnscheduled(item)
			? item.source.draggableId
			: false;

		draggedPostDispatch({
			type: "START",
			post: post,
			draggingUnscheduled,
			currentIndex,
		});
	};

	const onDragUpdate = (item) => {
		if (item.destination === null) {
			return;
		}

		let overUnscheduled = isOverUnscheduled(item);

		// only dispatch if an update is necessary
		if (overUnscheduled === true && draggedPost.overUnscheduled === false) {
			draggedPostDispatch({
				type: "DRAGGING_OVER_UNSCHEDULED",
				draggedOver: item.destination.index,
			});
		} else if (
			overUnscheduled === false &&
			draggedPost.overUnscheduled === true
		) {
			draggedPostDispatch({
				type: "DRAGGING_OVER_CALENDAR",
			});
		}
	};

	const onDragEnd = (item) => {
		const { source, destination } = item;
		const { post } = draggedPost;

		// dropped outside a list
		if (!destination) {
			return;
		}

		let overUnscheduled =
			destination.droppableId === "unscheduled" ? true : false;

		const post_date = draggedPostDate(
			post.post_date,
			destination.droppableId,
			overUnscheduled
		);

		if (overUnscheduled && source.droppableId === destination.droppableId) {
			// Reorder
			const items = reorderUnscheduled(
				getPostList(source.droppableId, posts),
				source.index,
				destination.index
			);

			postsDispatch({
				type: "SET_UNSCHEDULED",
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
				type: "MOVE",
				source: result[source.droppableId],
				destination: result[destination.droppableId],
				sourceId: result.sourceId,
				destinationId: result.destinationId,
			});
		}

		// Run the update
		postsDispatch({
			type: "UPDATE",
			post,
			unscheduled: overUnscheduled,
			params: { post_date: post_date.formatted },
			newIndex: overUnscheduled ? destination.index : null,
		});

		// If doing a post edit, save the post date
		if (posts.currentPost.id === post.id) {
			postsDispatch({
				type: "UPDATE_CURRENTPOST_FIELD",
				field: "post_date",
				value: post_date.date,
			});
		}

		draggedPostDispatch({ type: "END" });
	};

	return (
		<div className={`calendario`}>
			<ViewContext.Provider value={{ viewOptions, viewOptionsDispatch }}>
				<PostsContext.Provider value={{ posts, postsDispatch }}>
					<Header handleTodayClick={handleTodayClick} />

					<DragContext.Provider
						value={{ draggedPost, draggedPostDispatch }}
					>
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
	);
}
