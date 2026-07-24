# Sardius Media Module

Control Sardius Media live events directly from Bitfocus Companion.

## Configuration

- **API Key** — Your Sardius Stream Deck API key. Used for all event mutations and channel name lookups.
- **Account ID** — Your Sardius account identifier.
- **Channels** — Comma-separated list of channels in `Name:ID` format (e.g. `Main Stage:site_abc123, Social Feed:site_def456`).
- **Active Channels for Cycle** — Optionally limit which channels the cycle buttons step through. Leave empty to cycle all channels in the list.

## Actions

### Cycle Channel (Next / Previous)

Steps forward or backward through your channel list. All feedback and event actions that use the selected channel will update automatically.

### Go Live

Creates a new live event on the selected (or configured) channel. Does nothing if a live event is already active.

**Options:**
- **Channel ID** — Leave blank to use the currently selected channel.
- **Event Name** — Title for the new event.

### Add Time / Subtract Time

Extends or shortens the end time of the currently active event.

**Options:**
- **Channel ID** — Leave blank to use the currently selected channel.
- **Minutes** — Number of minutes to add or subtract (default: 5).

### End Event

Ends the active live event immediately by setting its end time to now.

**Options:**
- **Channel ID** — Leave blank to use the currently selected channel.

### Open Control Panel

Opens `https://cp.sardius.media` in your default browser.

## Feedbacks

### Live Event Active

Button lights up when a channel has an active live event. Shows the event title, a live indicator, and a countdown to the event end time.

### Selected Channel Display

Shows the name and position of the currently selected channel in the cycle list (e.g. `Main Stage 2/5`).

## Troubleshooting

1. Verify your API Key and Account ID are correct.
2. Make sure your Channel IDs are valid — names will show as raw IDs if the lookup fails.
3. Add/Subtract Time and End Event only work when a live event is active on that channel.
4. Go Live only works when no live event is currently active.

## Support

For issues: https://github.com/bitfocus/companion-module-sardiusmedia-sardiuslive/issues
