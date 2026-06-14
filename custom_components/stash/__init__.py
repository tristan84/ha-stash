"""Stash — a generic Home Assistant inventory app.

Serves a self-contained inventory web app as a sidebar panel and persists
the data in Home Assistant's own storage. Each install generates its own
webhook id, so the app talks only to the user's own HA instance — no URL,
no token, nothing to configure.

This module is intentionally domain-neutral: everything app-specific lives in
const.py and panel/app.html, so a sibling integration (e.g. Stash) is the same
code with a different category set.
"""
from __future__ import annotations

import os

from aiohttp import web

from homeassistant.components import webhook
from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import APP_NAME, DOMAIN, PANEL_URL_PATH, SIDEBAR_ICON, STORAGE_VERSION

PANEL_HTML = os.path.join(os.path.dirname(__file__), "panel", "app.html")
PANEL_IMG_DIR = os.path.join(os.path.dirname(__file__), "panel", "img")
PANEL_VIEW_URL = f"/{DOMAIN}-app/index.html"
ASSETS_URL = f"/{DOMAIN}-assets"

EMPTY_DATA = {"items": [], "barcodes": {}, "saved_at": 0}


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration from a config entry."""
    webhook_id: str = entry.data["webhook_id"]
    store: Store = Store(hass, STORAGE_VERSION, f"{DOMAIN}_{entry.entry_id}")

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"webhook_id": webhook_id}

    async def handle_webhook(
        hass: HomeAssistant, wh_id: str, request: web.Request
    ) -> web.Response:
        """GET returns the current inventory; POST persists a push."""
        if request.method == "POST":
            try:
                data = await request.json()
            except ValueError:
                return web.json_response({"error": "invalid json"}, status=400)
            if not isinstance(data, dict):
                return web.json_response({"error": "expected object"}, status=400)
            items = data.get("items")
            structure = data.get("structure")
            # Ignore truly empty pushes so a fresh device can never wipe a
            # list. Item edits and category-structure edits each persist; a
            # field that's absent from the push keeps its stored value.
            if items or structure:
                existing = await store.async_load() or {}
                merged = {
                    "items": items if items else existing.get("items", []),
                    "barcodes": (
                        data.get("barcodes", {})
                        if items
                        else existing.get("barcodes", {})
                    ),
                    "structure": (
                        structure if structure else existing.get("structure")
                    ),
                    "saved_at": data.get("saved_at", 0),
                }
                await store.async_save(merged)
            return web.json_response({"ok": True})

        data = await store.async_load() or EMPTY_DATA
        return web.json_response(data)

    webhook.async_register(
        hass,
        DOMAIN,
        APP_NAME,
        webhook_id,
        handle_webhook,
        local_only=False,
        allowed_methods=["GET", "POST"],
    )

    def _read_html() -> str:
        with open(PANEL_HTML, "r", encoding="utf-8") as fh:
            return fh.read().replace("__APP_WEBHOOK_ID__", webhook_id)

    html = await hass.async_add_executor_job(_read_html)
    hass.http.register_view(PanelView(html))

    # Serve the bundled imagery (header + washed category backgrounds).
    # Register once per HA run; static paths cannot be re-registered.
    if not hass.data[DOMAIN].get("_assets_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(ASSETS_URL, PANEL_IMG_DIR, False)]
        )
        hass.data[DOMAIN]["_assets_registered"] = True

    async_register_built_in_panel(
        hass,
        "iframe",
        sidebar_title=APP_NAME,
        sidebar_icon=SIDEBAR_ICON,
        frontend_url_path=PANEL_URL_PATH,
        config={"url": PANEL_VIEW_URL},
        require_admin=False,
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    data = hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    if data:
        webhook.async_unregister(hass, data["webhook_id"])
    async_remove_panel(hass, PANEL_URL_PATH)
    return True


class PanelView(HomeAssistantView):
    """Serve the web app page.

    The page holds no secrets (the only instance value is the webhook id,
    already injected) and must be loadable inside an iframe without an auth
    header, exactly like files under /local/ — so requires_auth is False.
    """

    url = f"/{DOMAIN}-app/index.html"
    name = f"{DOMAIN}:app"
    requires_auth = False

    def __init__(self, html: str) -> None:
        """Store the rendered HTML."""
        self._html = html

    async def get(self, request: web.Request) -> web.Response:
        """Return the app page."""
        return web.Response(text=self._html, content_type="text/html")
