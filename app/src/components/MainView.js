import React from "react";
import FullCalendar, { Component } from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import { eventSources } from "../lib/utils.js";

const plugins = [dayGridPlugin, listPlugin];

class MainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			posts: [],
			eventSources: "",
		};
	}

	componentDidMount() {
		this.setState({
			eventSources: eventSources(),
		});
	}

	calendarios = () => {
		let components = [];
		for (let i = 0; i < this.props.maxViewMonths; i++) {
			let hideCalendar =
				i < this.props.monthViewCount ? "visible" : "hidden";
			components.push(
				<div
					id={`fullcalendar-${i}`}
					className={`calendar ${hideCalendar}`}
					key={i}
				>
					<FullCalendar
						key={i}
						ref={this.props.calendarRef[i]}
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
						displayEventTime={false}
						eventDisplay="block"
					/>
				</div>
			);
		}

		return components;
	};

	addMonths = (date, num) => {
		let newDate = new Date(date);
		return newDate.setMonth(date.getMonth() + num);
	};

	render() {
		if (!this.props.baseMonth) {
			return null;
		}

		return <div className="calendars">{this.calendarios()}</div>;
	}
}

export default MainView;
