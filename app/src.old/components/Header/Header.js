import React from "react";
import CalendarNavigation from "./CalendarNavigation";
import StatusFilters from "./StatusFilters";

const Header = ({ maxViewMonths, viewMonthCount, onViewMonthCountChange }) => {
	return (
		<header className="calendario-header">
			<h1 className="page-title">Calendario II: The Datening</h1>

			<div className="header-tools">
				<CalendarNavigation
					maxViewMonths={maxViewMonths}
					viewMonthCount={viewMonthCount}
					onViewMonthCountChange={onViewMonthCountChange}
				/>

				<StatusFilters />
			</div>
		</header>
	);
};

export default Header;
