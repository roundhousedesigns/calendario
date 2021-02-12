import React, { useContext } from "react";
import SidebarInput from "./SidebarInput";

import PostsContext from "../PostsContext";

export default function ViewOptions() {
	const {
		posts: { calendarMonths },
		postsDispatch,
	} = useContext(PostsContext);
	// const [monthCount, setMonthCount] = useState(calendarMonths);

	const handleMonthCountChange = (e) => {
		postsDispatch({
			type: "UPDATE_MONTH_COUNT",
			calendarMonths: e.target.value,
		});
	};

	return (
		<div className="view-options">
			<SidebarInput
				name="monthCount"
				label="Months to view"
				type="number"
				atts={{ min: 1 }}
				value={calendarMonths}
				onChange={handleMonthCountChange}
				groupClass="monthCount"
			/>
		</div>
	);
}
