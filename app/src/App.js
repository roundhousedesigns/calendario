import React, { useEffect, useReducer, useRef } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import { useStickyState } from "./lib/hooks";
import { dateIsBetween } from "./lib/utils";

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

	function handleTodayClick() {
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
	}

	return (
		<div className={`calendario`}>
			<ViewContext.Provider value={{ viewOptions, viewOptionsDispatch }}>
				<PostsContext.Provider value={{ posts, postsDispatch }}>
					<Header handleTodayClick={handleTodayClick} />

					<DragContext.Provider
						value={{ draggedPost, draggedPostDispatch }}
					>
						<Sidebar />
						<Main ref={mainRef} todayRef={todayRef} />
					</DragContext.Provider>
				</PostsContext.Provider>
			</ViewContext.Provider>
		</div>
	);
}
