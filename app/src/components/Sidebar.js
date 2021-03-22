import React from "react";
import UnscheduledDrafts from "./UnscheduledDrafts";
import StatusFilters from "./StatusFilters";
import { renderWidget } from "../lib/utils";

export default function Sidebar() {
	return (
		<aside className="calendario__sidebar">
			<div className="calendario__sidebar__inner">
				{renderWidget(
					"Unscheduled Drafts",
					"unscheduledDrafts",
					<UnscheduledDrafts />
				)}

				{renderWidget(
					"Filter by Status",
					"statusFilters",
					<StatusFilters />
				)}

				{renderWidget(
					"Development",
					"dev",
					<>
						<ul
							style={{
								marginLeft: 0,
								paddingLeft: "24px",
								listStylePosition: "outside",
							}}
						>
							<li>
								<a
									href="https://github.com/gaswirth/rhdwp-calendario/issues"
									target="_blank"
									rel="noreferrer"
								>
									Report an issue
								</a>
							</li>
							<li>
								<a
									href="https://github.com/gaswirth/rhdwp-calendario#readme"
									target="_blank"
									rel="noreferrer"
								>
									Readme
								</a>
							</li>
						</ul>
						<p style={{ fontSize: "0.7em" }}>
							<a
								href="https://roundhouse-designs.com"
								target="_blank"
								rel="noreferrer"
							>
								Roundhouse Designs
							</a>
						</p>
					</>
				)}
			</div>
		</aside>
	);
}
