import React from "react";

export default function SidebarInput({ name, label, inlineLabel, children }) {
	const renderInput = () => {
		return (
			<div
				className={`sidebarInput fieldGroup fieldGroup__${name} ${
					inlineLabel ? "inlineLabel" : ""
				}`}
			>
				{label ? <label htmlFor={name}>{label}</label> : null}
				{children}
			</div>
		);
	};

	return renderInput();
}
