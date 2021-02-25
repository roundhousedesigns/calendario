import React, { useEffect, useReducer, Profiler } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import { useStickyState } from "./lib/hooks";

import PostsContext, { postsReducer, initialPosts } from "./PostsContext";
import DragContext, { dragReducer, initialDrag } from "./DragContext";
import ViewContext, { viewReducer, initialViewOptions } from "./ViewContext";

import "./App.scss";

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
			monthCount: 1,
		},
		"viewOptions"
	);

	useEffect(() => {
		// Update the context just initially
		viewOptionsDispatch({
			type: "UPDATE_OPTION",
			monthCount: view.monthCount,
			viewMode: view.viewMode,
		});
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		// Store the values if it's updated elsewhere
		setView({
			viewMode: viewOptions.viewMode,
			monthCount: viewOptions.monthCount,
		});
	}, [setView, viewOptions.viewMode, viewOptions.monthCount]);

	function mainRenderCallback(
		id,
		phase,
		actualDuration,
		baseDuration,
		startTime,
		commitTime,
		interactions
	) {}

	return (
		<div className={`calendario`}>
			<ViewContext.Provider value={{ viewOptions, viewOptionsDispatch }}>
				<PostsContext.Provider value={{ posts, postsDispatch }}>
					<Header />

					<Profiler id="Main" onRender={mainRenderCallback}>
						<DragContext.Provider
							value={{ draggedPost, draggedPostDispatch }}
						>
							<Main />
							<Sidebar />
						</DragContext.Provider>
					</Profiler>
				</PostsContext.Provider>
			</ViewContext.Provider>
		</div>
	);
}
