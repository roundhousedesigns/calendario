import React, { useContext, useEffect, useState, useReducer } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { postStatuses, dateFormat, isEmptyPost } from "../lib/utils";
import { useUnscheduledStatuses } from "../lib/hooks";

import "react-datepicker/dist/react-datepicker.css";

import PostsContext from "../PostsContext";

function editPostReducer(state, action) {
	switch (action.type) {
		case "INIT":
			return action.post;

		case "EDIT":
			return {
				...state,
				[action.field]: action.value,
			};

		case "DATE_CHANGE":
			return {
				...state,
				post_date: action.newDate,
			};

		default:
			return { state };
	}
}

export default function EditPost() {
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const [editMode, setEditMode] = useState(false);
	const [editPost, editPostDispatch] = useReducer(editPostReducer, {});
	const unscheduledStatuses = useUnscheduledStatuses(postStatuses);

	useEffect(() => {
		if (editMode === true && editPost.id !== currentPost.id) {
			setEditMode(false);
		}
	}, [editMode, editPost.id, currentPost.id]);

	useEffect(() => {
		// Handle changing post date (i.e. dragging on calendar) while in edit mode
		if (currentPost.post_date !== editPost.post_date) {
			editPostDispatch({
				type: "DATE_CHANGE",
				newDate: currentPost.post_date,
			});
		}
		//eslint-disable-next-line
	}, [currentPost.post_date]);

	const editHandler = () => {
		editPostDispatch(
			{
				type: "INIT",
				post: currentPost,
			},
			[unscheduledStatuses]
		);

		setEditMode(true);
	};

	const saveHandler = () => {
		postsDispatch({
			type: "UPDATE_POST",
			post: { ...editPost },
		});
		setEditMode(false);
	};

	const cancelHandler = () => setEditMode(false);

	const handleInputChange = (e) => {
		editPostDispatch({
			type: "EDIT",
			field: e.target.name,
			value: e.target.value,
		});
	};

	const handleInputDateChange = (date) => {
		editPostDispatch({
			type: "EDIT",
			field: "post_date",
			value: format(date, dateFormat.date),
		});
	};

	const renderStatusOptions = () => {
		return Object.keys(unscheduledStatuses).map((status) => (
			<option key={status} value={status}>
				{unscheduledStatuses[status].name}
			</option>
		));
	};

	return isEmptyPost(currentPost) ? (
		<div className="editPost">
			<div className="editPost__buttons">
				{editMode ? (
					<div>
						<button
							className="editPost__buttons__save"
							onClick={saveHandler}
						>
							Save
						</button>
						<button
							className="editPost__buttons__cancel"
							onClick={cancelHandler}
						>
							Cancel
						</button>
					</div>
				) : (
					<button
						className="editPost__buttons__edit"
						onClick={editHandler}
					>
						Edit Post
					</button>
				)}
			</div>
			<div className="editPost__editor">
				{editMode ? (
					<form className="editPost__editor__form">
						<label htmlFor="post_title">
							Post Title
							<input
								name="post_title"
								value={editPost.post_title}
								onChange={handleInputChange}
							/>
						</label>
						<label htmlFor="post_date">
							Post Date
							<DatePicker
								closeOnScroll={(e) => e.target === document}
								selected={new Date(editPost.post_date)}
								onChange={handleInputDateChange}
							/>
						</label>
						<label htmlFor="post_status">
							Post Status
							<select
								name="post_status"
								onChange={handleInputChange}
								value={editPost.post_status}
							>
								{renderStatusOptions()}
							</select>
						</label>
						<label htmlFor="post-thumbnail-chooser">
							{/* <input name="post-thumbnail-chooser"></input> */}
							<div className="post-thumbnail">
								Dreams: Choose/Replace Featured image here
							</div>
						</label>
					</form>
				) : (
					<div className="editPost__editor__display">
						<div className="postData">
							<p>{currentPost.post_title}</p>
							<p>{currentPost.post_date}</p>
							<p>{currentPost.post_status}</p>
						</div>
						<div className="post-thumbnail">
							Featured image here
						</div>
					</div>
				)}
			</div>
		</div>
	) : null;
}
