# Sardius Live

Bitfocus Companion module for [Sardius Live](https://sardius.media) — control live events directly from your Stream Deck.

## Configuration

- **API Key** — Your Sardius Stream Deck API key.
- **Account ID** — Your Sardius account identifier.
- **Active Channels for Cycle** — Appears after channels load. Optionally limit which channels the cycle buttons step through. Leave empty to cycle all channels in your account.

Channels are loaded automatically when you save your API Key and Account ID. Reopen settings after saving to see and select channels. If the connection shows an error status, check that your credentials are correct.

## Actions

### Cycle Channel (Next / Previous)

Steps forward or backward through your channel list. All feedback and event actions that use the selected channel update automatically.

### Go Live

Creates a new live event on the selected (or configured) channel. Does nothing if a live event is already active.

- **Channel** — Choose from the loaded channel list, or select "Use selected channel" to follow the active cycle selection.
- **Event Name** — Title for the new event.

### Add Time / Subtract Time

Extends or shortens the end time of the currently active event.

- **Channel** — Choose from the loaded channel list, or select "Use selected channel" to follow the active cycle selection.
- **Minutes** — Number of minutes to add or subtract (default: 5).

### End Event

Ends the active live event immediately by setting its end time to now. Recommended: configure as press-and-hold (2–5 seconds) to prevent accidental activation.

- **Channel** — Choose from the loaded channel list, or select "Use selected channel" to follow the active cycle selection.

### Open Control Panel

Opens `https://cp.sardius.media` in your default browser.

## Feedbacks

### Live Event Active

Button lights up when a channel has an active live event. Shows the channel name, a live indicator, and a countdown to the event end time.

- **Channel** — Choose a specific channel, or select "Use selected channel" to follow the active cycle selection.

### Selected Channel Display

Shows the name of the currently selected channel in the cycle list.

## Troubleshooting

1. **AuthenticationFailure status** — API Key or Account ID is incorrect. Update and save.
2. **No channels found (warning status)** — Credentials are valid but no channels returned. Verify your Account ID.
3. **Channel dropdown is empty in actions/feedbacks** — Save credentials first, then reopen settings. Dropdowns populate automatically after channels load.
4. **Add/Subtract Time and End Event** only work when a live event is active on that channel.
5. **Go Live** only works when no live event is currently active on that channel.

## Support

For issues: https://github.com/bitfocus/companion-module-sardiusmedia-sardiuslive/issues

## Development

```bash
npm install
npm run build       # compile TypeScript
npm run dev         # watch mode
npm run package     # build distributable .tgz
```

## License

MIT
