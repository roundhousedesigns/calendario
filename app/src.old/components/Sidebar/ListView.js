import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useFutureMost } from "../../lib/hooks";
import { routeBase, dateToMDY, getThisMonth, getToday } from "../../lib/utils";

const ListView = () => {
	const today = getToday();
	const baseMonth = getThisMonth();
	const futuremostDate = useFutureMost();

	return (
		<div id={`fullcalendar-list`} className={`calendar calendar-list`}>
			<FullCalendar
				key="list"
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
				// listDaySideFormat={{ weekday: "long" }}
				showNonCurrentDates={false}
				headerToolbar={false}
				displayEventTime={false}
				eventDisplay="block"
				noEventsText="No upcoming posts."
			/>
		</div>
	);
};

export default ListView;
