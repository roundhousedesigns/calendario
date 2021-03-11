import { forwardRef, useContext, useEffect } from "react";
import ViewOptions from "./ViewOptions";
import DatePicker from "react-datepicker";
import { addDays, startOfToday, startOfMonth, endOfMonth } from "date-fns";

import ViewContext from "../ViewContext";
import { dateFormat } from "../lib/utils";

export default function MainHeader() {
	const {
		viewOptions: { viewRange },
		viewMode,
		viewOptionsDispatch,
	} = useContext(ViewContext);

	const DateInput = forwardRef(({ value, onClick }, ref) => (
		<button className="viewRange__input" onClick={onClick} ref={ref}>
			{value}
		</button>
	));

	useEffect(() => {
		// set a sensible default range
		if (!viewRange.start && !viewRange.end) {
			let today = startOfToday();

			viewOptionsDispatch({
				type: "SET_RANGE",
				start: viewMode === "calendar" ? startOfMonth(today) : today,
				end:
					viewMode === "calendar" ? endOfMonth() : addDays(today, 30),
			});
		}
	}, [viewRange.start, viewRange.end, viewMode, viewOptionsDispatch]);

	const nextMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: "NEXT_MONTH" });
	};

	const prevMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: "PREV_MONTH" });
	};

	return (
		<div className="calendarListHeader row flex-middle">
			<div className="col col__start">
				<button className="icon dateChevron" onClick={prevMonth}>
					chevron_left
				</button>
			</div>
			<div className="col col__center">
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
			</div>
			<div className="col col__end">
				<button className="icon dateChevron" onClick={nextMonth}>
					chevron_right
				</button>
			</div>
		</div>
	);
}
