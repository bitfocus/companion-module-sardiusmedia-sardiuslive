import { CompanionActionCallbackContext, CompanionActionDefinitions, CompanionActionEvent, LogLevel } from '@companion-module/base'
import { exec } from 'child_process'
import { getCurrentEvent, updateEvent, createEvent, triggerSiteUpdate, addMinutesToEvent, subtractMinutesFromEvent, endEventNow } from './api.js'
import { ModuleConfig } from './config.js'

export interface Channel {
	id: string
	name: string
}

const channelIdOption = {
	type: 'textinput' as const,
	id: 'channelId',
	label: 'Channel ID (leave blank to use selected channel)',
	default: '',
}

export function getActions(
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
				channelIdOption,
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
				const channelId = String(action.options.channelId) || getSelectedChannel('get')?.id || ''
				const minutes = Number(action.options.minutes) || 5
				if (!config.apiKey) { log('error', 'API Key is not configured'); return }
				if (!channelId) { log('error', 'Channel ID is not configured'); return }
				try {
					const currentEvent = await getCurrentEvent(config.accountId, channelId)
					if (!currentEvent) { log('warn', 'No live event found'); return }
					const updatedEvent = addMinutesToEvent(currentEvent, minutes)
					await updateEvent(config.apiKey, config.accountId, channelId, currentEvent.id, updatedEvent)
					await triggerSiteUpdate(config.apiKey, config.accountId, channelId)
					log('info', `Added ${minutes} minutes to event "${currentEvent.title}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', `Failed to add time: ${error instanceof Error ? error.message : 'Unknown error'}`)
				}
			},
		},
		subtract_time: {
			name: 'Subtract Time from Event',
			description: 'Subtracts time from the currently active live event',
			options: [
				channelIdOption,
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
				const channelId = String(action.options.channelId) || getSelectedChannel('get')?.id || ''
				const minutes = Number(action.options.minutes) || 5
				if (!config.apiKey) { log('error', 'API Key is not configured'); return }
				if (!channelId) { log('error', 'Channel ID is not configured'); return }
				try {
					const currentEvent = await getCurrentEvent(config.accountId, channelId)
					if (!currentEvent) { log('warn', 'No live event found'); return }
					const updatedEvent = subtractMinutesFromEvent(currentEvent, minutes)
					await updateEvent(config.apiKey, config.accountId, channelId, currentEvent.id, updatedEvent)
					await triggerSiteUpdate(config.apiKey, config.accountId, channelId)
					log('info', `Subtracted ${minutes} minutes from event "${currentEvent.title}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', `Failed to subtract time: ${error instanceof Error ? error.message : 'Unknown error'}`)
				}
			},
		},
		create_event: {
			name: 'Go Live (Create Event)',
			description: 'Creates a new 1-hour live event on the specified channel',
			options: [
				channelIdOption,
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
				const channelId = String(action.options.channelId) || getSelectedChannel('get')?.id || ''
				const eventName = String(action.options.eventName) || 'Live Event'
				if (!config.apiKey) { log('error', 'API Key is not configured'); return }
				if (!channelId) { log('error', 'Channel ID is not configured'); return }
				try {
					const currentEvent = await getCurrentEvent(config.accountId, channelId)
					if (currentEvent) { log('warn', 'There is already an active live event'); return }
					await createEvent(config.apiKey, config.accountId, channelId, eventName)
					await triggerSiteUpdate(config.apiKey, config.accountId, channelId)
					log('info', `Created new event "${eventName}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', `Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
			options: [channelIdOption],
			callback: async (action: CompanionActionEvent, _context: CompanionActionCallbackContext) => {
				const config = getConfig()
				const channelId = String(action.options.channelId) || getSelectedChannel('get')?.id || ''
				if (!config.apiKey) { log('error', 'API Key is not configured'); return }
				if (!config.accountId || !channelId) { log('error', 'Account ID or Channel ID is not configured'); return }
				try {
					const currentEvent = await getCurrentEvent(config.accountId, channelId)
					if (!currentEvent) { log('warn', 'No active live event to end'); return }
					const endedEvent = endEventNow(currentEvent)
					await updateEvent(config.apiKey, config.accountId, channelId, currentEvent.id, endedEvent)
					await triggerSiteUpdate(config.apiKey, config.accountId, channelId)
					log('info', `Ended event "${currentEvent.title}"`)
					onEventChanged(channelId)
				} catch (error) {
					log('error', `Failed to end event: ${error instanceof Error ? error.message : 'Unknown error'}`)
				}
			},
		},
	}
}
