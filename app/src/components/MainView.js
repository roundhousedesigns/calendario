import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { routeBase, dateToMDY } from "../lib/utils.js";

const postStatuses = [
	{
		status: "publish",
		color: "blue",
		editable: false,
	},
	{
		status: "future",
		color: "green",
		editable: true,
	},
	{
		status: "draft",
		color: "gray",
		editable: true,
	},
	{
		status: "pending",
		color: "red",
		editable: true,
	},
];

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
		let postsRoute = `${routeBase}/futuremost`;

		fetch(postsRoute)
			.then((response) => response.json())
			.then((future) => {
				this.setState({ futuremostDate: new Date(future) });
			});
	}

	eventSources = () => {
		let start = this.props.baseMonth;
		let postsRoute = `${routeBase}/${dateToMDY(start)}`;

		return postStatuses.map((item, index) => {
			return {
				url: postsRoute + "/" + item.status,
				color: item.color,
				// editable: item.editable,
			};
		});
	};

	handleDragStart = (stuff) => {
		console.log("dragStart", stuff);
	};

	handleEventDrop = (stuff) => {
		console.log("handleEventDrop", stuff);
	};

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
						plugins={[dayGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						eventSources={this.eventSources(this.props.baseMonth)}
						initialDate={this.addMonths(this.props.baseMonth, i)}
						fixedWeekCount={false}
						editable={true}
						droppable={true}
						showNonCurrentDates={false}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
						displayEventTime={false}
						eventDisplay="block"
						selectable={true}
						// dateClick={this.handleDateClick}
						// eventDragStart={this.handleDragStart}
						// eventStartEditable={true}
						// eventDrop={this.handleEventDrop}
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
					plugins={[listPlugin, interactionPlugin]}
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
					eventSources={this.eventSources(this.props.baseMonth)}
					initialDate={this.props.baseMonth}
					editable={true}
					showNonCurrentDates={false}
					headerToolbar={{
						left: "title",
						center: "",
						right: "",
					}}
					// dateClick={this.handleDateClick}
					eventDragStart={this.handleDragStart}
					displayEventTime={false}
					eventDisplay="block"
					eventStartEditable={true}
					eventDrop={this.handleEventDrop}
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
