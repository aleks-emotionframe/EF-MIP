# EmotionFrame Platform (EF-MIP)

Emotion Intelligence Platform for Social Media Analytics. AI-powered insights, forecasting, and scenario simulation across all major social platforms.

## Architecture

```
                        ┌──────────────┐
                        │    Nginx     │ :80/:443
                        │ Reverse Proxy│ SSL, Gzip, Security Headers
                        └──────┬───────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────┴──────┐ ┌────┴─────┐ ┌──────┴──────┐
         │  Next.js    │ │  FastAPI  │ │   Static    │
         │  App :3000  │ │  AI :8000 │ │   Assets    │
         │             │ │           │ │             │
         │ Dashboard   │ │ Prophet   │ └─────────────┘
         │ Auth        │ │ IsoForest │
         │ API Routes  │ │ Claude AI │
         │ Inngest     │ │ Scenarios │
         └──────┬──────┘ └────┬─────┘
                │              │
         ┌──────┴──────────────┴──────┐
         │        PostgreSQL          │
         │     Metrics, Users,        │
         │  Integrations, Reports     │
         └────────────────────────────┘
                    │
              ┌─────┴─────┐
              │   Redis   │
              │  Caching  │
              └───────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Recharts |
| Auth | NextAuth.js v5, Credentials Provider, JWT, Role-based |
| Backend | Next.js API Routes, Inngest (background jobs) |
| AI Engine | Python FastAPI, Prophet, Scikit-learn, Claude API |
| Database | PostgreSQL 16, Prisma 7 ORM |
| Cache | Redis 7 |
| Proxy | Nginx, Let's Encrypt SSL |
| Deploy | Docker Compose / Vercel |

## Quick Start (3 Steps)

### 1. Clone & Configure

```bash
git clone https://github.com/aleks-emotionframe/EF-MIP.git
cd EF-MIP
cp .env.production.example .env.production
# Edit .env.production with your values
```

### 2. Start

```bash
docker compose up -d
```

This starts all services: Next.js, FastAPI, PostgreSQL, Redis, Nginx.

### 3. Initialize Database

```bash
# Run migrations
docker compose exec app npx prisma migrate deploy

# Create Super Admin
docker compose exec app npx tsx scripts/create-admin.ts
```

## Development (without Docker)

```bash
npm install
npx prisma generate
npm run dev
```

Visit http://localhost:3000

**Demo Logins:**
- Admin: `admin@emotionframe.com` / `demo1234`
- User: `user@emotionframe.com` / `demo1234`

## SSL Setup

```bash
chmod +x scripts/init-ssl.sh
./scripts/init-ssl.sh your-domain.com admin@your-domain.com
```

Then update `nginx/conf.d/default.conf` with your domain and restart nginx.

## Platform Integrations

Each platform requires API credentials in `.env.production`:

| Platform | Credentials Needed | Developer Portal |
|----------|-------------------|-----------------|
| Google Analytics | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | console.cloud.google.com |
| Search Console | Same as Google Analytics | console.cloud.google.com |
| YouTube | Same as Google Analytics | console.cloud.google.com |
| Instagram | `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` | developers.facebook.com |
| Facebook | Same as Instagram | developers.facebook.com |
| LinkedIn | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | linkedin.com/developers |
| TikTok | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` | developers.tiktok.com |

## Backup & Restore

Backups run automatically at 03:00 UTC daily (7-day retention).

```bash
# Manual backup
docker compose exec backup /backup.sh

# Restore from backup
gunzip < backups/ef_backup_YYYYMMDD.sql.gz | \
  docker compose exec -T postgres psql -U efuser emotionframe
```

## Project Structure

```
EF-MIP/
├── app/                      # Next.js App Router
│   ├── (auth)/login/         # Login page
│   ├── (dashboard)/          # Dashboard layout
│   │   ├── dashboard/        # Home, AI Insights, Scenarios, Reports
│   │   └── admin/clients/    # Admin CRUD
│   └── api/                  # API routes (auth, integrations, ai, inngest)
├── components/               # React components
│   ├── dashboard/            # Sidebar, Header, Shell, Mobile Nav
│   ├── auth/                 # Login form, Logo
│   └── ui/                   # Skeleton, shared UI
├── lib/                      # Shared libraries
│   ├── api/                  # Platform API clients (7 platforms)
│   ├── inngest/              # Background job functions
│   ├── auth.ts               # NextAuth configuration
│   └── prisma.ts             # Database client
├── prisma/                   # Database schema
├── services/ai-engine/       # Python FastAPI microservice
│   └── app/
│       ├── routers/          # API endpoints
│       └── services/         # Forecasting, anomaly, Claude AI
├── nginx/                    # Reverse proxy config
├── scripts/                  # Backup, SSL, setup scripts
├── docker-compose.yml        # Full stack orchestration
└── Dockerfile                # Next.js multi-stage build
```

## Pages

| Route | Description |
|-------|------------|
| `/login` | Animated gradient login page |
| `/dashboard` | Home with stats, charts, activity feed |
| `/dashboard/scenarios` | What-if scenario simulator |
| `/dashboard/ai-insights` | AI-generated insights feed |
| `/dashboard/reports` | Drag-and-drop report builder |
| `/dashboard/settings/integrations` | Platform OAuth connections |
| `/admin/clients` | Client CRUD management |

## License

Proprietary - EmotionFrame GmbH
