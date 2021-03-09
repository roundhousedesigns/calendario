import React, { useContext } from "react";
import FieldGroup from "./common/FieldGroup";

import ViewContext from "../ViewContext";

export default function ViewOptions() {
	const {
		viewOptions: { viewMode },
		viewOptionsDispatch,
	} = useContext(ViewContext);

	const handleViewModeChange = (e) => {
		viewOptionsDispatch({
			type: "UPDATE",
			viewMode: e.target.value,
		});
	};

	return (
		<div className="viewOptions">
			{/* <FieldGroup name="jumpToToday">
					<button
						onClick={handleToday}
						disabled={
							startOfDay(start) === startOfToday() ||
							isSameWeek(start, startOfToday())
						}
					>
						Jump to Today
					</button>
				</FieldGroup> */}
			<FieldGroup name="viewMode">
				<button
					onClick={handleViewModeChange}
					className={`icon ${
						viewMode === "calendar" ? "active " : "inactive"
					}`}
					value="calendar"
					title="Calendar"
				>
					calendar_view_month
				</button>
				<button
					name="viewMode"
					onClick={handleViewModeChange}
					className={`icon ${
						viewMode === "list" ? "active " : "inactive"
					}`}
					value="list"
					title="List"
				>
					view_list
				</button>
			</FieldGroup>
		</div>
	);
}
