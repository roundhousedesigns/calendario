import React, { useContext, useEffect, useState } from 'react';
import { wp } from '../lib/globals';
import { haveColorsChanged } from '../lib/utils';
import ColorPickerPopover from './common/ColorPickerPopover';
import ToggleButton from './common/ToggleButton';

import ViewContext from '../ViewContext';
import { useUpdateStatusColors } from '../lib/hooks';

export default function StatusFilters() {
	const {
		viewOptions: { postStatuses, postStatusColorsChanged },
		viewOptionsDispatch,
	} = useContext(ViewContext);
	const keys = Object.keys(postStatuses);
	const {
		freemius: { pro },
	} = wp;
	const [colorsChanged, setColorsChanged] = useState(false);

	// Maintain state for color defaults
	useEffect(() => {
		setColorsChanged(haveColorsChanged(postStatuses));
	}, [postStatuses]);

	// Updates the server when status colors are changed
	useUpdateStatusColors(
		postStatuses,
		postStatusColorsChanged,
		viewOptionsDispatch
	);

	const toggleStatus = (e) => {
		viewOptionsDispatch({
			type: 'TOGGLE_POST_STATUS',
			postStatus: e.target.name,
		});
	};

	const handleResetColors = () => {
		viewOptionsDispatch({
			type: 'RESET_POST_STATUS_COLORS',
		});
	};

	return (
		<div className="statusFilters">
			<ul className={`filters ${postStatusColorsChanged ? 'updating' : ''}`}>
				{keys.map((status, index) => {
					const { color, name } = postStatuses[status];
					return (
						<li className={`filterItem status__${status}`} key={index}>
							<ColorPickerPopover
								color={color}
								name={status}
								disableClick={!pro}
							/>
							<span className="name">{name}</span>
							<ToggleButton
								toggledOn={postStatuses[status].visible ? true : false}
								handleToggle={toggleStatus}
								name={status}
								allowLock={true}
							/>
						</li>
					);
				})}
			</ul>
			{colorsChanged ? (
				<button className="reset" onClick={handleResetColors}>
					Reset Colors
				</button>
			) : null}
		</div>
	);
}
