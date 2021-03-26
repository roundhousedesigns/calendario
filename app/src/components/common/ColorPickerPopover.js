import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { wp } from "../../lib/utils";
import { useClickOutside } from "../../lib/hooks";

import ViewContext from "../../ViewContext";

import { useDebounce } from "use-debounce";
import { HexColorPicker } from "react-colorful";

export default function ColorPickerPopover({ color, name }) {
	const { presetStatusColors } = wp;
	const popover = useRef();
	const previous = useRef(color);
	const {
		viewOptions: { postStatuses },
		viewOptionsDispatch,
	} = useContext(ViewContext);
	const [colorValue, setColorValue] = useState("");
	const [debouncedColor] = useDebounce(colorValue, 500);
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
			postStatuses[name].color === debouncedColor ||
			previous.current === debouncedColor
		) {
			return;
		}

		viewOptionsDispatch({
			type: "SET_POST_STATUS_COLOR",
			postStatus: name,
			color: debouncedColor,
		});

		previous.current = debouncedColor;
	}, [debouncedColor, name, postStatuses, viewOptionsDispatch]);

	const close = useCallback(() => setIsOpen(false), []);
	useClickOutside(popover, close);

	return (
		<div className="picker">
			<div
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

					<div class="picker__swatches">
						{presetStatusColors.map((color) => {
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
