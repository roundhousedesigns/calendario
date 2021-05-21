import React from "react";

export default function DrawerHandle({ toggle }) {
	return (
		<button className="drawerHandle icon" onClick={toggle}>
			drag_indicator
		</button>
	);
}
