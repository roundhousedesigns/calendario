import React, { useEffect, useReducer, Profiler } from "react";
import Header from "./components/Header";
import Main from "./components/Calendar";
import Sidebar from "./components/Sidebar";
import { samplePosts } from "./lib/utils";
import { useStickyState } from "./lib/hooks";

import PostsContext, { postsReducer, initialPosts } from "./PostsContext";
import DragContext, { dragReducer, initialDrag } from "./DragContext";

import "./App.scss";

export default function App() {
	const [posts, postsDispatch] = useReducer(postsReducer, initialPosts);
	const [draggedPost, draggedPostDispatch] = useReducer(
		dragReducer,
		initialDrag
	);
	const [darkMode, setDarkMode] = useStickyState(false, "darkMode");
	const [calendarMonthCount, setCalendarMonthCount] = useStickyState(
		1,
		"monthCount"
	);

	useEffect(() => {
		postsDispatch({
			type: "INIT",
			calendar: samplePosts.calendar,
			unscheduled: samplePosts.unscheduled,
		});

		// Update the context just initially
		postsDispatch({
			type: "UPDATE_MONTH_COUNT",
			monthCount: calendarMonthCount,
		});
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		// Store the value if it's updated elsewhere
		setCalendarMonthCount(posts.monthCount);
	}, [setCalendarMonthCount, posts.monthCount]);

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
