import React, { useContext, useEffect } from "react";
import PostList from "./PostList";
import { format } from "date-fns";
import { routeBase, dateFormat } from "../lib/utils";

import PostsContext from "../PostsContext";

export default function List() {
	const {
		posts: { scheduled, refetch },
		postsDispatch,
	} = useContext(PostsContext);
	// const [posts, setPosts] = useState([]);

	useEffect(() => {
		postsDispatch({
			type: "REFETCH",
		});
	}, [postsDispatch]);

	useEffect(() => {
		let startDate = format(new Date(), dateFormat.date);

		let url = `${routeBase}/scheduled/${startDate}`;
		const fetchData = async () => {
			try {
				const res = await fetch(url);
				const data = await res.json();

				postsDispatch({
					type: "SET",
					posts: data,
					unscheduled: false,
				});
			} catch (error) {
				console.log("REST error", error.message);
			}
		};

		fetchData();
	}, [postsDispatch, refetch]);

	return (
		<div className="view view__list">
			<header className="header">
				<h3 className="viewTitle">Upcoming Posts</h3>
			</header>
			<PostList
				className="listPosts"
				posts={scheduled}
				date={false}
				allowDrag={false}
			/>
		</div>
	);
}
