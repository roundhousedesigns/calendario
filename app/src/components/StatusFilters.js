import React, { useContext } from "react";
import { wp } from "../lib/utils";

import ViewContext from "../ViewContext";

export default function StatusFilters() {
	const { postStatuses } = wp;
	const keys = Object.keys(postStatuses);
	const {
		viewOptions: { statuses },
		viewOptionsDispatch,
	} = useContext(ViewContext);

	const toggleStatus = (e) => {
		viewOptionsDispatch({
			type: "TOGGLE_STATUS",
			status: e.target.name,
		});
	};

	return (
		<div className="statusFilters">
			<ul className="filters">
				{keys.map((item, index) => {
					const { color, backgroundColor, name } = postStatuses[item];
					return (
						<li
							className={`filterItem status__${item}`}
							key={index}
						>
							<button
								className={`dot ${
									statuses[item] ? "visible" : "hidden"
								}`}
								name={item}
								style={
									statuses[item] === true
										? {
												color,
												backgroundColor,
												borderColor: backgroundColor,
										  }
										: {
												color,
												borderColor: backgroundColor,
										  }
								}
								onClick={toggleStatus}
							/>
							<span className="name">{name}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
