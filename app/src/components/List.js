import React, { useContext, useReducer, useEffect } from "react";
import CalendarListHeader from "./CalendarListHeader";
import DayPosts from "./DayPosts";
import {
	format,
	addMonths,
	subMonths,
	addDays,
	endOfDay,
	parseISO,
} from "date-fns";

import { dateFormat } from "../lib/utils";
import { useFetchScheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

const initialListDates = {
	start: new Date(),
	end: new Date(),
};

function listDatesReducer(state, action) {
	switch (action.type) {
		case "SET":
			return {
				...state,
				start: action.start,
				end: action.end,
			};

		// case "END":
		// 	return {
		// 		...state,
		// 		end: action.end,
		// 	};

		case "NEXT_MONTH":
			return {
				...state,
				start: addMonths(state.start, 1),
				end: addMonths(state.end, 1),
			};

		case "PREV_MONTH":
			return {
				...state,
				start: subMonths(state.start, 1),
				end: subMonths(state.end, 1),
			};

		case "RESET":
			return initialListDates;

		default:
			return state;
	}
}

export default function List() {
	const {
		posts: { scheduled, refetch, dateRange },
		postsDispatch,
	} = useContext(PostsContext);
	const [listDates, listDatesDispatch] = useReducer(
		listDatesReducer,
		initialListDates
	);
	//TODO Maybe split this into a separate monthCount for list and calendar (currently shared value)?
	const {
		viewOptions: { monthCount },
	} = useContext(ViewContext);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useEffect(() => {
		// Set the fetch range
		let today = new Date();

		listDatesDispatch({
			type: "SET",
			start: today,
			end: addMonths(today, monthCount),
		});
	}, [refetch, monthCount]);

	const renderCalendarHeader = () => {
		return (
			<CalendarListHeader
				start={listDates.start}
				end={listDates.end}
				nextMonth={() =>
					listDatesDispatch({
						type: "NEXT_MONTH",
					})
				}
				prevMonth={() =>
					listDatesDispatch({
						type: "PREV_MONTH",
					})
				}
			/>
		);
	};

	useFetchScheduledPosts(listDates.start, listDates.end);

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
