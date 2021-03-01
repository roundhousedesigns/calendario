import React from "react";
import { postStatuses } from "../lib/utils";

export default function StatusFilters() {
	const keys = Object.keys(postStatuses);

	return (
		<div className="statusFilters">
			<p style={{ fontSize: "0.8em" }}>
				You'll be able to click me one day...
			</p>
			<ul className="filters">
				{keys.map((item, index) => {
					const { color, backgroundColor, name } = postStatuses[item];
					return (
						<li
							className={`filterItem status__${item}`}
							key={index}
						>
							<span
								className="dot"
								style={{
									color,
									backgroundColor,
								}}
							/>
							<span className="name">{name}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
