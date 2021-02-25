import React, { useContext, useEffect } from "react";
import CalendarListHeader from "./CalendarListHeader";
import DayPosts from "./DayPosts";
import {
	format,
	addMonths,
	addDays,
	endOfDay,
	parseISO,
	startOfToday,
} from "date-fns";

import { dateFormat } from "../lib/utils";
import { useFetchScheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

export default function List() {
	const {
		posts: { scheduled, refetch, dateRange },
		postsDispatch,
	} = useContext(PostsContext);

	//TODO Maybe split this into a separate monthCount for list and calendar (currently shared value)?
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
		// Set the fetch range
		let today = startOfToday();

		viewOptionsDispatch({
			type: "SET_RANGE",
			start: today,
			end: addMonths(today, monthCount),
		});
	}, [refetch, monthCount, viewOptionsDispatch]);

	const renderCalendarHeader = () => {
		return (
			<CalendarListHeader start={viewRange.start} end={viewRange.end} />
		);
	};

	useFetchScheduledPosts(viewRange.start, viewRange.end);

	const renderDays = () => {
		let days = [];
		let day = parseISO(dateRange.start);

		if (
			dateRange.end !== "undefined" &&
			dateRange.end !== null &&
			dateRange.end
		) {
			while (endOfDay(day) <= endOfDay(new Date(dateRange.end))) {
				days.push(
					<DayPosts
						key={day}
						date={day}
						posts={scheduled}
						renderEmpty={false}
						allowDrag={true}
						title={format(day, dateFormat.fullDate)}
					/>
				);

				day = addDays(day, 1);
			}
		}

		return days;
	};

	return (
		<div className="view view__list">
			{renderCalendarHeader()}
			{renderDays()}
		</div>
	);
}
