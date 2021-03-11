import React, { useEffect, useReducer, Profiler } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import { useStickyState } from "./lib/hooks";

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
			<Profiler id="Main" onRender={mainRenderCallback}>
				<ViewContext.Provider
					value={{ viewOptions, viewOptionsDispatch }}
				>
					<PostsContext.Provider value={{ posts, postsDispatch }}>
						<Header />

						<DragContext.Provider
							value={{ draggedPost, draggedPostDispatch }}
						>
							<Main />
							<Sidebar />
						</DragContext.Provider>
					</PostsContext.Provider>
				</ViewContext.Provider>
			</Profiler>
		</div>
	);
}
