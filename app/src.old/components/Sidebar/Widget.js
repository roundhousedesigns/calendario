import React from "react";

const Widget = ({ classString, title, children }) => {
	return (
		<div className={`widget widget__${classString}`}>
			<h2 className="widget-title">{title}</h2>
			{children}
		</div>
	);
};

export default Widget;
