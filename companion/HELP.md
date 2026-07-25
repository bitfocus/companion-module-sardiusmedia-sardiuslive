# Sardius Live

Control Sardius Live events directly from Bitfocus Companion.

## Configuration

- **API Key** — Your Sardius Stream Deck API key.
- **Account ID** — Your Sardius account identifier.
- **Active Channels for Cycle** — Appears after channels are loaded. Optionally limit which channels the cycle buttons step through. Leave empty to cycle all channels in your account.

Channels are loaded automatically when you save your API Key and Account ID. Reopen settings after saving to see and select channels.

If the connection shows an error or warning status, check that your API Key and Account ID are correct.

## Actions

### Cycle Channel (Next / Previous)

Steps forward or backward through your channel list. All feedback and event actions that use the selected channel update automatically.

### Go Live

Creates a new live event on the selected (or configured) channel. Does nothing if a live event is already active.

**Options:**
- **Channel** — Choose a channel from the list, or select "Use selected channel" to follow the active cycle selection.
- **Event Name** — Title for the new event.

### Add Time / Subtract Time

Extends or shortens the end time of the currently active event.

**Options:**
- **Channel** — Choose a channel from the list, or select "Use selected channel" to follow the active cycle selection.
- **Minutes** — Number of minutes to add or subtract (default: 5).

### End Event

Ends the active live event immediately by setting its end time to now.

**Options:**
- **Channel** — Choose a channel from the list, or select "Use selected channel" to follow the active cycle selection.

### Open Control Panel

Opens `https://cp.sardius.media` in your default browser.

## Feedbacks

### Live Event Active

Button lights up when a channel has an active live event. Shows the channel name, a live indicator, and a countdown to the event end time.

**Options:**
- **Channel** — Choose a specific channel, or select "Use selected channel" to follow the active cycle selection.

### Selected Channel Display

Shows the name of the currently selected channel in the cycle list.

## Troubleshooting

1. **Connection shows AuthenticationFailure** — Your API Key or Account ID is incorrect. Update them and save.
2. **Connection shows No channels found** — API Key is valid but no channels were returned. Verify your Account ID is correct.
3. **Channel dropdown is empty** — Channels haven't loaded yet. Save your credentials first, then reopen the settings panel. The dropdown in actions and feedbacks will populate automatically.
4. **Add/Subtract Time and End Event** only work when a live event is active on that channel.
5. **Go Live** only works when no live event is currently active on that channel.

## Support

For issues: https://github.com/bitfocus/companion-module-sardiusmedia-sardiuslive/issues
