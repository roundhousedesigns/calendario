import React, { useContext, useEffect } from "react";
import DayPosts from "./DayPosts";
import { dateFormat } from "../lib/utils";
import {
	format,
	addMonths,
	addDays,
	endOfDay,
	startOfToday,
	isToday,
	isPast,
} from "date-fns";

import { useFetchScheduledPosts } from "../lib/hooks";

import PostsContext from "../PostsContext";
import ViewContext from "../ViewContext";

export default function List({ className }) {
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
		// Set the fetch range
		let today = startOfToday();

		viewOptionsDispatch({
			type: "SET_RANGE",
			start: today,
			end: addMonths(today, monthCount),
		});
	}, [refetch, monthCount, viewOptionsDispatch]);

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
				<div className="view__list__days">
					<ul>{renderDays()}</ul>
				</div>
			</>
		);
	};

	return (
		<div className={className}>
			{viewRange.start !== null && viewRange.end !== null
				? renderList()
				: null}
		</div>
	);
}
