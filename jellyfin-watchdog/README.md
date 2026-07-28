# Jellyfin Watchdog

Monitors Jellyfin locally and auto-restarts it (plus cloudflared) when it goes down.

## How it works

1. HA polls `http://localhost:8096/health` every 30 seconds.
2. If Jellyfin is unreachable for **2 minutes**, it runs `restart_jellyfin.sh`.
3. The script tries `systemctl` first, then `docker` — works with either setup.
4. A persistent notification appears in HA when the restart fires, and clears itself once Jellyfin recovers.

## Setup

### 1. Copy the script

```bash
mkdir -p /config/scripts /config/logs
cp restart_jellyfin.sh /config/scripts/restart_jellyfin.sh
chmod +x /config/scripts/restart_jellyfin.sh
```

The script runs as the HA user. If that user can't run `systemctl` or `docker`, grant it permission:

```bash
# Option A — sudoers (systemd)
echo "homeassistant ALL=(ALL) NOPASSWD: /bin/systemctl restart jellyfin, /bin/systemctl restart cloudflared" \
  | sudo tee /etc/sudoers.d/ha-jellyfin

# Option B — docker group
sudo usermod -aG docker homeassistant
```

Then prefix the commands in the script with `sudo` if using Option A.

### 2. Enable packages in configuration.yaml

```yaml
homeassistant:
  packages: !include_dir_named packages/
```

### 3. Drop in the package

```bash
mkdir -p /config/packages
cp jellyfin_watchdog.yaml /config/packages/jellyfin_watchdog.yaml
```

### 4. Restart Home Assistant

That's it. You'll see a new `binary_sensor.jellyfin_health` entity and two new automations.

## Adjusting the Jellyfin URL

If Jellyfin isn't running on the same machine as HA, edit the `command` in `jellyfin_watchdog.yaml`:

```yaml
command: >-
  curl -sf --max-time 5 http://192.168.1.50:8096/health
  && echo "ok" || echo "down"
```

## Logs

Restart activity is logged to `/config/logs/jellyfin_watchdog.log`.
