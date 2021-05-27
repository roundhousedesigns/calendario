import { forwardRef, useContext, useEffect, useState } from "react";
import ViewOptions from "./ViewOptions";
import DatePicker from "react-datepicker";
import { addDays, startOfToday, startOfMonth, endOfMonth } from "date-fns";

import ViewContext from "../ViewContext";
import PostsContext from "../PostsContext";
import { dateFormat, dateIsBetween } from "../lib/utils";

export default function MainHeader({ handleTodayClick }) {
	const {
		viewOptions: { viewRange },
		viewMode,
		viewOptionsDispatch,
	} = useContext(ViewContext);
	const { postsDispatch } = useContext(PostsContext);
	const [todayInRange, setTodayInRange] = useState(true);

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
				type: "SET_RANGE",
				start: viewMode === "calendar" ? startOfMonth(today) : today,
				end:
					viewMode === "calendar" ? endOfMonth() : addDays(today, 30),
			});
		}
	}, [today, viewRange.start, viewRange.end, viewMode, viewOptionsDispatch]);

	const nextMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: "NEXT_MONTH" });
	};

	const prevMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: "PREV_MONTH" });
	};

	const handleRefreshClick = () => {
		postsDispatch({
			type: "REFETCH",
		});
	};

	return (
		<div className="calendarListHeader row flex-middle">
			<div className="col col__start">
				<button
					className="icon dateChevron"
					onClick={prevMonth}
					title="Previous Month"
				>
					chevron_left
				</button>
			</div>
			<div className="col col__center mainViewOptions">
				<div className={`controlButtons`}>
					<button
						className={`icon today todayButton ${
							todayInRange ? "hidden" : "visible"
						}`}
						onClick={handleTodayClick}
						title="Jump to Today"
					>
						today
					</button>
				</div>
				<div className="viewRange">
					<DatePicker
						dateFormat={dateFormat.daylessDate}
						selected={viewRange.start}
						onChange={(date) =>
							viewOptionsDispatch({
								type: `SET_RANGE_START`,
								date,
							})
						}
						customInput={<DateInput />}
						selectsStart
						startDate={viewRange.start}
						endDate={viewRange.end}
						closeOnScroll={(e) => e.target === document}
					/>
					{" to "}
					<DatePicker
						dateFormat={dateFormat.daylessDate}
						selected={viewRange.end}
						onChange={(date) =>
							viewOptionsDispatch({
								type: `SET_RANGE_END`,
								date,
							})
						}
						customInput={<DateInput />}
						selectsEnd
						startDate={viewRange.start}
						endDate={viewRange.end}
						minDate={viewRange.start}
						monthsShown={2}
						closeOnScroll={(e) => e.target === document}
					/>
				</div>
				<ViewOptions />
				<button
					className="icon refreshButton"
					onClick={handleRefreshClick}
					title="Refresh Posts"
				>
					sync
				</button>
			</div>
			<div className="col col__end">
				<button
					className="icon dateChevron"
					onClick={nextMonth}
					title="Next Month"
				>
					chevron_right
				</button>
			</div>
		</div>
	);
}
