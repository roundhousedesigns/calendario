import React from "react";

export default function Widget({ title, className, children }) {
	return (
		<div className={`widget ${className}`}>
			<h3 className="widgetTitle">{title}</h3>
			{children}
		</div>
	);
}
