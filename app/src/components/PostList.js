import React, { useContext, useEffect, useReducer, useState } from "react";
import Post from "./Post";
import Loading from "./common/Loading";
import {
	dateFormat,
	filterUnchangedParams,
	wp,
	DEBUG_MODE,
} from "../lib/utils";
// import { updateReducer, initialUpdateState } from "../lib/updatePost";
import { Droppable } from "react-beautiful-dnd";
import { format, getHours, getMinutes, setHours, setMinutes } from "date-fns";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";
import DragContext from "../DragContext";

export default function PostList({
	renderPosts,
	className,
	allowDrag,
	allowDrop,
	date,
	loadingState,
}) {
	const { routeBase, user, nonce } = wp;
	const {
		posts: { currentPost },
		postsDispatch,
	} = useContext(PostsContext);
	const {
		draggedPost: { post, draggedTo, draggedFrom, overUnscheduled },
		draggedPostDispatch,
	} = useContext(DragContext);
	// const [updatePost, updatePostDispatch] = useReducer(
	// 	updateReducer,
	// 	initialUpdateState
	// );
	const [isLoading, setIsLoading] = useState(false);
	const droppableId =
		date === false ? "unscheduled" : format(date, dateFormat.date);

	useEffect(() => {
		if (loadingState === undefined || loadingState === null) {
			return;
		}

		setIsLoading(loadingState);

		return () => {
			setIsLoading(false);
		};
	}, [loadingState]);

	// Fire the update!
	// useEffect(() => {
	// 	if (updatePost.updateNow === true && post.id !== "undefined") {
	// 		updatePostDispatch({
	// 			type: "UPDATING",
	// 		});

	// 		let url = `${routeBase}/posts/update/${post.id}/${user}`;

	// 		let headers = {
	// 			"Content-Type": "application/json",
	// 		};

	// 		if (DEBUG_MODE !== true) {
	// 			headers["X-WP-Nonce"] = nonce;
	// 		}

	// 		let postData = {
	// 			params: filterUnchangedParams(updatePost.params, post),
	// 			unscheduled: updatePost.unscheduled,
	// 		};

	// 		if (draggedTo !== null) {
	// 			postData.draggedTo = draggedTo;
	// 		}

	// 		const fetchData = async () => {
	// 			setIsLoading(true);

	// 			try {
	// 				const response = await fetch(url, {
	// 					method: "POST",
	// 					headers,
	// 					body: JSON.stringify(postData),
	// 				});
	// 				// const data = await response.json(); // If you need to catch the response...
	// 				await response.json();

	// 				postsDispatch({
	// 					type: "REFETCH",
	// 				});
	// 				draggedPostDispatch({
	// 					type: "END",
	// 				});
	// 				updatePostDispatch({
	// 					type: "COMPLETE",
	// 				});

	// 				setIsLoading(false);
	// 			} catch (error) {
	// 				console.log(error.message);
	// 				setIsLoading(false);
	// 			}
	// 		};

	// 		fetchData();
	// 	}
	// }, [
	// 	routeBase,
	// 	user,
	// 	nonce,
	// 	updatePost,
	// 	draggedTo,
	// 	draggedPostDispatch,
	// 	post,
	// 	postsDispatch,
	// ]);

	const renderPostList = () => {
		let listProps = {
			className: `postList ${className}`,
		};

		if (allowDrop === false) {
			listProps.className += " dropDisabled";
		}

		const Posts = () => {
			if (isEmpty(renderPosts)) {
				return null;
			}

			return renderPosts.map((post, index) => (
				<Post
					post={post}
					key={post.id}
					index={index}
					unscheduled={date === false ? true : false}
					allowDrag={allowDrag}
				/>
			));
		};

		return (
			<>
				{/* TODO: use react-beautiful-dnd loading animation/style instead? */}
				<Loading className={isLoading ? "active" : null} />
				<Droppable
					droppableId={droppableId}
					isDropDisabled={!allowDrop}
				>
					{(provided, snapshot) => (
						<ul
							ref={provided.innerRef}
							{...listProps}
							{...provided.droppableProps}
						>
							<Posts />
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</>
		);
	};

	return renderPostList();
}
