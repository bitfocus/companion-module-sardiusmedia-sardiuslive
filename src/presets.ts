import { combineRgb, CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'

export function getPresets(instanceLabel: string): {
	structure: CompanionPresetSection[]
	presets: CompanionPresetDefinitions
} {
	const presets: CompanionPresetDefinitions = {
		go_live: {
			type: 'simple',
			name: 'Go Live',
			style: {
				text: 'GO\nLIVE',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			steps: [
				{
					down: [{ actionId: 'create_event', options: { useSelectedChannel: true, channelId: '', eventName: 'Live Event' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'live_event_active',
					options: { useSelectedChannel: true, channelId: '' },
					style: {
						bgcolor: combineRgb(0, 204, 0),
						color: combineRgb(255, 255, 255),
						text: `● LIVE\n$(${instanceLabel}:event_countdown_short)`,
						size: 'auto',
					},
				},
			],
		},

		end_event: {
			type: 'simple',
			name: 'End Event',
			style: {
				text: 'END\nEVENT',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(102, 0, 0),
			},
			steps: [
				{
					down: [],
					up: [],
					2000: {
						actions: [{ actionId: 'end_event', options: { useSelectedChannel: true, channelId: '' } }],
						options: { runWhileHeld: true },
					},
				},
			],
			feedbacks: [],
		},

		add_time: {
			type: 'simple',
			name: 'Add 5 Minutes',
			style: {
				text: '+5\nMIN',
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 204, 0),
			},
			steps: [
				{
					down: [{ actionId: 'add_time', options: { useSelectedChannel: true, channelId: '', minutes: 5 } }],
					up: [],
				},
			],
			feedbacks: [],
		},

		subtract_time: {
			type: 'simple',
			name: 'Subtract 5 Minutes',
			style: {
				text: '-5\nMIN',
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 153, 0),
			},
			steps: [
				{
					down: [{ actionId: 'subtract_time', options: { useSelectedChannel: true, channelId: '', minutes: 5 } }],
					up: [],
				},
			],
			feedbacks: [],
		},

		add_time_30: {
			type: 'simple',
			name: 'Add 30 Minutes',
			style: {
				text: '+30\nMIN',
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 204, 0),
			},
			steps: [
				{
					down: [{ actionId: 'add_time', options: { useSelectedChannel: true, channelId: '', minutes: 30 } }],
					up: [],
				},
			],
			feedbacks: [],
		},

		subtract_time_30: {
			type: 'simple',
			name: 'Subtract 30 Minutes',
			style: {
				text: '-30\nMIN',
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 153, 0),
			},
			steps: [
				{
					down: [{ actionId: 'subtract_time', options: { useSelectedChannel: true, channelId: '', minutes: 30 } }],
					up: [],
				},
			],
			feedbacks: [],
		},

		add_time_60: {
			type: 'simple',
			name: 'Add 60 Minutes',
			style: {
				text: '+60\nMIN',
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 204, 0),
			},
			steps: [
				{
					down: [{ actionId: 'add_time', options: { useSelectedChannel: true, channelId: '', minutes: 60 } }],
					up: [],
				},
			],
			feedbacks: [],
		},

		subtract_time_60: {
			type: 'simple',
			name: 'Subtract 60 Minutes',
			style: {
				text: '-60\nMIN',
				size: 'auto',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 153, 0),
			},
			steps: [
				{
					down: [{ actionId: 'subtract_time', options: { useSelectedChannel: true, channelId: '', minutes: 60 } }],
					up: [],
				},
			],
			feedbacks: [],
		},

		cycle_next: {
			type: 'simple',
			name: 'Next Channel',
			style: {
				text: 'NEXT\nCH →',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 51, 153),
			},
			steps: [
				{
					down: [{ actionId: 'cycle_channel_next', options: {} }],
					up: [],
				},
			],
			feedbacks: [],
		},

		cycle_prev: {
			type: 'simple',
			name: 'Previous Channel',
			style: {
				text: '← CH\nPREV',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 51, 153),
			},
			steps: [
				{
					down: [{ actionId: 'cycle_channel_prev', options: {} }],
					up: [],
				},
			],
			feedbacks: [],
		},

		error_display: {
			type: 'simple',
			name: 'Error Display',
			style: {
				text: '✓ OK',
				size: 'auto',
				color: combineRgb(100, 100, 100),
				bgcolor: combineRgb(20, 20, 20),
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'action_error',
					options: {},
					style: {
						bgcolor: combineRgb(180, 0, 0),
						color: combineRgb(255, 255, 255),
						text: `$(${instanceLabel}:last_error)`,
						size: 'auto',
					},
				},
			],
		},

		channel_display: {
			type: 'simple',
			name: 'Channel Display',
			style: {
				text: `$(${instanceLabel}:selected_channel_name)`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [{ actionId: 'cycle_channel_next', options: {} }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'selected_channel_display',
					options: {},
					style: {
						bgcolor: combineRgb(0, 102, 204),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		},

	}

	const structure: CompanionPresetSection[] = [
		{
			id: 'event_control',
			name: 'Event Control',
			definitions: ['go_live', 'end_event', 'add_time', 'subtract_time', 'add_time_30', 'subtract_time_30', 'add_time_60', 'subtract_time_60'],
		},
		{
			id: 'channel_control',
			name: 'Channel Control',
			definitions: ['cycle_next', 'cycle_prev', 'channel_display'],
		},
		{
			id: 'status',
			name: 'Status',
			definitions: ['error_display'],
		},
	]

	return { structure, presets }
}
