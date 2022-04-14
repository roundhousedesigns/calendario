import { wp } from '../../lib/utils';

export default function ProWrapper({ showMessage, children }) {
	const {
		freemius: { pro, trialLink },
	} = wp;

	return (
		<div className="pro">
			{!pro && showMessage ? (
				<>
					<div className="pro__container">
						<div className="pro__content">
							<p className="pro__content__message">{showMessage}</p>
							<p className="pro__content__link">
								<a href={trialLink} target="_blank" rel="noreferrer">
									30-day free trial
								</a>
							</p>
						</div>
					</div>
					<div className="pro__children">{children}</div>
				</>
			) : null}
		</div>
	);
}
