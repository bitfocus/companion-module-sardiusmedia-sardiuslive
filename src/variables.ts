import { CompanionVariableDefinitions } from '@companion-module/base'
import { SardiusVariables } from './index.js'

export function getVariables(): CompanionVariableDefinitions<SardiusVariables> {
	return {
		event_title: { name: 'Current Event Title' },
		event_end_time: { name: 'Event End Time' },
		event_countdown: { name: 'Event Countdown (HH:MM:SS)' },
		event_countdown_short: { name: 'Event Countdown (MM:SS)' },
		selected_channel_id: { name: 'Selected Channel ID' },
		selected_channel_name: { name: 'Selected Channel Name' },
	}
}
