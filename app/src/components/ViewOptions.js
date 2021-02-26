import React, { useContext } from "react";
import FieldGroup from "./FieldGroup";

import ViewContext from "../ViewContext";
import PostsContext from "../PostsContext";

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
			<FieldGroup name="viewMode">
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
			</FieldGroup>
			<FieldGroup
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
			</FieldGroup>
		</div>
	);
}
