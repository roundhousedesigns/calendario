import React from "react";
import FullCalendar, { Component } from "@fullcalendar/react";
// import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import { eventSources } from "../lib/utils.js";

const plugins = [dayGridPlugin];

class Calendars extends Component {
	calendarRef = [React.createRef(), React.createRef(), React.createRef()];

	constructor(props) {
		super(props);

		this.state = {
			posts: [],
			eventSources: "",
		};

		this.nextMonth = this.nextMonth.bind(this);
		this.prevMonth = this.prevMonth.bind(this);
	}

	componentDidMount() {
		this.setState({
			eventSources: eventSources(),
		});
	}

	calendarios() {
		if (!this.props.monthViewCount || !this.props.baseMonth) {
			return;
		}

		let components = [];
		for (let i = 0; i < this.props.monthViewCount; i++) {
			components.push(
				<div id={`fullcalendar-${i}`} className="calendar" key={i}>
					<FullCalendar
						key={i}
						ref={this.calendarRef[i]}
						plugins={plugins}
						initialView="dayGridMonth"
						eventSources={eventSources(
							this.props.baseMonth,
							this.props.monthViewCount
						)}
						initialDate={this.addMonths(this.props.baseMonth, i)}
						fixedWeekCount={false}
						showNonCurrentDates={false}
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
		for (let i = 0; i < this.props.monthViewCount; i++) {
			let calendarApi = this.calendarRef[i].current.getApi();

			calendarApi.next();
		}
	}

	prevMonth() {
		for (let i = 0; i < this.props.monthViewCount; i++) {
			let calendarApi = this.calendarRef[i].current.getApi();

			calendarApi.prev();
		}
	}

	render() {
		if (!this.props.baseMonth) {
			return null;
		}

		return (
			<div className="calendars">
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

export default Calendars;
