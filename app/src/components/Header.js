import React from "react";

const Header = ({ calendarRefs, viewMode, maxViewMonths, onViewChange }) => {
	const nextMonth = () => {
		for (let i = 0; i < maxViewMonths; i++) {
			let calendarApi = calendarRefs[i].current.getApi();

			calendarApi.next();
		}
	};

	const prevMonth = () => {
		for (let i = 0; i < maxViewMonths; i++) {
			let calendarApi = calendarRefs[i].current.getApi();

			calendarApi.prev();
		}
	};

	const handleViewChange = (e) => {
		onViewChange(e.target.value);
	};

	return (
		<header className="calendario-header">
			<h1 className="page-title">Calendario II: The Datening</h1>

			{viewMode !== "list" ? (
				<nav className="calendar-grid-navigation">
					<button className="prev" id="prev" onClick={prevMonth}>
						PREV
					</button>
					<button className="next" id="next" onClick={nextMonth}>
						NEXT
					</button>
				</nav>
			) : null}

			<div className="view-mode">
				<label>
					<input
						type="radio"
						value="3"
						name="view-mode"
						onChange={handleViewChange}
						checked={viewMode === "3"}
					/>
					3 months
				</label>

				<label>
					<input
						type="radio"
						value="1"
						name="view-mode"
						onChange={handleViewChange}
						checked={viewMode === "1"}
					/>
					1 month
				</label>

				<label>
					<input
						type="radio"
						value="list"
						name="view-mode"
						onChange={handleViewChange}
						checked={viewMode === "list"}
					/>
					List
				</label>
			</div>
		</header>
	);
};

export default Header;
