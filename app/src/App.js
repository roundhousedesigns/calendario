import React from "react";
import { Component } from "@fullcalendar/react";
import Calendars from "./components/Calendars";
import Sidebar from "./components/Sidebar";

import "./App.css";

const tempMonthCount = 3;

export default class App extends Component {
	constructor(props) {
		super(props);
		let today = new Date();
		today.setDate(1);

		this.state = {
			baseMonth: today,
		};
	}

	render() {
		return (
			<div className="calendario">
				<header className="calendario-header">
					<h1 className="page-title">Calendario II: The Datening</h1>
				</header>

				<Calendars
					baseMonth={this.state.baseMonth}
					monthViewCount={tempMonthCount}
				/>
				<Sidebar />
			</div>
		);
	}
}
