import React from "react";
import MainHeader from "./MainHeader";

export default function Header() {
	return (
		<header className="calendario__header">
			<div className="calendario__header__content">
				<div className="left">
					<MainHeader />
				</div>
				<div className="right">
					<h1 className="calendario__title">
						the editorial calendorial
					</h1>
				</div>
			</div>
		</header>
	);
}
