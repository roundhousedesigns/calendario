import React, { useContext } from 'react';
import Widget from './common/Widget';
import UnscheduledDrafts from './UnscheduledDrafts';
import StatusFilters from './StatusFilters';
import ViewOptions from './ViewOptions';
import Support from './Support';
import Icon from './common/Icon';
import ProWrapper from './common/ProWrapper';
import { wp } from '../lib/globals';

import ViewContext from '../ViewContext';

export default function Sidebar() {
	const {
		viewOptions: { sidebarOpen },
	} = useContext(ViewContext);
	const {
		tz,
		adminUrl,
		freemius: { pro },
	} = wp;

	return (
		<aside
			className={`calendarioMain__sidebar ${sidebarOpen ? 'open' : 'closed'}`}
		>
			<div className="calendarioMain__sidebar__inner">
				<Widget className="options">
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
				<Widget title="Draft Sandbox" className="unscheduledDrafts">
					<UnscheduledDrafts />
				</Widget>

				<Widget title="Post Status" className="statusFilters">
					<StatusFilters />
				</Widget>

				{!pro ? (
					<Widget className="upsell">
						<ProWrapper upsell={true} />
					</Widget>
				) : null}

				<Widget title="Support" className="support">
					<Support />
				</Widget>
			</div>
		</aside>
	);
}
