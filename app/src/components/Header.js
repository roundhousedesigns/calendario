import React from "react";
import MainHeader from "./MainHeader";
import { useFetchPostStatuses } from "../lib/hooks";
import { wp } from "../lib/utils";
import { ReactComponent as Logo } from '../svg/calendariologo.svg';

export default function Header({ handleTodayClick }) {
	useFetchPostStatuses();

	const { postsUrl } = wp;

	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="calendarHeader">
					<MainHeader handleTodayClick={handleTodayClick} />
				</div>
				<div className="title">
					<h1 className="calendario__title">
						<Logo />
					</h1>
				</div>
			</div>
		</header>
	);
}
