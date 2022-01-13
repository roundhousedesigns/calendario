import React from 'react';

export default function Icon({ className, tooltip, children }) {
	return (
		<span
			title={tooltip ? tooltip : ''}
			className={className ? `icon ${className}` : 'icon'}
		>
			{children}
		</span>
	);
}
