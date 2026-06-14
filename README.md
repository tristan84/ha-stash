# Stash for Home Assistant

A fast, phone-friendly **tool & supplies inventory** for your shed, garage or
workshop — right inside Home Assistant. Track power tools, hand tools, fixings,
paint & chemicals, electrical, plumbing, garden, automotive, PPE and
consumables by category, with quantities, low-stock alerts and barcode
scanning. Your data is stored in your own Home Assistant and shared across
every device that opens it.

> No cloud account, no external server, no API token. The app is served by this
> integration and talks only to your own HA instance.

> Tracking the kitchen too? See the sister integration **[My Pantry](https://github.com/tristan84/ha-pantry)** — same app, pantry/freezer categories.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tristan84&repository=ha-stash&category=integration)

## Features

- 🧰 Shed-focused categories with sub-categories (Power Tools / Hand Tools / Fixings / Paint & Chemicals / Electrical / Plumbing / Garden / Automotive / Safety / Consumables)
- ✏️ **Add, edit and delete your own categories and sub-categories** (⚙︎ in the header) — icon, colour and all. Your layout syncs across devices.
- 🏷️ **Plain-word item icons** that render correctly on every phone (no missing-glyph boxes)
- 🖼️ **Per-item photo + receipt** — snap a picture of the tool and keep its receipt (image or PDF) attached
- 📤 **Check-out / check-in** — lend a tool to someone with a note and a handover photo, then check it back in; the list shows who has what
- ➕➖ One-tap quantity adjust, low-stock thresholds, out-of-stock alerts
- 📷 Barcode scanning
- 🔄 Real-time sync — open it on any phone/tablet and see the same list
- 🗄️ Data stored privately in Home Assistant (`.storage`), nothing leaves your network
- 💾 **Backup & restore** — automatic on-device snapshots with one-tap restore, plus downloadable full backup files and CSV import/export
- 📲 **Install to your phone** — the 📲 button saves the app to your home screen as a standalone, full-screen web app

## Installation

### 1 · Add the repository to HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tristan84&repository=ha-stash&category=integration)

Click the button above (it opens HACS with this repo pre-filled) → **Download**.
Or do it manually: HACS → **⋮** → **Custom repositories** → add
`https://github.com/tristan84/ha-stash` as an **Integration**, then download it.

Then **restart Home Assistant**.

### 2 · Add the integration

[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=stash)

Click the button above, or go to **Settings → Devices & Services → Add
Integration → Stash**, and press **Submit** — there's nothing to configure.
A **Stash** item then appears in your sidebar. Done.

### Manual installation (no HACS)

Copy `custom_components/stash` into your HA `config/custom_components/` folder,
restart, then add the integration as in step 2 above.

## How it works

- Setup generates a private **webhook id** for your install.
- The app is served at `/stash-app/index.html` and shown as a sidebar panel.
- It reads/writes inventory **and your category layout** via `GET`/`POST` to
  `/api/webhook/<your-id>`, which the integration persists in HA storage. Empty
  pushes are ignored, so a fresh device can never wipe an existing list.

## Notes

- **Barcode scanner & camera:** browsers only allow the camera over HTTPS (or
  `localhost`). If you open HA over plain `http://`, scanning won't start —
  use HTTPS / Nabu Casa, or add items manually. Because the panel runs in an
  iframe, you can also open `/stash-app/index.html` directly in a tab if your
  browser blocks the camera inside the panel.
- **Multi-device:** the last device to save wins (simple last-write-wins).

## License

MIT
