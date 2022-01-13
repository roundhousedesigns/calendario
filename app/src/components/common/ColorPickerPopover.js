import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { wp } from '../../lib/utils';
import { useClickOutside } from '../../lib/hooks';

import ViewContext from '../../ViewContext';

import { HexColorPicker } from 'react-colorful';

export default function ColorPickerPopover({ color, name }) {
	const { presetStatusColors } = wp;
	const popover = useRef();
	const previous = useRef(color);
	const {
		viewOptions: { postStatuses },
		viewOptionsDispatch,
	} = useContext(ViewContext);
	const [colorValue, setColorValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (popover.current === undefined && !color) {
			return;
		}

		setColorValue(color);
	}, [color]);

	useEffect(() => {
		if (
			popover.current === undefined ||
			postStatuses[name].color === colorValue ||
			previous.current === colorValue
		) {
			return;
		}

		viewOptionsDispatch({
			type: 'SET_POST_STATUS_COLOR',
			postStatus: name,
			color: colorValue,
		});

		previous.current = colorValue;
	}, [colorValue, name, postStatuses, viewOptionsDispatch]);

	const close = useCallback(() => setIsOpen(false), []);
	useClickOutside(popover, close);

	return (
		<div className="picker">
			<button
				className="swatch"
				style={{ backgroundColor: colorValue }}
				onClick={() => setIsOpen(true)}
			/>

			{isOpen && (
				<div className="popover" ref={popover}>
					<HexColorPicker
						color={colorValue}
						onChange={setColorValue}
						name={name}
					/>

					<div className="picker__swatches">
						{presetStatusColors === undefined
							? null
							: presetStatusColors.map((color) => {
									return (
										<button
											key={color}
											className="picker__swatch"
											style={{ background: color }}
											onClick={() => setColorValue(color)}
										/>
									);
							  })}
					</div>
				</div>
			)}
		</div>
	);
}
