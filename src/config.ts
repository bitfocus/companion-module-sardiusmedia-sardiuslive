import { JsonObject, SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig extends JsonObject {
	apiKey: string
	accountId: string
	channelList: string
	activeChannelIds: string[]
}

export function getConfigFields(channels: { id: string; name: string }[] = []): SomeCompanionConfigField[] {
	const channelChoices = channels.map((ch) => ({ id: ch.id, label: ch.name }))
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'Enter your API Key and Account ID, then add your channels below. Use the cycle actions to switch between channels — all feedback and event actions follow the selected channel.',
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
		{
			type: 'textinput',
			id: 'channelList',
			label: 'Channels (Name:ID, comma separated)',
			width: 12,
			default: '',
			tooltip: 'e.g. Main Channel:site_abc123, Social Media Channel:site_def456',
		},
		{
			type: 'multidropdown',
			id: 'activeChannelIds',
			label: 'Active Channels for Cycle (leave empty to cycle all)',
			width: 12,
			default: [],
			choices: channelChoices,
			minSelection: 0,
		},
	]
}
