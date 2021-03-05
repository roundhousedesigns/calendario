import React, { useContext } from "react";
import StatusFilters from "./StatusFilters";
import FieldGroup from "./common/FieldGroup";
import {
	startOfToday,
	startOfDay,
	startOfWeek,
	isSameWeek,
	addMonths,
} from "date-fns";

import ViewContext from "../ViewContext";

export default function ViewOptions() {
	const {
		viewOptions: { viewMode, monthCount, viewRange },
		viewOptionsDispatch,
	} = useContext(ViewContext);

	const handleToday = () => {
		let today = startOfToday();

		viewOptionsDispatch({
			type: "SET_RANGE",
			start: viewMode === "calendar" ? startOfWeek(today) : today,
			end: addMonths(today, monthCount),
		});
	};

	const handleMonthCountChange = (e) => {
		viewOptionsDispatch({
			type: "UPDATE_OPTION",
			monthCount: e.target.value,
		});
	};

	const handleViewModeChange = (e) => {
		viewOptionsDispatch({
			type: "UPDATE_OPTION",
			viewMode: e.target.value,
		});
	};

	return (
		<div className="viewOptions">
			<StatusFilters />
			<div className="dateOptions">
				<FieldGroup name="jumpToToday">
					<button
						onClick={handleToday}
						disabled={
							startOfDay(viewRange.start) === startOfToday() ||
							isSameWeek(viewRange.start, startOfToday())
						}
					>
						Jump to Today
					</button>
				</FieldGroup>
				<FieldGroup name="viewMode">
					<button
						onClick={handleViewModeChange}
						className={
							viewMode === "calendar" ? "active " : "inactive"
						}
						value="calendar"
					>
						Calendar
					</button>
					<button
						name="viewMode"
						onClick={handleViewModeChange}
						className={viewMode === "list" ? "active " : "inactive"}
						value="list"
					>
						List
					</button>
				</FieldGroup>
				<FieldGroup name="monthCount" label="Months" inlineLabel={true}>
					<input
						type="number"
						min={1}
						value={monthCount}
						onChange={handleMonthCountChange}
						className="mini"
					/>
				</FieldGroup>
			</div>
		</div>
	);
}
