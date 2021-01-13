import React, { useState, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import Unscheduled from "./Unscheduled.js";
import { routeBase } from "../lib/utils.js";

export default function Sidebar() {
	const [sidebarPosts, setSidebarPosts] = useState([]);
	const [listRendered, setListRendered] = useState(false);

	useEffect(() => {
		const apiUrl = `${routeBase}/posts/unscheduled`;
		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) => {
				setSidebarPosts(data);
				setListRendered(true);
			});
	}, []);

	useEffect(() => {
		if (listRendered === true) {
			new Draggable(document.getElementById("unscheduled-drafts-list"), {
				itemSelector: ".unscheduled-draft",
			});
		}
	}, [listRendered]);

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
					onDragEnter={(e) => {
						console.log(e);
					}}
					onDragOver={(e) => {
						console.log("dragover");
					}}
					onDrop={(e) => {
						console.log("drop");
					}}
				>
					{sidebarPosts.map(({ id, title }, index) => (
						<Unscheduled key={index} id={id} title={title} />
					))}
				</ul>
			</div>
		</div>
	);
}
