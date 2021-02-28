import { format } from "date-fns";
import { useContext } from "react";
import { dateFormat } from "../lib/utils";

import ViewContext from "../ViewContext";

export default function CalendarListHeader({ start, end }) {
	const { viewOptionsDispatch } = useContext(ViewContext);

	const nextMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: "NEXT_MONTH" });
	};

	const prevMonth = (e) => {
		e.preventDefault();
		viewOptionsDispatch({ type: "PREV_MONTH" });
	};

	return (
		<div className="calendarListHeader row flex-middle">
			<div className="col col__start">
				<button className="icon dateChevron" onClick={prevMonth}>
					chevron_left
				</button>
			</div>
			<div className="col col__center">
				<h3 className="viewTitle">Scheduled Posts</h3>
				<p className="viewRange">
					{start && end
						? `${format(
								start,
								dateFormat.daylessDate
						  )} \u2014 ${format(end, dateFormat.daylessDate)}`
						: null}
				</p>
			</div>
			<div className="col col__end">
				<button className="icon dateChevron" onClick={nextMonth}>
					chevron_right
				</button>
			</div>
		</div>
	);
}
