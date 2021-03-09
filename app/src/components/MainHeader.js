import { useContext, useEffect } from "react";
import ViewOptions from "./ViewOptions";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { dateFormat } from "../lib/utils";
import {
	addYears,
	addDays,
	startOfToday,
	startOfMonth,
	endOfMonth,
} from "date-fns";

import ViewContext from "../ViewContext";

import "react-calendar/dist/Calendar.css";

export default function MainHeader() {
	const {
		viewOptions: {
			viewRange: { start, end },
		},
		viewMode,
		viewOptionsDispatch,
	} = useContext(ViewContext);

	useEffect(() => {
		// set a sensible default range
		if (!start && !end) {
			let today = startOfToday();

			viewOptionsDispatch({
				type: "SET_RANGE",
				start: viewMode === "calendar" ? startOfMonth(today) : today,
				end:
					viewMode === "calendar" ? endOfMonth() : addDays(today, 30),
			});
		}
	}, [end, start, viewMode, viewOptionsDispatch]);

	const handleChangeDateRange = (dates) => {
		viewOptionsDispatch({
			type: "SET_RANGE",
			start: dates[0],
			end: dates[1],
		});
	};

	return (
		<div className="calendarListHeader row flex-middle">
			<div className="col col__center">
				{/* <h3 className="viewTitle">Scheduled Posts</h3> */}
				<DateRangePicker
					value={[start, end]}
					onChange={handleChangeDateRange}
					// calendarIcon={<span className="icon">date_range</span>}
					clearIcon={null}
					format={dateFormat.daylessDate}
					required={true}
					// minDetail={"month"}
					// maxDetail={"month"}
					maxDate={addYears(new Date(), 3)}
					showLeadingZeros={false}
					disableCalendar={true}
				/>
				<ViewOptions />
			</div>
		</div>
	);
}
