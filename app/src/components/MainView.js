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
import CalendarContext from "../context/Calendar";

const MainView = ({
	baseMonth,
	viewMode,
	maxViewMonths,
	viewMonthCount,
	futuremostDate,
	today,
}) => {
	const calendarRefs = useContext(CalendarContext);
	const [calendarIsLoading, setCalendarIsLoading] = useState(false);
	const [unscheduledList, setUnscheduledList] = useState("");
	const [draggedEvent, setDraggedEvent] = useState({ event: {} });

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

	const handleEventAllow = (dropInfo, draggedEvent) => {
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

		if (event.start < today) {
		}

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
						loading={handleEventLoading}
						initialDate={addMonths(baseMonth, i)}
						headerToolbar={{
							left: "title",
							center: "",
							right: "",
						}}
						showNonCurrentDates={false}
						selectMirror={false}
						fixedWeekCount={false}
						editable={true}
						droppable={true}
						selectable={true}
						eventAllow={handleEventAllow}
						eventClick={handleEventClick}
						eventDragStart={handleEventDragStart}
						eventDragStop={handleEventDragStop}
						eventDidMount={handleEventDidMount}
						displayEventTime={false}
						eventDisplay="block"
						eventDrop={handleEventDrop}
						eventReceive={handleEventRecieve}
					/>
				</div>
			);
		}

		return calendars;
	};

	/**
	 * Calendario List view
	 */
	const calendarioList = () => {
		return (
			<div id={`fullcalendar-list`} className={`calendar calendar-list`}>
				<FullCalendar
					key={viewMonthCount + 1}
					ref={calendarRefs[viewMonthCount + 1]}
					plugins={[listPlugin, interactionPlugin]}
					views={{
						listAllFuture: {
							type: "list",
							visibleRange: {
								start: today,
								end: futuremostDate,
							},
						},
					}}
					initialView="listAllFuture"
					eventSources={[
						`${routeBase}/posts/scheduled/${dateToMDY(baseMonth)}`,
					]}
					listDayFormat={{
						month: "long",
						day: "numeric",
					}}
					listDaySideFormat={{ weekday: "long" }}
					// editable={true}
					droppable={true}
					showNonCurrentDates={false}
					headerToolbar={false}
					displayEventTime={false}
					eventDisplay="block"
					noEventsText="No upcoming posts."
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
