import React from 'react';
import { wp } from '../../lib/globals';
import Icon from './Icon';

export default function ToggleButton({
	toggledOn,
	handleToggle,
	name,
	allowLock,
}) {
	const {
		freemius: { pro },
	} = wp;

	return (
		<div className="toggle">
			<button
				name={name}
				className={`dialog-button ${toggledOn ? '' : 'disabled'}`}
				onClick={pro ? handleToggle : null}
			>
				{allowLock && !pro ? (
					<Icon tooltip="Unlock with PRO">lock</Icon>
				) : toggledOn ? (
					'ON'
				) : (
					'OFF'
				)}
			</button>
		</div>
	);
}
