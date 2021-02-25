import React from "react";
import UnscheduledDrafts from "./UnscheduledDrafts";
import EditPost from "./EditPost";
import { renderWidget } from "../lib/utils";

export default function Sidebar() {
	return (
		<aside className="calendario__sidebar">
			{renderWidget(
				"Unscheduled Drafts",
				"unscheduledDrafts",
				<UnscheduledDrafts />
			)}
			{renderWidget("Post Area", "editPost", <EditPost />)}
		</aside>
	);
}
