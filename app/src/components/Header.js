import React from "react";
import ViewOptions from "./ViewOptions";
import StatusFilters from "./StatusFilters";

export default function Header() {
	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="top left">
					<h1 className="page-title">Calendario II: The Datening</h1>
				</div>
				<div className="top right"></div>
				<div className="bottom left">
					<ViewOptions />
				</div>
				<div className="bottom right">
					<StatusFilters />
				</div>
			</div>
		</header>
	);
}
