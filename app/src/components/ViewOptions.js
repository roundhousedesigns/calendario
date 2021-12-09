import React, { useContext } from 'react';
import ViewContext from '../ViewContext';

export default function ViewOptions() {
	const {
		viewOptions: { viewMode },
		viewOptionsDispatch,
	} = useContext(ViewContext);

	const handleViewModeChange = (e) => {
		viewOptionsDispatch({
			type: 'SET_VIEW_MODE',
			viewMode: e.target.value,
		});
	};

	const handleSidebarToggle = (e) => {
		viewOptionsDispatch({ type: 'TOGGLE_SIDEBAR' });
	};

	return (
		<>
			<div className="toggleSidebar">
				<button
					onClick={handleSidebarToggle}
					className="icon drawerHandle"
					title="Toggle Sidebar"
				>
					swipe_right_alt
				</button>
			</div>
			<div className="viewMode">
				<button
					onClick={handleViewModeChange}
					className={`icon control viewMode__input ${
						viewMode === 'calendar' ? 'active ' : 'inactive'
					}`}
					value="calendar"
					title="Calendar"
				>
					calendar_view_month
				</button>
				<button
					name="viewMode"
					onClick={handleViewModeChange}
					className={`icon control viewMode__input ${
						viewMode === 'list' ? 'active ' : 'inactive'
					}`}
					value="list"
					title="List"
				>
					view_list
				</button>
			</div>
		</>
	);
}
