import React, { useContext } from "react";
import ViewOptions from "./ViewOptions";
import Calendar from "./Calendar";
import List from "./List";
import EditPost from "./EditPost";

import ViewContext from "../ViewContext";

export default function Main() {
	const {
		viewOptions: { viewMode },
	} = useContext(ViewContext);

	return (
		<main className="calendario__main">
			<div className="view">
				<ViewOptions className="view__options" />
				{viewMode === "calendar" ? (
					<Calendar className="view__calendar" />
				) : (
					<List className="view__list" />
				)}
			</div>
			<EditPost />
		</main>
	);
}
