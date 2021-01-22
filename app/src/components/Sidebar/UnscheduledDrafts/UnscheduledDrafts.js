import React, { useContext } from "react";
import Unscheduled from "./Unscheduled.js";

import SidebarPostsContext from "../../../context/SidebarPosts";

const UnscheduledDrafts = () => {
	const { sidebarPosts } = useContext(SidebarPostsContext);

	return (
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
	);
};

export default UnscheduledDrafts;
