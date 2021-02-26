import React from "react";
import UnscheduledDrafts from "./UnscheduledDrafts";
import { renderWidget } from "../lib/utils";

export default function Sidebar() {
	return (
		<aside className="calendario__sidebar">
			{renderWidget(
				"Unscheduled Drafts",
				"unscheduledDrafts",
				<UnscheduledDrafts />
			)}
		</aside>
	);
}
