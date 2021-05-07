import React from "react";
import MainHeader from "./MainHeader";
import { useFetchPostStatuses } from "../lib/hooks";
import { wp } from "../lib/utils";

export default function Header({ handleTodayClick }) {
	useFetchPostStatuses();

	const { postsUrl } = wp;

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
						<button
							className="icon closeCalendario"
							onClick={() => (window.location.href = postsUrl)}
						>
							disabled_by_default
						</button>
					</a>
				</div>
			</div>
		</header>
	);
}
