import React from "react";

// TODO rename this component since it'll be used not just in Sidebar anymore

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
