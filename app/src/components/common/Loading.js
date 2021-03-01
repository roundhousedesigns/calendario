import React from "react";

export default function Loading({ className }) {
	return (
		<div className={`loadingOverlay ${className}`}>
			<div className="roller">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
