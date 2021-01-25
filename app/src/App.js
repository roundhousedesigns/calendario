import React, { useReducer } from "react";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import PostModal from "./components/PostModal";
import { useCalendarRefs, useStickyState } from "./lib/hooks";
import PostModalContext, { postModalReducer } from "./PostModalContext";
import CalendarContext from "./CalendarContext";

const maxViewMonths = 6;

export default function App() {
	const [viewMode, setViewMode] = useStickyState("calendar", "viewMode");
	const [viewMonthCount, setViewMonthCount] = useStickyState(
		3,
		"viewMonthCount"
	);

	const [postModal, postModalDispatch] = useReducer(postModalReducer, {
		show: false,
		post: {},
	});

	const calendarRefs = useCalendarRefs(viewMonthCount);

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
					<Main
						viewMode={viewMode}
						viewMonthCount={viewMonthCount}
						maxViewMonths={maxViewMonths}
					/>

					{postModal.show ? (
						<PostModal
							post={postModal.post}
							modalClose={handleModalClose}
						/>
					) : null}
				</PostModalContext.Provider>
			</CalendarContext.Provider>
		</div>
	);
}
