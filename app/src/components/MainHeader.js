import { forwardRef, useContext, useEffect, useState } from "react";
// import ViewOptions from "./ViewOptions";
import DatePicker from "react-datepicker";
import { addDays, startOfToday, startOfMonth, endOfMonth } from "date-fns";

import ViewContext from "../ViewContext";
// import PostsContext from "../PostsContext";
import { dateFormat, dateIsBetween } from "../lib/utils";

export default function MainHeader({ handleTodayClick }) {
	const {
		viewOptions: { viewRange },
		viewMode,
		viewOptionsDispatch,
	} = useContext(ViewContext);
	// const { postsDispatch } = useContext(PostsContext);
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
		viewOptionsDispatch({ type: "CHANGE_MONTH", direction: "next" });
	};

	const prevMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: "CHANGE_MONTH", direction: "previous" });
	};

	return (
		<div className="calendarHeaderControls">
			<div className="col col__start">
				<button
					className="icon dateChevron"
					onClick={prevMonth}
					title="Previous Month"
				>
					chevron_left
				</button>
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
						dateFormat={dateFormat.daylessDate}
						selected={viewRange.start}
						onChange={(date) =>
							viewOptionsDispatch({
								type: "SET_RANGE",
								start: date,
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
								type: "SET_RANGE",
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
					/>
				</div>
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
