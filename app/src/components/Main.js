import React, { forwardRef, useContext } from "react";
import ViewOptions from "./ViewOptions";
import Calendar from "./Calendar";
import List from "./List";
import EditPost from "./EditPost";

import ViewContext from "../ViewContext";

const Main = forwardRef(({ todayRef }, ref) => {
	const {
		viewOptions: { viewMode },
	} = useContext(ViewContext);

	return (
		<main className="calendario__main">
			<div className="view" ref={ref}>
				<ViewOptions className="view__options" />
				{viewMode === "calendar" ? (
					<Calendar className="view__calendar" todayRef={todayRef} />
				) : (
					<List className="view__list" todayRef={todayRef} />
				)}
			</div>
			<EditPost />
		</main>
	);
});
export default Main;
