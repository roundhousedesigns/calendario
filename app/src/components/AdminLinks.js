import React from "react";
import { wp } from "../lib/utils";

export default function AdminLinks() {
	const { blogUrl, trashUrl } = wp;

	const renderLink = ([link, title, target]) => {
		target = target ? target : "_self";

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
			{renderLink([trashUrl, "Trash", "_blank"])}
			{renderLink([blogUrl, "View Posts", "_blank"])}
		</ul>
	);
}
