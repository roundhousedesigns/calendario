import React, { useState, useEffect } from "react";
import UnscheduledPost from "./UnscheduledPost";
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
		<div className="sidebar">
			<h2 className="sidebar-title">Unscheduled Drafts</h2>
			<ul className="unscheduled-drafts">
				{sidebarPosts.map((postData, index) => (
					<UnscheduledPost post={postData} key={index} />
				))}
			</ul>
		</div>
	);
}
