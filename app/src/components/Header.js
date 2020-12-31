import React, { Component } from "react";

class Header extends Component {
	constructor(props) {
		super(props);

		this.nextMonth = this.nextMonth.bind(this);
		this.prevMonth = this.prevMonth.bind(this);
	}

	nextMonth = () => {
		for (let i = 0; i < this.props.maxViewMonths; i++) {
			let calendarApi = this.props.calendarRef[i].current.getApi();

			calendarApi.next();
		}
	};

	prevMonth = () => {
		for (let i = 0; i < this.props.maxViewMonths; i++) {
			let calendarApi = this.props.calendarRef[i].current.getApi();

			calendarApi.prev();
		}
	};

	handleViewChange = (e) => {
		this.props.onViewChange(e.target.value);
	};

	render() {
		return (
			<header className="calendario-header">
				<h1 className="page-title">Calendario II: The Datening</h1>

				{this.props.viewMode !== "list" ? (
					<nav className="calendar-grid-navigation">
						<button
							className="prev"
							id="prev"
							onClick={this.prevMonth}
						>
							PREV
						</button>
						<button
							className="next"
							id="next"
							onClick={this.nextMonth}
						>
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
							onChange={this.handleViewChange}
							checked={this.props.viewMode === "3"}
						/>
						3 months
					</label>

					<label>
						<input
							type="radio"
							value="1"
							name="view-mode"
							onChange={this.handleViewChange}
							checked={this.props.viewMode === "1"}
						/>
						1 month
					</label>

					<label>
						<input
							type="radio"
							value="list"
							name="view-mode"
							onChange={this.handleViewChange}
							checked={this.props.viewMode === "list"}
						/>
						List
					</label>
				</div>
			</header>
		);
	}
}

export default Header;
