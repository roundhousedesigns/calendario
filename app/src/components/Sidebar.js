import React, { useEffect } from "react";
import UnscheduledDrafts from "./UnscheduledDrafts";
import StatusFilters from "./StatusFilters";
import { renderWidget } from "../lib/utils";
import { wp } from "../lib/utils";

export default function Sidebar() {
	const { pluginUrl } = wp;

	useEffect(() => {
		console.log(pluginUrl);
	});

	return (
		<aside className="calendario__sidebar">
			<div className="calendario__sidebar__inner">
				{renderWidget(
					"Unscheduled Drafts",
					"unscheduledDrafts",
					<UnscheduledDrafts />
				)}

				{renderWidget(
					"Post Status",
					"statusFilters",
					<StatusFilters />
				)}

				{renderWidget(
					"",
					"support",
					<>
						<ul className="docs">
							<li>
								<a
									href="https://github.com/gaswirth/rhdwp-calendario"
									rel="noreferrer"
									target="_blank"
								>
									Help + Documentation (dummy link)
								</a>
							</li>
							<li>
								<a
									href="https://github.com/gaswirth/rhdwp-calendario"
									rel="noreferrer"
									target="_blank"
								>
									Support (dummy link)
								</a>
							</li>
						</ul>
						<a
							className="rhdLogo"
							href="https://roundhouse-designs.com"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src={`${pluginUrl}rhd-logo.png`}
								alt="Roundhouse Designs logo"
							/>
						</a>
					</>
				)}
			</div>
		</aside>
	);
}
