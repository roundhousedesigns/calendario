import React from "react";

export default function Day(props) {
	const { className, day, onClick, dayNumber, children } = props;

	const cloneDay = day;

	return (
		<div
			className={className}
			onClick={() => {
				onClick(cloneDay);
			}}
		>
			<span className="number">{dayNumber}</span>
			<span className="bg">{dayNumber}</span>

			{children}
		</div>
	);
}
