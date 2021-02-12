import React, { useEffect, useState, useReducer, Profiler } from "react";
import Header from "./components/Header";
import Main from "./components/Calendar";
import Sidebar from "./components/Sidebar";
import { samplePosts } from "./lib/utils";

import PostsContext, { postsReducer, initialPosts } from "./PostsContext";
import DragContext, { dragReducer, initialDrag } from "./DragContext";

import "./App.scss";

export default function App() {
	const [posts, postsDispatch] = useReducer(postsReducer, initialPosts);
	const [draggedPost, draggedPostDispatch] = useReducer(
		dragReducer,
		initialDrag
	);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		postsDispatch({
			type: "INIT",
			scheduled: samplePosts.scheduled,
			unscheduled: samplePosts.unscheduled,
		});
	}, []);

	const toggleDarkMode = () => {
		setDarkMode(() => !darkMode);
	};

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
		<div className={`calendario ${darkMode ? "darkMode" : "lightMode"}`}>
			<Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

			<Profiler id="Main" onRender={mainRenderCallback}>
				<DragContext.Provider
					value={{ draggedPost, draggedPostDispatch }}
				>
					<PostsContext.Provider value={{ posts, postsDispatch }}>
						<Main />
						<Sidebar />
					</PostsContext.Provider>
				</DragContext.Provider>
			</Profiler>
		</div>
	);
}
