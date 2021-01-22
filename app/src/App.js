import React, { useEffect, useState, useReducer } from "react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar/Sidebar";
import PostModal from "./components/PostModal";
import { useCalendarRefs, useStickyState } from "./lib/hooks";
import { routeBase, getThisMonth } from "./lib/utils";

import SidebarPostsContext, {
	sidebarPostsReducer,
} from "./context/SidebarPosts";
import PostModalContext, { postModalReducer } from "./context/PostModal";
import CalendarContext from "./context/Calendar";

const maxViewMonths = 6;

export default function App() {
	const baseMonth = getThisMonth();
	const [viewMode, setViewMode] = useStickyState("calendar", "viewMode");
	const [viewMonthCount, setViewMonthCount] = useStickyState(
		3,
		"viewMonthCount"
	);
	const [today, setToday] = useState(new Date());
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

	const calendarRefs = useCalendarRefs(viewMonthCount);

	useEffect(() => {
		let today = new Date();
		today.setHours(0, 0, 0);
		setToday(today);
	}, []);

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
	}, []);

	const handleViewChange = (viewMode) => {
		setViewMode(viewMode);
	};

	const handleViewMonthCountChange = (viewMonthCount) => {
		setViewMonthCount(
			viewMonthCount > maxViewMonths ? maxViewMonths : viewMonthCount
		);
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
					viewMonthCount={viewMonthCount}
					maxViewMonths={maxViewMonths}
					onViewChange={handleViewChange}
					onViewMonthCountChange={handleViewMonthCountChange}
				/>
				<PostModalContext.Provider
					value={{ postModal, postModalDispatch }}
				>
					<SidebarPostsContext.Provider
						value={{ sidebarPosts, sidebarPostsDispatch }}
					>
						<MainView
							baseMonth={baseMonth}
							today={today}
							viewMode={viewMode}
							viewMonthCount={viewMonthCount}
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
