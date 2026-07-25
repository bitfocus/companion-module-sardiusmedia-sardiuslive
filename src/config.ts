import { JsonObject, SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig extends JsonObject {
	apiKey: string
	accountId: string
	activeChannelIds: string[]
}

export function getConfigFields(channels: { id: string; name: string }[] = []): SomeCompanionConfigField[] {
	const fields: SomeCompanionConfigField[] = [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'Enter your API Key and Account ID. Channels are loaded automatically from your Sardius account. Use the cycle actions to switch between channels — all feedback and event actions follow the selected channel.',
		},
		{
			type: 'textinput',
			id: 'apiKey',
			label: 'API Key',
			width: 12,
			minLength: 1,
			default: '',
		},
		{
			type: 'textinput',
			id: 'accountId',
			label: 'Account ID',
			width: 6,
			minLength: 1,
			default: '',
		},
	]

	if (channels.length === 0) {
		fields.push({
			type: 'static-text',
			id: 'channels_hint',
			width: 12,
			label: 'Channels',
			value: 'Save your API Key and Account ID, then reopen settings to select which channels to include in the cycle.',
		})
	} else {
		fields.push({
			type: 'multidropdown',
			id: 'activeChannelIds',
			label: 'Active Channels for Cycle (leave empty to cycle all)',
			width: 12,
			default: [],
			choices: channels.map((ch) => ({ id: ch.id, label: ch.name })),
			minSelection: 0,
		})
	}

	return fields
}
