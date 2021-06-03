import React, { useState, useMemo, useContext } from "react";
import Post from "./Post";
import Loading from "./common/Loading";
import { dateFormat } from "../lib/utils";
import { Droppable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { isEmpty } from "lodash";

import PostsContext from "../PostsContext";

export default function PostList({ renderPosts, className, date }) {
	const {
		posts: { isUpdating },
	} = useContext(PostsContext);
	const [hovered, setHovered] = useState(false);

	const droppableId =
		date === false ? "unscheduled" : format(date, dateFormat.date);

	const posts = () => {
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

	const renderPostList = useMemo(posts, [renderPosts, droppableId]);

	return (
		<Droppable droppableId={droppableId}>
			{({ innerRef, droppableProps, placeholder }, snapshot) => (
				<>
					{isUpdating === droppableId ? (
						<Loading />
					) : null}
					<ul
						ref={innerRef}
						{...droppableProps}
						className={`postList ${className} ${
							snapshot.isDraggingOver ? "draggingOver" : "idle"
						}`}
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
						style={hovered ? { marginBottom: 0 } : null}
					>
						{renderPostList}
						{placeholder}
					</ul>
				</>
			)}
		</Droppable>
	);
}
