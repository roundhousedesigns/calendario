import React, { useContext } from "react";
import PostList from "./PostList";

import PostsContext from "../PostsContext";

export default function List() {
	const {
		posts: { calendar },
	} = useContext(PostsContext);

	// TODO Get/set this from cache
	// TODO use futuremost date to get all 'calendared' posts from today onward
	//        that aren't published
	// useEffect(() => {
	// 	let endMonth = addMonths(startMonth, monthCount);

	// 	fetch(
	// 		`${routeBase}/calendar/${format(
	// 			startMonth,
	// 			dateFormat.date
	// 		)}/${format(endMonth, dateFormat.date)}`
	// 	)
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			postsDispatch({
	// 				type: "INIT",
	// 				calendar: data,
	// 			});
	// 		});
	// }, [monthCount, startMonth, postsDispatch]);

	return (
		<PostList
			className="view view__list"
			posts={calendar}
			date={false}
			allowDrag={false}
		/>
	);
}
