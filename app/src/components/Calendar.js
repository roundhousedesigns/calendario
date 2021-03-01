import React, { useContext, useEffect, useCallback } from "react";
import Day from "./Day";
import DayPosts from "./DayPosts";
import { dateFormat } from "../lib/utils";
import {
	format,
	addDays,
	addMonths,
	startOfWeek,
	endOfWeek,
	isFirstDayOfMonth,
	startOfToday,
} from "date-fns";

import { useFetchScheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

export default function Calendar() {
	const {
		posts: { scheduled, refetch },
		postsDispatch,
	} = useContext(PostsContext);
	const {
		viewOptions: { monthCount, viewRange },
		viewOptionsDispatch,
	} = useContext(ViewContext);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useEffect(() => {
		let today = startOfToday();

		viewOptionsDispatch({
			type: "SET_RANGE",
			start: startOfWeek(today),
			end: endOfWeek(addMonths(today, monthCount)),
		});
	}, [refetch, monthCount, viewOptionsDispatch]);

	const isLoading = useFetchScheduledPosts(viewRange.start, viewRange.end);

	const renderDaysHeaderRow = useCallback(() => {
		const days = [];

		let startDate = startOfWeek(viewRange.start);

		for (let i = 0; i < 7; i++) {
			days.push(
				<div className="col col__center" key={i}>
					{format(addDays(startDate, i), dateFormat.dayName)}
				</div>
			);
		}

		return <div className="days row">{days}</div>;
	}, [viewRange.start]);

	const renderDays = useCallback(() => {
		const rows = [];

		let days = [];
		let day = viewRange.start;
		let firstCalendarDay = true;

		while (day <= viewRange.end) {
			for (let i = 0; i < 7; i++) {
				const dayIsFirstDay =
					isFirstDayOfMonth(day) || firstCalendarDay;

				days.push(
					<Day
						key={day}
						day={day}
						monthName={
							dayIsFirstDay
								? format(day, dateFormat.monthShort)
								: ""
						}
					>
						<DayPosts
							date={day}
							posts={scheduled}
							allowDrag={true}
							renderEmpty={true}
							loadingState={isLoading}
						/>
					</Day>
				);

				firstCalendarDay = false;
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
	}, [viewRange.end, viewRange.start, scheduled, isLoading]);

	const renderCalendar = () => {
		return (
			<>
				{renderDaysHeaderRow()}
				{renderDays()}
			</>
		);
	};

	return (
		<div className="view__calendar">
			{viewRange.start !== null && viewRange.end !== null
				? renderCalendar()
				: null}
		</div>
	);
}
