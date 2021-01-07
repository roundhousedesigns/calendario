import React, { useState, useEffect } from "react";
import UnscheduledDraft from "./UnscheduledDraft";
import { routeBase } from "../lib/utils.js";

export default function Sidebar() {
	const [sidebarPosts, setSidebarPosts] = useState([]);

	useEffect(() => {
		const apiUrl = `${routeBase}/unscheduled`;
		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) => {
				setSidebarPosts(data);
			});
	}, []);

	return (
		<div id="sidebar" className="sidebar">
			<h2 className="sidebar-title">Unscheduled Drafts</h2>
			<div id="unscheduled-drafts" className="unscheduled-drafts">
				<ul>
					{sidebarPosts.map((postData, index) => (
						<UnscheduledDraft post={postData} key={index} />
					))}
				</ul>
			</div>
		</div>
	);
}
