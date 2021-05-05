import React from "react";

export default function PostLink({ title, icon, onClick, target, children }) {
	return (
		<button
			title={title}
			className={`icon postLink icon__${icon}`}
			onClick={onClick}
			target={target ? target : ""}
			rel="noreferrer"
		>
			{children}
		</button>
	);
}
