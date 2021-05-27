import React, { useContext } from "react";
import DrawerHandle from "./common/DrawerHandle";
import Widget from "./common/Widget";
import UnscheduledDrafts from "./UnscheduledDrafts";
import StatusFilters from "./StatusFilters";
import RefetchButton from "./RefetchButton";
import ViewOptions from "./ViewOptions";
import { wp } from "../lib/utils";

import ViewContext from "../ViewContext";

export default function Sidebar() {
	const { pluginUrl } = wp;

	const {
		viewOptions: { sidebarOpen },
		// viewMode,
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
				<Widget widgetClass="options">
					<div className="options">
						<ViewOptions />
						<RefetchButton />
					</div>
				</Widget>
				<Widget
					title="Unscheduled Drafts"
					widgetClass="unscheduledDrafts"
				>
					<UnscheduledDrafts />
				</Widget>

				<Widget title="Post Status" widgetClass="statusFilters">
					<StatusFilters />
				</Widget>

				<Widget widgetClass="support">
					<div className="support-links">
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
						<ul className="docs">
							<li>
								<a
									href="https://github.com/gaswirth/rhdwp-calendario/wiki"
									rel="noreferrer"
									target="_blank"
								>
									Support
								</a>
							</li>
							<li>
								<a
									href="https://github.com/gaswirth/rhdwp-calendario/issues"
									rel="noreferrer"
									target="_blank"
								>
									Report a Bug
								</a>
							</li>
						</ul>
					</div>
				</Widget>
			</div>
		</aside>
	);
}
