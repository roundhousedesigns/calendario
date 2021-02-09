import React, { useContext, useEffect, useState, useReducer } from "react";
import { isEmpty } from "lodash";
// import { useCurrentPost } from "../lib/hooks";

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

	useEffect(() => {
		editPostDispatch({
			type: "INIT",
			post: currentPost,
		});

		setEditMode(false);
	}, [currentPost]);

	const editHandler = () => {
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

	return !isEmpty(editPost) ? (
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
						{/* <label htmlFor="post_date">
							Post Date
							<input
								name="post_date"
								value={editPost.post_date}
							/>
						</label> */}
						<label htmlFor="post_status">
							Post Status
							<input
								name="post_status"
								value={editPost.post_status}
								onChange={handleInputChange}
							/>
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
							<p>{editPost.post_title}</p>
							<p>{editPost.post_date}</p>
							<p>{editPost.post_status}</p>
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
