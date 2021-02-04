import React, { useReducer } from "react";
import CalendarArea from "./CalendarArea";
import Sidebar from "../Sidebar/Sidebar";
import PostModal from "../PostModal";

import PostModalContext, { postModalReducer } from "../../PostModalContext";

import SidebarPostsContext, {
	sidebarPostsReducer,
} from "../SidebarPostsContext";

const Main = ({
	viewMode,
	viewMonthCount,
	maxViewMonths,
	handleViewChange,
}) => {
	const [postModal, postModalDispatch] = useReducer(postModalReducer, {
		show: false,
		post: {},
	});

	const [sidebarPosts, sidebarPostsDispatch] = useReducer(
		sidebarPostsReducer,
		{
			events: [],
		}
	);

	const handleModalClose = () => {
		postModalDispatch({
			type: "CLOSE",
		});
	};

	return (
		<PostModalContext.Provider value={{ postModal, postModalDispatch }}>
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

				{postModal.show ? (
					<PostModal
						post={postModal.post}
						modalClose={handleModalClose}
					/>
				) : null}
			</SidebarPostsContext.Provider>
		</PostModalContext.Provider>
	);
};

export default Main;
