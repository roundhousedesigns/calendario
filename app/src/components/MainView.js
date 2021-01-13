import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { routeBase, postStatuses, dateToMDY } from "../lib/utils.js";

function updatePost(event) {
	let newDate = dateToMDY(event.start);
	let remove_unscheduled = typeof event.unscheduled !== "undefined" ? 1 : 0;
	let postStatus = event.post_status;
	let apiUrl = `${routeBase}/posts/update/${event.id}/${newDate}/${postStatus}/${remove_unscheduled}`;

	fetch(apiUrl, { method: "POST" })
		.then((response) => {
			response.json();
			if (!response.ok) {
				return false;
			}
		})
		.then((data) => {
			// console.log(data);
		});

	return true;
}

export default function MainView(props) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		let apiUrl = `${routeBase}/posts/scheduled/${dateToMDY(
			props.baseMonth
		)}`;

		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) => {
				var today = new Date();
				today.setHours(0, 0, 0, 0);

				if (data.length) {
					data.forEach(function (item, index) {
						let start = new Date(this[index].start);
						start.setHours(0, 0, 0, 0);
						if (start < today) {
							this[index].editable = false;
						}

						this[index].color =
							postStatuses[item.post_status].color;
						this[index].end = this[index].start;
					}, data);

					setPosts(data);
				}
			});
	}, [props.baseMonth]);

	const handleEventDrop = (info) => {
		// Internal calendar event drops
		let event = info.event;
		event.post_status = info.event.extendedProps.post_status;

		updatePost(event);
	};

	const handleEventRecieve = (info) => {
		// Fires on external event drop, including other calendars

		var { event, draggedEl } = info;
		// var calendarApi = info.view.getCurrentData().calendarApi;
		event.post_status = event.extendedProps.post_status;

		if (draggedEl.classList.contains("unscheduled-draft")) {
			// event.setEnd(event.start);
			event.setProp("backgroundColor", postStatuses["draft"].color);
			event.setProp("borderColor", postStatuses["draft"].color);
			event.unscheduled = true;

			if (updatePost(event) === true) {
				// calendarApi.addEvent(event);

				document.getElementById(`unsched-${event.id}`).remove();
			} else {
				event.remove();
			}
		} else {
			updatePost(event);
		}
	};

	const calendarioGrids = () => {
		let components = [];
		for (let i = 0; i < props.maxViewMonths; i++) {
			let hideCalendar = i < props.viewMode ? "visible" : "hidden";

			components.push(
				<div
					id={`fullcalendar-${i}`}
					className={`calendar ${hideCalendar}`}
					key={i}
				>
					<FullCalendar
						key={i}
						ref={props.calendarRef[i]}
						plugins={[dayGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						events={posts}
						initialDate={addMonths(props.baseMonth, i)}
						fixedWeekCount={false}
						editable={true}
						droppable={true}
						showNonCurrentDates={false}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
						eventDragStart={(e) => {
							console.log("synthetic", e);
						}}
						eventDragStop={(ev) => {
							// console.log("stop", ev);
						}}
						eventDidMount={(arg) => {
							const { el, event } = arg;

							// set the element ID
							el.setAttribute("id", `post-id-${event.id}`);

							// set draggable ... doesn't seem to do anything
							// el.setAttribute("draggable", true);
						}}
						// eventLeave={(e) => {
						// 	console.log('leave', e);
						// }}
						// selectMirror={true}
						displayEventTime={false}
						eventDisplay="block"
						selectable={true}
						eventDrop={handleEventDrop}
						eventReceive={handleEventRecieve}
					/>
				</div>
			);
		}

		return components;
	};

	const calendarioList = () => {
		return (
			<div id={`fullcalendar-list`} className={`calendar calendar-list`}>
				<FullCalendar
					key={props.maxViewMonths + 1}
					ref={props.calendarRef[props.maxViewMonths + 1]}
					plugins={[listPlugin, interactionPlugin]}
					views={{
						listAllFuture: {
							type: "list",
							visibleRange: {
								start: new Date(),
								end: props.futuremostDate,
							},
						},
					}}
					initialView="listAllFuture"
					events={posts}
					editable={true}
					droppable={true}
					showNonCurrentDates={false}
					headerToolbar={false}
					displayEventTime={false}
					eventDisplay="block"
				/>
			</div>
		);
	};

	const addMonths = (date, num) => {
		let newDate = new Date(date);
		return newDate.setMonth(date.getMonth() + num);
	};

	return (
		<div className="calendars">
			{props.viewMode === "list" ? calendarioList() : calendarioGrids()}
		</div>
	);
}
