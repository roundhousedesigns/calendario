import React, { useMemo } from "react";
import Post from "./Post";
import { dateFormat } from "../lib/utils";
import { Droppable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { isEmpty } from "lodash";

export default function PostList({ renderPosts, className, date }) {
	const droppableId =
		date === false ? "unscheduled" : format(date, dateFormat.date);

	const assemblePostList = () => {
		const Posts = () => {
			if (isEmpty(renderPosts)) {
				return null;
			}

			return renderPosts.map((post, index) => (
				<Post
					post={post}
					key={post.id}
					index={index}
					unscheduled={droppableId === "unscheduled" ? true : false}
				/>
			));
		};

		return (
			<>
				<Droppable droppableId={droppableId}>
					{(provided, snapshot) => (
						<ul
							ref={provided.innerRef}
							{...provided.droppableProps}
							className={`postList ${className}`}
						>
							<Posts />
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</>
		);
	};

	const renderPostList = useMemo(assemblePostList, [
		renderPosts,
		className,
		droppableId,
	]);

	return renderPostList;
}
