import React, { useContext } from 'react';
import DrawerHandle from './common/DrawerHandle';
import Widget from './common/Widget';
import UnscheduledDrafts from './UnscheduledDrafts';
import StatusFilters from './StatusFilters';
import ViewOptions from './ViewOptions';
import { wp } from '../lib/utils';

import ViewContext from '../ViewContext';

export default function Sidebar() {
	const { pluginUrl } = wp;

	const {
		viewOptions: { sidebarOpen },
		// viewMode,
		viewOptionsDispatch,
	} = useContext(ViewContext);

	return (
		<aside
			className={`calendarioMain__sidebar ${sidebarOpen ? 'open' : 'closed'}`}
		>
			<DrawerHandle
				toggle={() =>
					viewOptionsDispatch({
						type: 'TOGGLE_SIDEBAR',
					})
				}
			/>
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
					<div className="support-links">
						<a
							className="rhdLogo"
							href="https://roundhouse-designs.com"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src={`${pluginUrl}rhd-logo.png`}
								alt="Roundhouse Designs logo"
							/>
						</a>
						<ul className="docs">
							<li>Documentation coming soon</li>
							<li>Thanks for testing!</li>
							<li>Latest Bugfixes:
								<ul>
									<li>Vertical scroll was locking the Dashboard left-side menu</li>
								</ul>
							</li>
							<li>
								<a
									href="mailto:help@roundhouse-designs.com?subject=Calendar.io Support Request?body=***Please type your editorial calendar.io support request here***"
									rel="noreferrer"
									target="_blank"
								>
									Support
								</a>
							</li>
						</ul>
					</div>
				</Widget>
			</div>
		</aside>
	);
}
