import React from "react";
import { postStatuses } from "../lib/utils";

export default function StatusFilters() {
	const keys = Object.keys(postStatuses);

	return (
		<ul className="filters">
			{keys.map((item, index) => {
				const { color, backgroundColor, name } = postStatuses[item];
				return (
					<li className={`filter-item status__${item}`} key={index}>
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
	);
}
