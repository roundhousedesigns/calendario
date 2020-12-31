import React from "react";
import { Component } from "@fullcalendar/react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";

import "./App.css";

const maxViewMonths = 3;

export default class App extends Component {
	// TODO: programatically create this array
	calendarRef = [
		React.createRef(),
		React.createRef(),
		React.createRef(),
		React.createRef(),
	];

	constructor(props) {
		super(props);

		this.handleViewChange = this.handleViewChange.bind(this);

		let today = new Date();
		today.setDate(1);

		this.state = {
			baseMonth: today,
			viewMode: maxViewMonths.toString(),
		};
	}

	componentDidMount() {}

	handleViewChange(viewMode) {
		// let calendarApi =
		// if ( viewMode === "list" ) {
		// 	this.calendarRef[0].current.getApi()
		// }

		this.setState({ viewMode });
	}

	render() {
		return (
			<div className="calendario">
				<Header
					calendarRef={this.calendarRef}
					viewMode={this.state.viewMode}
					maxViewMonths={maxViewMonths}
					onViewChange={this.handleViewChange}
				/>

				<MainView
					calendarRef={this.calendarRef}
					baseMonth={this.state.baseMonth}
					viewMode={this.state.viewMode}
					maxViewMonths={maxViewMonths}
					onViewChange={this.handleViewChange}
				/>
				<Sidebar />
			</div>
		);
	}
}
