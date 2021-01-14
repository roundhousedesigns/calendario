import React, { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
	routeBase,
	postStatuses,
	dateToMDY,
	updatePost,
} from "../lib/utils.js";
import SidebarPostsContext from "../SidebarPosts";

export default function MainView(props) {
	// const [posts, setPosts] = useState([]);
	const [unscheduledList, setUnscheduledList] = useState("");
	const [draggedEvent, setDraggedEvent] = useState({});

	const { sidebarPostsDispatch } = useContext(SidebarPostsContext);

	// useEffect(() => {
	// 	let apiUrl = `${routeBase}/posts/scheduled/${dateToMDY(
	// 		props.baseMonth
	// 	)}`;

	// 	fetch(apiUrl)
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			var today = new Date();
	// 			today.setHours(0, 0, 0, 0);

	// 			if (data.length) {
	// 				data.forEach(function (item, index) {
	// 					let start = new Date(this[index].start);
	// 					start.setHours(0, 0, 0, 0);
	// 					if (start < today) {
	// 						this[index].editable = false;
	// 					}

	// 					this[index].color =
	// 						postStatuses[item.post_status].color;
	// 				}, data);

	// 				setPosts(data);
	// 			}
	// 		});
	// }, [props.baseMonth]);

	useEffect(() => {
		let el = document.getElementById("unscheduled-drafts-list");

		if (el) {
			setUnscheduledList(el);
		}
	}, [unscheduledList]);

	const handleEventDragStart = (info) => {
		const { event } = info;

		setDraggedEvent({
			event: event,
		});
	};

	const handleEventDragStop = (info) => {
		// Handles moving events off the sidebar

		const { jsEvent, view } = info;
		let dropZoneRect = unscheduledList.getBoundingClientRect();
		let { top, right, bottom, left } = dropZoneRect;
		let { clientX, clientY } = jsEvent;

		if (
			clientX >= left &&
			clientX <= right &&
			clientY >= top &&
			clientY <= bottom
		) {
			if (
				updatePost(
					draggedEvent.event.id,
					draggedEvent.event.start,
					"draft",
					true
				) === true
			) {
				sidebarPostsDispatch({
					type: "ADD",
					event: draggedEvent.event,
				});

				let deleteEvent = view
					.getCurrentData()
					.calendarApi.getEventById(draggedEvent.event.id);

				deleteEvent.remove();
			}
		}

		setDraggedEvent({});
	};

	const handleEventDrop = (info) => {
		// Internal calendar event drops
		const { event } = info;

		updatePost(
			event.id,
			event.start,
			event.extendedProps.post_status,
			false
		);
	};

	const handleEventRecieve = (info) => {
		// Fires on external event drop, including from other calendars

		var { event, draggedEl } = info;

		if (draggedEl.classList.contains("unscheduled-draft")) {
			// FROM sidebar TO calendar
			let post_status = "draft";
			event.setProp("backgroundColor", postStatuses[post_status].color);
			event.setProp("borderColor", postStatuses[post_status].color);

			if (
				updatePost(event.id, event.start, post_status, false) === true
			) {
				sidebarPostsDispatch({
					type: "REMOVE",
					event: event,
				});

				let el = document.getElementById(`unsched-${event.id}`);
				if (el) el.remove();
			} else {
				// cancel
				event.remove();
			}
		} else {
			// FROM calendar A TO calendar B
			updatePost(event.id, event.start, event.post_status, false);
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
						// forceEventDuration={true}
						defaultTimedEventDuration={"00:01"}
						// events={posts}
						eventSources={[
							`${routeBase}/posts/scheduled/${dateToMDY(
								props.baseMonth
							)}`,
						]}
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
						eventDragStart={handleEventDragStart}
						eventDragStop={handleEventDragStop}
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
					eventSources={[
						`${routeBase}/posts/scheduled/${dateToMDY(
							props.baseMonth
						)}`,
					]}
					// events={posts}
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
