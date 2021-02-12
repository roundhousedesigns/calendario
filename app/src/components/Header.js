import React from "react";
import StatusFilters from "./StatusFilters";

export default function Header({ darkMode, toggleDarkMode }) {
	return (
		<header className="calendario__header">
			<h1 className="page-title">Calendario II: The Datening</h1>
			<div className="calendario__header__inner">
				<div className="left">
					<p>
						Drag posts back and forth from the{" "}
						<strong>Calendar</strong> to the{" "}
						<strong>Unscheduled Drafts</strong> area.
					</p>
					<p style={{ fontStyle: "italic", marginBottom: 0 }}>
						Coming soon:
					</p>
					<ul style={{ margin: 0 }}>
						<li>Re-connect to WP for real data</li>
						<li>Show/hide statuses from filter menu</li>
						<li>Improve DND UI</li>
					</ul>
				</div>
				<div className="calendario__header__right">
					<div className="darkLight">
						<button onClick={toggleDarkMode}>
							{darkMode
								? "Please Light Mode Woof"
								: "Worst Dark Mode Ever"}
						</button>
					</div>
					<StatusFilters />
				</div>
			</div>
		</header>
	);
}
