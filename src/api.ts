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

export async function getSites(apiKey: string, accountId: string): Promise<{ id: string; name: string }[]> {
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
			const s = site as Record<string, string>
			return { id: s.pk ?? s.id ?? s.siteId ?? '', name: s.name ?? s.siteName ?? s.pk ?? '' }
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
			eventPlayerId: 'dvr',
			experiences: {
				access_default: {
					video: {
						source: channelId,
						type: 'assetUID',
					},
				},
			},
			publish: {
				autoApprove: false,
				autoPublish: false,
				defaultProfile: 'hls',
			},
			keepPrePost: false,
			keepVOD: true,
			deleteAssetInDays: 0,
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
