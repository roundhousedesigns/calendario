import { wp } from '../../lib/globals';
import Upsell from './Upsell';

export default function ProWrapper({
	showMessage,
	upsell,
	flowContent,
	className,
	children,
}) {
	const {
		freemius: { pro, trialLink },
	} = wp;
	const messagePosition = upsell || flowContent ? 'relative' : 'absolute';
	const message = upsell ? <Upsell /> : showMessage ? showMessage : '';

	const classes = () => `pro${className ? ` ${className}` : ''}`;

	return (
		<div className={classes()}>
			{!pro && message ? (
				<>
					<div className={`pro__container message-${messagePosition}`}>
						<div className="pro__content">
							<div className="pro__content__message">{message}</div>
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
