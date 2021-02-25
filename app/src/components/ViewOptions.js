import React, { useContext } from "react";
import SidebarInput from "./SidebarInput";

import ViewContext from "../ViewContext";
import PostsContext from "../PostsContext";

export default function ViewOptions() {
	const {
		viewOptions: { viewMode, monthCount },
		viewOptionsDispatch,
	} = useContext(ViewContext);

	const { postsDispatch } = useContext(PostsContext);

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

	const handleRefetch = (e) => {
		postsDispatch({
			type: "REFETCH",
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
			<SidebarInput
				name="refetch"
				label="Refetch Posts (not for production)"
				inlineLabel={true}
			>
				<button onClick={handleRefetch}>Refetch</button>
			</SidebarInput>
		</div>
	);
}
