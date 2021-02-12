import React, { useEffect, useState, useReducer } from "react";
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
			type: "POPULATE",
			scheduled: samplePosts.scheduled,
			unscheduled: samplePosts.unscheduled,
		});
	}, []);

	const toggleDarkMode = () => {
		setDarkMode(() => !darkMode);
	};

	return (
		<div className={`calendario ${darkMode ? "darkMode" : "lightMode"}`}>
			<Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

			<DragContext.Provider value={{ draggedPost, draggedPostDispatch }}>
				<PostsContext.Provider value={{ posts, postsDispatch }}>
					<Main />
					<Sidebar />
				</PostsContext.Provider>
			</DragContext.Provider>
		</div>
	);
}
