import React, { useContext } from "react";
// import { Draggable } from "@fullcalendar/interaction";
import Unscheduled from "./Unscheduled.js";
// import { routeBase } from "../lib/utils.js";
import SidebarPostsContext from "../SidebarPosts";

export default function Sidebar() {
	// const [posts, setposts] = useState([]);

	const { sidebarPosts } = useContext(SidebarPostsContext);

	return (
		<div id="sidebar" className="sidebar">
			<h2 className="sidebar-title">Unscheduled Drafts</h2>
			<div id="unscheduled-drafts" className="unscheduled-drafts">
				<ul
					id="unscheduled-drafts-list"
					className="unscheduled-drafts-list"
				>
					{sidebarPosts.events.map(({ id, title }, index) => (
						<Unscheduled key={index} id={id} title={title} />
					))}
				</ul>
			</div>
		</div>
	);
}
