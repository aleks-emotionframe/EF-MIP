#!/bin/sh
# ─── EmotionFrame PostgreSQL Backup Script ───────────────────────
# Runs daily via cron inside the backup container
# Retention: 7 days

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ef_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

# Create backup directory
mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting backup..."

# Dump and compress
pg_dump -h "${PGHOST}" -U "${PGUSER}" -d "${PGDATABASE}" | gzip > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "[$(date)] Backup successful: ${BACKUP_FILE} (${SIZE})"
else
    echo "[$(date)] ERROR: Backup failed!"
    rm -f "${BACKUP_FILE}"
    exit 1
fi

# Remove old backups
echo "[$(date)] Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "ef_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# List remaining backups
echo "[$(date)] Current backups:"
ls -lh "${BACKUP_DIR}"/ef_backup_*.sql.gz 2>/dev/null || echo "  (none)"

echo "[$(date)] Backup complete."
