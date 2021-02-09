import React, { useContext, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useCurrentPost } from "../lib/hooks";

import PostsContext from "../PostsContext";

export default function EditPost() {
	const { posts, postsDispatch } = useContext(PostsContext);
	const [editMode, setEditMode] = useState(false);
	const currentPost = useCurrentPost(posts);

	useEffect(() => {
		setEditMode(false);
	}, [currentPost.id]);

	const editHandler = () => {
		setEditMode(!editMode);
	};

	const saveHandler = () => {
		postsDispatch({
			type: "UPDATE_POST",
			updatedPost: {...currentPost}
		});
		setEditMode(false);
	};

	const cancelHandler = () => {
		// postsDispatch({
		// 	type: "UNCLICK",
		// });
		setEditMode(false);
	};

	return !isEmpty(currentPost) ? (
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
						<label for="post_title">
							Post Title
							<input
								name="post_title"
								value={currentPost.post_title}
							/>
						</label>
						<label for="post_date">
							Post Date
							<input
								name="post_date"
								value={currentPost.post_date}
							/>
						</label>
						<label for="post_status">
							Post Status
							<input
								name="post_status"
								value={currentPost.post_status}
							/>
						</label>
						<label for="post-thumbnail-chooser">
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
