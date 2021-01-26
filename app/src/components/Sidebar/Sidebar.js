import React from "react";
import Widget from "./Widget";
import UnscheduledDrafts from "./UnscheduledDrafts";
import StatusFilters from "./StatusFilters";

const Sidebar = () => {
	return (
		<div id="sidebar" className="sidebar">
			<Widget title="Unscheduled Drafts" classString="unscheduled-drafts">
				<UnscheduledDrafts />
			</Widget>
			<Widget title="Status Filters" classString="status-filters">
				<StatusFilters />
			</Widget>
		</div>
	);
};

export default Sidebar;
