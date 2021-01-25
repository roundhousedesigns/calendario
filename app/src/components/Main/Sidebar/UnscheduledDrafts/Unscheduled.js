import React, { useState, useEffect, useContext } from "react";
import { Draggable } from "@fullcalendar/interaction";
import { firstToUpper } from "../../../../lib/utils";
import PostModalContext from "../../../../PostModalContext";

const Unscheduled = ({ post, index }) => {
	const [eventData, setEventData] = useState({});
	const [itemRendered, setItemRendered] = useState(false);

	const { postModalDispatch } = useContext(PostModalContext);

	useEffect(() => {
		setEventData({
			id: post.id,
			title: post.title,
			post_date: post.post_date,
			post_status: post.post_status,
			unscheduled: true,
		});

		setItemRendered(true);
	}, [post.id, post.title, post.post_date, post.post_status]);

	useEffect(() => {
		if (itemRendered === true) {
			new Draggable(document.getElementById(`unsched-${eventData.id}`), {
				eventData: eventData,
			});
		}
	}, [eventData, itemRendered]);

	const handleClick = () => {
		postModalDispatch({
			type: "OPEN",
			post: eventData,
		});
	};

	return (
		<li
			key={index}
			id={`unsched-${post.id}`}
			className={`unscheduled-draft fc-event post-id-${post.id}`}
			onClick={handleClick}
		>
			{post.title}
			{post.post_status === "pending" ||
			post.post_status === "private" ? (
				<span className="flag">{firstToUpper(post.post_status)}</span>
			) : (
				""
			)}
		</li>
	);
};

export default Unscheduled;