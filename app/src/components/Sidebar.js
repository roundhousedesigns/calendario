import React from "react";
import UnscheduledDrafts from "./UnscheduledDrafts";
import ViewOptions from "./ViewOptions";
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

				{renderWidget("", "viewOptions noBorder", <ViewOptions />)}

				{renderWidget(
					"Dev Links + Info",
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
									href="https://github.com/gaswirth/rhdwp-calendario#readme"
									target="_blank"
									rel="noreferrer"
								>
									TODO/Readme
								</a>
							</li>
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
								GitHub:{" "}
								<a
									href="https://github.com/gaswirth/rhdwp-calendario"
									target="_blank"
									rel="noreferrer"
								>
									gaswirth/rhdwp-calendario
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
