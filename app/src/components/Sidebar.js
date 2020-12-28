import React, { Component } from "react";
import UnscheduledPost from "./UnscheduledPost";
import { routeBase } from "../lib/utils.js";

class Sidebar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			posts: null,
		};
	}

	componentDidMount() {
		const apiUrl = `${routeBase}unscheduled`;
		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					posts: data,
				})
			);
	}

	render() {
		if (!this.state.posts) {
			return null;
		}

		return (
			<div className="sidebar">
				<ul className="unscheduled-posts">
					{this.state.posts.map((postData, index) => (
						<UnscheduledPost post={postData} key={index} />
					))}
				</ul>
			</div>
		);
	}
}

export default Sidebar;
