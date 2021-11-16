import React from 'react';

export default function ToggleButton({ selected, toggleSelected, name }) {
	return (
		<div className="toggle">
			<button
				name={name}
				className={`dialog-button ${selected ? '' : 'disabled'}`}
				onClick={toggleSelected}
			>
				{selected ? 'ON' : 'OFF'}
			</button>
		</div>
	);
}
