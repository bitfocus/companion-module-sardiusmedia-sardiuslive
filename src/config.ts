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
			id: 'step1_header',
			width: 12,
			label: 'Step 1 — Authenticate',
			value: 'Enter your Sardius Stream Deck API Key and Account ID. You can find these in the Sardius Control Panel under Settings → API Keys.',
		},
		{
			type: 'textinput',
			id: 'apiKey',
			label: 'API Key',
			width: 12,
			minLength: 1,
			default: '',
			tooltip: 'Generate a Stream Deck API Key in the Sardius Control Panel under Settings → API Keys.',
		},
		{
			type: 'textinput',
			id: 'accountId',
			label: 'Account ID',
			width: 6,
			minLength: 1,
			default: '',
			tooltip: 'Your Sardius account identifier. Found in the Control Panel under your account settings.',
		},
	]

	if (channels.length === 0) {
		fields.push({
			type: 'static-text',
			id: 'step2_header',
			width: 12,
			label: 'Step 2 — Load Channels',
			value: 'Click Save above. Channels will load automatically from your Sardius account. Reopen this panel after saving to select channels.',
		})
	} else {
		fields.push(
			{
				type: 'static-text',
				id: 'step2_header',
				width: 12,
				label: `Step 2 — Channels (${channels.length} loaded)`,
				value: 'Channels loaded successfully. Select which channels to include in the cycle, or leave empty to cycle through all of them.',
			},
			{
				type: 'multidropdown',
				id: 'activeChannelIds',
				label: 'Active Channels for Cycle',
				width: 12,
				default: [],
				choices: channels.map((ch) => ({ id: ch.id, label: ch.name })),
				minSelection: 0,
				tooltip: 'Leave empty to cycle through all channels. Select specific channels to limit the cycle.',
			},
		)
	}

	return fields
}
