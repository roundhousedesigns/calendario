import React from 'react';

import { wp } from '../lib/utils';

export default function BetaInfo() {
	const { pluginUrl } = wp;

	return (
		<div className="support-links">
			<a
				className="rhdLogo"
				href="https://roundhouse-designs.com"
				target="_blank"
				rel="noreferrer"
			>
				<img src={`${pluginUrl}rhd-logo.png`} alt="Roundhouse Designs logo" />
			</a>
			<ul className="docs">
				<li>
					<a
						href="https://github.com/roundhousedesigns/calendario/blob/main/CHANGELOG.md"
						rel="noreferrer"
						target="_blank"
					>
						Changelog
					</a>
				</li>
				<li>Documentation coming soon</li>
				<li>Thanks for testing!</li>
				<li>
					<a
						href="/wp-admin/edit.php?page=calendario-contact"
						rel="noreferrer"
						target="_blank"
					>
						Support
					</a>
				</li>
			</ul>
		</div>
	);
}
