import React, { useContext, useEffect, useRef, useState } from 'react';
import ColorPickerPopover from './common/ColorPickerPopover';
import ToggleButton from './common/ToggleButton';
import { wp, haveColorsChanged, DEBUG_MODE } from '../lib/utils';
import { isEmpty } from 'lodash';

import ViewContext from '../ViewContext';

export default function StatusFilters() {
	const { routeBase } = wp;
	const firstUpdate = useRef(true);
	const {
		viewOptions: { postStatuses },
		viewOptionsDispatch,
	} = useContext(ViewContext);
	const keys = Object.keys(postStatuses);
	const [colorsChanged, setColorsChanged] = useState(false);
	const { nonce } = wp;

	// Maintain state for color defaults
	useEffect(() => {
		setColorsChanged(haveColorsChanged(postStatuses));
	}, [postStatuses]);

	// Updates the server when the dispatch is updated (after debounce)
	// TODO Move this to hooks.js?
	useEffect(() => {
		if (isEmpty(postStatuses)) {
			return;
		}

		if (firstUpdate.current === true) {
			firstUpdate.current = false;
			return;
		}

		let url = `${routeBase}/statuses`;

		const fetchData = async () => {
			let colors = {};
			let headers = {
				'Content-Type': 'application/json',
			};
			if (DEBUG_MODE === false) {
				headers['X-WP-Nonce'] = nonce;
			}

			for (let status in postStatuses) {
				colors[status] = postStatuses[status].color;
			}

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers,
					body: JSON.stringify(colors),
				});

				// const data = await response.json(); // If you need to catch the response...

				await response.json();
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchData();
	}, [firstUpdate, routeBase, postStatuses, nonce]);

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
			<ul className="filters">
				{keys.map((status, index) => {
					const { color, name } = postStatuses[status];
					return (
						<li className={`filterItem status__${status}`} key={index}>
							<ColorPickerPopover color={color} name={status} />
							<span className="name">{name}</span>
							<ToggleButton
								selected={postStatuses[status].visible ? true : false}
								toggleSelected={toggleStatus}
								name={status}
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
