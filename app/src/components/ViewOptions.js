import React, { useContext } from "react";

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
			<div className="viewMode">
				<button
					onClick={handleViewModeChange}
					className={`icon viewMode__input ${
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
					className={`icon viewMode__input ${
						viewMode === "list" ? "active " : "inactive"
					}`}
					value="list"
					title="List"
				>
					view_list
				</button>
			</div>
		</div>
	);
}
