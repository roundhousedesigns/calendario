import React, { useReducer, useEffect } from "react";
import CalendarArea from "./CalendarArea";
import Sidebar from "./Sidebar/Sidebar";
import { routeBase } from "../../lib/utils";

import SidebarPostsContext, {
	sidebarPostsReducer,
} from "./SidebarPostsContext";

const Main = ({
	viewMode,
	viewMonthCount,
	maxViewMonths,
	handleViewChange,
}) => {
	const [sidebarPosts, sidebarPostsDispatch] = useReducer(
		sidebarPostsReducer,
		{
			events: [],
		}
	);

	useEffect(() => {
		fetch(`${routeBase}/posts/unscheduled`)
			.then((response) => response.json())
			.then((data) => {
				sidebarPostsDispatch({
					type: "POPULATE",
					events: data,
				});
			});
	}, []);

	return (
		<SidebarPostsContext.Provider
			value={{ sidebarPosts, sidebarPostsDispatch }}
		>
			<CalendarArea
				viewMode={viewMode}
				viewMonthCount={viewMonthCount}
				maxViewMonths={maxViewMonths}
				onViewChange={handleViewChange}
			/>

			<Sidebar />
		</SidebarPostsContext.Provider>
	);
};

export default Main;
