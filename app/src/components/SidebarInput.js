import React from "react";
import { isEmpty } from "lodash";

export default function SidebarInput({
	name,
	label,
	type,
	value,
	atts,
	onChange,
	children,
}) {
	const renderInput = () => {
		let inputAtts = {
			name: name,
			type: type ? type : "text",
			value: value,
			onChange: onChange,
		};

		if (!isEmpty(atts)) {
			Object.keys(atts).map((prop) => (inputAtts[prop] = atts[prop]));
		}

		return (
			<div className={`field-group field-group__${name}`}>
				<label htmlFor={name}>{label}</label>
				{children}
			</div>
		);
	};

	return renderInput();
}
