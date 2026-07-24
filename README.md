# companion-module-sardiusmedia-sardiuslive

Bitfocus Companion module for [Sardius Media](https://sardius.media) — control live events directly from your Stream Deck.

## Configuration

- **API Key** — Your Sardius Stream Deck API key.
- **Account ID** — Your Sardius account identifier.
- **Channels** — Comma-separated list of channels in `Name:ID` format (e.g. `Main Stage:site_abc123, Social Feed:site_def456`).
- **Active Channels for Cycle** — Optionally limit which channels the cycle buttons step through. Leave empty to cycle all channels in the list.

## Actions

### Cycle Channel (Next / Previous)

Steps forward or backward through your channel list. All feedback and event actions that use the selected channel update automatically.

### Go Live

Creates a new live event on the selected (or configured) channel. Does nothing if a live event is already active.

- **Channel ID** — Leave blank to use the currently selected channel.
- **Event Name** — Title for the new event.

### Add Time / Subtract Time

Extends or shortens the end time of the currently active event.

- **Channel ID** — Leave blank to use the currently selected channel.
- **Minutes** — Number of minutes to add or subtract (default: 5).

### End Event

Ends the active live event immediately by setting its end time to now. Recommended: configure as press-and-hold (2–5 seconds) to prevent accidental activation.

- **Channel ID** — Leave blank to use the currently selected channel.

### Open Control Panel

Opens `https://cp.sardius.media` in your default browser.

## Feedbacks

### Live Event Active

Button lights up when a channel has an active live event. Shows the event title, a live indicator, and a countdown to the event end time.

### Selected Channel Display

Shows the name of the currently selected channel in the cycle list.

## Troubleshooting

1. Verify your API Key and Account ID are correct.
2. Channels must be entered in `Name:ID` format — check for typos in the ID portion.
3. Add/Subtract Time and End Event only work when a live event is active on that channel.
4. Go Live only works when no live event is currently active on that channel.

## Support

For issues: https://github.com/bitfocus/companion-module-sardiusmedia-sardiuslive/issues


## License

MIT
