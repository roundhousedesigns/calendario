import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { postStatuses, updatePost } from "../lib/utils";

import "react-datepicker/dist/react-datepicker.css";

const PostModal = ({ modalClose, post, calendarRefs }) => {
	const [id, setID] = useState("");
	const [title, setTitle] = useState("");
	const [postDate, setPostDate] = useState(new Date());
	const [postStatus, setPostStatus] = useState("");
	const [allowedStatuses, setAllowedStatuses] = useState([]);

	useEffect(() => {
		setID(post.id);
		setTitle(post.title);
		setPostDate(new Date(post.post_date));
		setPostStatus(post.post_status);
	}, [post.id, post.title, post.post_date, post.post_status]);

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

	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handlePostDateChange = (date) => {
		setPostDate(date);
	};

	const handlePostStatusChange = (e) => {
		setPostStatus(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		updatePost(id, postDate, postStatus, post.unscheduled, {
			post_title: title,
		});
		calendarRefs.forEach((calendar) => {
			// let sources = calendar.current.getApi().getEventSources();

			// console.log(sources);

			// sources.forEach((source) => {
			// 	source.refetch();
			// });
			let calendarApi = calendar.current.getApi();

			calendarApi.refetchEvents();
		});

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
					<input type="hidden" name="id" value={id} />

					<label htmlFor="title">Post Title</label>
					<input
						type="text"
						value={title}
						name="title"
						onChange={handleTitleChange}
					/>

					{post.unscheduled === true ? (
						<div className="post-date-picker">
							<label htmlFor="title">Post Date</label>
							<DatePicker
								closeOnScroll={(e) => e.target === document}
								selected={postDate}
								onChange={handlePostDateChange}
							/>
						</div>
					) : (
						""
					)}

					<label htmlFor="title">Post Status</label>
					<select
						name="post_status"
						onChange={handlePostStatusChange}
						value={postStatus}
					>
						{allowedStatuses.map((status, index) => (
							<option key={index} value={status}>
								{status}
							</option>
						))}
					</select>

					<input
						type="submit"
						value="Submit"
						onSubmit={handleSubmit}
					/>
				</form>

				<button className="post-modal-close" onClick={modalClose}>
					close
				</button>
			</div>
		</div>
	);
};

export default PostModal;
