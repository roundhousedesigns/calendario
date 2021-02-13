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
		<div className="viewOptions">
			<SidebarInput
				name="monthCount"
				label="Months to view"
				inlineLabel={true}
			>
				<input
					type="number"
					min={1}
					value={calendarMonths}
					onChange={handleMonthCountChange}
					className="mini"
				/>
			</SidebarInput>
		</div>
	);
}
