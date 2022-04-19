import React from 'react';

export default function Widget({ title, className, children }) {
	const widgetTitle = title ? <h3 className="widgetTitle">{title}</h3> : '';

	const classes = () => {
		const base = 'widget';
		return className ? `${base} ${className}` : base;
	};

	return (
		<div className={classes()}>
			{widgetTitle}
			{children}
		</div>
	);
}
