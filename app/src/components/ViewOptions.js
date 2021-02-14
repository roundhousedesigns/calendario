import React, { useContext } from "react";
import SidebarInput from "./SidebarInput";

import ViewContext from "../ViewContext";

export default function ViewOptions() {
	const {
		viewOptions: { viewMode, monthCount },
		viewOptionsDispatch,
	} = useContext(ViewContext);

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
			<SidebarInput name="viewMode" label="View Mode">
				<div className="options">
					<label htmlFor="calendar">Calendar</label>
					<input
						type="radio"
						name="viewMode"
						onChange={handleViewModeChange}
						checked={viewMode === "calendar"}
						value="calendar"
					/>
					<label htmlFor="list">List</label>
					<input
						type="radio"
						name="viewMode"
						onChange={handleViewModeChange}
						checked={viewMode === "list"}
						value="list"
					/>
				</div>
			</SidebarInput>
			{viewMode === "calendar" ? (
				<SidebarInput
					name="monthCount"
					label="Months to view"
					inlineLabel={true}
				>
					<input
						type="number"
						min={1}
						value={monthCount}
						onChange={handleMonthCountChange}
						className="mini"
					/>
				</SidebarInput>
			) : null}
		</div>
	);
}
