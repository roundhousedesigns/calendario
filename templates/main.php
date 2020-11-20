<?php
/**
 * The main Calendario template.
 */
?>

<div id="calendario" data-server-gmt-offset="<?php echo get_option( 'gmt_offset' ); ?>">
	<header class="plugin-header">
		<h2 class="plugin-title"><?php echo $this->plugin_meta["Name"]; ?></h2>
	</header>
	
	<div id="calendario-workspace">
		<div id="editorial-calendar" class="editorial-calendar" data-oldest="<?php echo $oldest_date[0]; ?>" data-latest="<?php echo $latest_date[0]; ?>"></div>
		<div id="calendario-sidebar" class="calendario-sidebar">
			<div id="event-toggles" class="calendario-sidebar-container">
				<h4 class="calendario-sidebar-box-title"><?php _e( 'Filter by Status', 'rhdwp' ); ?></h4>
				<div id="calendario-event-toggles" class="calendario-event-toggles calendario-sidebar-box">
					<ul class="toggles">
						<?php
						$statuses = array(
							'publish'	=> 'Published',
							'draft'		=> 'Draft',
							'pending'	=> 'Pending',
							'future'	=> 'Scheduled'
						);
						?>
						<?php foreach( $statuses as $status => $label ) : ?>	
							<li class="event-toggle-item">
								<button class="event-toggle status-<?php echo $status; ?>" data-filter="<?php echo $status; ?>"><?php echo $label; ?></button>
							</li>
						<?php endforeach; ?>
					</ul>
				</div>
			</div>
			<div id="calendario-drafts" class="calendario-sidebar-container">
				<h4 class="calendario-sidebar-box-title"><?php _e( 'Unscheduled Drafts', 'rhdwp' ); ?></h4>
				<ul id="calendario-unscheduled-drafts" class="unscheduled-drafts-list calendario-sidebar-box"></ul>
			</div>
		</div>
	</div>
</div>