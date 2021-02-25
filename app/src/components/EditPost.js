import React, { useContext, useEffect, useState, useReducer } from "react";
import SidebarInput from "./SidebarInput";
import { updateReducer, initialUpdateState } from "../lib/updatePost";
import {
	dateFormat,
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

const initialEditPost = {
	post: {},
	editMode: false,
};

function editPostReducer(state, action) {
	switch (action.type) {
		case "SET":
			return {
				post: action.post,
				editMode: true,
			};

		case "EDIT":
			const { field } = action;
			var { value } = action;

			if (field === "post_date") {
				value = new Date(value);
			}
			return {
				...state,
				post: {
					...state.post,
					[field]: value,
				},
			};

		case "DATE_CHANGE":
			return {
				...state,
				post: {
					...state.post,
					post_date: action.newDate,
				},
			};

		case "CLEAR":
			return initialEditPost;

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
	const [editPost, editPostDispatch] = useReducer(
		editPostReducer,
		initialEditPost
	);
	const [updatePost, updatePostDispatch] = useReducer(
		updateReducer,
		initialUpdateState
	);
	const [date, setDate] = useState(new Date());
	const [allowedStatuses, setAllowedStatuses] = useState({});

	const { post, editMode } = editPost;

	useEffect(() => {
		if (post.post_date && post.post_date !== "undefined") {
			setDate(new Date(post.post_date));
		}

		return function cleanup() {
			setDate(new Date());
		};
	}, [post.post_date]);

	useEffect(() => {
		let exclude = [];

		if (post.unscheduled === true) {
			exclude.push("publish", "future", "pending");
		} else if (isFuture(date)) {
			exclude.push("publish");
		} else if (isPast(date)) {
			exclude.push("future");
		}

		const statusList = filterStatusList(exclude);

		setAllowedStatuses(statusList);
	}, [date, post.unscheduled]);

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
						post: post,
						unscheduled: post.unscheduled,
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
		post,
		draggedPostDispatch,
		postsDispatch,
		updatePost.params,
		updatePost.updateNow,
		updatePost.unscheduled,
	]);

	useEffect(() => {
		if (currentPost.id && currentPost.id > 0) {
			editPostDispatch({
				type: "SET",
				post: currentPost,
			});
		}
	}, [currentPost.id, currentPost]);

	const handleSubmit = (e) => {
		e.preventDefault();

		updatePostDispatch({
			type: "UPDATE",
			params: {
				post_title: post.post_title,
				post_date: format(new Date(post.post_date), dateFormat.date),
				post_status: post.post_status,
			},
			unscheduled: post.unscheduled,
		});

		editPostDispatch({
			type: "CLEAR",
		});
	};

	const cancelHandler = () => editPostDispatch({ type: "CLEAR" });

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

	return editMode === true ? (
		<div className={`editPost`}>
			<div className="editPost__container">
				<div className="editPost__editor">
					<form
						className="editPost__editor__form"
						onSubmit={handleSubmit}
					>
						<input
							type="submit"
							className="editPost__buttons__save"
							value="Save"
						/>
						<input
							type="button"
							className="editPost__buttons__cancel"
							onClick={cancelHandler}
							value="Cancel"
						/>
						<SidebarInput name="post_title" label="Post Title">
							<input
								name="post_title"
								value={post.post_title}
								onChange={handleInputChange}
							/>
						</SidebarInput>
						{post.unscheduled === false ? (
							<SidebarInput name="post_date" label="Post Date">
								{/* TODO prompt to make scheduled when changing an Unscheduled Draft date? */}
								<DatePicker
									closeOnScroll={(e) => e.target === document}
									selected={date}
									onChange={handleInputDateChange}
									disabled={
										(isToday(currentPost.post_date) ||
											isPast(currentPost.post_date)) &&
										currentPost.post_status === "publish"
											? true
											: false
									}
								/>
							</SidebarInput>
						) : null}
						<SidebarInput name="post_status" label="Post Status">
							<select
								name="post_status"
								onChange={handleStatusChange}
								value={post.post_status}
							>
								{renderStatusOptions(allowedStatuses)}
							</select>
						</SidebarInput>
						<SidebarInput name="post_thumb" label="Featured Image">
							{/* TODO Featured image display/selection */}
							<div className="postThumb">
								Dreams: Choose/Replace Featured image here
							</div>
						</SidebarInput>
					</form>
				</div>
			</div>
		</div>
	) : null;
}
