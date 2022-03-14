import React, { useContext } from 'react';
import Widget from './common/Widget';
import UnscheduledDrafts from './UnscheduledDrafts';
import StatusFilters from './StatusFilters';
import ViewOptions from './ViewOptions';
import Support from './Support';
import Icon from './common/Icon';
import { wp } from '../lib/utils';

import ViewContext from '../ViewContext';

export default function Sidebar() {
	const {
		viewOptions: { sidebarOpen },
	} = useContext(ViewContext);
	const { tz, adminUrl } = wp;

	return (
		<aside
			className={`calendarioMain__sidebar ${sidebarOpen ? 'open' : 'closed'}`}
		>
			<div className="calendarioMain__sidebar__inner">
				<Widget widgetClass="options">
					<div className="options">
						<ViewOptions />
						<p className="tz">
							<a
								href={`${adminUrl}options-general.php`}
								title="Change your WordPress timezone"
							>
								Timezone: {tz} <Icon className="open_in_new">open_in_new</Icon>
							</a>
						</p>
					</div>
				</Widget>
				<Widget title="Draft Sandbox" widgetClass="unscheduledDrafts">
					<UnscheduledDrafts />
				</Widget>

				<Widget title="Post Status" widgetClass="statusFilters">
					<StatusFilters />
				</Widget>

				<Widget title="Support" widgetClass="support">
					<Support />
				</Widget>
			</div>
		</aside>
	);
}
