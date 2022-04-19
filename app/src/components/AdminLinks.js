import React from 'react';
import { wp } from '../lib/globals';

export default function AdminLinks() {
	const { trashUrl } = wp;

	const renderLink = ([link, title, target]) => {
		target = target ? target : '_self';

		return (
			<li>
				<a rel="noreferrer" href={link} target={target}>
					{title} <span className="icon">open_in_new</span>
				</a>
			</li>
		);
	};

	return (
		<ul className="adminLinks">
			{renderLink([trashUrl, 'View Trashed Posts', '_blank'])}
		</ul>
	);
}
