import React from "react";
import Widget from "./Widget";
import UnscheduledDrafts from "./UnscheduledDrafts";
import ListView from "./ListView";

export default function Sidebar() {
	return (
		<aside className="calendario__sidebar">
			<Widget title="Unscheduled Drafts" className={"unscheduled-drafts"}>
				<UnscheduledDrafts />
			</Widget>
			<Widget title="At a glance" className={"list-view"}>
				<ListView />
			</Widget>
		</aside>
	);
}
