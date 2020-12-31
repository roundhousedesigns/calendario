import React from "react";
import { Component } from "@fullcalendar/react";
import Header from "./components/Header";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";

import "./App.css";

const maxViewMonths = 3;
const thisMonth = new Date();
thisMonth.setDate(1);

export default class App extends Component {
	constructor(props) {
		super(props);

		this.handleViewChange = this.handleViewChange.bind(this);

		this.state = {
			baseMonth: thisMonth,
			viewMode: maxViewMonths.toString(),
		};

		this.calendarRef = [];
		for (let i = 0; i < maxViewMonths; i++) {
			this.calendarRef[i] = React.createRef();
		}
	}

	handleViewChange(viewMode) {
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
