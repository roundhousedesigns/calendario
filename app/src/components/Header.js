import React, { useContext } from "react";
import CalendarContext from "../context/Calendar";
import { getThisMonth, addMonths } from "../lib/utils";

const Header = ({
	viewMode,
	maxViewMonths,
	viewMonthCount,
	onViewChange,
	onViewMonthCountChange,
}) => {
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

	const handleViewChange = (e) => {
		onViewChange(e.target.value);
	};

	const handleViewMonthCountChange = (e) => {
		onViewMonthCountChange(e.target.value);
	};

	return (
		<header className="calendario-header">
			<h1 className="page-title">Calendario II: The Datening</h1>

			{viewMode !== "list" ? (
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
			) : null}

			<div className="view-mode">
				<label>Calendar</label>
				<input
					type="radio"
					value="calendar"
					name="view-mode"
					onChange={handleViewChange}
					checked={viewMode === "calendar"}
				/>

				<label>List</label>
				<input
					type="radio"
					value="list"
					name="view-mode"
					onChange={handleViewChange}
					checked={viewMode === "list"}
				/>
			</div>
			{viewMode === "calendar" ? (
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
			) : (
				""
			)}
		</header>
	);
};

export default Header;
