import React, { useContext } from "react";
import UnscheduledDrafts from "./UnscheduledDrafts";
import StatusFilters from "./StatusFilters";
import DrawerHandle from "./common/DrawerHandle";
import { renderWidget } from "../lib/utils";
import { wp } from "../lib/utils";

import ViewContext from "../ViewContext";

export default function Sidebar() {
	const { pluginUrl } = wp;
	// const [sidebarOpen, setSidebarOpen] = useState(true);
	const {
		viewOptions: { sidebarOpen },
		viewOptionsDispatch,
	} = useContext(ViewContext);

	return (
		<aside
			className={`calendario__sidebar ${sidebarOpen ? "open" : "closed"}`}
		>
			<DrawerHandle
				toggle={() =>
					viewOptionsDispatch({
						type: "TOGGLE_SIDEBAR",
					})
				}
			/>
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
