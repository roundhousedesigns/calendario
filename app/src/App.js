import React, { useEffect, /*useState,*/ useReducer, useRef } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import Icon from "./components/common/Icon";
import { useStickyState } from "./lib/hooks";
import {
	dateIsBetween,
	isDraggingUnscheduled,
	reorderUnscheduled,
	getPostList,
	moveItem,
	wp,
	draggedPostDate,
	DEBUG_MODE,
	filterPostStatus,
	dateFormat,
} from "./lib/utils";
import { differenceInWeeks, addWeeks, format } from "date-fns";
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
	const { routeBase, user, nonce } = wp;

	useEffect(() => {
		// Update the context initially
		viewOptionsDispatch({
			type: "SET_VIEW_MODE",
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
	// TODO move this to a custom hook
	useEffect(() => {
		const {
			updatePost: { updateNow, id, params, unscheduled, newIndex, trash },
		} = posts;

		if (updateNow === true && id !== undefined) {
			const droppableId =
				unscheduled === true
					? "unscheduled"
					: format(new Date(params.post_date), dateFormat.date);

			postsDispatch({
				type: "UPDATE_INIT",
			});

			// Check if this is a new post, a post to trash, or an existing post,
			//   and set the proper URL
			let url = `${routeBase}/posts/`;
			if (trash === true) {
				url += `trash/${id}/${user}`;
				postsDispatch({ type: "REMOVE_POST", droppableId });
			} else if (id === 0) {
				url += `new/${user}`;
				postsDispatch({ type: "ADD_POST", droppableId });
			} else {
				url += `update/${id}/${user}`;
				postsDispatch({ type: "UPDATE_POST", droppableId });
			}

			let headers = {
				"Content-Type": "application/json",
			};

			if (DEBUG_MODE !== true) {
				headers["X-WP-Nonce"] = nonce;
			}

			let postData = {
				params,
				unscheduled,
			};

			if (newIndex !== null) {
				postData.newIndex = newIndex;
			}

			const sendUpdate = async () => {
				try {
					const response = await fetch(url, {
						method: "POST",
						headers,
						body: JSON.stringify(postData),
					});
					const data = await response.json();

					if (data && data > 0) {
						postsDispatch({ type: "UPDATE_SUCCESS", id, params });
					} else {
						console.log("Update server error", data);

						postsDispatch({ type: "UPDATE_ERROR", id, params });
					}

					draggedPostDispatch({
						type: "END",
					});

					// TODO fix new post not appearing right away

					// postsDispatch({ type: "REFETCH" });

					postsDispatch({ type: "UPDATE_COMPLETE" });
				} catch (error) {
					postsDispatch({ type: "UPDATE_COMPLETE" });
				}
			};

			sendUpdate();
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

	const isOverUnscheduled = (droppableId) =>
		droppableId === "unscheduled" ? true : false;

	const handleTodayClick = () => {
		const today = new Date();

		if (dateIsBetween(today, start, end)) {
			mainRef.current.scroll({
				top: todayRef.current.offsetTop,
				behavior: "smooth",
			});
		} else {
			const weekDiff = differenceInWeeks(end, start);

			viewOptionsDispatch({
				type: "SET_RANGE",
				start: today,
				end: addWeeks(today, weekDiff),
			});
		}
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

		let overUnscheduled = isOverUnscheduled(item.source.droppableId);

		// only dispatch if an update is necessary
		if (overUnscheduled === true) {
			draggedPostDispatch({
				type: "DRAGGING_OVER_UNSCHEDULED",
				draggedOver: item.destination.index,
			});
		} else if (draggedPost.overUnscheduled === true) {
			draggedPostDispatch({
				type: "DRAGGING_OVER_CALENDAR",
			});
		}
	};

	const onDragEnd = (item) => {
		const { source, destination } = item;
		const {
			post: { id, post_date: post_date_raw, post_status },
		} = draggedPost;

		// dropped outside a list
		if (!destination) {
			return;
		}

		let overUnscheduled = isOverUnscheduled(destination.droppableId);

		const post_date = draggedPostDate(
			post_date_raw,
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
			id,
			unscheduled: overUnscheduled,
			params: {
				post_date: post_date.formatted,
				post_status: filterPostStatus(post_status, overUnscheduled),
			},
			newIndex: overUnscheduled ? destination.index : null,
		});

		// If doing a post edit, save the post date
		if (currentPost.id === id) {
			postsDispatch({
				type: "UPDATE_CURRENTPOST_FIELD",
				field: "post_date",
				value: post_date.date,
			});
		}

		draggedPostDispatch({ type: "END" });
	};

	function appClass() {
		const { sidebarOpen } = viewOptions;

		let classes = ["calendario"];

		if (sidebarOpen === true) {
			classes.push("sidebarOpen");
		} else {
			classes.push("sidebarClosed");
		}

		return classes.join(" ");
	}

	return (
		<>
			<div className="mobileOrientationCheck">
				<div className="message">
					<Icon>screen_rotation</Icon>
					<p className="caption">Please rotate your device</p>
				</div>
			</div>
			<div className={appClass()}>
				<ViewContext.Provider
					value={{ viewOptions, viewOptionsDispatch }}
				>
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
		</>
	);
}
