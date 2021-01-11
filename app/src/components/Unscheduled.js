import React, { useState, useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";

export default function Unscheduled(props) {
	const [eventData, setEventData] = useState({});
	const [itemRendered, setItemRendered] = useState(false);

	useEffect(() => {
		setEventData({
			id: props.id,
			title: props.title,
			post_status: "draft",
			// create: false
		});
		setItemRendered(true);
	}, [props.id, props.title]);

	useEffect(() => {
		if (itemRendered === true) {
			new Draggable(document.getElementById(`post-id-${eventData.id}`), {
				eventData: eventData,
			});
		}
	}, [eventData, itemRendered]);

	return (
		<li
			key={props.index}
			id={`post-id-${props.id}`}
			className={`unscheduled-draft post-id-${props.id}`}
		>
			{props.title}
		</li>
	);
}
