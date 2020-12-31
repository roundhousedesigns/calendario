import React from "react";
import FullCalendar, { Component } from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import { eventSources, routeBase } from "../lib/utils.js";

class MainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			posts: [],
			eventSources: "",
			futuremostDate: "",
		};
	}

	componentDidMount() {
		this.setState({
			eventSources: eventSources(),
		});

		let postsRoute = `${routeBase}/futuremost`;

		fetch(postsRoute)
			.then((response) => response.json())
			.then((future) => {
				this.setState({ futuremostDate: new Date(future) });
			});
	}

	calendarioGrids = () => {
		let components = [];
		for (let i = 0; i < this.props.maxViewMonths; i++) {
			let hideCalendar = i < this.props.viewMode ? "visible" : "hidden";

			components.push(
				<div
					id={`fullcalendar-${i}`}
					className={`calendar ${hideCalendar}`}
					key={i}
				>
					<FullCalendar
						key={i}
						ref={this.props.calendarRef[i]}
						plugins={[dayGridPlugin]}
						initialView="dayGridMonth"
						eventSources={eventSources(this.props.baseMonth)}
						initialDate={this.addMonths(this.props.baseMonth, i)}
						fixedWeekCount={false}
						editable={true}
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

	calendarioList = () => {
		return (
			<div id={`fullcalendar-list`} className={`calendar calendar-list`}>
				<FullCalendar
					key={this.props.maxViewMonths + 1}
					ref={this.props.calendarRef[this.props.maxViewMonths + 1]}
					plugins={[listPlugin]}
					views={{
						listAllFuture: {
							type: "list",
							visibleRange: {
								start: new Date(),
								end: this.state.futuremostDate,
							},
						},
					}}
					initialView="listAllFuture"
					eventSources={eventSources(this.props.baseMonth)}
					initialDate={this.props.baseMonth}
					editable={true}
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
	};

	addMonths = (date, num) => {
		let newDate = new Date(date);
		return newDate.setMonth(date.getMonth() + num);
	};

	render() {
		if (!this.props.baseMonth) {
			return null;
		}

		return (
			<div className="calendars">
				{this.props.viewMode === "list"
					? this.calendarioList()
					: this.calendarioGrids()}
			</div>
		);
	}
}

export default MainView;
