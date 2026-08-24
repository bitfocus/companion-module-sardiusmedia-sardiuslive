# Sardius Live

Control Sardius Live events directly from Bitfocus Companion.

## Configuration

- **API Key** — Your Sardius Stream Deck API key.
- **Account ID** — Your Sardius account identifier.
- **Active Channels for Cycle** — Appears after channels are loaded. Optionally limit which channels the cycle buttons step through. Leave empty to cycle all channels in your account.

Channels are loaded automatically when you save your API Key and Account ID. Reopen settings after saving to see and select channels.

If the connection shows an error or warning status, check that your API Key and Account ID are correct.

## Presets

The quickest way to get started. Open the **Presets** tab in the button editor and drag any preset onto your layout — each one arrives with the right action, style, and feedback already configured.

### Event Control
- **Go Live** — Green button. Creates a live event on the selected channel. Turns brighter green when the event is active (via Live Event Active feedback).
- **End Event** — Red button. Requires a **2-second hold** to fire, preventing accidental activation.
- **+5 Min / -5 Min** — Yellow/orange buttons. Add or subtract 5 minutes from the active event's end time.
- **+30 Min / -30 Min** — Yellow/orange buttons. Add or subtract 30 minutes from the active event's end time.
- **+60 Min / -60 Min** — Yellow/orange buttons. Add or subtract 60 minutes from the active event's end time.

### Channel Control
- **Next Channel** — Steps forward through the channel cycle.
- **Previous Channel** — Steps backward through the channel cycle.
- **Channel Display** — Shows the active channel name. Highlights blue via Selected Channel Display feedback.

### Status
- **Error Display** — Shows `✓ OK` normally. Turns red and displays the error message when any action fails. Clears automatically on the next successful action.

---

## Actions

### Cycle Channel (Next / Previous)

Steps forward or backward through your channel list. All feedbacks and event actions that use the selected channel update automatically.

### Go Live

Creates a new live event on the selected channel. Does nothing if a live event is already active.

**Options:**
- **Use selected channel** — When checked, uses the currently cycled channel. Uncheck to pick a specific channel.
- **Event Name** — Title for the new event.

### Add Time / Subtract Time

Extends or shortens the end time of the currently active event.

**Options:**
- **Use selected channel** — When checked, uses the currently cycled channel. Uncheck to pick a specific channel.
- **Minutes** — Number of minutes to add or subtract (default: 5).

### End Event

Ends the active live event immediately by setting its end time to now. When using the preset, this is configured as a 2-second hold to prevent accidental activation.

**Options:**
- **Use selected channel** — When checked, uses the currently cycled channel. Uncheck to pick a specific channel.

### Open Control Panel

Opens `https://cp.sardius.media` in your default browser.

---

## Feedbacks

### Live Event Active

Highlights the button when the selected channel has an active live event.

**Default button style** pre-fills with `● LIVE` and a short countdown (`$(connection:event_countdown_short)`) so you see remaining time directly on the button.

**Options:**
- **Use selected channel** — When checked, watches the currently cycled channel. Uncheck to watch a specific channel.

### Selected Channel Display

Highlights the button when a channel is currently selected in the cycle. The default button style pre-fills with `$(connection:selected_channel_name)` so the button always shows the active channel name.

No additional options — this feedback simply reflects whether a channel is active in the cycle.

### Action Error

Active when the last action failed. The default button style displays the error message from `$(connection:last_error)`. Add this feedback to the Error Display preset or any other button to surface failures visually.

No additional options.

---

## Variables

| Variable | Description |
|---|---|
| `$(connection:selected_channel_id)` | ID of the currently selected channel |
| `$(connection:selected_channel_name)` | Name of the currently selected channel |
| `$(connection:event_title)` | Title of the active live event |
| `$(connection:event_end_time)` | Scheduled end time of the active event (e.g. `3:00 PM`) |
| `$(connection:event_countdown)` | Full countdown to event end (`HH:MM:SS`) |
| `$(connection:event_countdown_short)` | Compact countdown — omits hours when under 1 hour (`MM:SS`) |
| `$(connection:last_error)` | Error message from the last failed action. Empty when no error. |

Replace `connection` with your actual connection name as configured in Companion (e.g. `$(Sardius-Admin:selected_channel_name)`).

---

## Troubleshooting

1. **Connection shows AuthenticationFailure** — Your API Key or Account ID is incorrect. Update them and save.
2. **Connection shows No channels found** — API Key is valid but no channels were returned. Verify your Account ID.
3. **Channel dropdown is empty** — Channels haven't loaded yet. Save your credentials first, then reopen the settings panel. Dropdowns populate automatically after channels load.
4. **Add/Subtract Time and End Event** only work when a live event is active on that channel.
5. **Go Live** only works when no live event is currently active on that channel.
6. **Error Display button turns red** — Check the message shown on the button. Press any action button again to clear it once resolved.
7. **Presets not visible** — Disconnect and reconnect the module in Companion settings, then check the Presets tab.

## Support

For issues: https://github.com/bitfocus/companion-module-sardiusmedia-sardiuslive/issues
