import React from "react";

export default function Day(props) {
	const { className, dayNumber, children } = props;

	return (
		<div className={className}>
			{children}

			<span className="number">{dayNumber}</span>
			<span className="bg">{dayNumber}</span>
		</div>
	);
}
