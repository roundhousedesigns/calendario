import React, { useEffect } from "react";
import { postStatuses } from "../lib/utils";

export default function StatusFilters() {
	const keys = Object.keys(postStatuses);

	return (
		<ul className="filters">
			{keys.map((item) => {
				const { color, backgroundColor, name } = postStatuses[item];
				return (
					<li className={`filter-item status__${item}`}>
						<span
							className="dot"
							style={{
								color,
								backgroundColor,
							}}
						/>
						<span class="name">{name}</span>
					</li>
				);
			})}
		</ul>
	);
}
