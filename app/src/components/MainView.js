import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin /*Draggable*/ from "@fullcalendar/interaction";
import { routeBase, postStatuses, dateToMDY } from "../lib/utils.js";

function updatePost(event, postStatus) {
	let newDate = dateToMDY(event.start);
	let unscheduled = event.unscheduled === true ? 1 : 0;
	let postsRoute = `${routeBase}/update/${event.id}/${newDate}/${postStatus}/${unscheduled}`;

	fetch(postsRoute, { method: "POST" })
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

function eventExists(eventID, calendarApi) {
	return calendarApi.getEventById(eventID) === null ? false : true;
}

export default function MainView(props) {
	// const [eventSources, setEventSources] = useState("");
	const [posts, setPosts] = useState([]);
	const [futuremostDate, setFuturemostDate] = useState("");

	useEffect(() => {
		fetch(`${routeBase}/futuremost`)
			.then((response) => response.json())
			.then((future) => {
				setFuturemostDate(new Date(future));
			});
	}, []);

	useEffect(() => {
		let postsRoute = `${routeBase}/scheduled/${dateToMDY(props.baseMonth)}`;

		fetch(postsRoute)
			.then((response) => response.json())
			.then((data) => {
				if (data.length) {
					data.forEach(function (item, index) {
						this[index].color =
							postStatuses[item.post_status].color;
					}, data);

					setPosts(data);
				}
			});
	}, [props.baseMonth]);

	const handleEventDrop = (dropInfo) => {
		updatePost(dropInfo.event, dropInfo.event.extendedProps.post_status);
	};

	const handleDrop = (dropInfo) => {
		let calendarApi = dropInfo.view.getCurrentData().calendarApi;
		let eventData = JSON.parse(dropInfo.draggedEl.dataset.event);

		// Check if event already exists (hacky: prevent duplicates)
		let unscheduledEl = document.getElementById(`post-id-${eventData.id}`);
		if (eventExists(eventData.id, calendarApi)) {
			eventData.create = false;
		} else {
			// Add event
			eventData.create = true;
			eventData.start = dropInfo.date;
			eventData.color = postStatuses["draft"].color;

			// Update the post, and if successful, add the event
			let updated = updatePost(eventData, eventData.post_status);
			if (updated === true) {
				calendarApi.addEvent(eventData);
			}

			// Remove event from Unscheduled list
			if (unscheduledEl && typeof unscheduledEl !== "undefined") {
				unscheduledEl.remove();
			}
		}
	};

	const handleEventRecieve = (dropInfo) => {
		let calendarApi = dropInfo.view.getCurrentData().calendarApi;

		calendarApi.refetchEvents();
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
						// eventSources={eventSources}
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
						displayEventTime={false}
						eventDisplay="block"
						selectable={true}
						drop={handleDrop}
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
								end: futuremostDate,
							},
						},
					}}
					initialView="listAllFuture"
					// eventSources={eventSources}
					events={posts}
					initialDate={props.baseMonth}
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
