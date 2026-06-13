"""Config flow for the Stash integration.

Single-instance, zero-input setup. On submit we generate a per-install
webhook id; that is the only instance-specific value the integration needs.
"""
from __future__ import annotations

from homeassistant.components import webhook
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import APP_NAME, DOMAIN


class StashConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Stash."""

    VERSION = 1

    async def async_step_user(self, user_input=None) -> ConfigFlowResult:
        """Handle the initial step."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(
                title=APP_NAME,
                data={"webhook_id": webhook.async_generate_id()},
            )

        return self.async_show_form(step_id="user")
