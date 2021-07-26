import React, { forwardRef, useContext, useState } from "react";
import { dateFormat } from "../lib/utils";
import { format, isToday, isPast, isSameDay } from "date-fns";

import DragContext from "../DragContext";

const Day = forwardRef(({ day, monthName, children }, ref) => {
	const [dragOver, setDragOver] = useState(false);
	const {
		draggedPost: {
			post: { post_date },
			isUnscheduled,
		},
	} = useContext(DragContext);

	const handleDragOver = () => {
		if (!isUnscheduled && isSameDay(day, post_date)) {
			return;
		}

		setDragOver(true);
	};

	const styles = () => {
		let classes = ["day", "col", "cell"];

		if (isToday(day)) {
			classes.push("today");
		}

		if (isPast(day) && !isToday(day)) {
			classes.push("past");
		}

		if (dragOver) {
			classes.push("dragOver");
		}

		return classes.join(" ");
	};

	return (
		<div
			className={styles()}
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
});

export default Day;
