import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { routeBase, postStatuses, dateToMDY } from "../lib/utils.js";

function updatePost(event) {
	let newDate = dateToMDY(event.start);
	let unscheduled = typeof event.unscheduled !== "undefined" ? 1 : 0;
	let postStatus = event.post_status;
	let apiUrl = `${routeBase}/update/${event.id}/${newDate}/${postStatus}/${unscheduled}`;

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
	const [futuremostDate, setFuturemostDate] = useState("");

	useEffect(() => {
		fetch(`${routeBase}/futuremost`)
			.then((response) => response.json())
			.then((future) => {
				setFuturemostDate(new Date(future));
			});
	}, []);

	useEffect(() => {
		let apiUrl = `${routeBase}/scheduled/${dateToMDY(props.baseMonth)}`;

		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) => {
				if (data.length) {
					data.forEach(function (item, index) {
						this[index].color =
							postStatuses[item.post_status].color;
						this[index].end = this[index].start;
					}, data);

					setPosts(data);
				}
			});
	}, [props.baseMonth]);

	const handleEventDrop = (info) => {
		let event = info.event;
		event.post_status = info.event.extendedProps.post_status;

		updatePost(event);
	};

	const handleEventRecieve = (info) => {
		// Fires on external event drop, including other calendars
		var event = info.event;
		var calendarApi = info.view.getCurrentData().calendarApi;
		event.post_status = info.event.extendedProps.post_status;

		if (info.draggedEl.classList.contains("unscheduled-draft")) {
			event.unscheduled = true;
			event.setProp("color", postStatuses["draft"].color);
			if (updatePost(event) === true) {
				// calendarApi.addEvent(event);

				document.getElementById(`post-id-${event.id}`).remove();
			}
		} else {
			updatePost(event);
		}
	};

	// const handleEventRecieve = (info) => {
	// 	let calendarApi = info.view.getCurrentData().calendarApi;

	// 	calendarApi.refetchEvents();
	// };

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
						displayEventTime={false}
						eventDisplay="block"
						selectable={true}
						// drop={handleDrop}
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
