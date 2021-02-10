import React, { useContext, useEffect } from "react";
import Draft from "./Draft.js";
import { routeBase } from "../../lib/utils";

import SidebarPostsContext from "../SidebarPostsContext";

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
		<div id="unscheduledDrafts" className="unscheduledDrafts">
			{sidebarPosts ? (
				<ul
					id="unscheduledDrafts__list"
					className="unscheduledDrafts__list"
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
