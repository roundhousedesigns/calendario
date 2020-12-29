import React from "react";
import { Component } from "@fullcalendar/react";
import Header from "./components/Header";
import Calendars from "./components/Calendars";
import Sidebar from "./components/Sidebar";

import "./App.css";

const tempMonthCount = 3;

export default class App extends Component {
	calendarRef = [React.createRef(), React.createRef(), React.createRef()];

	constructor(props) {
		super(props);
		let today = new Date();
		today.setDate(1);

		this.state = {
			baseMonth: today,
			monthViewCount: tempMonthCount,
		};
	}

	render() {
		return (
			<div className="calendario">
				<Header
					calendarRef={this.calendarRef}
					monthViewCount={this.state.monthViewCount}
				/>

				<Calendars
					baseMonth={this.state.baseMonth}
					monthViewCount={this.state.monthViewCount}
					calendarRef={this.calendarRef}
				/>
				<Sidebar />
			</div>
		);
	}
}
