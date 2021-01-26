import React, { useReducer } from "react";
import CalendarArea from "./CalendarArea";
import Sidebar from "./Sidebar/Sidebar";

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
