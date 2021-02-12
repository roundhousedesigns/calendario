import React, { useContext, useEffect, useState, useReducer } from "react";
import SidebarInput from "./SidebarInput";
import DatePicker from "react-datepicker";
import { format, isFuture, isPast } from "date-fns";
import { dateFormat, isEmptyPost } from "../lib/utils";
import { filterStatusList } from "../lib/utils";

import PostsContext from "../PostsContext";

import "react-datepicker/dist/react-datepicker.css";

function editPostReducer(state, action) {
	switch (action.type) {
		case "SET":
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
	const [allowedStatuses, setAllowedStatuses] = useState({});

	useEffect(() => {
		const date = new Date(editPost.post_date);
		let exclude = [];

		if (editPost.unscheduled === true) {
			exclude.push("publish", "future");
		} else if (isFuture(date)) {
			exclude.push("publish");
		} else if (isPast(date)) {
			exclude.push("future");
		}

		const statusList = filterStatusList(exclude);

		setAllowedStatuses(statusList);
	}, [editPost.post_date, editPost.unscheduled]);

	useEffect(() => {
		if (editMode === true && editPost.id !== currentPost.id) {
			setEditMode(false);
		}
	}, [editMode, editPost.id, currentPost.id]);

	useEffect(() => {
		// Handle changing post date (i.e. dragging on calendar) while in edit mode
		if (
			currentPost.post_date !== editPost.post_date &&
			!isEmptyPost(currentPost)
		) {
			editPostDispatch({
				type: "DATE_CHANGE",
				newDate: currentPost.post_date,
			});
		}
		// we don't want to re-fire when editPost.post_date changes, so leave it out of deps.
		// TODO Figure out a `usePrevious` solution that doesn't require an eslint hack
		//eslint-disable-next-line
	}, [currentPost.post_date]);

	const editHandler = () => {
		editPostDispatch({
			type: "SET",
			post: currentPost,
		});

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

	const handleStatusChange = (e) => {
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

	const renderStatusOptions = (statusList) => {
		return Object.keys(statusList).map((status) => (
			<option key={status} value={status}>
				{statusList[status].name}
			</option>
		));
	};

	return (
		<div className="editPost">
			{isEmptyPost(currentPost) ? (
				<div>
					<div className="editPost__buttons">
						{editMode === true ? (
							<div className="editPost__buttons__row">
								{/* TODO Get keyboard ENTER to work as Save button */}
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
							<div>
								<button
									className="editPost__buttons__edit"
									onClick={editHandler}
								>
									Edit Post
								</button>
							</div>
						)}
					</div>
					<div className="editPost__editor">
						{editMode ? (
							<form className="editPost__editor__form">
								<SidebarInput name="post_title" label="Post Title">
									<input
										name="post_title"
										value={editPost.post_title}
										onChange={handleInputChange}
									/>
								</SidebarInput>
								<SidebarInput name="post_date" label="Post Date">
									<DatePicker
										closeOnScroll={(e) =>
											e.target === document
										}
										selected={new Date(editPost.post_date)}
										onChange={handleInputDateChange}
									/>
								</SidebarInput>
								<SidebarInput name="post_status" label="Post Status">
									<select
										name="post_status"
										onChange={handleStatusChange}
										value={editPost.post_status}
									>
										{renderStatusOptions(allowedStatuses)}
									</select>
								</SidebarInput>
								<SidebarInput name="post_thumb" label="Post Title">
									{/* <input name="postThumb-chooser"></input> */}
									{/* TODO Featured image display/selection */}
									<div className="postThumb">
										Dreams: Choose/Replace Featured image
										here
									</div>
								</SidebarInput>
							</form>
						) : (
							<div className="editPost__editor__display">
								<div className="postData">
									<p>{currentPost.post_title}</p>
									<p>{currentPost.post_date}</p>
									<p>{currentPost.post_status}</p>
								</div>
								<div className="postThumb">
									Featured image here
								</div>
							</div>
						)}
					</div>
				</div>
			) : (
				<small>Click a post to Quick Edit.</small>
			)}
		</div>
	);
}
