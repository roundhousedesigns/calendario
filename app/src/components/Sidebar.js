import React from "react";
import Widget from "./Widget";
import UnscheduledDrafts from "./UnscheduledDrafts";
import EditPost from "./EditPost";

export default function Sidebar() {
	return (
		<aside className="calendario__sidebar">
			<Widget
				title="Unscheduled Drafts"
				className={"widget__unscheduledDrafts"}
			>
				<UnscheduledDrafts />
			</Widget>
			<Widget title="Post Area" className={"widget__editPost"}>
				<EditPost />
			</Widget>
		</aside>
	);
}
