import React, { useContext, useCallback } from 'react';
import Day from './Day';
import DayPosts from './DayPosts';
import { useFetchScheduledPosts } from '../lib/hooks';
import { dateFormat, dayKey } from '../lib/utils';
import {
	format,
	addDays,
	startOfWeek,
	isFirstDayOfMonth,
	isToday,
} from 'date-fns';

import PostsContext from '../PostsContext';
import ViewContext from '../ViewContext';

export default function Calendar({ className, todayRef }) {
	const { posts, postsDispatch } = useContext(PostsContext);
	const {
		viewOptions: { viewRange },
	} = useContext(ViewContext);

	const { scheduled } = posts;

	useFetchScheduledPosts(viewRange.start, viewRange.end, posts, postsDispatch);

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

		while (day < viewRange.end) {
			for (let i = 0; i < 7; i++) {
				const dayIsFirstDay = isFirstDayOfMonth(day) || firstCalendarDay;

				days.push(
					<Day
						key={day}
						ref={isToday(day) ? todayRef : null}
						day={day}
						monthName={dayIsFirstDay ? format(day, dateFormat.monthShort) : ''}
					>
						<DayPosts
							date={day}
							posts={scheduled[dayKey(day)]}
							allowDrag={true}
							renderEmpty={true}
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
	}, [viewRange.end, viewRange.start, scheduled, todayRef]);

	const renderCalendar = () => {
		return (
			<div className="view__calendar__inner">
				{renderDaysHeaderRow()}
				{renderDays()}
			</div>
		);
	};

	return (
		<div className={className}>
			{viewRange.start !== null && viewRange.end !== null
				? renderCalendar()
				: null}
		</div>
	);
}
