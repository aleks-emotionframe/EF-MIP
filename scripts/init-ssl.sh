#!/bin/bash
# ─── Initialize Let's Encrypt SSL Certificate ────────────────────
# Usage: ./scripts/init-ssl.sh yourdomain.com admin@yourdomain.com

DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: $0 <domain> <email>"
    echo "Example: $0 app.emotionframe.com admin@emotionframe.com"
    exit 1
fi

echo "Requesting SSL certificate for: ${DOMAIN}"

# Create self-signed cert first (so nginx can start)
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/self-signed.key \
    -out nginx/ssl/self-signed.crt \
    -subj "/CN=${DOMAIN}"

# Start nginx to serve ACME challenge
docker compose up -d nginx

# Request real certificate
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    -d "${DOMAIN}"

echo ""
echo "SSL certificate obtained!"
echo "Update nginx/conf.d/default.conf:"
echo "  - Uncomment the ssl_certificate lines"
echo "  - Replace YOUR_DOMAIN with: ${DOMAIN}"
echo "  - Remove the self-signed fallback lines"
echo "Then: docker compose restart nginx"
