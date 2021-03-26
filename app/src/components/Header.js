import React from "react";
import MainHeader from "./MainHeader";
import { useFetchPostStatuses } from "../lib/hooks";

export default function Header({ handleTodayClick }) {
	useFetchPostStatuses();

	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="left">
					<MainHeader handleTodayClick={handleTodayClick} />
				</div>
				<div className="right">
					<h1 className="calendario__title">
						editorial calendar.io
					</h1>
				</div>
			</div>
		</header>
	);
}
