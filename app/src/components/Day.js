import React, { forwardRef } from "react";
import { dateFormat } from "../lib/utils";
import { format, isToday, isPast } from "date-fns";

const Day = forwardRef(({ day, monthName, children }, ref) => {
	var classes = ["day", "col", "cell"];

	if (isToday(day)) {
		classes.push("today");
	}

	if (isPast(day) && !isToday(day)) {
		classes.push("past");
	}

	return (
		<div className={classes.join(" ")} ref={isToday(day) ? ref : null}>
			{monthName ? <span className="month">{monthName}</span> : ""}
			<span className="number">{format(day, dateFormat.day)}</span>

			{children}
		</div>
	);
});
export default Day;
