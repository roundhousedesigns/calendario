import React from "react";
import Widget from "./Widget";
import UnscheduledDrafts from "./UnscheduledDrafts";
import ListView from "./ListView";

const Sidebar = () => {
	return (
		<div id="sidebar" className="sidebar">
			<Widget title="Unscheduled Drafts" classString="unscheduled-drafts">
				<UnscheduledDrafts />
			</Widget>
			<Widget title="At a glance" classString="list-view">
				<ListView />
			</Widget>
		</div>
	);
};

export default Sidebar;
