import { format } from "date-fns";
import { useContext } from "react";
import { dateFormat } from "../lib/utils";

import ViewContext from "../ViewContext";

export default function CalendarListHeader({ start, end }) {
	const { viewOptionsDispatch } = useContext(ViewContext);

	return (
		<div className="header row flex-middle">
			<div className="col col__start">
				<div
					className="icon"
					onClick={() => viewOptionsDispatch({ type: "PREV_MONTH" })}
				>
					chevron_left
				</div>
			</div>
			<div className="col col__center">
				<h3 className="viewTitle">Scheduled Posts</h3>
				<p className="viewRange">{`${format(
					start,
					dateFormat.daylessDate
				)} \u2014 ${format(end, dateFormat.daylessDate)}`}</p>
			</div>
			<div
				className="col col__end"
				onClick={() =>
					viewOptionsDispatch({
						type: "NEXT_MONTH",
					})
				}
			>
				<div className="icon">chevron_right</div>
			</div>
		</div>
	);
}
