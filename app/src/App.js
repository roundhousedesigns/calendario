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

const tempMonthCount = 3;

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
	calendarRef = [React.createRef(), React.createRef(), React.createRef()];

	constructor(props) {
		super(props);

		let today = new Date();
		today.setDate(1);

		this.state = {
			posts: [],
			baseMonth: today,
			monthViewCount: tempMonthCount,
		};

		this.nextMonth = this.nextMonth.bind(this);
		this.prevMonth = this.prevMonth.bind(this);
	}

	calendarios() {
		let components = [];
		for (let i = 0; i < this.state.monthViewCount; i++) {
			components.push(
				<div id={`fullcalendar-${i}`}>
					<FullCalendar
						key={i}
						ref={this.calendarRef[i]}
						plugins={plugins}
						initialView="dayGridMonth"
						eventSources={eventSources}
						initialDate={this.addMonths(this.state.baseMonth, i)}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
					/>
				</div>
			);
		}

		return components;
	}

	addMonths(date, num) {
		let newDate = new Date(date);
		return newDate.setMonth(date.getMonth() + num);
	}

	nextMonth() {
		for (let i = 0; i < this.state.monthViewCount; i++) {
			let calendarApi = this.calendarRef[i].current.getApi();

			calendarApi.next();
		}
	}

	prevMonth() {
		for (let i = 0; i < this.state.monthViewCount; i++) {
			let calendarApi = this.calendarRef[i].current.getApi();

			calendarApi.prev();
		}
	}

	render() {
		if (!this.state.posts || !this.state.baseMonth) {
			return <div />;
		}

		return (
			<div className="App">
				<header className="App-header">
					<h1 className="page-title">Calendario II: The Datening</h1>
				</header>

				<button className="prev" id="prev" onClick={this.prevMonth}>
					PREV
				</button>
				<button className="next" id="next" onClick={this.nextMonth}>
					NEXT
				</button>

				{this.calendarios()}
			</div>
		);
	}
}
