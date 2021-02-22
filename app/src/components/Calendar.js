// TODO Refactor or subdivide this component further
import React, { useReducer, useContext, useEffect, useCallback } from "react";
import Day from "./Day";
import DayPosts from "./DayPosts";
import {
	format,
	isPast,
	isToday,
	addDays,
	addMonths,
	subMonths,
	startOfWeek,
	startOfMonth,
	endOfMonth,
	endOfWeek,
	isFirstDayOfMonth,
} from "date-fns";

import { dateFormat, routeBase } from "../lib/utils";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

const initialCalendarDates = {
	start: new Date(),
	end: new Date(),
	firstOfMonth: startOfMonth(new Date()),
};

function calendarDatesReducer(state, action) {
	switch (action.type) {
		case "START":
			return {
				...state,
				start: action.start,
				firstOfMonth: action.firstOfMonth,
			};

		case "END":
			return {
				...state,
				end: action.end,
			};

		case "NEXT_MONTH":
			let nextMonth = startOfMonth(addMonths(state.firstOfMonth, 1));

			return {
				...state,
				start: startOfWeek(nextMonth),
				firstOfMonth: nextMonth,
			};

		case "PREV_MONTH":
			let prevMonth = startOfMonth(subMonths(state.firstOfMonth, 1));

			return {
				...state,
				start: startOfWeek(prevMonth),
				firstOfMonth: prevMonth,
			};

		case "RESET":
			return initialCalendarDates;

		default:
			return state;
	}
}

export default function Calendar() {
	const {
		posts: { scheduled, refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [calendarDates, calendarDatesDispatch] = useReducer(
		calendarDatesReducer,
		initialCalendarDates
	);
	const {
		viewOptions: { monthCount },
	} = useContext(ViewContext);

	useEffect(() => {
		calendarDatesDispatch({
			type: "START",
			start: startOfWeek(startOfMonth(new Date())), // make this the first day viewed on the calendar, not necessarily always going to be 1st of month
			firstOfMonth: startOfMonth(new Date()),
		});
	}, []);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useEffect(() => {
		// Set the fetch range
		const firstOfViewMonth = startOfMonth(calendarDates.start);
		const lastOfViewMonth = endOfMonth(
			addMonths(firstOfViewMonth, monthCount)
		);
		const endDate = endOfWeek(lastOfViewMonth);

		// Calculate the end date whenever calendarDates.start or monthCount updates!
		calendarDatesDispatch({
			type: "END",
			end: endDate,
		});
	}, [refetch, calendarDates.start, monthCount]);

	useEffect(() => {
		if (calendarDates.start !== null && calendarDates.end !== null) {
			let startDate = format(calendarDates.start, dateFormat.date);
			let endDate = format(calendarDates.end, dateFormat.date);
			let url = `${routeBase}/scheduled/${startDate}/${endDate}`;
			const fetchData = async () => {
				try {
					const res = await fetch(url);
					const data = await res.json();

					postsDispatch({
						type: "SET_SCHEDULED",
						posts: data.posts,
						start: data.dateRange.start,
						end: data.dateRange.end,
					});
				} catch (error) {
					console.log("REST error", error.message);
				}
			};

			fetchData();
		}
	}, [postsDispatch, calendarDates.start, calendarDates.end]);

	const nextMonth = () => {
		calendarDatesDispatch({
			type: "NEXT_MONTH",
		});
	};

	const prevMonth = () => {
		calendarDatesDispatch({
			type: "PREV_MONTH",
		});
	};

	const renderCalendarHeader = () => {
		return (
			<div className="header row flex-middle">
				<div className="col col__start">
					<div className="icon" onClick={prevMonth}>
						chevron_left
					</div>
				</div>
				<div className="col col__center">
					<h3 className="viewTitle">Scheduled Posts</h3>
				</div>
				<div className="col col__end" onClick={nextMonth}>
					<div className="icon">chevron_right</div>
				</div>
			</div>
		);
	};

	const renderDaysHeaderRow = () => {
		const days = [];

		let startDate = startOfWeek(calendarDates.start);

		for (let i = 0; i < 7; i++) {
			days.push(
				<div className="col col__center" key={i}>
					{format(addDays(startDate, i), dateFormat.dayName)}
				</div>
			);
		}

		return <div className="days row">{days}</div>;
	};

	const renderDays = useCallback(() => {
		const rows = [];

		let days = [];
		let day = calendarDates.start;
		let formattedDay;

		while (day <= calendarDates.end) {
			for (let i = 0; i < 7; i++) {
				const dayIsFirstDay = isFirstDayOfMonth(day);
				const dayIsToday = isToday(day);
				const dayIsPast = isPast(day);

				// even/odd month
				// if (dayIsFirstDay) {
				// 	isMonthEven = !isMonthEven;
				// }

				formattedDay = format(day, dateFormat.day);

				var classes = [];
				if (dayIsToday) {
					classes.push("today");
				}
				// else {
				// 	classes.push(isMonthEven ? "even" : "odd");
				// }

				if (dayIsPast && !dayIsToday) {
					classes.push("past");
				}

				days.push(
					<Day
						className={`col cell ${classes.join(" ")}`}
						key={day}
						day={day}
						dayNumber={formattedDay}
						monthName={
							dayIsFirstDay
								? format(day, dateFormat.monthName)
								: ""
						}
					>
						<DayPosts
							date={day}
							posts={scheduled}
							allowDrag={true}
							renderEmpty={true}
						/>
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
	}, [calendarDates.end, calendarDates.start, scheduled]);

	return (
		<div>
			<div className="view view__calendar">
				{renderCalendarHeader()}
				{renderDaysHeaderRow()}
				{renderDays()}
			</div>
			<div style={{ textAlign: "center" }}>
				Maybe a big + to add a month?
			</div>
		</div>
	);
}
