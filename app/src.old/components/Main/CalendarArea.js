import React, { useEffect, useState, useContext } from "react";
import Calendar from "./MyCalendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
	routeBase,
	postStatuses,
	dateToMDY,
	updatePost,
	addMonths,
	getThisMonth,
	getToday,
} from "../../lib/utils.js";

import SidebarPostsContext from "../SidebarPostsContext";
import PostModalContext from "../../PostModalContext";
import CalendarContext from "../../CalendarContext";

const CalendarArea = ({ maxViewMonths, viewMonthCount }) => {
	const calendarRefs = useContext(CalendarContext);
	const { sidebarPostsDispatch } = useContext(SidebarPostsContext);
	const { postModalDispatch } = useContext(PostModalContext);

	const [unscheduledList, setUnscheduledList] = useState({});
	const [draggedEvent, setDraggedEvent] = useState({});
	getToday();
	const baseMonth = getThisMonth();
	const today = getToday();

	useEffect(() => {
		let el = document.getElementById("unscheduledDrafts__list");

		if (el) {
			setUnscheduledList(el);
		}
	}, [unscheduledList]);

	const handleEventDidMount = (arg) => {
		const { el, event } = arg;

		// set the element ID
		el.setAttribute("id", `post-id-${event.id}`);
	};

	const handleEventAllow = (dropInfo) => {
		// Don't allow dropping onto past dates
		if (today < dropInfo.start) {
			return true;
		} else {
			return false;
		}
	};

	const handleEventDragStart = (info) => {
		const { event } = info;

		event.post_status = event.extendedProps.post_status;

		setDraggedEvent(event);
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
					draggedEvent.id,
					draggedEvent.start,
					draggedEvent.post_status,
					true
				) === true
			) {
				sidebarPostsDispatch({
					type: "ADD",
					event: draggedEvent,
				});

				let deleteEvent = view
					.getCurrentData()
					.calendarApi.getEventById(draggedEvent.id);

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
		let calendars = [];
		let monthCount =
			viewMonthCount > maxViewMonths ? maxViewMonths : viewMonthCount;
		for (let i = 0; i < monthCount; i++) {
			let hideCalendar = i < monthCount ? "visible" : "hidden";
			let monthStart = addMonths(baseMonth, i);
			let monthEnd = new Date(
				monthStart.getFullYear(),
				monthStart.getMonth() + 1,
				0
			);
			let monthStartString = dateToMDY(monthStart);
			let monthEndString = dateToMDY(monthEnd);

			calendars.push(
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
							`${routeBase}/posts/scheduled/${monthStartString}/${monthEndString}`,
						]}
						initialDate={addMonths(baseMonth, i)}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
						editable={true}
						droppable={true}
						showNonCurrentDates={false}
						selectMirror={false}
						fixedWeekCount={false}
						eventDisplay="block"
						displayEventTime={false}
						eventAllow={handleEventAllow}
						eventClick={handleEventClick}
						eventDragStart={handleEventDragStart}
						eventDragStop={handleEventDragStop}
						eventDidMount={handleEventDidMount}
						eventDrop={handleEventDrop}
						eventReceive={handleEventRecieve}
					/>
				</div>
			);
		}

		return calendars;
	};

	return (
		<div className="calendars">
			{/* {calendarioGrids()} */}
			{<Calendar />}
		</div>
	);
};

export default CalendarArea;
