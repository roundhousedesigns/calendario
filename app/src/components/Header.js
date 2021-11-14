import React from 'react';
import MainHeader from './MainHeader';
import { ReactComponent as Logo } from '../svg/calendariologo.svg';

export default function Header({ handleTodayClick }) {
	return (
		<header className="calendarioMain__header">
			<div className="calendarioMain__header__content">
				<div className="calendarHeader">
					<MainHeader handleTodayClick={handleTodayClick} />
				</div>
				<div className="title">
					<h1 className="calendarioMain__title">
						<Logo />
					</h1>
				</div>
			</div>
		</header>
	);
}
