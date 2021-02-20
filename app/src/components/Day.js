import React from "react";

export default function Day(props) {
	const { className, dayNumber, monthName, children } = props;

	return (
		<div className={className}>
			{monthName ? <span className="month">{monthName}</span> : ""}
			<span className="number">{dayNumber}</span>

			{children}
		</div>
	);
}
