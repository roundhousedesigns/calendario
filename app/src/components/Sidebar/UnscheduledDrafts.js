import React, { useContext, useEffect } from "react";
import Draft from "./Draft.js";
import { routeBase } from "../../lib/utils";

import SidebarPostsContext from "../Main/SidebarPostsContext";

const UnscheduledDrafts = () => {
	const { sidebarPosts, sidebarPostsDispatch } = useContext(
		SidebarPostsContext
	);

	useEffect(() => {
		fetch(`${routeBase}/posts/unscheduled`)
			.then((response) => response.json())
			.then((data) => {
				sidebarPostsDispatch({
					type: "POPULATE",
					events: data,
				});
			});
	}, [sidebarPostsDispatch]);

	return (
		<div id="unscheduled-drafts" className="unscheduled-drafts">
			{sidebarPosts ? (
				<ul
					id="unscheduled-drafts-list"
					className="unscheduled-drafts-list"
				>
					{sidebarPosts.events.map((event, index) => (
						<Draft key={index} post={event} />
					))}
				</ul>
			) : null}
		</div>
	);
};

export default UnscheduledDrafts;
