import axios from 'axios'
import moment from 'moment'
import momentTZ from 'moment-timezone'

const WATCH_API_BASE = 'https://watch.sardius.media'
const API_BASE = 'https://api.sardius.media'

export interface SardiusEvent {
	id: string
	title: string
	start: string
	end: string
	timezone: string
	metadata: Record<string, unknown>
	settings: Record<string, unknown>
}

export async function getCurrentEvent(accountId: string, channelId: string): Promise<SardiusEvent | null> {
	const url = `${WATCH_API_BASE}/calendar/${accountId}/${channelId}/live`
	const response = await axios({
		url,
		method: 'get',
		headers: {},
	})
	if (response.data?.id) {
		return response.data
	}
	return null
}

export async function getSites(
	apiKey: string,
	accountId: string,
): Promise<{ id: string; name: string; playerType?: string; videoSource?: string; liveDefaults?: Record<string, unknown> }[]> {
	const url = `${API_BASE}/sites/${accountId}`
	const response = await axios({
		url,
		method: 'get',
		headers: { Authorization: `Bearer ${apiKey}` },
	})
	// Handle both { data: [...] } and bare array responses
	const items: unknown[] = Array.isArray(response.data)
		? response.data
		: Array.isArray(response.data?.data)
			? response.data.data
			: []
	return items
		.map((site: unknown) => {
			const s = site as Record<string, unknown>
			const live = s.live as Record<string, unknown> | undefined
			const video = s.video as Record<string, string> | undefined
			return {
				id: String(s.pk ?? s.id ?? s.siteId ?? ''),
				name: String(s.name ?? s.siteName ?? s.pk ?? ''),
				playerType: typeof s.playerType === 'string' ? s.playerType : undefined,
				videoSource: video?.source ?? String(s.pk ?? ''),
				liveDefaults: live?.defaults as Record<string, unknown> | undefined,
			}
		})
		.filter((s) => s.id)
		.sort((a, b) => a.name.localeCompare(b.name))
}

export async function updateEvent(
	apiKey: string,
	accountId: string,
	channelId: string,
	eventId: string,
	data: SardiusEvent,
): Promise<void> {
	const url = `${API_BASE}/calendars/${accountId}/${channelId}/events/${eventId}`
	await axios({
		url,
		method: 'post',
		headers: { Authorization: `Bearer ${apiKey}` },
		data,
	})
}

export async function createEvent(
	apiKey: string,
	accountId: string,
	channelId: string,
	eventName: string,
	channelConfig?: { playerType?: string; videoSource?: string; liveDefaults?: Record<string, unknown> },
): Promise<void> {
	const url = `${API_BASE}/calendars/${accountId}/${channelId}/events`
	const eventStart = moment().format()
	const eventEnd = moment().add(1, 'hour').format()
	const createData = {
		end: eventEnd,
		start: eventStart,
		timezone: momentTZ.tz.guess(),
		title: eventName,
		metadata: {
			asset: {
				bios: {
					speakers: [],
					worshipLeaders: [],
					specials: [],
					attendees: [],
					guests: [],
					hosts: [],
					actors: [],
					artists: [],
					announcers: [],
					performers: [],
					bios: [],
				},
				metadata: {},
				album: '',
				categories: [],
				languages: [],
				series: '',
				tags: [],
				title: '',
				topics: [],
			},
			autoApprove: false,
			autoPublish: false,
			defaultProfile: 'hls',
			description: '',
			eventImage: '',
			postRoll: 0,
			preRoll: 0,
			subtitle: '',
			video: {},
		},
		settings: {
			clearDVR: false,
			eventPlayerId: channelConfig?.playerType ?? 'dvr',
			experiences: {
				access_default: {
					video: {
						source: channelConfig?.videoSource ?? channelId,
						type: 'assetUID',
					},
				},
			},
			publish: {
				autoApprove: false,
				autoPublish: false,
				defaultProfile: 'hls',
			},
			excludePrePost: false,
			keepVOD: false,
			deleteAssetInDays: 0,
			...(channelConfig?.liveDefaults ? { live: channelConfig.liveDefaults } : {}),
		},
	}
	await axios({
		url,
		method: 'post',
		headers: { Authorization: `Bearer ${apiKey}` },
		data: createData,
	})
}

export async function triggerSiteUpdate(apiKey: string, accountId: string, channelId: string): Promise<void> {
	const timestamp = moment().valueOf()
	const url = `${API_BASE}/sites/${accountId}/${channelId}/trigger?version=${timestamp}`
	await axios({
		url,
		method: 'get',
		headers: { Authorization: `Bearer ${apiKey}` },
	})
}

export function addMinutesToEvent(event: SardiusEvent, minutes: number): SardiusEvent {
	const newEnd = moment(event.end).add(minutes, 'minutes').format()
	return { ...event, end: newEnd }
}

export function endEventNow(event: SardiusEvent): SardiusEvent {
	const newEnd = moment().format()
	return { ...event, end: newEnd }
}

export function subtractMinutesFromEvent(event: SardiusEvent, minutes: number): SardiusEvent {
	const newEnd = moment(event.end).subtract(minutes, 'minutes').format()
	return { ...event, end: newEnd }
}

/**
 * Fetch the current live event, apply a transformation, persist it, and trigger a site update.
 * Throws if there is no live event.
 */
export async function modifyCurrentEvent(
	apiKey: string,
	accountId: string,
	channelId: string,
	modifier: (event: SardiusEvent) => SardiusEvent,
): Promise<SardiusEvent> {
	const event = await getCurrentEvent(accountId, channelId)
	if (!event) throw new Error('No live event found')
	const updated = modifier(event)
	await updateEvent(apiKey, accountId, channelId, event.id, updated)
	await triggerSiteUpdate(apiKey, accountId, channelId)
	return event
}
