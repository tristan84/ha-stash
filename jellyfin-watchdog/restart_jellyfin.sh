#!/usr/bin/env bash
# Restart Jellyfin and cloudflared.
# Called by HA shell_command.restart_jellyfin.
# Place at /config/scripts/restart_jellyfin.sh and chmod +x it.

set -euo pipefail

TS=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TS] Watchdog triggered — restarting services"

restart_service() {
    local name="$1"
    if systemctl is-active --quiet "$name" 2>/dev/null || systemctl list-unit-files "$name.service" &>/dev/null; then
        echo "[$TS] systemctl restart $name"
        systemctl restart "$name"
        return 0
    fi
    if docker inspect "$name" &>/dev/null; then
        echo "[$TS] docker restart $name"
        docker restart "$name"
        return 0
    fi
    echo "[$TS] WARNING: could not find service '$name' via systemctl or docker"
    return 1
}

restart_service jellyfin   || true
restart_service cloudflared || true

echo "[$TS] Done — waiting 15 s for services to settle"
sleep 15

# Quick health check
if curl -sf --max-time 5 http://localhost:8096/health > /dev/null; then
    echo "[$TS] Jellyfin is back up"
else
    echo "[$TS] WARNING: Jellyfin still not responding after restart"
fi
