import React, { Component } from "react";

class Header extends Component {
	constructor(props) {
		super(props);

		this.nextMonth = this.nextMonth.bind(this);
		this.prevMonth = this.prevMonth.bind(this);
	}

	nextMonth() {
		for (let i = 0; i < this.props.monthViewCount; i++) {
			let calendarApi = this.props.calendarRef[i].current.getApi();

			calendarApi.next();
		}
	}

	prevMonth() {
		for (let i = 0; i < this.props.monthViewCount; i++) {
			let calendarApi = this.props.calendarRef[i].current.getApi();

			calendarApi.prev();
		}
	}

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
			</header>
		);
	}
}

export default Header;
