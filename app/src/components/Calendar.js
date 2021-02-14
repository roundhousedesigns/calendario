import React, { useState, useContext } from "react";
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
import Day from "./Day";
import DayPosts from "./DayPosts";
import { dateFormat } from "../lib/utils";

import PostsContext from "../PostsContext";

export default function Calendar() {
	const { posts } = useContext(PostsContext);
	const [startMonth, setStartMonth] = useState(new Date());

	const nextMonth = () => setStartMonth(addMonths(startMonth, 1));
	const prevMonth = () => setStartMonth(subMonths(startMonth, 1));

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
						{format(startMonth, dateFormat.monthName)}{" "}
						{format(startMonth, dateFormat.year)}
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

		let startDate = startOfWeek(startMonth);

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
		const firstOfViewMonth = startOfMonth(startMonth);
		const lastOfViewMonth = endOfMonth(
			addMonths(firstOfViewMonth, posts.monthCount - 1)
		);
		const startDate = startOfWeek(firstOfViewMonth);
		const endDate = endOfWeek(lastOfViewMonth);
		let isMonthEven = false;

		const rows = [];

		let days = [];
		let day = startDate;
		let formattedDate = {};

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const dayIsFirstDay = isFirstDayOfMonth(day);
				const dayIsToday = isToday(day);
				const dayIsPast = isPast(day);

				formattedDate = {
					day: format(day, dateFormat.day),
					date: format(day, dateFormat.date),
				};

				var classes = [];
				if (dayIsToday) {
					classes.push("today");
				} else {
					classes.push(isMonthEven && !dayIsToday ? "even" : "odd");
				}
				if (dayIsPast && !dayIsToday) {
					classes.push("past");
				}

				// Ranges
				if (
					isAfter(day, lastOfViewMonth) ||
					isBefore(day, firstOfViewMonth)
				) {
					classes.push("outsideMonth");
				} else {
					classes.push("insideMonth");
				}

				// even/odd month
				if (dayIsFirstDay && !dayIsPast) {
					isMonthEven = !isMonthEven;
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
						<DayPosts date={day} posts={posts.scheduled} />
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
		<div className="calendario__main">
			<div className="calendar">
				{renderHeader()}
				{renderDays()}
				{renderCells()}
			</div>
		</div>
	);
}
