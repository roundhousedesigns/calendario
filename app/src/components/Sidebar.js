import React from "react";
import Widget from "./Widget";
import UnscheduledDrafts from "./UnscheduledDrafts";
import StatusFilters from "./StatusFilters";

export default function Sidebar() {
	return (
		<aside className="calendario__sidebar">
			<Widget title="Unscheduled Drafts" className={"unscheduled-drafts"}>
				<UnscheduledDrafts />
			</Widget>
			<Widget title="Status Filters" className={"status-filters"}>
				<StatusFilters />
			</Widget>
		</aside>
	);
}
