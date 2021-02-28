import React, { useContext } from "react";
import ViewOptions from "./ViewOptions";
import CalendarListHeader from "./CalendarListHeader";

import ViewContext from "../ViewContext";

export default function Header() {
	const {
		viewOptions: { viewRange },
	} = useContext(ViewContext);

	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="left">
					<CalendarListHeader
						start={viewRange.start}
						end={viewRange.end}
					/>
				</div>
				<div className="right">
					<ViewOptions />
				</div>
			</div>
		</header>
	);
}
