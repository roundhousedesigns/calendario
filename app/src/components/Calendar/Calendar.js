import React, { useReducer } from "react";
import {
	format,
	isSameMonth,
	isSameDay,
	isToday,
	addDays,
	addMonths,
	subMonths,
	startOfWeek,
	startOfMonth,
	endOfMonth,
	endOfWeek,
} from "date-fns";
import Day from "./Day";
import PostEvent from "./PostEvent";
import "./Calendar.scss";

const events = {
	"02-10-2021": [
		{
			post_title: "Test Post 1",
			post_status: "draft",
			post_date: "02-10-2021", // will be more accurate and have post time, as well
		},
		{
			post_title: "Test Post 2",
			post_status: "future",
			post_date: "02-10-2021", // will be more accurate and have post time, as well
		},
	],
};

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
		const dateFormat = "EEEE";
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

		const dateFormat__Day = "d";
		const dateFormat__Date = "MM-dd-yyyy";
		const rows = [];

		let days = [];
		let day = startDate;
		let formattedDate = {};

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				formattedDate = {
					day: format(day, dateFormat__Day),
					date: format(day, dateFormat__Date),
				};

				// const cloneDay = day;

				days.push(
					<Day
						className={`col cell ${
							!isSameMonth(day, monthStart)
								? "disabled"
								: isSameDay(day, selectedDate)
								? "selected"
								: ""
						} ${isToday(day) ? "today" : ""}`}
						key={day}
						day={day}
						dayNumber={formattedDate.day}
						onClick={onDateClick}
					>
						{formattedDate.date in events
							? events[formattedDate.date].map((post, index) => {
									return (
										<PostEvent post={post} key={index} />
									);
							  })
							: null}
					</Day>
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
