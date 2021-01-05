import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { routeBase, postStatuses, dateToMDY } from "../lib/utils.js";

function updatePost(event) {
	let newDate = dateToMDY(event.start);
	let postsRoute = `${routeBase}/update/${event.id}/${newDate}`;

	fetch(postsRoute)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		});
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
						this[index].color = postStatuses[item.status].color;
					}, data);

					setPosts(data);
				}
			});
	}, [props.baseMonth]);

	const handleEventDrop = (dropInfo) => {
		// send update to API
		// console.log(dropInfo.event.id + " new:", dropInfo.event.start);
		// console.log("old post date: ", dropInfo.oldEvent.start);

		updatePost(dropInfo.event);
	};

	const handleEventRecieve = (dropInfo) => {
		updatePost(dropInfo.event);
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
