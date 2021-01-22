import React, { useContext, useEffect, useReducer, useState } from "react";
import DatePicker from "react-datepicker";
import { postStatuses, updatePost, firstToUpper } from "../lib/utils";

import SidebarPostsContext from "../context/SidebarPosts";
import CalendarContext from "../context/Calendar";

import "react-datepicker/dist/react-datepicker.css";

function thisPostReducer(state, action) {
	return {
		...state,
		[action.field]: action.value,
	};
}

const PostModal = ({ modalClose, post }) => {
	const calendarRefs = useContext(CalendarContext);
	const [thisPost, thisPostDispatch] = useReducer(thisPostReducer, {
		id: post.id,
		title: post.title,
		postDate: new Date(post.post_date),
		postStatus: post.post_status,
		unscheduled: post.unscheduled,
	});

	const [allowedStatuses, setAllowedStatuses] = useState([]);

	const { sidebarPostsDispatch } = useContext(SidebarPostsContext);

	useEffect(() => {
		var allowed = Object.keys(postStatuses);

		if (post.unscheduled === true) {
			let exclude = ["publish", "future"];
			allowed = allowed.filter((status) => {
				return !exclude.includes(status);
			});
		}

		setAllowedStatuses(allowed);
	}, [post.unscheduled]);

	const handlePostDateChange = (date) => {
		thisPostDispatch({
			field: "postDate",
			value: date,
		});
	};

	const handleInputChange = (e) => {
		thisPostDispatch({
			field: e.target.name,
			value: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let updateResult = updatePost(
			thisPost.id,
			thisPost.postDate,
			thisPost.postStatus,
			thisPost.unscheduled,
			{
				post_title: thisPost.title,
			}
		);

		if (updateResult) {
			if (!post.unscheduled) {
				calendarRefs.forEach((calendar) => {
					let calendarApi = calendar.current.getApi();

					calendarApi.refetchEvents();
				});
			} else {
				sidebarPostsDispatch({
					type: "UPDATE",
					updateEvent: {
						id: thisPost.id,
						props: {
							title: thisPost.title,
							post_date: thisPost.postDate,
							post_status: thisPost.postStatus,
						},
					},
				});
			}
		}

		modalClose();
	};

	return (
		<div className="post-modal">
			<div className="post-modal-form-container">
				<form
					id="post-modal-form"
					className="post-modal-form"
					onSubmit={handleSubmit}
				>
					<label htmlFor="title">
						<input type="hidden" name="id" value={thisPost.id} />
						Post Title
					</label>
					<input
						type="text"
						value={thisPost.title}
						name="title"
						onChange={handleInputChange}
					/>

					<label htmlFor="postDate">
						Post Date
						<DatePicker
							closeOnScroll={(e) => e.target === document}
							selected={thisPost.postDate}
							onChange={handlePostDateChange}
						/>
					</label>

					<label htmlFor="title">
						Post Status
						<select
							name="postStatus"
							onChange={handleInputChange}
							value={thisPost.postStatus}
						>
							{allowedStatuses.map((status, index) => (
								<option key={index} value={status}>
									{firstToUpper(status)}
								</option>
							))}
						</select>
					</label>

					<input
						type="submit"
						value="Submit"
						onSubmit={handleSubmit}
					/>
				</form>

				<button className="post-modal-close" onClick={modalClose}>
					X
				</button>
			</div>
		</div>
	);
};

export default PostModal;
