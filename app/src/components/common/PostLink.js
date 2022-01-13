import React from 'react';

export default function PostLink({ title, icon, onClick, target, children }) {
	return (
		<div className="postLink">
			<button
				title={title}
				className={`icon icon__${icon}`}
				onClick={onClick}
				target={target ? target : ''}
				rel="noreferrer"
			>
				{children}
			</button>
		</div>
	);
}
