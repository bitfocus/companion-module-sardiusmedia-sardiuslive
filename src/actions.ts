import { CompanionActionCallbackContext, CompanionActionDefinitions, CompanionActionEvent, LogLevel } from '@companion-module/base'
import { exec } from 'child_process'
import { getCurrentEvent, createEvent, triggerSiteUpdate, modifyCurrentEvent, addMinutesToEvent, subtractMinutesFromEvent, endEventNow } from './api.js'
import { ModuleConfig } from './config.js'

export interface Channel {
	id: string
	name: string
}

/** Channel picker: checkbox defaults to "use selected channel"; dropdown shown only when unchecked. */
function channelOptions(channels: Channel[]) {
	return [
		{
			type: 'checkbox' as const,
			id: 'useSelectedChannel',
			label: 'Use selected channel',
			default: true,
			disableAutoExpression: true,
		},
		{
			type: 'dropdown' as const,
			id: 'channelId',
			label: 'Channel',
			default: '',
			choices: [{ id: '', label: '— Select a channel —' }, ...channels.map((ch) => ({ id: ch.id, label: ch.name }))],
			isVisibleExpression: '$(options:useSelectedChannel) == false',
		},
	]
}

function resolveChannelId(
	options: { useSelectedChannel?: unknown; channelId?: unknown },
	getSelectedChannel: (op: 'get') => Channel | null,
): string {
	return options.useSelectedChannel !== false
		? (getSelectedChannel('get')?.id ?? '')
		: String(options.channelId ?? '')
}

function guardAction(
	config: ModuleConfig,
	channelId: string,
	log: (level: LogLevel, msg: string) => void,
): boolean {
	if (!config.apiKey) { log('error', 'API Key is not configured'); return false }
	if (!channelId) { log('error', 'No channel selected'); return false }
	return true
}

function errMsg(error: unknown): string {
	return error instanceof Error ? error.message : 'Unknown error'
}

export function getActions(
	channels: Channel[],
	getConfig: () => ModuleConfig,
	log: (level: LogLevel, message: string) => void,
	onEventChanged: (channelId: string) => void,
	getSelectedChannel: (op: 'next' | 'prev' | 'get') => Channel | null,
): CompanionActionDefinitions {
	return {
		open_scp: {
			name: 'Open Sardius Control Panel',
			description: 'Opens the Sardius Control Panel in your default browser',
			options: [],
			callback: async (_action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const url = 'https://cp.sardius.media'
				const command =
					process.platform === 'darwin'
						? `open "${url}"`
						: process.platform === 'win32'
							? `start "${url}"`
							: `xdg-open "${url}"`
				exec(command, (error) => {
					if (error) log('error', `Failed to open browser: ${error.message}`)
				})
			},
		},
		add_time: {
			name: 'Add Time to Event',
			description: 'Adds time to the currently active live event',
			options: [
				...channelOptions(channels),
				{
					type: 'number',
					id: 'minutes',
					label: 'Minutes to Add',
					default: 5,
					min: 1,
					max: 60,
				},
			],
			callback: async (action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const config = getConfig()
				const channelId = resolveChannelId(action.options, getSelectedChannel)
				const minutes = Number(action.options.minutes) || 5
				if (!guardAction(config, channelId, log)) return
				try {
					const event = await modifyCurrentEvent(config.apiKey, config.accountId, channelId, (e) => addMinutesToEvent(e, minutes))
					log('info', `Added ${minutes} minutes to event "${event.title}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', errMsg(error))
				}
			},
		},
		subtract_time: {
			name: 'Subtract Time from Event',
			description: 'Subtracts time from the currently active live event',
			options: [
				...channelOptions(channels),
				{
					type: 'number',
					id: 'minutes',
					label: 'Minutes to Subtract',
					default: 5,
					min: 1,
					max: 60,
				},
			],
			callback: async (action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const config = getConfig()
				const channelId = resolveChannelId(action.options, getSelectedChannel)
				const minutes = Number(action.options.minutes) || 5
				if (!guardAction(config, channelId, log)) return
				try {
					const event = await modifyCurrentEvent(config.apiKey, config.accountId, channelId, (e) => subtractMinutesFromEvent(e, minutes))
					log('info', `Subtracted ${minutes} minutes from event "${event.title}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', errMsg(error))
				}
			},
		},
		create_event: {
			name: 'Go Live (Create Event)',
			description: 'Creates a new 1-hour live event on the specified channel',
			options: [
				...channelOptions(channels),
				{
					type: 'textinput',
					id: 'eventName',
					label: 'Event Name',
					default: 'Live Event',
					minLength: 1,
				},
			],
			callback: async (action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const config = getConfig()
				const channelId = resolveChannelId(action.options, getSelectedChannel)
				const eventName = String(action.options.eventName) || 'Live Event'
				if (!guardAction(config, channelId, log)) return
				try {
					const currentEvent = await getCurrentEvent(config.accountId, channelId)
					if (currentEvent) { log('warn', 'There is already an active live event'); return }
					await createEvent(config.apiKey, config.accountId, channelId, eventName)
					await triggerSiteUpdate(config.apiKey, config.accountId, channelId)
					log('info', `Created new event "${eventName}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', errMsg(error))
				}
			},
		},
		cycle_channel_next: {
			name: 'Cycle Channel (Forward)',
			description: 'Steps to the next channel in the list. Assign to single tap.',
			options: [],
			callback: async (_action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const result = getSelectedChannel('next')
				if (!result) { log('warn', 'No channels available to cycle'); return }
				log('info', `Selected channel: ${result.name}`)
			},
		},
		cycle_channel_prev: {
			name: 'Cycle Channel (Backward)',
			description: 'Steps to the previous channel in the list. Assign to double tap or hold.',
			options: [],
			callback: async (_action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const result = getSelectedChannel('prev')
				if (!result) { log('warn', 'No channels available to cycle'); return }
				log('info', `Selected channel: ${result.name}`)
			},
		},
		end_event: {
			name: 'End Event',
			description: 'Ends the currently active live event. Recommended: configure as press-and-hold (2-5 seconds) to prevent accidental activation.',
			options: channelOptions(channels),
			callback: async (action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const config = getConfig()
				const channelId = resolveChannelId(action.options, getSelectedChannel)
				if (!guardAction(config, channelId, log)) return
				try {
					const event = await modifyCurrentEvent(config.apiKey, config.accountId, channelId, endEventNow)
					log('info', `Ended event "${event.title}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', errMsg(error))
				}
			},
		},
	}
}
