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

const initialDateRange = {
	start: new Date(),
	end: new Date(),
	firstOfMonth: startOfMonth(new Date()),
};

function dateRangeReducer(state, action) {
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
			return initialDateRange;

		default:
			return state;
	}
}

export default function Calendar() {
	const {
		posts: { scheduled, refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [dateRange, dateRangeDispatch] = useReducer(
		dateRangeReducer,
		initialDateRange
	);
	const {
		viewOptions: { monthCount },
	} = useContext(ViewContext);

	useEffect(() => {
		dateRangeDispatch({
			type: "START",
			start: startOfWeek(startOfMonth(new Date())),
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
		const firstOfViewMonth = startOfMonth(dateRange.start);
		const lastOfViewMonth = endOfMonth(
			addMonths(firstOfViewMonth, monthCount)
		);
		const endDate = endOfWeek(lastOfViewMonth);

		// Calculate the end date whenever dateRange.start or monthCount updates!
		dateRangeDispatch({
			type: "END",
			end: endDate,
		});
	}, [refetch, dateRange.start, monthCount]);

	useEffect(() => {
		if (dateRange.start !== null && dateRange.end !== null) {
			let startDate = format(dateRange.start, dateFormat.date);
			let endDate = format(dateRange.end, dateFormat.date);
			let url = `${routeBase}/scheduled/${startDate}/${endDate}`;
			const fetchData = async () => {
				try {
					const res = await fetch(url);
					const data = await res.json();

					postsDispatch({
						type: "SET",
						posts: data,
						unscheduled: false,
					});
				} catch (error) {
					console.log("REST error", error.message);
				}
			};

			fetchData();
		}
	}, [postsDispatch, dateRange.start, dateRange.end]);

	const nextMonth = () => {
		dateRangeDispatch({
			type: "NEXT_MONTH",
		});
	};

	const prevMonth = () => {
		dateRangeDispatch({
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

		let startDate = startOfWeek(dateRange.start);

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
		let day = dateRange.start;
		let formattedDate = {};

		while (day <= dateRange.end) {
			for (let i = 0; i < 7; i++) {
				const dayIsFirstDay = isFirstDayOfMonth(day);
				const dayIsToday = isToday(day);
				const dayIsPast = isPast(day);

				// even/odd month
				// if (dayIsFirstDay) {
				// 	isMonthEven = !isMonthEven;
				// }

				formattedDate = {
					day: format(day, dateFormat.day),
					date: format(day, dateFormat.date),
				};

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
						dayNumber={formattedDate.day}
						monthName={
							dayIsFirstDay
								? format(day, dateFormat.monthName)
								: ""
						}
					>
						<DayPosts date={day} posts={scheduled} />
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
	}, [dateRange.end, dateRange.start, scheduled]);

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
