import React from "react";

export default function Header() {
	return (
		<header className="calendario__header">
			<h1 className="page-title">Calendario II: The Datening</h1>
			<p>
				Drag posts back and forth from the <strong>Calendar</strong> to
				the <strong>Unscheduled Drafts</strong> area.
			</p>
			<p style={{ fontStyle: "italic", marginBottom: 0 }}>Coming soon:</p>
			<ul style={{ margin: 0 }}>
				<li>Re-connect to WP for real data</li>
				<li>Status color indicators</li>
				<li>Do UI for drag-and-drop feedback</li>
				<li>Post Modal for changing post data</li>
			</ul>
		</header>
	);
}
