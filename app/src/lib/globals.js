/**
 * Globals.
 */

export const DEBUG_MODE =
	process.env.REACT_APP_DEBUG_MODE === 'true' ? true : false;

export const wp =
	DEBUG_MODE === true
		? {
				nonce: 0,
				// routeBase: 'http://localhost/wp-json/calendario/v1',
				tz: 'America/New_York',
				routeBase: 'http://localhost/backend/wp-json/calendario/v1',
				adminUrl: '',
				version: '<version>',
				freemius: {
					pro: false,
					trialLink:
						'https://checkout.freemius.com/mode/dialog/plugin/8136/plan/13973/?trial=free',
					dateRangeWeekLimit: 6,
				},
				pluginUrl: '//localhost/backend/wp-content/plugins/calendario/',
				trashUrl: '',
				defaultStatusColors: {
					publish: '#eb6e6f',
					future: '#d9eee1',
					draft: '#ffc90d',
					pending: '#f6bc98',
					private: '#eb6e6f',
				},
				presetStatusColors: [
					'#ffc90d',
					'#8F3C3D',
					'#f27121',
					'#474750',
					'#c1bfb8',
					'#d9eee1',
					'#64b181',
					'#aaaae8',
					'#f6bc98',
					'#eb6e6f',
				],
				postStatuses: {
					publish: {
						name: 'Published',
						color: '#00A193',
					},
					future: {
						name: 'Scheduled',
						color: '#F7C900',
					},
					draft: {
						name: 'Draft',
						color: '#B8B8B8',
					},
					pending: {
						name: 'Pending Review',
						color: '#EB867B',
					},
					private: {
						name: 'Private',
						color: '#252B6F',
					},
				},
				postAuthors: {
					1: 'Author 1',
					5: 'Author 2',
				},
		  }
		: {
				...window.rhdReactPlugin,
		  };

export const dateFormat = {
	day: 'd',
	date: 'yyyy-MM-dd',
	dayName: 'EEEE',
	monthShort: 'MMM',
	fullDate: 'EEEE,  MMMM dd, yyyy',
	fullDateTime: 'EEEE,  MMMM dd, yyyy @ h:mm aa',
	daylessDate: 'MMMM dd, yyyy',
};
