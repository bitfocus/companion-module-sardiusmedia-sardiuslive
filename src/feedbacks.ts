import { combineRgb, CompanionFeedbackDefinitions, CompanionFeedbackAdvancedEvent, CompanionFeedbackCallbackContext } from '@companion-module/base'
import moment from 'moment'
import { Channel } from './actions.js'

export interface ChannelState {
	hasLiveEvent: boolean
	currentEventTitle: string | null
	eventEndTime: string | null
}

function formatCountdown(eventEndTime: string | null | undefined): string {
	if (!eventEndTime) return ''
	const now = moment()
	const end = moment(eventEndTime)
	const diff = end.diff(now)
	if (diff <= 0) return '00:00'
	const duration = moment.duration(diff)
	const hours = Math.floor(duration.asHours())
	const minutes = duration.minutes()
	const seconds = duration.seconds()
	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function getFeedbacks(
	getChannelState: (channelId: string) => ChannelState | undefined,
	getSelectedChannel: () => Channel | null,
): CompanionFeedbackDefinitions {
	return {
		selected_channel_display: {
			type: 'advanced',
			name: 'Selected Channel Display',
			description: 'Updates the button to show the currently selected channel name',
			options: [],
			affectedProperties: ['text', 'bgcolor', 'color'],
			callback: (_feedback: CompanionFeedbackAdvancedEvent, _context: CompanionFeedbackCallbackContext) => {
				const channel = getSelectedChannel()
				if (!channel) return { text: 'No Channel', size: '14' }
				return {
					bgcolor: combineRgb(0, 102, 204),
					color: combineRgb(255, 255, 255),
					text: channel.name,
					size: '14',
				}
			},
		},
		live_event_active: {
			type: 'advanced',
			name: 'Live Event Active',
			description: 'Changes button to green with channel name and countdown when there is an active live event. Leave Channel ID blank to follow the selected channel.',
			options: [
				{
					type: 'textinput',
					id: 'channelId',
					label: 'Channel ID (leave blank to use selected channel)',
					default: '',
				},
			],
			affectedProperties: ['text', 'bgcolor', 'color'],
			callback: (feedback: CompanionFeedbackAdvancedEvent, _context: CompanionFeedbackCallbackContext) => {
				const channel = getSelectedChannel()
				const channelId = String(feedback.options.channelId) || channel?.id
				if (!channelId) return {}
				const state = getChannelState(channelId)
				if (!state?.hasLiveEvent) return {}
				const countdown = formatCountdown(state.eventEndTime)
				const channelName = channel?.name ?? channelId
				const shortName = channelName.length > 10 ? channelName.slice(0, 9) + '…' : channelName
				return {
					bgcolor: combineRgb(0, 204, 0),
					color: combineRgb(255, 255, 255),
					text: `${shortName}\n● LIVE\n${countdown}`,
					size: 'auto',
				}
			},
		},
	}
}
