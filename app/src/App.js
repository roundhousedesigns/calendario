import React, { useEffect, useState, useReducer } from "react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import PostModal from "./components/PostModal";
import { routeBase, getThisMonth } from "./lib/utils";

import SidebarPostsContext, {
	sidebarPostsReducer,
} from "./context/SidebarPosts";
import PostModalContext, { postModalReducer } from "./context/PostModal";

import "./App.css";

const maxViewMonths = 3;

export default function App() {
	const baseMonth = getThisMonth();
	const [viewMode, setViewMode] = useState("3");
	const [calendarRefs, setCalendarRefs] = useState([]);
	const [futuremostDate, setFuturemostDate] = useState("");
	const [sidebarPosts, sidebarPostsDispatch] = useReducer(
		sidebarPostsReducer,
		{
			events: [],
		}
	);

	const [postModal, postModalDispatch] = useReducer(postModalReducer, {
		show: false,
		post: {},
	});

	const createCalendarRefs = () => {
		let refs = [];
		for (let i = 0; i < maxViewMonths; i++) {
			refs[i] = React.createRef();
		}
		setCalendarRefs(refs);
	};

	useEffect(() => {
		setCalendarRefs(createCalendarRefs);
	}, []);

	useEffect(() => {
		const apiUrl = `${routeBase}/posts/unscheduled`;
		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) => {
				sidebarPostsDispatch({
					type: "POPULATE",
					events: data,
				});
			});
	}, []);

	useEffect(() => {
		fetch(`${routeBase}/posts/futuremost`)
			.then((response) => response.json())
			.then((future) => {
				setFuturemostDate(new Date(future));
			});

		fetch(`${routeBase}/user/calendario_view_mode/0`)
			.then((response) => response.json())
			.then((viewMode) => {
				viewMode = viewMode === false ? "3" : viewMode;
				setViewMode(viewMode);
			});
	}, []);

	useEffect(() => {
		fetch(`${routeBase}/user/calendario_view_mode/${viewMode}`, {
			method: "POST",
		})
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
			});
	}, [viewMode]);

	const handleViewChange = (viewMode) => {
		setViewMode(viewMode);
	};

	const handleModalClose = () => {
		postModalDispatch({
			type: "CLOSE",
		});
	};

	return (
		<div className="calendario">
			<Header
				calendarRefs={calendarRefs}
				viewMode={viewMode}
				maxViewMonths={maxViewMonths}
				onViewChange={handleViewChange}
			/>
			<PostModalContext.Provider value={{ postModal, postModalDispatch }}>
				<SidebarPostsContext.Provider
					value={{ sidebarPosts, sidebarPostsDispatch }}
				>
					<MainView
						calendarRefs={calendarRefs}
						baseMonth={baseMonth}
						viewMode={viewMode}
						maxViewMonths={maxViewMonths}
						onViewChange={handleViewChange}
						futuremostDate={futuremostDate}
					/>
					<Sidebar />
					{postModal.show ? (
						<PostModal
							post={postModal.post}
							modalClose={handleModalClose}
							calendarRefs={calendarRefs}
						/>
					) : null}
				</SidebarPostsContext.Provider>
			</PostModalContext.Provider>
		</div>
	);
}
