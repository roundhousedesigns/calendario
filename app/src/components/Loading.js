import React from "react";

const Loading = ({ show }) => {
	let classes = show ? "visible" : "";
	return (
		<div className={`calendar-loading ${classes}`}>
			<h3>Loading...</h3>
		</div>
	);
};

export default Loading;
