import React, { useContext, useEffect } from "react";
import CalendarListHeader from "./CalendarListHeader";
import DayPosts from "./DayPosts";
import {
	format,
	addMonths,
	addDays,
	endOfDay,
	startOfToday,
	isToday,
	isPast,
} from "date-fns";

import { dateFormat } from "../lib/utils";
import { useFetchScheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

export default function List() {
	const {
		posts: { scheduled, refetch },
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
		let day = viewRange.start;
		let classes = ["listDay"];

		if (viewRange.end !== "undefined" && viewRange.end !== null) {
			while (endOfDay(day) <= endOfDay(viewRange.end)) {
				if (isToday(day)) {
					classes.push("today");
				}
				if (isPast(day) && !isToday(day)) {
					classes.push("past");
				}
				days.push(
					<li key={day} className={classes.join(" ")}>
						<DayPosts
							date={day}
							posts={scheduled}
							allowDrag={true}
							title={format(day, dateFormat.fullDate)}
							newPostButton={true}
						/>
					</li>
				);

				day = addDays(day, 1);
			}
		}

		return days;
	};

	const renderList = () => {
		return (
			<>
				{renderCalendarHeader()}
				<div className="view__list__days">
					<ul>{renderDays()}</ul>
				</div>
			</>
		);
	};

	return (
		<div className="view view__list">
			{viewRange.start !== null && viewRange.end !== null
				? renderList()
				: null}
		</div>
	);
}
