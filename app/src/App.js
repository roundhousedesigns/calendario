import React, { useEffect, useReducer, useRef } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import { useStickyState } from "./lib/hooks";
import { dateIsBetween } from "./lib/utils";

import PostsContext, { postsReducer, initialPosts } from "./PostsContext";
import DragContext, { dragReducer, initialDrag } from "./DragContext";
import ViewContext, { viewReducer, initialViewOptions } from "./ViewContext";

import "./App.scss";
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
			// TODO add/save user filtered statuses here?
		},
		"viewOptions"
	);

	const todayRef = useRef();
	const mainRef = useRef();

	function handleTodayClick() {
		const today = new Date();

		if (
			dateIsBetween(
				today,
				viewOptions.viewRange.start,
				viewOptions.viewRange.end
			)
		) {
			mainRef.current.scrollTop = todayRef.current.offsetTop;
		} else {
			viewOptionsDispatch({
				type: "SET_RANGE_START",
				date: today,
			});
		}
	}

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

	return (
		<div className={`calendario`}>
			<ViewContext.Provider value={{ viewOptions, viewOptionsDispatch }}>
				<PostsContext.Provider value={{ posts, postsDispatch }}>
					<Header handleTodayClick={handleTodayClick} />

					<DragContext.Provider
						value={{ draggedPost, draggedPostDispatch }}
					>
						<Main ref={mainRef} todayRef={todayRef} />
						<Sidebar />
					</DragContext.Provider>
				</PostsContext.Provider>
			</ViewContext.Provider>
		</div>
	);
}
