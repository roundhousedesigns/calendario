import React, { useContext } from 'react';
import Widget from './common/Widget';
import UnscheduledDrafts from './UnscheduledDrafts';
import StatusFilters from './StatusFilters';
import ViewOptions from './ViewOptions';
import BetaInfo from './BetaInfo';

import ViewContext from '../ViewContext';

export default function Sidebar() {
	const {
		viewOptions: { sidebarOpen },
	} = useContext(ViewContext);

	return (
		<aside
			className={`calendarioMain__sidebar ${sidebarOpen ? 'open' : 'closed'}`}
		>
			<div className="calendarioMain__sidebar__inner">
				<Widget widgetClass="options">
					<div className="options">
						<ViewOptions />
					</div>
				</Widget>
				<Widget title="Unscheduled Drafts" widgetClass="unscheduledDrafts">
					<UnscheduledDrafts />
				</Widget>

				<Widget title="Post Status" widgetClass="statusFilters">
					<StatusFilters />
				</Widget>

				<Widget widgetClass="support">
					<BetaInfo />
				</Widget>
			</div>
		</aside>
	);
}
