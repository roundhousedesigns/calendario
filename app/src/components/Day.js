import React, { forwardRef, useContext, useState } from "react";
import { dateFormat } from "../lib/utils";
import { format, isToday, isPast, isSameDay } from "date-fns";

import DragContext from "../DragContext";

const Day = forwardRef(({ day, monthName, children }, ref) => {
	const [dragOver, setDragOver] = useState(false);
	const {
		draggedPost: {
			post: { post_date },
		},
	} = useContext(DragContext);
	var classes = ["day", "col", "cell"];

	const handleDragOver = () => {
		if (isSameDay(day, post_date)) {
			return;
		}

		setDragOver(true);
	};

	const renderDay = () => {
		if (isToday(day)) {
			classes.push("today");
		}

		if (isPast(day) && !isToday(day)) {
			classes.push("past");
		}

		if (dragOver) {
			classes.push("dragOver");
		}

		return (
			<div
				className={classes.join(" ")}
				ref={isToday(day) ? ref : null}
				onDragOver={handleDragOver}
				onDragLeave={() => setDragOver(false)}
				onDrop={() => setDragOver(false)}
			>
				{monthName ? <span className="month">{monthName}</span> : ""}
				<span className="number">{format(day, dateFormat.day)}</span>

				{children}
			</div>
		);
	};

	return renderDay();
});
export default Day;
