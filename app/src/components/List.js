import React, { useContext, useEffect } from "react";
import DayPosts from "./DayPosts";
import { format, addDays, endOfDay, parseISO } from "date-fns";
import { routeBase, dateFormat } from "../lib/utils";

import PostsContext from "../PostsContext";

export default function List() {
	const {
		posts: { scheduled, refetch, dateRange },
		postsDispatch,
	} = useContext(PostsContext);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useEffect(() => {
		let today = new Date();
		let startDate = format(addDays(today, 1), dateFormat.date); // Start from tomorrow

		let url = `${routeBase}/scheduled/${startDate}`;
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
	}, [postsDispatch, refetch]);

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
						allowDrop={true} // TODO remove this prop probably from everywhere
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
			<header className="header">
				<h3 className="viewTitle">Upcoming Posts </h3>
			</header>

			{renderDays()}
		</div>
	);
}
