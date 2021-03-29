import React from "react";
import MainHeader from "./MainHeader";
import { useFetchPostStatuses } from "../lib/hooks";
import { wp } from "../lib/utils";

export default function Header({ handleTodayClick }) {
	useFetchPostStatuses();

	const { pluginUrl } = wp;

	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="left">
					<MainHeader handleTodayClick={handleTodayClick} />
				</div>
				<div className="right">
					<h1 className="calendario__title">editorial calendar.io</h1>
					<a
						className="calendario__logo"
						href="https://roundhouse-designs.com"
						rel="noreferrer"
						target="_blank"
					>
						<img
							src={`${pluginUrl}rhd-logo.png`}
							alt="Roundhouse Designs logo"
						/>
					</a>
				</div>
			</div>
		</header>
	);
}
