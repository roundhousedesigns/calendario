// TODO Refactor or subdivide this component further
import React, { useState, useReducer, useContext, useEffect } from "react";
import Day from "./Day";
import DayPosts from "./DayPosts";
import {
	format,
	isPast,
	isBefore,
	isAfter,
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

import {
	dateFormat,
	// isEmptyPost,
	routeBase,
} from "../lib/utils";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

function dateRangeReducer(state, action) {
	switch (action.type) {
		case "START":
			return {
				...state,
				start: action.start,
			};

		case "END":
			return {
				...state,
				end: action.end,
			};

		default:
			return state;
	}
}

export default function Calendar() {
	const {
		posts: { refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const [dateRange, dateRangeDispatch] = useReducer(dateRangeReducer, {
		start: new Date(),
		end: new Date(),
	});
	const [posts, setPosts] = useState([]);
	const {
		viewOptions: { monthCount },
	} = useContext(ViewContext);

	useEffect(() => {
		dateRangeDispatch({
			type: "START",
			start: startOfWeek(startOfMonth(new Date())),
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
			addMonths(firstOfViewMonth, monthCount - 1)
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
					setPosts(data);
				} catch (error) {
					console.log("REST error", error.message);
				}
			};

			fetchData();
		}

		return function cleanup() {
			setPosts([]);
		};
	}, [dateRange.start, dateRange.end]);

	const nextMonth = () =>
		dateRangeDispatch({
			type: "START",
			start: addMonths(dateRange.start, 1),
		});
	const prevMonth = () =>
		dateRangeDispatch({
			type: "START",
			start: subMonths(dateRange.start, 1),
		});

	function renderHeader() {
		return (
			<div className="header row flex-middle">
				<div className="col col__start">
					<div className="icon" onClick={prevMonth}>
						chevron_left
					</div>
				</div>
				<div className="col col__center">
					<span>
						{format(dateRange.start, dateFormat.monthName)}{" "}
						{format(dateRange.start, dateFormat.year)}
					</span>
				</div>
				<div className="col col__end" onClick={nextMonth}>
					<div className="icon">chevron_right</div>
				</div>
			</div>
		);
	}

	function renderDays() {
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
	}

	function renderCells() {
		// TODO sometimes previous incomplete month shows wrong even/odd
		//        (e.g. jan 31 as 1st day of the week of feb 1st, jan 31 and feb 1 are 'odd')
		let isMonthEven = false;

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
				if (dayIsFirstDay && !dayIsPast) {
					isMonthEven = !isMonthEven;
				}

				formattedDate = {
					day: format(day, dateFormat.day),
					date: format(day, dateFormat.date),
				};

				var classes = [];
				if (dayIsToday) {
					classes.push("today");
				} else {
					classes.push(isMonthEven ? "even" : "odd");
				}
				if (dayIsPast && !dayIsToday) {
					classes.push("past");
				}

				// Ranges
				if (
					isAfter(day, dateRange.last) ||
					isBefore(day, dateRange.first)
				) {
					classes.push("outsideMonth");
				} else {
					classes.push("insideMonth");
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
						<DayPosts date={day} posts={posts} />
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

	return (
		<div className="view view__calendar">
			{renderHeader()}
			{renderDays()}
			{renderCells()}
		</div>
	);
}
