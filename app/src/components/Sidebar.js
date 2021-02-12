import React from "react";
import Widget from "./Widget";
import ViewOptions from "./ViewOptions";
import UnscheduledDrafts from "./UnscheduledDrafts";
import EditPost from "./EditPost";

export default function Sidebar() {
	const renderWidget = (title, className, children) => {
		return (
			<Widget title={title} className={`widget__${className}`}>
				{children}
			</Widget>
		);
	};

	return (
		<aside className="calendario__sidebar">
			{renderWidget("View Options", "viewOptions", <ViewOptions />)}
			{renderWidget(
				"Unscheduled Drafts",
				"unscheduledDrafts",
				<UnscheduledDrafts />
			)}
			{renderWidget("Post Area", "editPost", <EditPost />)}
		</aside>
	);
}
