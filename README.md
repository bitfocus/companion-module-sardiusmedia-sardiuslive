# Sardius Live

Bitfocus Companion module for [Sardius Live](https://sardius.media) — control live events directly from your Stream Deck.

## Configuration

- **API Key** — Your Sardius Stream Deck API key.
- **Account ID** — Your Sardius account identifier.
- **Active Channels for Cycle** — Appears after channels load. Optionally limit which channels the cycle buttons step through. Leave empty to cycle all channels in your account.

Channels are loaded automatically when you save your API Key and Account ID. Reopen settings after saving to see and select channels. If the connection shows an error status, check that your credentials are correct.

## Presets

The module ships 12 ready-to-use presets organized into three groups. Open the **Presets** tab in the Companion button editor and drag any preset onto your layout.

### Event Control
| Preset | Style | Behavior |
|---|---|---|
| Go Live | Green | Creates a live event. Turns brighter green when the event is active. |
| End Event | Red | **Requires a 2-second hold** to fire — prevents accidental activation. |
| +5 Min | Yellow | Adds 5 minutes to the active event's end time. |
| -5 Min | Orange | Subtracts 5 minutes from the active event's end time. |
| +30 Min | Yellow | Adds 30 minutes to the active event's end time. |
| -30 Min | Orange | Subtracts 30 minutes from the active event's end time. |
| +60 Min | Yellow | Adds 60 minutes to the active event's end time. |
| -60 Min | Orange | Subtracts 60 minutes from the active event's end time. |

### Channel Control
| Preset | Style | Behavior |
|---|---|---|
| Next Channel | Blue | Steps forward through the channel cycle. |
| Previous Channel | Blue | Steps backward through the channel cycle. |
| Channel Display | Black / Blue | Shows the active channel name. Highlights blue via Selected Channel Display feedback. |

### Status
| Preset | Style | Behavior |
|---|---|---|
| Error Display | Dark / Red | Shows `✓ OK` normally. Turns red and displays the error message when any action fails. |

## Actions

### Cycle Channel (Next / Previous)

Steps forward or backward through your channel list. All feedbacks and event actions that use the selected channel update automatically.

### Go Live

Creates a new live event on the selected (or configured) channel. Does nothing if a live event is already active.

- **Use selected channel** — When checked (default), uses the currently cycled channel. Uncheck to pick a specific channel.
- **Event Name** — Title for the new event.

### Add Time / Subtract Time

Extends or shortens the end time of the currently active event.

- **Use selected channel** — When checked (default), uses the currently cycled channel. Uncheck to pick a specific channel.
- **Minutes** — Number of minutes to add or subtract (default: 5).

### End Event

Ends the active live event immediately by setting its end time to now. The End Event preset configures this as a 2-second hold to prevent accidental activation.

- **Use selected channel** — When checked (default), uses the currently cycled channel. Uncheck to pick a specific channel.

### Open Control Panel

Opens `https://cp.sardius.media` in your default browser.

## Feedbacks

### Live Event Active

Highlights the button when the selected channel has an active live event.

Default button style pre-fills with `● LIVE` and a short countdown (`$(connection:event_countdown_short)`).

- **Use selected channel** — When checked (default), watches the currently cycled channel. Uncheck to watch a specific channel.

### Selected Channel Display

Highlights the button when a channel is currently active in the cycle. Default button style pre-fills with `$(connection:selected_channel_name)`.

No additional options.

### Action Error

Active when the last action failed. Displays the error message on the button. Use this with the Error Display preset or add it to any button that should reflect error state.

No additional options.

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

Replace `connection` with your actual connection name as configured in Companion.

## Troubleshooting

1. **AuthenticationFailure status** — API Key or Account ID is incorrect. Update and save.
2. **No channels found (warning status)** — Credentials are valid but no channels returned. Verify your Account ID.
3. **Channel dropdown is empty in actions/feedbacks** — Save credentials first, then reopen settings. Dropdowns populate automatically after channels load.
4. **Add/Subtract Time and End Event** only work when a live event is active on that channel.
5. **Go Live** only works when no live event is currently active on that channel.
6. **Error Display button turns red** — Check the error message on the button. Press any action button again to clear it once resolved.
7. **Presets not visible** — Disconnect and reconnect the module in Companion, then check the Presets tab.

## Support

For issues: https://github.com/bitfocus/companion-module-sardiusmedia-sardiuslive/issues

## Development

```bash
yarn install
yarn build       # compile TypeScript
yarn dev         # watch mode
```

## License

MIT
