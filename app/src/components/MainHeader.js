import { forwardRef, useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import {
	isBefore,
	isAfter,
	addWeeks,
	subWeeks,
	addDays,
	startOfToday,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
} from 'date-fns';

import ViewContext from '../ViewContext';
import PostsContext from '../PostsContext';
import { wp, dateFormat } from '../lib/globals';
import { dateIsBetween } from '../lib/utils';

export default function MainHeader({ handleTodayClick }) {
	const {
		viewOptions: { viewRange },
		viewMode,
		viewOptionsDispatch,
	} = useContext(ViewContext);
	const { postsDispatch } = useContext(PostsContext);

	const [todayInRange, setTodayInRange] = useState(true);

	const { daylessDate } = dateFormat;
	const {
		freemius: { pro, dateRangeWeekLimit },
	} = wp;

	const today = startOfToday();

	const DateInput = forwardRef(({ value, onClick }, ref) => (
		<button className="viewRange__input" onClick={onClick} ref={ref}>
			{value}
		</button>
	));

	useEffect(() => {
		const { start, end } = viewRange;
		if (start !== null && end !== null) {
			setTodayInRange(dateIsBetween(new Date(), start, end));
		}
	}, [viewRange]);

	useEffect(() => {
		// set a sensible default range
		if (!viewRange.start && !viewRange.end) {
			viewOptionsDispatch({
				type: 'SET_RANGE',
				start: viewMode === 'calendar' ? startOfMonth(today) : today,
				end: viewMode === 'calendar' ? endOfMonth() : addDays(today, 30),
			});
		}
	}, [today, viewRange.start, viewRange.end, viewMode, viewOptionsDispatch]);

	const nextMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: 'CHANGE_MONTH', direction: 'next' });
		postsDispatch({ type: 'FETCH' });
	};

	const prevMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: 'CHANGE_MONTH', direction: 'previous' });

		postsDispatch({ type: 'FETCH' });
	};

	const isInPlanRange = (date) => {
		// Pro plans skip this limit!
		if (pro) return true;

		const startRange = subWeeks(
			startOfWeek(today, { weekStartsOn: 6 }),
			dateRangeWeekLimit
		);
		const endRange = addWeeks(
			endOfWeek(today, { weekStartsOn: 6 }),
			dateRangeWeekLimit
		);

		return isAfter(date, startRange) && isBefore(date, endRange) ? true : false;
	};

	return (
		<div className="calendarHeaderControls">
			<div className="col col__start">
				{pro ? (
					<button
						className="icon control dateChevron"
						onClick={prevMonth}
						title="Previous Month"
					>
						chevron_left
					</button>
				) : null}
			</div>
			<div className="viewControl">
				<button
					className="today control todayButton"
					onClick={handleTodayClick}
					disabled={todayInRange}
				>
					Today
				</button>
				<div className="viewRange">
					<DatePicker
						dateFormat={daylessDate}
						selected={viewRange.start}
						onChange={(date) =>
							viewOptionsDispatch({
								type: 'SET_RANGE',
								start: date,
							})
						}
						customInput={<DateInput />}
						selectsStart
						startDate={viewRange.start}
						endDate={viewRange.end}
						closeOnScroll={(e) => e.target === document}
						filterDate={isInPlanRange}
					/>
					{' to '}
					<DatePicker
						dateFormat={daylessDate}
						selected={viewRange.end}
						onChange={(date) =>
							viewOptionsDispatch({
								type: 'SET_RANGE',
								end: date,
							})
						}
						customInput={<DateInput />}
						selectsEnd
						startDate={viewRange.start}
						endDate={viewRange.end}
						minDate={viewRange.start}
						monthsShown={2}
						closeOnScroll={(e) => e.target === document}
						filterDate={isInPlanRange}
					/>
				</div>
			</div>
			<div className="col col__end">
				{pro ? (
					<button
						className="icon control dateChevron"
						onClick={nextMonth}
						title="Next Month"
					>
						chevron_right
					</button>
				) : null}
			</div>
		</div>
	);
}
