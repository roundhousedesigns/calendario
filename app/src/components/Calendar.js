import React, { useState, useContext } from "react";
import {
	format,
	isSameMonth,
	isPast,
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
import DayPosts from "./DayPosts";
import { dateFormat } from "../lib/utils";

import PostsContext from "../PostsContext";

// TODO BIG FUCKING ONE Add months to the calendar somehow
export default function Calendar() {
	const { posts } = useContext(PostsContext);
	const [currentMonth, setCurrentMonth] = useState(new Date());

	function renderHeader() {
		return (
			<div className="header row flex-middle">
				<div className="col col__start">
					<div className="icon" onClick={prevMonth}>
						chevron_left
					</div>
				</div>
				<div className="col col__center">
					<span>{format(currentMonth, dateFormat.header)}</span>
				</div>
				<div className="col col__end" onClick={nextMonth}>
					<div className="icon">chevron_right</div>
				</div>
			</div>
		);
	}

	function renderDays() {
		const days = [];

		let startDate = startOfWeek(currentMonth);

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
		const firstOfMonth = startOfMonth(currentMonth);
		const lastOfMonth = endOfMonth(firstOfMonth);
		const startDate = startOfWeek(firstOfMonth);
		const endDate = endOfWeek(lastOfMonth);

		const rows = [];

		let days = [];
		let day = startDate;
		let formattedDate = {};

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				formattedDate = {
					day: format(day, dateFormat.day),
					date: format(day, dateFormat.date),
				};

				var classes = [];
				if (isToday(day)) {
					classes.push("today");
				}
				if (isPast(day) && !isToday(day)) {
					classes.push("past");
				}
				if (!isSameMonth(day, firstOfMonth)) {
					classes.push("outsideMonth");
				}

				days.push(
					<Day
						className={`col cell ${classes.join(" ")}`}
						key={day}
						day={day}
						dayNumber={formattedDate.day}
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

	const nextMonth = () => {
		setCurrentMonth(addMonths(currentMonth, 1));
	};

	const prevMonth = () => {
		setCurrentMonth(subMonths(currentMonth, 1));
	};

	return (
		<div className="calendar calendario__main">
			{renderHeader()}
			{renderDays()}
			{renderCells()}
		</div>
	);
}
