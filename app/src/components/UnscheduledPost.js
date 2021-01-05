import React from "react";

export default function UnscheduledPost(props) {
	return (
		<li className={`unscheduled-post post-id-${props.post.id}`}>
			<p className="post-title">{props.post.title}</p>
		</li>
	);
}
