import React, { useContext } from "react";
import CalendarContext from "../../CalendarContext";
import { getThisMonth, addMonths } from "../../lib/utils";

const CalendarNavigation = ({ maxViewMonths, viewMonthCount, onViewMonthCountChange }) => {
	const calendarRefs = useContext(CalendarContext);

	const nextMonth = () => {
		for (let i = 0; i < viewMonthCount; i++) {
			let calendarApi = calendarRefs[i].current.getApi();

			calendarApi.next();
		}
	};

	const prevMonth = () => {
		for (let i = 0; i < viewMonthCount; i++) {
			let calendarApi = calendarRefs[i].current.getApi();

			calendarApi.prev();
		}
	};

	const thisMonth = () => {
		const today = getThisMonth();

		for (let i = 0; i < viewMonthCount; i++) {
			let calendarApi = calendarRefs[i].current.getApi();

			calendarApi.gotoDate(addMonths(today, i));
		}
	};

	const handleViewMonthCountChange = (e) => {
		onViewMonthCountChange(e.target.value);
	};

	return (
		<div>
			<nav className="calendar-grid-navigation">
				<button className="prev" id="prev" onClick={prevMonth}>
					PREV
				</button>
				<button className="next" id="next" onClick={nextMonth}>
					NEXT
				</button>
				<button className="today" id="today" onClick={thisMonth}>
					TODAY
				</button>
			</nav>

			<div className="view-count">
				<label>{`Months Visible (max ${maxViewMonths}): `}</label>
				<input
					type="number"
					value={viewMonthCount}
					name="view-month-count"
					onChange={handleViewMonthCountChange}
					min={1}
					max={6}
				/>
			</div>
		</div>
	);
};

export default CalendarNavigation;
