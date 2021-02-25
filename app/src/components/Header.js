import React from "react";
import ViewOptions from "./ViewOptions";
import StatusFilters from "./StatusFilters";
import { renderWidget } from "../lib/utils";

export default function Header() {
	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="left">
					<h1 className="page-title">Calendario II: The Datening</h1>
				</div>
				<div className="right">
					{renderWidget(
						"View Options",
						"viewOptions",
						<ViewOptions />
					)}
				</div>
				<div className="bottom">
					{renderWidget(
						"Filter by Status (TODO)",
						"statusFilters",
						<StatusFilters />
					)}
				</div>
			</div>
		</header>
	);
}
