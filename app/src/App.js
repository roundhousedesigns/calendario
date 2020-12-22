import React from "react";
import FullCalendar, { Component } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "./App.css";

const postsRouteBase = "http://localhost/wp-json/calendario/v1/posts/";
const monthLimit = 3;

class App extends Component {
	state = {
		posts: [],
		monthOffset: 0,
	};

	getFirstOfMonth(date, i) {
		date.setDate(1);
		date.setMonth(date.getMonth() + i);
		return date;
	}

	render() {
		if (!this.state.posts) {
			return <div />;
		}

		let tempDatesString = "12-01-202/12-24-2020";
		let postsRoute = postsRouteBase + tempDatesString;

		let calendars = [];

		for (let i = 0; i < monthLimit; i++) {
			let month = i + this.state.monthOffset;
			let today = new Date();
			let initialMonth = this.getFirstOfMonth(today, month);
			let headerToolbar = {
				start: "title",
				center: "",
				right: "",
			};
			if (i <= 0) {
				headerToolbar.right = "prev next";
			}

			calendars.push(
				<FullCalendar
					key={i}
					plugins={[dayGridPlugin]}
					initialView="dayGridMonth"
					eventSources={[
						{
							url: postsRoute,
							color: "green",
						},
					]}
					initialDate={initialMonth}
					headerToolbar={headerToolbar}
				/>
			);
		}

		return (
			<div className="App">
				<header className="App-header">
					<h1 className="page-title">Calendario II: The Datening</h1>
				</header>

				{calendars}
			</div>
		);
	}
}

export default App;
