#!/bin/sh
# ─── Setup cron for daily backups at 03:00 UTC ───────────────────
echo "0 3 * * * /backup.sh >> /var/log/backup.log 2>&1" > /etc/crontabs/root
crond -f -l 2
