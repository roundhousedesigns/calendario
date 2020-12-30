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

	handleMonthViewCountChange = (e) => {
		this.props.onMonthViewCountChange(e.target.value);
	};

	render() {
		return (
			<header className="calendario-header">
				<h1 className="page-title">Calendario II: The Datening</h1>

				<nav className="calendar-navigation">
					<button className="prev" id="prev" onClick={this.prevMonth}>
						PREV
					</button>
					<button className="next" id="next" onClick={this.nextMonth}>
						NEXT
					</button>
				</nav>

				<div className="view-mode">
					<label>
						<input
							type="radio"
							value={3}
							name="view-mode"
							onChange={this.handleMonthViewCountChange}
							checked={
								this.props.monthViewCount.toString() === "3"
							}
						/>
						3 months
					</label>

					<label>
						<input
							type="radio"
							value={1}
							name="view-mode"
							onChange={this.handleMonthViewCountChange}
							checked={
								this.props.monthViewCount.toString() === "1"
							}
						/>
						1 month
					</label>
				</div>
			</header>
		);
	}
}

export default Header;
