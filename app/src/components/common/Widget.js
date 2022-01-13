import React from 'react';

export default function Widget({ title, widgetClass, children }) {
	const widgetTitle = title ? <h3 className="widgetTitle">{title}</h3> : '';
	const widgetClassLabel = widgetClass ? widgetClass : 'default';

	return (
		<div className={`widget widget__${widgetClassLabel}`}>
			{widgetTitle}
			{children}
		</div>
	);
}
