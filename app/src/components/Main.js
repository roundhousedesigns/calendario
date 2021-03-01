import React, { useContext } from "react";
import Calendar from "./Calendar";
import List from "./List";
import EditPost from "./EditPost";

import ViewContext from "../ViewContext";

export default function Main() {
	const {
		viewOptions: { viewMode },
	} = useContext(ViewContext);

	return (
		<main className="calendario__main">
			<div className="view">
				{viewMode === "calendar" ? <Calendar /> : <List />}
			</div>
			<EditPost />
		</main>
	);
}
