# EmotionFrame Marketing Intelligence Platform – Claude Code Prompt

## Anweisung

Kopiere dieses Dokument und verwende es als `CLAUDE.md` ins Root deines Repos – Claude Code liest es automatisch.

### Wichtig: Frontend Design in Claude Code

Dieses Projekt wird **komplett in Claude Code** gebaut – inklusive des gesamten Frontend-Designs.

**BEVOR du irgendeine UI-Komponente, Seite oder Layout baust, lies IMMER zuerst den Skill:**

```
/mnt/skills/public/frontend-design/SKILL.md
```

Dieser Skill enthält die verbindlichen Regeln für Design Thinking, Typografie, Farben, Motion, Spatial Composition und Visual Details. Claude Code MUSS diesen Skill bei JEDER UI-Aufgabe zuerst lesen und konsequent anwenden.

**Beim Prompten in Claude Code jede UI-Aufgabe mit diesem Prefix starten:**

> Lies zuerst /mnt/skills/public/frontend-design/SKILL.md und wende die Regeln an. Du bist ein erfahrener UI/UX Designer und Frontend-Entwickler. Baue produktionsreife, visuell beeindruckende Interfaces gemäss dem frontend-design Skill. Vermeide generische AI-Ästhetik (kein Inter, kein lila-auf-weiss, keine Standard-Layouts). Setze das Design System aus CLAUDE.md konsequent um. Jede Komponente braucht: durchdachte Spacing, Micro-Animationen (Framer Motion), Hover-States, Loading-States, und responsive Verhalten. Qualitätsreferenz: Linear, Vercel Dashboard, Raycast.

---

## CLAUDE.md (Projektdefinition)

```markdown
# EmotionFrame Marketing Intelligence Platform

## Projektübersicht

Baue eine Multi-Tenant Marketing Intelligence Platform als SaaS-Anwendung.

- **Betreiber:** EmotionFrame GmbH (Design-Agentur, Super-Admin)
- **Nutzer:** Kunden der Agentur (eigenes Dashboard pro Mandant)
- **Ziel:** Alle Social-Media-, SEO- und Analytics-Daten an einem Ort. KI-gestützte Empfehlungen und What-If-Szenarien.

---

## Tech Stack

| Layer | Technologie |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Charts | Recharts (Hauptcharts) + D3.js (komplexe Visualisierungen) |
| Auth | NextAuth.js v5 (Credentials + Magic Link) |
| Datenbank | PostgreSQL via Prisma ORM |
| Cache | Redis (Upstash) |
| KI/ML Service | Python FastAPI (separater Microservice) |
| KI Modelle | Prophet (Forecasting), scikit-learn (Clustering/Anomalien), Claude API (Textempfehlungen) |
| Job Queue | Inngest (Scheduled API-Polling, Datenverarbeitung) |
| Hosting (Dev) | GitHub Repo → Vercel (Frontend) + Railway (Python) + Supabase (DB) |
| Hosting (Prod) | Eigener Server (Docker Compose) |

---

## Projektstruktur

```
emotionframe-platform/
├── apps/
│   └── web/                          # Next.js App
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   └── forgot-password/
│       │   ├── (dashboard)/
│       │   │   ├── layout.tsx         # Dashboard Shell (Sidebar + Header)
│       │   │   ├── page.tsx           # Overview Dashboard
│       │   │   ├── social/
│       │   │   │   ├── page.tsx       # Social Media Übersicht
│       │   │   │   ├── instagram/
│       │   │   │   ├── facebook/
│       │   │   │   ├── tiktok/
│       │   │   │   ├── linkedin/
│       │   │   │   └── youtube/
│       │   │   ├── analytics/
│       │   │   │   ├── page.tsx       # Google Analytics Dashboard
│       │   │   │   └── search/        # Google Search Console
│       │   │   ├── ads/
│       │   │   │   ├── google/
│       │   │   │   └── meta/
│       │   │   ├── scenarios/
│       │   │   │   └── page.tsx       # What-If Szenario Builder
│       │   │   ├── ai-insights/
│       │   │   │   └── page.tsx       # KI Empfehlungen
│       │   │   ├── reports/
│       │   │   │   └── page.tsx       # Report Builder + PDF Export
│       │   │   └── settings/
│       │   │       ├── integrations/  # API Keys verwalten
│       │   │       └── profile/
│       │   └── admin/                 # EmotionFrame Super-Admin
│       │       ├── layout.tsx
│       │       ├── page.tsx           # Admin Dashboard
│       │       ├── clients/           # Kunden CRUD
│       │       ├── onboarding/        # Neuen Kunden anlegen
│       │       └── billing/           # Abrechnung (optional)
│       ├── components/
│       │   ├── ui/                    # shadcn/ui Komponenten
│       │   ├── charts/               # Wiederverwendbare Chart-Komponenten
│       │   ├── dashboard/            # Dashboard Widgets
│       │   ├── scenarios/            # Szenario-Simulator Komponenten
│       │   └── layout/               # Sidebar, Header, Navigation
│       ├── lib/
│       │   ├── prisma.ts
│       │   ├── auth.ts
│       │   ├── api/                   # API-Client für Social Platforms
│       │   │   ├── instagram.ts
│       │   │   ├── facebook.ts
│       │   │   ├── tiktok.ts
│       │   │   ├── linkedin.ts
│       │   │   ├── youtube.ts
│       │   │   ├── google-analytics.ts
│       │   │   └── search-console.ts
│       │   └── utils/
│       ├── prisma/
│       │   └── schema.prisma
│       └── inngest/
│           ├── client.ts
│           └── functions/
│               ├── sync-instagram.ts
│               ├── sync-facebook.ts
│               ├── sync-analytics.ts
│               └── daily-ai-analysis.ts
├── services/
│   └── ai-engine/                    # Python FastAPI
│       ├── main.py
│       ├── models/
│       │   ├── forecasting.py        # Prophet Zeitreihen
│       │   ├── anomaly.py            # Anomalie-Erkennung
│       │   ├── clustering.py         # Audience Segmentierung
│       │   └── scenarios.py          # What-If Simulationen
│       ├── routes/
│       │   ├── predict.py
│       │   ├── insights.py
│       │   └── scenarios.py
│       └── requirements.txt
├── docker-compose.yml                # Für Prod Self-Hosting
├── .env.example
├── CLAUDE.md                         # Diese Datei
└── README.md
```

---

## Datenbank Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// === MULTI-TENANT ===

model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  logo        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users        User[]
  integrations Integration[]
  metrics      Metric[]
  scenarios    Scenario[]
  reports      Report[]
  aiInsights   AiInsight[]
}

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  name           String?
  passwordHash   String?
  role           Role     @default(CLIENT_VIEWER)
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  createdAt      DateTime @default(now())

  @@index([organizationId])
}

enum Role {
  SUPER_ADMIN       // EmotionFrame Team
  CLIENT_ADMIN      // Kunde: kann Settings ändern
  CLIENT_VIEWER     // Kunde: nur lesen
}

// === INTEGRATIONEN ===

model Integration {
  id             String          @id @default(cuid())
  organizationId String
  organization   Organization    @relation(fields: [organizationId], references: [id])
  platform       Platform
  accessToken    String          // verschlüsselt speichern!
  refreshToken   String?
  accountId      String?         // Platform-spezifische Account ID
  accountName    String?
  isActive       Boolean         @default(true)
  lastSyncAt     DateTime?
  createdAt      DateTime        @default(now())

  @@unique([organizationId, platform])
  @@index([organizationId])
}

enum Platform {
  INSTAGRAM
  FACEBOOK
  TIKTOK
  LINKEDIN
  YOUTUBE
  GOOGLE_ANALYTICS
  SEARCH_CONSOLE
  GOOGLE_ADS
  META_ADS
}

// === METRIKEN ===

model Metric {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  platform       Platform
  metricType     String       // z.B. "followers", "engagement_rate", "impressions"
  value          Float
  date           DateTime
  metadata       Json?        // Zusätzliche Platform-spezifische Daten
  createdAt      DateTime     @default(now())

  @@index([organizationId, platform, date])
  @@index([organizationId, metricType, date])
}

// === SZENARIEN ===

model Scenario {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  name           String
  description    String?
  parameters     Json         // Input-Parameter des Szenarios
  results        Json?        // Berechnete Ergebnisse
  createdBy      String
  createdAt      DateTime     @default(now())

  @@index([organizationId])
}

// === KI INSIGHTS ===

model AiInsight {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  type           InsightType
  title          String
  content        String       // Markdown
  confidence     Float        // 0-1
  priority       Priority
  actionable     Boolean      @default(true)
  dismissed      Boolean      @default(false)
  metadata       Json?
  createdAt      DateTime     @default(now())

  @@index([organizationId, createdAt])
}

enum InsightType {
  ANOMALY           // Ungewöhnliche Änderung erkannt
  TREND             // Trend erkannt
  RECOMMENDATION    // Handlungsempfehlung
  FORECAST          // Prognose
  BENCHMARK         // Vergleich mit Branche
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

// === REPORTS ===

model Report {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  title          String
  dateRange      Json         // { from, to }
  sections       Json         // Konfiguration der Report-Sektionen
  generatedUrl   String?      // URL zum generierten PDF
  createdAt      DateTime     @default(now())

  @@index([organizationId])
}
```

---

## Design System

### Ästhetik: "Swiss Precision meets Dark Intelligence"
Inspiriert von: Linear App, Vercel Dashboard, Raycast, Arc Browser. Kein generisches Bootstrap/Material-Feeling.

- **Theme:** Dark Mode primär (helles Sekundärtheme optional)
- **Farbpalette:**
  - Background: `#0A0A0F` (tiefes Schwarz-Blau)
  - Surface: `#12121A`
  - Surface Elevated: `#1A1A2E`
  - Border: `#2A2A3E`
  - Primary Accent: `#6C5CE7` (EmotionFrame Violett)
  - Primary Hover: `#7C6DF7`
  - Success: `#00D68F`
  - Warning: `#FFB800`
  - Danger: `#FF4757`
  - Text Primary: `#F0F0F5`
  - Text Secondary: `#8888A0`
  - Text Muted: `#55556A`
- **Typografie:**
  - Headlines: `"Plus Jakarta Sans", sans-serif` (Google Fonts, weight 600/700)
  - Body: `"Geist Sans", sans-serif` (weight 400/500) — NICHT Inter
  - Monospace/Zahlen: `"Geist Mono", monospace`
- **Design-Regeln (STRIKT EINHALTEN):**
  - Glassmorphism auf Karten: `bg-white/5 backdrop-blur-xl border border-white/10`
  - Glow-Effekt auf Primary-Buttons: `shadow-[0_0_20px_rgba(108,92,231,0.3)]`
  - Alle Übergänge mit Framer Motion: `initial`, `animate`, `exit` Varianten
  - Staggered Animations beim Seitenladen: Karten erscheinen nacheinander (50ms delay)
  - Hover-States auf JEDER interaktiven Fläche (Karten, Buttons, Tabellenzeilen)
  - Skeleton Loading States für jeden Datenbereich (shimmer animation)
  - Charts mit Gradient Fills (z.B. Linie mit transparentem Gradient darunter)
  - Sidebar: 64px collapsed (nur Icons), 260px expanded, smooth transition
  - Border-Radius: `rounded-xl` (12px) für Karten, `rounded-lg` (8px) für Buttons/Inputs
  - Spacing: Grosszügig. Mindestens `p-6` auf Karten, `gap-6` zwischen Elementen
  - Zahlen in KPI-Karten: `text-3xl font-bold` mit Geist Mono
  - Trend-Indikatoren: Grüner Pfeil ↑ bei positiv, roter Pfeil ↓ bei negativ, mit `text-sm` Prozent daneben
  - Tabellen: Kein sichtbarer Border. Hover-Row mit `bg-white/5`. Zebra-Striping mit `bg-white/[0.02]`
  - Scrollbars: Custom styled, dünn, transparent-grau
  - Empty States: Illustration + Text + CTA Button (nie leere Seiten)
  - Error States: Inline-Toast oder Banner, nie alert()
  - Mobile: Sidebar wird zu Bottom-Navigation, Karten stacken vertikal

---

## Seiten & Komponenten – Detailbeschreibung

### 1. Login Page `/login`
- Zentriertes Login-Formular auf dunklem Hintergrund
- EmotionFrame Logo oben
- Email + Passwort Felder
- "Passwort vergessen" Link
- Subtiler animierter Hintergrund (CSS Gradient Animation)

### 2. Dashboard Overview `/dashboard`
- **KPI Row** (oben): 4-6 grosse Karten mit Hauptmetriken
  - Total Followers (alle Plattformen kombiniert)
  - Engagement Rate (Durchschnitt)
  - Website Traffic (GA4)
  - Top Suchbegriff (Search Console)
  - Jede Karte zeigt: Wert, Trend-Pfeil (↑↓), Prozent-Änderung, Sparkline
- **Performance Chart** (Mitte): Grosser Linien-Chart, Zeitraum wählbar (7d/30d/90d/1y)
  - Mehrere Linien übereinander (Followers, Engagement, Traffic)
  - Tooltip mit Details
- **Channel Performance** (unten links): Horizontale Balken pro Plattform
- **AI Insights Feed** (unten rechts): Scrollbare Liste der letzten KI-Empfehlungen
  - Farbcodiert nach Priority
  - "Dismiss" und "Details" Buttons

### 3. Social Media Detail Pages `/social/[platform]`
- Platform-spezifisches Dashboard
- **Header:** Platform-Logo, Account-Name, Follower-Zahl
- **Metriken-Grid:** Platform-spezifische KPIs
  - Instagram: Followers, Engagement Rate, Reach, Story Views, Reels Performance
  - Facebook: Page Likes, Post Reach, Engagement, Video Views
  - TikTok: Followers, Video Views, Likes, Shares, Profile Views
  - LinkedIn: Connections, Post Impressions, Engagement Rate, Profile Views
  - YouTube: Subscribers, Watch Time, Views, CTR
- **Content Performance Table:** Tabelle der letzten Posts mit Metriken
- **Best Posting Times:** Heatmap (Wochentag × Uhrzeit)
- **Audience Demographics:** Donut-Charts (Alter, Geschlecht, Standort)

### 4. Analytics Dashboard `/analytics`
- Google Analytics 4 Daten
- **Traffic Overview:** Sessions, Users, Pageviews, Bounce Rate
- **Traffic Sources:** Pie/Donut Chart (Organic, Paid, Social, Direct, Referral)
- **Top Pages:** Tabelle mit Seitenaufrufen
- **User Flow:** Sankey-Diagramm (vereinfacht)
- **Conversions:** Goal Completions, Conversion Rate

### 5. Search Console `/analytics/search`
- **Search Performance Chart:** Klicks, Impressions, CTR, Position über Zeit
- **Top Suchbegriffe:** Tabelle sortierbar
  - Suchbegriff, Klicks, Impressions, CTR, Durchschnittliche Position
  - Trend-Indikator pro Begriff
- **Top Seiten:** Welche Seiten ranken am besten
- **Keyword Opportunities:** KI-generiert – Suchbegriffe die Potenzial haben

### 6. Szenario Simulator `/scenarios`
Das Herzstück der KI-Features:
- **Szenario Builder** (linke Seite):
  - Dropdown: Szenario-Typ wählen:
    - "Budget erhöhen auf Kanal X"
    - "Posting-Frequenz ändern"
    - "Neue Plattform starten"
    - "Content-Strategie ändern"
    - "Custom Szenario"
  - Slider/Inputs für Parameter:
    - Budget (CHF), Zeitraum, Plattform, Content-Typ
  - "Szenario berechnen" Button
- **Ergebnis-Visualisierung** (rechte Seite):
  - Forecast-Chart: Ist-Daten (solid) vs. Prognose (dashed) vs. Szenario (farbig)
  - Erwartete KPI-Änderungen als Karten
  - Konfidenzintervall als schattierter Bereich
  - "Szenario speichern" Button
- **Gespeicherte Szenarien:** Tabelle unten, Vergleich möglich

### 7. KI Insights `/ai-insights`
- **Insight Feed:** Karten mit KI-generierten Erkenntnissen
  - Jede Karte: Icon (Typ), Titel, Beschreibung, Confidence-Bar, Priorität-Badge
  - Expandierbar für Details
  - Aktions-Buttons: "Umsetzen", "Ignorieren", "Mehr erfahren"
- **Insight-Kategorien:** Filter-Tabs (Alle, Anomalien, Trends, Empfehlungen, Prognosen)
- **Lern-Historie:** Timeline was die KI gelernt hat und wie sich Empfehlungen verbessert haben

### 8. Report Builder `/reports`
- Drag-and-Drop Sektionen auswählen
- Zeitraum wählen
- Vorschau
- PDF generieren und herunterladen
- Automatisierte monatliche Reports (Inngest Cron)

### 9. Admin Panel `/admin` (nur EmotionFrame)
- **Client-Liste:** Tabelle aller Kunden-Organisationen
  - Name, Plan, Aktive Integrationen, Letzter Login
  - "Bearbeiten", "Login als Kunde" (Impersonation)
- **Neuen Kunden anlegen:**
  - Organisation erstellen
  - Admin-User anlegen + Einladungsmail
  - Integrationen einrichten (API Keys eintragen)
- **System Health:** API-Status aller Integrationen, Job-Queue Status

### 10. Settings `/settings/integrations`
- Pro Plattform: Karte mit Status-Indikator (verbunden/getrennt)
- OAuth-Flow starten oder API-Key eingeben
- Letzte Synchronisation anzeigen
- "Jetzt synchronisieren" Button

---

## API Integrationen – Implementierungsdetails

### Instagram (Graph API)
- OAuth 2.0 via Facebook Login
- Endpoints: `/me/media`, `/me/insights`, `/me/stories`
- Metriken: followers_count, impressions, reach, engagement, profile_views

### Facebook (Graph API)
- OAuth 2.0
- Endpoints: `/page/insights`, `/page/posts`
- Metriken: page_fans, post_reach, post_engagement, video_views

### Google Analytics 4 (Data API)
- OAuth 2.0 via Google Cloud Console
- Endpoint: `runReport`
- Metriken: sessions, activeUsers, screenPageViews, bounceRate, conversions

### Google Search Console (API)
- OAuth 2.0
- Endpoint: `searchanalytics/query`
- Metriken: clicks, impressions, ctr, position per query

### TikTok (Research API / Business API)
- OAuth 2.0
- Endpoints: `/video/list/`, `/user/info/`
- Metriken: follower_count, video_views, likes, shares

### LinkedIn (Marketing API)
- OAuth 2.0
- Endpoints: `/organizationalEntityShareStatistics`, `/networkSizes`
- Metriken: impressions, engagement, followers, clicks

### YouTube (Data API v3)
- OAuth 2.0
- Endpoints: `/channels`, `/videos`, `/analytics`
- Metriken: subscriberCount, viewCount, watchTime, ctr

---

## KI/ML Engine (Python FastAPI)

### Endpunkte

```
POST /api/predict/forecast
  Body: { organization_id, metric_type, platform, horizon_days }
  → Gibt Zeitreihen-Forecast zurück (Prophet)

POST /api/predict/scenario
  Body: { organization_id, scenario_type, parameters }
  → Berechnet What-If Szenario

POST /api/insights/generate
  Body: { organization_id }
  → Analysiert alle Daten, generiert neue Insights

GET /api/insights/{organization_id}
  → Gibt aktuelle Insights zurück

POST /api/insights/learn
  Body: { organization_id, feedback }
  → Nimmt User-Feedback auf, passt Modelle an
```

### Lern-Mechanismus
1. **Datensammlung:** Alle Metriken werden täglich gepollt und gespeichert
2. **Pattern Recognition:** Wöchentlicher Job analysiert Trends, Anomalien, Korrelationen
3. **Feedback Loop:** Wenn User Insights als "hilfreich" oder "nicht relevant" markiert → Gewichtung anpassen
4. **Model Retraining:** Monatlich werden Forecast-Modelle mit neuen Daten nachtrainiert
5. **Cross-Client Learning:** Anonymisierte Muster über alle Mandanten hinweg erkennen (optional, DSGVO-konform)

---

## Development Phasen

### Phase 1: Foundation (Woche 1-2)
- [ ] Next.js Projekt aufsetzen mit TypeScript, Tailwind, shadcn/ui
- [ ] Prisma Schema + PostgreSQL aufsetzen (Supabase)
- [ ] NextAuth.js mit Rollen-System (SUPER_ADMIN, CLIENT_ADMIN, CLIENT_VIEWER)
- [ ] Multi-Tenant Middleware (Organization-Kontext pro Request)
- [ ] Dashboard Layout Shell (Sidebar, Header, Responsive)
- [ ] Login Page
- [ ] Admin: Client CRUD

### Phase 2: Dashboard & Charts (Woche 3-4)
- [ ] Dashboard Overview Page mit Dummy-Daten
- [ ] KPI-Karten Komponente (wiederverwendbar)
- [ ] Chart-Komponenten (Line, Bar, Donut, Heatmap, Sparkline)
- [ ] Social Media Detail-Seiten (Struktur + Dummy-Daten)
- [ ] Analytics Seite
- [ ] Search Console Seite

### Phase 3: API Integrationen (Woche 5-7)
- [ ] OAuth Flow für Google (Analytics + Search Console)
- [ ] Instagram/Facebook Graph API Integration
- [ ] YouTube Data API Integration
- [ ] LinkedIn Marketing API Integration
- [ ] TikTok API Integration
- [ ] Settings Page: Integrationen verwalten
- [ ] Inngest Jobs: Tägliches Daten-Polling pro Integration

### Phase 4: KI Engine (Woche 8-10)
- [ ] Python FastAPI Microservice aufsetzen
- [ ] Prophet Forecasting implementieren
- [ ] Anomalie-Erkennung (Isolation Forest)
- [ ] Szenario-Simulator Backend
- [ ] Claude API Integration für Text-Insights
- [ ] AI Insights Page im Frontend
- [ ] Feedback-System (Insight bewerten)

### Phase 5: Szenario Simulator (Woche 11-12)
- [ ] Szenario Builder UI
- [ ] Parameter-Formulare pro Szenario-Typ
- [ ] Forecast vs. Szenario Visualisierung
- [ ] Szenarien speichern + vergleichen

### Phase 6: Reports & Polish (Woche 13-14)
- [ ] Report Builder (Sektionen auswählen)
- [ ] PDF-Generierung (react-pdf oder Puppeteer)
- [ ] Automatisierte monatliche Reports
- [ ] Performance-Optimierung (Redis Caching)
- [ ] Responsive Design finalisieren
- [ ] Error Handling & Loading States

### Phase 7: Deployment (Woche 15)
- [ ] Docker Compose für Self-Hosting
- [ ] Nginx Reverse Proxy Config
- [ ] SSL/TLS Setup
- [ ] Backup-Strategie
- [ ] Monitoring (optional: Sentry)

---

## Befehle für Claude Code

### Projekt starten:
```bash
# Zuerst in Claude Code ausführen:
/init

# Dann:
npx create-next-app@latest emotionframe-platform --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd emotionframe-platform
npx shadcn@latest init
npm install prisma @prisma/client next-auth@beta recharts framer-motion inngest @tanstack/react-query lucide-react geist
npm install -D @types/node
npx prisma init
```

### Nützliche Claude Code Prompts pro Phase:

**Phase 1 – Foundation + Layout Design:**
```
Lies zuerst /mnt/skills/public/frontend-design/SKILL.md und wende die Regeln an.

Du bist ein erfahrener UI/UX Designer und Frontend-Entwickler. Erstelle das Prisma Schema gemäss CLAUDE.md. Richte NextAuth.js v5 mit Credentials Provider und Rollen-System ein. Baue eine Multi-Tenant Middleware die den Organization-Kontext aus der Session liest.

Dann baue das Dashboard Layout – das ist das wichtigste UI-Element der ganzen App:
- Collapsible Sidebar (64px collapsed / 260px expanded) mit smooth Framer Motion Transition
- Icons: Lucide React. Menüpunkte: Home, Social, Analytics, Scenarios, AI Insights, Reports, Settings
- Aktiver Menüpunkt: heller Background + linker Accent-Balken in #6C5CE7
- Header: Breadcrumb links, rechts: Organization-Name, User-Avatar mit Dropdown (Profile, Settings, Logout)
- Für Super-Admins: Organization-Switcher Dropdown im Header
- Mobile: Sidebar wird zu einer Bottom-Navigation mit 5 Icons
- Verwende das komplette Design System aus CLAUDE.md (Farben, Fonts, Glassmorphism, Glow-Effekte)
- Login Page: Zentriertes Formular, animierter Gradient-Hintergrund (CSS only), EmotionFrame Logo
- Baue eine Tailwind Config die alle Design Tokens als CSS Variables definiert
```

**Phase 2 – Dashboard Design + Charts:**
```
Lies zuerst /mnt/skills/public/frontend-design/SKILL.md und wende die Regeln an.

Du bist ein erfahrener UI/UX Designer und Frontend-Entwickler. Baue die Dashboard Overview Page – sie muss aussehen wie ein Premium SaaS Tool (Referenz: Linear, Vercel Dashboard).

1. KPI-Karten Komponente (wiederverwendbar):
   - Glassmorphism Background (bg-white/5 backdrop-blur-xl border-white/10)
   - Metrik-Name (text-sm text-secondary), Wert (text-3xl font-bold Geist Mono), Trend-Badge (grün/rot mit Pfeil + Prozent), Sparkline (letzte 30 Tage, Recharts, 60px hoch)
   - Staggered entrance animation (Framer Motion, 50ms delay pro Karte)
   - Hover: leichter Scale + Border-Glow

2. Chart-Komponenten mit Recharts:
   - LineChart: Gradient fill unter der Linie, custom Tooltip mit Glassmorphism, animated drawing
   - BarChart: Rounded corners, Gradient fill, hover highlight
   - DonutChart: Center-Label mit Hauptwert, animated segments
   - Heatmap: Custom SVG Grid für Posting-Zeiten (Wochentag × Stunde)
   - AreaChart: Für Forecasting (solid = Ist, dashed = Prognose, shaded = Konfidenz)
   - Alle Charts: Custom Recharts Theme mit den Farben aus dem Design System

3. Dashboard Layout:
   - KPI Row (4-6 Karten, responsive grid)
   - Grosser Performance Chart (Zeitraum-Switcher: 7d/30d/90d/1y als Pill-Buttons)
   - Channel Performance (horizontale Bars pro Plattform mit Platform-Logo)
   - AI Insights Feed (scrollbare Liste, Priority-farbcodiert)

4. Verwende realistische Dummy-Daten (nicht 0 oder 100, sondern z.B. 12,847 Followers, +3.2%, etc.)
5. Skeleton Loading für jeden Bereich (shimmer animation)
6. Empty State wenn keine Integration verbunden
```

**Phase 3 – API Integrationen:**
```
Lies zuerst /mnt/skills/public/frontend-design/SKILL.md und wende die Regeln an.

Implementiere den Google OAuth Flow für Analytics und Search Console. Erstelle einen API-Client in lib/api/google-analytics.ts der die GA4 Data API nutzt um Sessions, Users, Pageviews, und Traffic Sources zu fetchen. Speichere die Daten als Metrics in der Datenbank. Erstelle einen Inngest Job der täglich um 02:00 UTC alle aktiven Integrationen synchronisiert.

Für die Settings/Integrationen Seite:
- Pro Plattform eine Karte mit: Platform-Logo (farbig), Name, Status-Badge (Verbunden/Getrennt mit Dot-Indicator), Letzter Sync Timestamp, "Verbinden" oder "Sync Now" Button
- OAuth-Verbindung öffnet Popup, nach Erfolg: animierter Übergang von "Getrennt" zu "Verbunden"
- Design: gleicher Glassmorphism-Stil wie Dashboard Karten
```

**Phase 4 – KI Engine:**
```
Lies zuerst /mnt/skills/public/frontend-design/SKILL.md und wende die Regeln an.

Erstelle den Python FastAPI Microservice unter services/ai-engine/. Implementiere Prophet-basiertes Forecasting das Zeitreihen-Daten aus der PostgreSQL DB liest und Prognosen für 30/60/90 Tage berechnet. Erstelle einen Endpoint der Anomalien in den letzten 7 Tagen erkennt (Isolation Forest). Verbinde Claude API um aus den Rohdaten natürlichsprachliche Insights zu generieren.

Für die AI Insights Page im Frontend (Design wie ein Premium Feed):
- Insight-Karten: Icon links (Typ-basiert), Titel bold, Beschreibung, Confidence-Bar (animiert), Priority-Badge
- Karten expandierbar mit Framer Motion AnimatePresence
- Filter-Tabs oben: Alle | Anomalien | Trends | Empfehlungen | Prognosen (Pill-Style, animated indicator)
- Aktions-Buttons pro Insight: "Umsetzen" (primary), "Ignorieren" (ghost), "Details" (outline)
- Lern-Timeline: Vertikale Timeline die zeigt was die KI gelernt hat
```

**Phase 5 – Szenario Simulator:**
```
Lies zuerst /mnt/skills/public/frontend-design/SKILL.md und wende die Regeln an.

Du bist ein erfahrener UI/UX Designer. Baue den Szenario Simulator – das muss das beeindruckendste Feature der App sein.

Layout: Split-Screen
- Links (40%): Szenario Builder
  - Szenario-Typ Dropdown (styled, nicht native select)
  - Dynamische Parameter-Felder je nach Typ (Slider mit Wert-Anzeige, styled Inputs)
  - "Szenario berechnen" Button mit Loading-Animation
- Rechts (60%): Ergebnis-Visualisierung
  - Forecast-Chart: Ist-Daten (solid line) vs. Szenario (dashed, andere Farbe) mit Konfidenz-Band (shaded area)
  - KPI-Impact Karten darunter: "Erwartete Follower in 90 Tagen: +2,340 (+18%)"
  - Animated transition wenn neues Szenario berechnet wird

Gespeicherte Szenarien: Tabelle unten mit Vergleichs-Möglichkeit (2 Szenarien nebeneinander)
```

---

## Umgebungsvariablen (.env.example)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/emotionframe"

# Auth
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXTAUTH_URL="http://localhost:3000"

# Redis
REDIS_URL="redis://localhost:6379"

# Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Facebook/Instagram
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""

# TikTok
TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""

# LinkedIn
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# YouTube
YOUTUBE_API_KEY=""

# AI Engine
AI_ENGINE_URL="http://localhost:8000"
ANTHROPIC_API_KEY=""

# Inngest
INNGEST_EVENT_KEY=""
INNGEST_SIGNING_KEY=""
```

---

## Wichtige Regeln

1. **Frontend Design Skill:** Bei JEDER UI-Aufgabe ZUERST `/mnt/skills/public/frontend-design/SKILL.md` lesen und anwenden. Keine Ausnahmen.
2. **Sicherheit:** Access Tokens IMMER verschlüsselt speichern (AES-256). Nie im Klartext in der DB.
2. **Sicherheit:** Access Tokens IMMER verschlüsselt speichern (AES-256). Nie im Klartext in der DB.
3. **Multi-Tenancy:** JEDE Datenbankabfrage MUSS nach organizationId filtern. Nie Daten zwischen Mandanten leaken.
4. **Rate Limiting:** Alle externen API-Calls mit Rate Limiting und Retry-Logic.
5. **DSGVO:** Keine personenbezogenen Daten ohne Einwilligung verarbeiten. Lösch-Funktion für Mandanten vorsehen.
6. **Error Handling:** Jede API-Integration braucht robustes Error Handling mit Logging.
7. **Performance:** Aggregierte Daten in Redis cachen. Keine Live-API-Calls bei Seitenaufruf.
8. **TypeScript:** Strikte Typen überall. Keine `any` Types.
```

---

## GitHub Setup

```bash
# Repo erstellen und pushen
git init
git add .
git commit -m "Initial commit: EmotionFrame Marketing Intelligence Platform"
gh repo create emotionframe-platform --private --source=. --push
```

## Vercel Deployment (Dev/Test)

```bash
# Vercel CLI
npm i -g vercel
vercel link
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... weitere env vars
vercel deploy
```
