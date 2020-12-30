import React from "react";
import { Component } from "@fullcalendar/react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";

import "./App.css";

const maxViewMonths = 3;

export default class App extends Component {
	calendarRef = [React.createRef(), React.createRef(), React.createRef()];

	constructor(props) {
		super(props);

		this.handleMonthViewCountChange = this.handleMonthViewCountChange.bind(
			this
		);

		let today = new Date();
		today.setDate(1);

		this.state = {
			baseMonth: today,
			monthViewCount: maxViewMonths,
		};
	}

	handleMonthViewCountChange(monthViewCount) {
		this.setState({ monthViewCount });
	}

	render() {
		return (
			<div className="calendario">
				<Header
					calendarRef={this.calendarRef}
					monthViewCount={this.state.monthViewCount}
					maxViewMonths={maxViewMonths}
					onMonthViewCountChange={this.handleMonthViewCountChange}
				/>

				<MainView
					calendarRef={this.calendarRef}
					baseMonth={this.state.baseMonth}
					monthViewCount={this.state.monthViewCount}
					maxViewMonths={maxViewMonths}
					onMonthViewCountChange={this.handleMonthViewCountChange}
				/>
				<Sidebar />
			</div>
		);
	}
}
