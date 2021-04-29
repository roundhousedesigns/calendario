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
	moveItem,
	dateFormat,
	filterUnchangedParams,
	wp,
	DEBUG_MODE,
} from "./lib/utils";
import {
	format,
	parseISO,
	getHours,
	getMinutes,
	setHours,
	setMinutes,
} from "date-fns";
import { DragDropContext } from "react-beautiful-dnd";

import PostsContext, { postsReducer, initialPosts } from "./PostsContext";
import { updateReducer, initialUpdateState } from "./lib/updatePost";
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
	const [updatePost, updatePostDispatch] = useReducer(
		updateReducer,
		initialUpdateState
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

	useEffect(() => {
		const { post, draggedTo } = updatePost;
		if (updatePost.updateNow === true && post.id !== "undefined") {
			updatePostDispatch({
				type: "UPDATING",
			});

			let url = `${routeBase}/posts/update/${post.id}/${user}`;

			let headers = {
				"Content-Type": "application/json",
			};

			if (DEBUG_MODE !== true) {
				headers["X-WP-Nonce"] = nonce;
			}

			let postData = {
				params: filterUnchangedParams(updatePost.params, post),
				unscheduled: updatePost.unscheduled,
			};

			if (draggedTo !== null) {
				postData.draggedTo = draggedTo;
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

					updatePostDispatch({
						type: "COMPLETE",
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
		updatePost,
		draggedPost,
		draggedPostDispatch,
		postsDispatch,
	]);

	const getList = (id) => {
		let list;
		if (id === "unscheduled") {
			list = posts.unscheduled;
		} else {
			list = posts.scheduled[id];
		}

		return list;
	};

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
		let draggedFrom = isDraggingUnscheduled(item)
			? item.source.draggableId
			: false;

		draggedPostDispatch({
			type: "START",
			post: post,
			draggingUnscheduled,
			draggedFrom,
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

		let dropDate, post_date;
		let overUnscheduled =
			destination.droppableId === "unscheduled" ? true : false;
		if (overUnscheduled === true) {
			post_date = format(post.post_date, dateFormat.dateTime);
		} else {
			dropDate = parseISO(destination.droppableId);

			const time = {
				h: getHours(post.post_date),
				m: getMinutes(post.post_date),
			};
			dropDate = setHours(dropDate, time.h);
			dropDate = setMinutes(dropDate, time.m);

			post_date = format(dropDate, dateFormat.dateTime);
		}

		if (overUnscheduled && source.droppableId === destination.droppableId) {
			const items = reorderUnscheduled(
				getList(source.droppableId),
				source.index,
				destination.index
			);

			postsDispatch({
				type: "SET_UNSCHEDULED",
				posts: items,
			});
		} else if (source.droppableId !== destination.droppableId) {
			const result = moveItem(
				getList(source.droppableId),
				getList(destination.droppableId),
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
		updatePostDispatch({
			type: "UPDATE",
			post,
			unscheduled: overUnscheduled,
			params: { post_date },
			draggedTo: overUnscheduled ? destination.index : null,
		});

		// TODO investigate this
		if (posts.currentPost.id === post.id) {
			postsDispatch({
				type: "UPDATE_CURRENTPOST_FIELD",
				field: "post_date",
				value: dropDate,
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
