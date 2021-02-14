import React, { useContext } from "react";
import Calendar from "./Calendar";
import List from "./List";

import ViewContext from "../ViewContext";

export default function Main() {
	const {
		viewOptions: { viewMode },
	} = useContext(ViewContext);

	return (
		<main className="calendario__main">
			{viewMode === "calendar" ? <Calendar /> : <List />}
		</main>
	);
}
