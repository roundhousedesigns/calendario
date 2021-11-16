import React from 'react';

export default function Icon({ className, children }) {
	return (
		<span className={className ? `icon ${className}` : 'icon'}>{children}</span>
	);
}
