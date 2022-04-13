<?php
/**
 * Freemius integration.
 */

/**
 * Freemius integration.
 */
if ( ! function_exists( 'rhd_cal' ) ) {
	// Create a helper function for easy SDK access.
	function rhd_cal() {
		global $rhd_cal;

		if ( ! isset( $rhd_cal ) ) {
			// Include Freemius SDK.
			require_once dirname( __FILE__ ) . '/freemius/start.php';

			$rhd_cal = fs_dynamic_init( array(
				'id'                  => '8136',
				'slug'                => 'calendario',
				'type'                => 'plugin',
				'public_key'          => 'pk_0ceb9fcfae9cbd708428cd6126d45',
				'is_premium'          => true,
				'premium_suffix'      => 'Pro',
				// If your plugin is a serviceware, set this option to false.
				'has_premium_version' => true,
				'has_addons'          => false,
				'has_paid_plans'      => true,
				'is_org_compliant'    => false,
				'trial'               => array(
					'days'               => 30,
					'is_require_payment' => false,
				),
				'menu'                => array(
					'slug'    => 'calendario',
					'support' => false,
				),
				// Set the SDK to work in a sandbox mode (for development & testing).
				// IMPORTANT: MAKE SURE TO REMOVE SECRET KEY BEFORE DEPLOYMENT.
				'secret_key'          => 'sk_cR%[KEAzQyGU.RFj7P#CGgJ^t#GHT',
			) );
		}

		return $rhd_cal;
	}

	// Init Freemius.
	rhd_cal();
	// Signal that SDK was initiated.
	do_action( 'rhd_cal_loaded' );
}

/**
 * Freemius customer messages.
 */
// phpcs:ignore Squiz.Commenting.FunctionComment.MissingParamTag
function rhd_cal_custom_connect_message_on_update( $message, $user_first_name, $plugin_title, $user_login, $site_link, $freemius_link ) {
	$updated_message = sprintf(
		/* Translators: %s: user first name, %s: plugin title, %s: user login, %s: site link, freemiums link */
		__( 'Hey %1$s' ) . ',<br>' . __( 'Never miss an important %2$s update! Opt-in to our security and feature updates notifications and non-sensitive diagnostic tracking with %5$s. If you skip this, that\'s okay! %2$s will totally work just fine. :)', 'calendario' ),
		$user_first_name,
		'<b>' . $plugin_title . '</b>',
		'<b>' . $user_login . '</b>',
		$site_link,
		$freemius_link
	);

	return $updated_message;
}
rhd_cal()->add_filter( 'connect_message_on_update', 'rhd_cal_custom_connect_message_on_update', 10, 6 );
