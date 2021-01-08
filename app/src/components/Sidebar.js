import React, { useState, useEffect } from "react";
import { routeBase } from "../lib/utils.js";

export default function Sidebar() {
	const [sidebarPosts, setSidebarPosts] = useState([]);
	const [postOrderChanged, setPostOrderChanged] = useState(false);

	useEffect(() => {
		const apiUrl = `${routeBase}/unscheduled`;
		let postIDs = [];
		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) => {
				setSidebarPosts(data);

				for (let item in data) {
					postIDs.push(item.id);
				}
			});
	}, []);

	useEffect(() => {
		if (postOrderChanged === true) {
			let ids = [];
			// eslint-disable-next-line
			for (let [i, post] of sidebarPosts.entries()) {
				ids.push(post.id);
			}

			const idString = ids.join(";");
			const apiUrl = `${routeBase}/updateUnscheduledDraftOrder/${idString}`;

			fetch(apiUrl, { method: "POST" })
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
				});

			setPostOrderChanged(false);
		}
	}, [postOrderChanged, sidebarPosts]);

	function handleOnDragEnd(result) {
		const items = Array.from(sidebarPosts);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setSidebarPosts(items);
		setPostOrderChanged(true);
	}

	return (
		<div id="sidebar" className="sidebar">
			<h2 className="sidebar-title">Unscheduled Drafts</h2>
			<div id="unscheduled-drafts" className="unscheduled-drafts">
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable droppableId="unscheduledList">
						{(provided) => (
							<ul
								className="unscheduledList"
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{sidebarPosts.map(({ id, title }, index) => (
									<Draggable
										key={id}
										draggableId={`${id}`}
										index={index}
									>
										{(provided) => (
											<li
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												id={`post-id-${id}`}
												className={`unscheduled-draft post-id-${id}`}
												data-id={id}
												data-event={`{"id":${id},"title":"${title}","unscheduled":true, "post_status":"draft","create":false}`}
											>
												{title}
											</li>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</ul>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>
	);
}
