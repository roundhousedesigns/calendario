import React, { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Calendar";
import Sidebar from "./components/Sidebar";

import PostsContext, { postsReducer } from "./PostsContext";

import "./App.scss";

const samplePosts = {
	scheduled: {
		"02-10-2021": [
			{
				post_title: "Test Post 1",
				post_status: "draft",
				post_date: "02-10-2021", // will be more accurate and have post time, as well
			},
		],
		"02-13-2021": [
			{
				post_title: "Test Post 2",
				post_status: "future",
				post_date: "02-13-2021", // will be more accurate and have post time, as well
			},
		],
	},
	unscheduled: [
		{
			post_title: "Test Post 3",
			post_status: "draft",
			post_date: "02-16-2021", // will be more accurate and have post time, as well
		},
		{
			post_title: "Test Post 4",
			post_status: "pending",
			post_date: "02-22-2021", // will be more accurate and have post time, as well
		},
	],
};

export default function App() {
	const [posts, postsDispatch] = useReducer(postsReducer, samplePosts);

	useEffect(() => {
		postsDispatch({
			posts: samplePosts,
		});
	}, []);

	return (
		<div className="calendario">
			<Header />
			<PostsContext.Provider value={posts}>
				<Main />
				<Sidebar />
			</PostsContext.Provider>
		</div>
	);
}
