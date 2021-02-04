import React from "react";

export default function PostEvent(props) {
	const { post } = props;

	return post ? (
		<div className="calendar__event">{post.post_title}</div>
	) : null;
}
