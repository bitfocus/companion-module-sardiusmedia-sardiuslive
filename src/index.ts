import { InstanceBase, InstanceStatus, InstanceTypes } from '@companion-module/base'
import { getConfigFields, ModuleConfig } from './config.js'
import { getActions, Channel } from './actions.js'
import { getFeedbacks, ChannelState } from './feedbacks.js'
import { getVariables } from './variables.js'
import { getCurrentEvent, getSites } from './api.js'
import moment from 'moment'

const POLL_INTERVAL = 5000
const COUNTDOWN_INTERVAL = 1000

export type SardiusVariables = {
	event_title: string | undefined
	event_end_time: string | undefined
	event_countdown: string | undefined
	event_countdown_short: string | undefined
	selected_channel_id: string | undefined
	selected_channel_name: string | undefined
}

interface SardiusInstanceTypes extends InstanceTypes {
	config: ModuleConfig
	secrets: undefined
	variables: SardiusVariables
}

export default class SardiusMediaInstance extends InstanceBase<SardiusInstanceTypes> {
	config: ModuleConfig = {
		apiKey: '',
		accountId: '',
		activeChannelIds: [],
	}

	channelStates = new Map<string, ChannelState>()
	trackedChannels = new Set<string>()
	channels: Channel[] = []
	selectedChannelIndex = 0
	pollTimer: ReturnType<typeof setInterval> | null = null
	countdownTimer: ReturnType<typeof setInterval> | null = null

	async init(config: ModuleConfig, _isFirstInit: boolean, _secrets: undefined): Promise<void> {
		this.config = config
		this.updateStatus(InstanceStatus.Ok)
		this.updateActions()
		this.updateVariables()
		this.updateFeedbacks()
		this.startPolling()
		this.startCountdown()
		await this.loadChannels()
	}

	async destroy(): Promise<void> {
		this.stopPolling()
		this.stopCountdown()
	}

	async configUpdated(config: ModuleConfig, _secrets: undefined): Promise<void> {
		this.config = config
		this.updateStatus(InstanceStatus.Ok)
		this.updateActions()
		this.updateVariables()
		this.updateFeedbacks()
		this.stopPolling()
		this.stopCountdown()
		this.startPolling()
		this.startCountdown()
		await this.loadChannels()
	}

	getConfigFields() {
		return getConfigFields(this.channels)
	}

	get cycleChannels(): Channel[] {
		const ids = this.config.activeChannelIds
		if (!ids || ids.length === 0) return this.channels
		return this.channels.filter((ch) => ids.includes(ch.id))
	}

	updateActions(): void {
		const actions = getActions(
			() => this.config,
			(level, message) => this.log(level, message),
			(channelId) => this.checkChannelStatus(channelId),
			(op) => this.handleSelectedChannel(op),
		)
		this.setActionDefinitions(actions)
	}

	updateVariables(): void {
		this.setVariableDefinitions(getVariables())
	}

	updateFeedbacks(): void {
		const feedbacks = getFeedbacks(
			(channelId) => {
				if (channelId && !this.trackedChannels.has(channelId)) {
					this.trackedChannels.add(channelId)
					this.checkChannelStatus(channelId)
				}
				return this.channelStates.get(channelId)
			},
			() => this.handleSelectedChannel('get'),
		)
		this.setFeedbackDefinitions(feedbacks)
	}

	async loadChannels(): Promise<void> {
		if (!this.config.apiKey || !this.config.accountId) return
		try {
			const sites = await getSites(this.config.apiKey, this.config.accountId)
			this.channels = sites
			this.selectedChannelIndex = 0
			if (this.channels.length > 0) {
				this.updateSelectedChannelVariables()
				this.checkFeedbacks('selected_channel_display')
			}
			this.updateStatus(InstanceStatus.Ok)
		} catch (err) {
			this.log('error', `Failed to load channels: ${err instanceof Error ? err.message : String(err)}`)
			this.updateStatus(InstanceStatus.BadConfig, 'Failed to load channels — check API Key and Account ID')
		}
	}

	handleSelectedChannel(op: 'next' | 'prev' | 'get'): Channel | null {
		const pool = this.cycleChannels
		if (pool.length === 0) return null
		if (op === 'next' || op === 'prev') {
			const len = pool.length
			this.selectedChannelIndex =
				op === 'next'
					? (this.selectedChannelIndex + 1) % len
					: (this.selectedChannelIndex - 1 + len) % len
			const channel = pool[this.selectedChannelIndex]
			this.updateSelectedChannelVariables()
			this.trackedChannels.add(channel.id)
			this.checkChannelStatus(channel.id)
			this.checkFeedbacks('live_event_active')
			this.checkFeedbacks('selected_channel_display')
			return channel
		}
		const idx = Math.min(this.selectedChannelIndex, pool.length - 1)
		return pool[idx] ?? null
	}

	updateSelectedChannelVariables(): void {
		const channel = this.cycleChannels[this.selectedChannelIndex]
		if (!channel) return
		this.setVariableValues({
			selected_channel_id: channel.id,
			selected_channel_name: channel.name,
		})
	}

	startPolling(): void {
		if (this.pollTimer) return
		this.pollTimer = setInterval(() => {
			this.trackedChannels.forEach((channelId) => {
				this.checkChannelStatus(channelId)
			})
		}, POLL_INTERVAL)
	}

	stopPolling(): void {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	startCountdown(): void {
		if (this.countdownTimer) return
		this.countdownTimer = setInterval(() => {
			this.updateCountdownVariables()
			this.checkFeedbacks('live_event_active')
		}, COUNTDOWN_INTERVAL)
	}

	stopCountdown(): void {
		if (this.countdownTimer) {
			clearInterval(this.countdownTimer)
			this.countdownTimer = null
		}
	}

	async checkChannelStatus(channelId: string): Promise<void> {
		if (!this.config.accountId || !channelId) return
		this.trackedChannels.add(channelId)
		try {
			const currentEvent = await getCurrentEvent(this.config.accountId, channelId)
			const hasLiveEvent = currentEvent !== null
			const currentEventTitle = currentEvent?.title ?? null
			const eventEndTime = currentEvent?.end ?? null
			const existingState = this.channelStates.get(channelId)
			if (
				!existingState ||
				existingState.hasLiveEvent !== hasLiveEvent ||
				existingState.currentEventTitle !== currentEventTitle ||
				existingState.eventEndTime !== eventEndTime
			) {
				this.channelStates.set(channelId, { hasLiveEvent, currentEventTitle, eventEndTime })
				const selectedId = this.handleSelectedChannel('get')?.id
				if (channelId === selectedId) {
					this.setVariableValues({
						event_title: currentEventTitle ?? '',
						event_end_time: eventEndTime ? moment(eventEndTime).format('h:mm A') : '',
					})
					this.updateCountdownVariables()
				}
				this.checkFeedbacks('live_event_active')
			}
		} catch {
			// Silently fail on polling errors to avoid log spam
		}
	}

	updateCountdownVariables(): void {
		const selectedId = this.handleSelectedChannel('get')?.id
		const state = this.channelStates.get(selectedId ?? '')
		if (!state?.eventEndTime) {
			this.setVariableValues({ event_countdown: '', event_countdown_short: '' })
			return
		}
		const now = moment()
		const end = moment(state.eventEndTime)
		const diff = end.diff(now)
		if (diff <= 0) {
			this.setVariableValues({ event_countdown: '00:00:00', event_countdown_short: '00:00' })
			return
		}
		const duration = moment.duration(diff)
		const hours = Math.floor(duration.asHours())
		const minutes = duration.minutes()
		const seconds = duration.seconds()
		const countdownFull = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		const countdownShort =
			hours > 0
				? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
				: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		this.setVariableValues({ event_countdown: countdownFull, event_countdown_short: countdownShort })
	}
}

export const UpgradeScripts = []
