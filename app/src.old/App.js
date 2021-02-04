import React from "react";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { useCalendarRefs, useStickyState } from "./lib/hooks";
import CalendarContext from "./CalendarContext";

const maxViewMonths = 6;

export default function App() {
	const [viewMonthCount, setViewMonthCount] = useStickyState(
		3,
		"viewMonthCount"
	);

	const calendarRefs = useCalendarRefs(viewMonthCount);

	const handleViewMonthCountChange = (viewMonthCount) => {
		setViewMonthCount(
			viewMonthCount > maxViewMonths ? maxViewMonths : viewMonthCount
		);
	};

	return (
		<div className="calendario">
			<CalendarContext.Provider value={calendarRefs}>
				<Header
					viewMonthCount={viewMonthCount}
					maxViewMonths={maxViewMonths}
					onViewMonthCountChange={handleViewMonthCountChange}
				/>

				<Main
					viewMonthCount={viewMonthCount}
					maxViewMonths={maxViewMonths}
				/>
			</CalendarContext.Provider>
		</div>
	);
}
