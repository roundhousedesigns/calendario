import React, { useContext } from "react";
import CalendarListHeader from "./CalendarListHeader";

import ViewContext from "../ViewContext";

export default function Header() {
	const {
		viewOptions: {
			viewRange: { start, end },
		},
	} = useContext(ViewContext);

	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="left">
					<CalendarListHeader start={start} end={end} />
				</div>
				<div className="right">
					<h1 className="calendario__title">
						the editorial calendorial
					</h1>
				</div>
			</div>
		</header>
	);
}
