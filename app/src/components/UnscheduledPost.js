import React, { Component } from "react";

class UnscheduledPost extends Component {
	render() {
		return (
			<li className={`unscheduled-post post-id-${this.props.post.id}`}>
				<p className="post-title">{this.props.post.title}</p>
			</li>
		);
	}
}

export default UnscheduledPost;
