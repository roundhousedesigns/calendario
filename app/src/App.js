import React, { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Calendar";
import Sidebar from "./components/Sidebar";

import PostsContext, { postsReducer, initialPosts } from "./PostsContext";
import DragContext, { dragReducer, initialDrag } from "./DragContext";

import { samplePosts } from "./lib/utils";

import "./App.scss";

export default function App() {
	const [posts, postsDispatch] = useReducer(postsReducer, initialPosts);
	const [draggedPost, dragDispatch] = useReducer(dragReducer, initialDrag);

	useEffect(() => {
		postsDispatch({
			type: "POPULATE",
			scheduled: samplePosts.scheduled,
			unscheduled: samplePosts.unscheduled,
		});
	}, []);

	return (
		<div className="calendario">
			<Header />

			<DragContext.Provider value={{ draggedPost, dragDispatch }}>
				<PostsContext.Provider value={{ posts, postsDispatch }}>
					<Main />
					<Sidebar />
				</PostsContext.Provider>
			</DragContext.Provider>
		</div>
	);
}
