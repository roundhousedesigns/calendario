import React, { useContext } from "react";
import Unscheduled from "./Unscheduled.js";

import SidebarPostsContext from "../context/SidebarPosts";

export default function Sidebar() {
	const { sidebarPosts } = useContext(SidebarPostsContext);

	return (
		<div id="sidebar" className="sidebar">
			<h2 className="sidebar-title">Unscheduled Drafts</h2>
			<div id="unscheduled-drafts" className="unscheduled-drafts">
				<ul
					id="unscheduled-drafts-list"
					className="unscheduled-drafts-list"
				>
					{sidebarPosts.events.map((event, index) => (
						<Unscheduled key={index} post={event} />
					))}
				</ul>
			</div>
		</div>
	);
}
