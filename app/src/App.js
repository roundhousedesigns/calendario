import React from "react";
import FullCalendar, { Component } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "./App.css";

const plugins = [dayGridPlugin];
const postsRouteBase = "http://localhost/wp-json/calendario/v1/posts/";
const statuses = [
	{
		status: "publish",
		color: "blue",
	},
	{
		status: "future",
		color: "green",
	},
	{
		status: "draft",
		color: "gray",
	},
	{
		status: "pending",
		color: "red",
	},
];
const eventSources = () => {
	let tempDatesString = "12-01-202/12-24-2020";
	let postsRoute = postsRouteBase + tempDatesString;

	return statuses.map((item, index) => {
		return {
			url: postsRoute + "/" + item.status,
			color: item.color,
		};
	});
};

export default class App extends Component {
	constructor(props) {
		super(props);

		let today = new Date();
		today.setDate(1);

		this.state = {
			posts: [],
			baseMonth: today,
		};

		// bind increment/decrement handlers?
	}

	addMonths(date, num) {
		let newDate = new Date(date);
		return newDate.setMonth(date.getMonth() + num);
	}

	incrementMonthOffset() {}
	decrementMonthOffset() {}

	render() {
		if (!this.state.posts || !this.state.baseMonth) {
			return <div />;
		}

		return (
			<div className="App">
				<header className="App-header">
					<h1 className="page-title">Calendario II: The Datening</h1>
				</header>

				<div className="calendars">
					<FullCalendar
						key="1"
						plugins={plugins}
						initialView="dayGridMonth"
						eventSources={eventSources}
						initialDate={this.state.baseMonth}
						customButtons={{
							customPrev: {
								text: "<",
								click: this.decrementMonthOffset,
							},
							customNext: {
								text: ">",
								click: this.incrementMonthOffset,
							},
						}}
						headerToolbar={{
							left: "title",
							center: "",
							right: "customPrev customNext",
						}}
					/>

					<FullCalendar
						key="2"
						plugins={plugins}
						initialView="dayGridMonth"
						eventSources={eventSources}
						initialDate={this.addMonths(this.state.baseMonth, 1)}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
					/>

					<FullCalendar
						key="3"
						plugins={plugins}
						initialView="dayGridMonth"
						eventSources={eventSources}
						initialDate={this.addMonths(this.state.baseMonth, 2)}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
					/>
				</div>
			</div>
		);
	}
}
