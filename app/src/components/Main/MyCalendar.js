import React, { useReducer } from "react";
import {
	format,
	isSameMonth,
	isSameDay,
	addDays,
	addMonths,
	subMonths,
	startOfWeek,
	startOfMonth,
	endOfMonth,
	endOfWeek,
} from "date-fns";
import { useDrag } from "react-dnd";

import "./MyCalendar.css";

function reducer(state, action) {
	return {
		...state,
		currentMonth: action.currentMonth
			? action.currentMonth
			: state.currentMonth,
		selectedDate: action.selectedDate
			? action.selectedDate
			: state.selectedDate,
	};
}

export default function Calendar() {
	const [dateState, dateDispatch] = useReducer(reducer, {
		currentMonth: new Date(),
		selectedDate: new Date(),
	});

	function renderHeader() {
		const dateFormat = "MMMM yyyy";

		return (
			<div className="header row flex-middle">
				<div className="col col-start">
					<div className="icon" onClick={prevMonth}>
						chevron_left
					</div>
				</div>
				<div className="col col-center">
					<span>{format(dateState.currentMonth, dateFormat)}</span>
				</div>
				<div className="col col-end" onClick={nextMonth}>
					<div className="icon">chevron_right</div>
				</div>
			</div>
		);
	}

	function renderDays() {
		const dateFormat = "dddd";
		const days = [];

		let startDate = startOfWeek(dateState.currentMonth);

		for (let i = 0; i < 7; i++) {
			days.push(
				<div className="col col-center" key={i}>
					{format(addDays(startDate, i), dateFormat)}
				</div>
			);
		}

		return <div className="days row">{days}</div>;
	}

	function renderCells() {
		const { currentMonth, selectedDate } = dateState;
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);

		const dateFormat = "d";
		const rows = [];

		let days = [];
		let day = startDate;
		let formattedDate = "";

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				formattedDate = format(day, dateFormat);
				const cloneDay = day;
				days.push(
					<div
						className={`col cell ${
							!isSameMonth(day, monthStart)
								? "disabled"
								: isSameDay(day, selectedDate)
								? "selected"
								: ""
						}`}
						key={day}
						onClick={() => {
							onDateClick(cloneDay);
						}}
					>
						<span className="number">{formattedDate}</span>
						<span className="bg">{formattedDate}</span>
					</div>
				);
				day = addDays(day, 1);
			}
			rows.push(
				<div className="row" key={day}>
					{days}
				</div>
			);
			days = [];
		}
		return <div className="body">{rows}</div>;
	}

	const onDateClick = (day) => {
		dateDispatch({ selectedDate: day });
	};

	const nextMonth = () => {
		dateDispatch({ currentMonth: addMonths(dateState.currentMonth, 1) });
	};

	const prevMonth = () => {
		dateDispatch({ currentMonth: subMonths(dateState.currentMonth, 1) });
	};

	return (
		<div className="calendar">
			{renderHeader()}
			{renderDays()}
			{renderCells()}
		</div>
	);
}
