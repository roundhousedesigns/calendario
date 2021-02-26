import React from "react";
import { dateFormat } from "../lib/utils";
import { format, isToday, isPast } from "date-fns";

export default function Day({ className, day, monthName, children }) {
	var classes = ["day", "col", "cell"];
	if (isToday(day)) {
		classes.push("today");
	}
	if (isPast(day) && !isToday(day)) {
		classes.push("past");
	}

	return (
		<div className={classes.join(" ")}>
			{monthName ? <span className="month">{monthName}</span> : ""}
			<span className="number">{format(day, dateFormat.day)}</span>

			{children}
		</div>
	);
}
