import React from "react";
import UnscheduledDrafts from "./UnscheduledDrafts";
import { renderWidget } from "../lib/utils";

export default function Sidebar() {
	return (
		<aside className="calendario__sidebar">
			{renderWidget(
				"Unscheduled Drafts",
				"unscheduledDrafts",
				<UnscheduledDrafts />
			)}

			{renderWidget(
				"bugs + todo",
				"dev",
				<div>
					<p>
						GitHub:{" "}
						<a
							href="https://github.com/gaswirth/rhdwp-calendario"
							target="_blank"
						>
							gaswirth/rhdwp-calendario
						</a>
					</p>
					<p>
						<a
							href="https://github.com/gaswirth/rhdwp-calendario/issues"
							target="_blank"
						>
							Report issue/bug
						</a>
					</p>
				</div>
			)}
		</aside>
	);
}
