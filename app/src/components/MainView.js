import React, { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Loading from "./Loading";
import {
	routeBase,
	postStatuses,
	dateToMDY,
	updatePost,
	addMonths,
} from "../lib/utils.js";

import SidebarPostsContext from "../context/SidebarPosts";
import PostModalContext from "../context/PostModal";

const MainView = ({
	calendarRefs,
	baseMonth,
	viewMode,
	maxViewMonths,
	futuremostDate,
}) => {
	const [calendarIsLoading, setCalendarIsLoading] = useState(false);
	const [unscheduledList, setUnscheduledList] = useState("");
	const [draggedEvent, setDraggedEvent] = useState({});

	const { sidebarPostsDispatch } = useContext(SidebarPostsContext);
	const { postModalDispatch } = useContext(PostModalContext);

	useEffect(() => {
		let el = document.getElementById("unscheduled-drafts-list");

		if (el) {
			setUnscheduledList(el);
		}
	}, [unscheduledList]);

	const handleEventDidMount = (arg) => {
		const { el, event } = arg;

		// set the element ID
		el.setAttribute("id", `post-id-${event.id}`);
	};

	const handleEventLoading = (isLoading) => {
		setCalendarIsLoading(isLoading);
	};

	const handleEventDragStart = (info) => {
		const { event } = info;

		event.post_status = event.extendedProps.post_status;

		setDraggedEvent({
			event: event,
		});
	};

	/**
	 * Handles moving events off the sidebar
	 */
	const handleEventDragStop = (info) => {
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
					draggedEvent.event.post_status,
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

	/**
	 * Internal calendar event drops
	 */
	const handleEventDrop = (info) => {
		const { event } = info;

		updatePost(
			event.id,
			event.start,
			event.extendedProps.post_status,
			false
		);
	};

	/**
	 * Fires on external event drop, including from other calendars
	 */
	const handleEventRecieve = (info) => {
		var { event, draggedEl } = info;
		let post_status = event.extendedProps.post_status;

		if (draggedEl.classList.contains("unscheduled-draft")) {
			/**
			 * FROM sidebar TO calendar
			 */
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
			/**
			 * FROM calendar A TO calendar B
			 */
			updatePost(event.id, event.start, post_status, false);
		}
	};

	/**
	 * Clicking an event on the calendar.
	 */
	const handleEventClick = (info) => {
		const { event } = info;

		let post = {
			id: event.id,
			title: event.title,
			post_date: event.start,
			post_status: event.extendedProps.post_status,
			unscheduled: false,
		};

		postModalDispatch({
			type: "OPEN",
			post: post,
			calendarRefs: calendarRefs,
		});
	};

	/**
	 * Calendario Grid view
	 */
	const calendarioGrids = () => {
		let components = [];
		for (let i = 0; i < maxViewMonths; i++) {
			let hideCalendar = i < viewMode ? "visible" : "hidden";

			components.push(
				<div
					id={`fullcalendar-${i}`}
					className={`calendar ${hideCalendar}`}
					key={i}
				>
					<FullCalendar
						key={i}
						ref={calendarRefs[i]}
						plugins={[dayGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						defaultTimedEventDuration={"00:01"}
						eventSources={[
							`${routeBase}/posts/scheduled/${dateToMDY(
								baseMonth
							)}`,
						]}
						loading={handleEventLoading}
						initialDate={addMonths(baseMonth, i)}
						fixedWeekCount={false}
						editable={true}
						droppable={true}
						eventClick={handleEventClick}
						showNonCurrentDates={false}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
						eventDragStart={handleEventDragStart}
						eventDragStop={handleEventDragStop}
						eventDidMount={handleEventDidMount}
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

	/**
	 * Calendario List view
	 */
	const calendarioList = () => {
		return (
			<div id={`fullcalendar-list`} className={`calendar calendar-list`}>
				<FullCalendar
					key={maxViewMonths + 1}
					ref={calendarRefs[maxViewMonths + 1]}
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
					eventSources={[
						`${routeBase}/posts/scheduled/${dateToMDY(baseMonth)}`,
					]}
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

	return (
		<div className="calendars">
			<Loading show={calendarIsLoading} />

			{viewMode === "list" ? calendarioList() : calendarioGrids()}
		</div>
	);
};

export default MainView;
