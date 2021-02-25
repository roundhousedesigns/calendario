import { format } from "date-fns";
import { dateFormat } from "../lib/utils";

export default function CalendarListHeader({
	start,
	end,
	nextMonth,
	prevMonth,
}) {
	return (
		<div className="header row flex-middle">
			<div className="col col__start">
				<div className="icon" onClick={prevMonth}>
					chevron_left
				</div>
			</div>
			<div className="col col__center">
				<h3 className="viewTitle">Scheduled Posts</h3>
				<p className="viewRange">{`${format(
					start,
					dateFormat.fullDate
				)} \u2014 ${format(end, dateFormat.fullDate)}`}</p>
			</div>
			<div className="col col__end" onClick={nextMonth}>
				<div className="icon">chevron_right</div>
			</div>
		</div>
	);
}
