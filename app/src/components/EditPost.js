import React, { useContext, useEffect, useState, useReducer } from "react";
import SidebarInput from "./SidebarInput";
import { updateReducer, initialUpdateState } from "../lib/updatePost";
import {
	dateFormat,
	isEmptyPost,
	filterStatusList,
	routeBase,
	filterUnchangedParams,
} from "../lib/utils";
import DatePicker from "react-datepicker";
import { format, isFuture, isPast, isToday } from "date-fns";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

import "react-datepicker/dist/react-datepicker.css";

function editPostReducer(state, action) {
	switch (action.type) {
		case "SET":
			return action.post;

		case "EDIT":
			const { field } = action;
			var { value } = action;

			if (field === "post_date") {
				value = new Date(value);
			}
			return {
				...state,
				[field]: value,
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

// TODO Date/time display, add time picker
export default function EditPost() {
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const { draggedPostDispatch } = useContext(DragContext);
	const [editMode, setEditMode] = useState(false);
	const [editPost, editPostDispatch] = useReducer(editPostReducer, {});
	const [updatePost, updatePostDispatch] = useReducer(
		updateReducer,
		initialUpdateState
	);
	const [date, setDate] = useState(new Date());
	const [allowedStatuses, setAllowedStatuses] = useState({});

	useEffect(() => {
		if (editPost.post_date && editPost.post_date !== "undefined") {
			setDate(new Date(editPost.post_date));
		}

		return function cleanup() {
			setDate(new Date());
		};
	}, [editPost.post_date]);

	useEffect(() => {
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
	}, [date, editPost.unscheduled]);

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
		// TODO Figure out a `usePrevious` solution that doesn't require an eslint hack
		//        (we don't want to re-fire when editPost.post_date changes, so leave it out of deps.
		//        Also, apparently adding editPost.post_date also borks changing the date in the picker?)
		//eslint-disable-next-line
	}, [currentPost.post_date]);

	// Handle post updating
	useEffect(() => {
		if (updatePost.updateNow === true && currentPost.id !== "undefined") {
			updatePostDispatch({
				type: "UPDATING",
			});

			let url = `${routeBase}/update/${currentPost.id}`;
			let postData = {
				params: filterUnchangedParams(updatePost.params, currentPost),
				unscheduled: updatePost.unscheduled,
			};

			if (isEmpty(postData.params)) {
				return { data: "Update not necessary.", error: true };
			}

			const fetchData = async () => {
				try {
					const response = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(postData),
					});
					// const data = await response.json(); // If you need to catch the response...
					await response.json();

					draggedPostDispatch({
						type: "END",
					});
					updatePostDispatch({
						type: "COMPLETE",
					});
					postsDispatch({
						type: "SET_CURRENTPOST",
						post: editPost,
						unscheduled: editPost.unscheduled,
					});

					postsDispatch({
						type: "REFETCH",
					});
				} catch (error) {
					console.log(error.message);
				}
			};

			fetchData();
		}
	}, [
		currentPost,
		editPost,
		draggedPostDispatch,
		postsDispatch,
		updatePost.params,
		updatePost.updateNow,
		updatePost.unscheduled,
	]);

	const editHandler = () => {
		editPostDispatch({
			type: "SET",
			post: currentPost,
		});

		setEditMode(true);
	};

	const handleSubmit = () => {
		updatePostDispatch({
			type: "UPDATE",
			params: {
				post_title: editPost.post_title,
				post_date: format(
					new Date(editPost.post_date),
					dateFormat.date
				),
				post_status: editPost.post_status,
			},
			unscheduled: editPost.unscheduled,
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
			value: date,
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
					{editMode === false ? (
						<div className="editPost__buttons__row">
							<button
								className="editPost__buttons__edit"
								onClick={editHandler}
							>
								Edit Post
							</button>
						</div>
					) : (
						<div></div>
					)}
					<div className="editPost__editor">
						{editMode ? (
							<form
								className="editPost__editor__form"
								onSubmit={handleSubmit}
							>
								<button
									type="submit"
									className="editPost__buttons__save"
								>
									Save
								</button>
								<button
									className="editPost__buttons__cancel"
									onClick={cancelHandler}
								>
									Cancel
								</button>
								<SidebarInput
									name="post_title"
									label="Post Title"
								>
									<input
										name="post_title"
										value={editPost.post_title}
										onChange={handleInputChange}
									/>
								</SidebarInput>
								<SidebarInput
									name="post_date"
									label="Post Date"
								>
									{/* TODO prompt to make scheduled when changing an Unscheduled Draft date? */}
									<DatePicker
										closeOnScroll={(e) =>
											e.target === document
										}
										selected={date}
										onChange={handleInputDateChange}
										disabled={
											(isToday(currentPost.post_date) ||
												isPast(
													currentPost.post_date
												)) &&
											currentPost.post_status ===
												"publish"
												? true
												: false
										}
									/>
								</SidebarInput>
								<SidebarInput
									name="post_status"
									label="Post Status"
								>
									<select
										name="post_status"
										onChange={handleStatusChange}
										value={editPost.post_status}
									>
										{renderStatusOptions(allowedStatuses)}
									</select>
								</SidebarInput>
								<SidebarInput
									name="post_thumb"
									label="Post Title"
								>
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
									<p>
										{format(
											currentPost.post_date,
											dateFormat.date
										)}
									</p>
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
