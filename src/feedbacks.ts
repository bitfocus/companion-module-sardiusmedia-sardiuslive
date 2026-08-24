import { combineRgb, CompanionFeedbackDefinitions, CompanionFeedbackBooleanEvent, CompanionFeedbackCallbackContext } from '@companion-module/base'
import { Channel } from './actions.js'

export interface ChannelState {
	hasLiveEvent: boolean
	currentEventTitle: string | null
	eventEndTime: string | null
}

export function getFeedbacks(
	channels: Channel[],
	getChannelState: (channelId: string) => ChannelState | undefined,
	getSelectedChannel: () => Channel | null,
	instanceLabel: string,
	getHasError: () => boolean,
): CompanionFeedbackDefinitions {
	return {
		selected_channel_display: {
			type: 'boolean',
			name: 'Selected Channel Display',
			description: `Highlights this button when a channel is currently selected. The button text variable $(${instanceLabel}:selected_channel_name) updates automatically as channels are cycled.`,
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(0, 102, 204),
				color: combineRgb(255, 255, 255),
				text: `$(${instanceLabel}:selected_channel_name)`,
				size: 'auto',
			},
			callback: (_feedback: CompanionFeedbackBooleanEvent, _context: CompanionFeedbackCallbackContext) => {
				return getSelectedChannel() !== null
			},
		},
		live_event_active: {
			type: 'boolean',
			name: 'Live Event Active',
			description: `Highlights this button when the channel has an active live event. Tip: use $(${instanceLabel}:event_countdown_short) in the button text for a live countdown.`,
			options: [
				{
					type: 'checkbox',
					id: 'useSelectedChannel',
					label: 'Use selected channel',
					default: true,
					disableAutoExpression: true,
				},
				{
					type: 'dropdown',
					id: 'channelId',
					label: 'Channel',
					default: '',
					choices: [{ id: '', label: '— Select a channel —' }, ...channels.map((ch) => ({ id: ch.id, label: ch.name }))],
					isVisibleExpression: '$(options:useSelectedChannel) == false',
				},
			],
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(255, 255, 255),
				text: `● LIVE\n$(${instanceLabel}:event_countdown_short)`,
				size: 'auto',
			},
			callback: (feedback: CompanionFeedbackBooleanEvent, _context: CompanionFeedbackCallbackContext) => {
				const channelId = feedback.options.useSelectedChannel
					? getSelectedChannel()?.id
					: String(feedback.options.channelId)
				if (!channelId) return false
				const state = getChannelState(channelId)
				return !!state?.hasLiveEvent
			},
		},
		action_error: {
			type: 'boolean',
			name: 'Action Error',
			description: 'Active when the last action failed. Add to a dedicated error display button to surface errors from any action.',
			options: [],
			defaultStyle: {
				bgcolor: combineRgb(180, 0, 0),
				color: combineRgb(255, 255, 255),
				text: `$(${instanceLabel}:last_error)`,
				size: 'auto',
			},
			callback: (_feedback: CompanionFeedbackBooleanEvent, _context: CompanionFeedbackCallbackContext) => {
				return getHasError()
			},
		},
	}
}
