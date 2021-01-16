import React, { useEffect, useState, useReducer } from "react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import PostModal from "./components/PostModal";
import { useCalendarRefs } from "./lib/hooks";
import { routeBase, getThisMonth } from "./lib/utils";

import SidebarPostsContext, {
	sidebarPostsReducer,
} from "./context/SidebarPosts";
import PostModalContext, { postModalReducer } from "./context/PostModal";
import CalendarContext from "./context/Calendar";

import "./App.css";

const maxViewMonths = 3;

export default function App() {
	const baseMonth = getThisMonth();
	const [viewMode, setViewMode] = useState("3");
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

	const calendarRefs = useCalendarRefs(maxViewMonths);

	useEffect(() => {
		fetch(`${routeBase}/posts/unscheduled`)
			.then((response) => response.json())
			.then((data) => {
				sidebarPostsDispatch({
					type: "POPULATE",
					events: data,
				});
			});

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
			<CalendarContext.Provider value={calendarRefs}>
				<Header
					viewMode={viewMode}
					maxViewMonths={maxViewMonths}
					onViewChange={handleViewChange}
				/>
				<PostModalContext.Provider
					value={{ postModal, postModalDispatch }}
				>
					<SidebarPostsContext.Provider
						value={{ sidebarPosts, sidebarPostsDispatch }}
					>
						<MainView
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
							/>
						) : null}
					</SidebarPostsContext.Provider>
				</PostModalContext.Provider>
			</CalendarContext.Provider>
		</div>
	);
}
