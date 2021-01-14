import React, { useContext } from "react";
// import { Draggable } from "@fullcalendar/interaction";
import Unscheduled from "./Unscheduled.js";
// import { routeBase } from "../lib/utils.js";
import SidebarPostsContext from "../Posts";

export default function Sidebar() {
	// const [posts, setposts] = useState([]);

	const { sidebarPosts } = useContext(SidebarPostsContext);
	// const [listRendered, setListRendered] = useState(false);

	// useEffect(() => {
	// 	const apiUrl = `${routeBase}/posts/unscheduled`;
	// 	fetch(apiUrl)
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			setposts(data);
	// 			setListRendered(true);
	// 		});
	// }, []);

	// useEffect(() => {
	// 	if (listRendered === true) {
	// 		new Draggable(document.getElementById("unscheduled-drafts-list"), {
	// 			itemSelector: ".unscheduled-draft",
	// 		});
	// 	}
	// }, [listRendered]);

	return (
		<div id="sidebar" className="sidebar">
			<h2 className="sidebar-title">Unscheduled Drafts</h2>
			<div id="unscheduled-drafts" className="unscheduled-drafts">
				<ul
					id="unscheduled-drafts-list"
					className="unscheduled-drafts-list"
					style={{
						display: "block",
						backgroundColor: "#eee",
						height: "200px",
					}}
				>
					{sidebarPosts.events.map(({ id, title }, index) => (
						<Unscheduled key={index} id={id} title={title} />
					))}
				</ul>
			</div>
		</div>
	);
}
