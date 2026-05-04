"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  MapPin, Monitor, Smartphone, Tablet, ArrowRight,
  Globe, ExternalLink, Clock, Activity, Users,
  Zap, Eye, MousePointer,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
interface ActivePage {
  path: string
  title: string
  viewers: number
}

interface LocationEntry {
  city: string
  country: string
  flag: string
  visitors: number
  percent: number
}

interface ReferrerEntry {
  source: string
  visitors: number
  percent: number
  color: string
}

interface DeviceEntry {
  type: string
  icon: typeof Monitor
  percent: number
  color: string
}

interface FeedEntry {
  id: number
  city: string
  page: string
  timestamp: string
}

// ─── Demo Data (shown in blurred preview & connected state) ─────
const DEMO_LOCATIONS: LocationEntry[] = [
  { city: "Zurich", country: "Schweiz", flag: "🇨🇭", visitors: 24, percent: 32 },
  { city: "Berlin", country: "Deutschland", flag: "🇩🇪", visitors: 18, percent: 24 },
  { city: "Wien", country: "Osterreich", flag: "🇦🇹", visitors: 12, percent: 16 },
  { city: "London", country: "UK", flag: "🇬🇧", visitors: 8, percent: 11 },
  { city: "Paris", country: "Frankreich", flag: "🇫🇷", visitors: 7, percent: 9 },
  { city: "Amsterdam", country: "Niederlande", flag: "🇳🇱", visitors: 6, percent: 8 },
]

const DEMO_PAGES: ActivePage[] = [
  { path: "/", title: "Startseite", viewers: 28 },
  { path: "/produkte", title: "Produkte", viewers: 15 },
  { path: "/blog/social-media-2026", title: "Blog: Social Media 2026", viewers: 12 },
  { path: "/preise", title: "Preise", viewers: 9 },
  { path: "/kontakt", title: "Kontakt", viewers: 5 },
  { path: "/ueber-uns", title: "Uber uns", viewers: 3 },
]

const DEMO_REFERRERS: ReferrerEntry[] = [
  { source: "Direkt", visitors: 32, percent: 42, color: "#6C5CE7" },
  { source: "Google", visitors: 22, percent: 29, color: "#00CEC9" },
  { source: "Social Media", visitors: 12, percent: 16, color: "#E84393" },
  { source: "Verweise", visitors: 6, percent: 8, color: "#F97316" },
  { source: "E-Mail", visitors: 4, percent: 5, color: "#0EA5E9" },
]

const DEMO_DEVICES: DeviceEntry[] = [
  { type: "Desktop", icon: Monitor, percent: 56, color: "#6C5CE7" },
  { type: "Mobil", icon: Smartphone, percent: 38, color: "#00CEC9" },
  { type: "Tablet", icon: Tablet, percent: 6, color: "#F97316" },
]

const DEMO_FEED: FeedEntry[] = [
  { id: 1, city: "Zurich", page: "/produkte", timestamp: "Gerade eben" },
  { id: 2, city: "Berlin", page: "/blog/social-media-2026", timestamp: "Vor 12 Sek." },
  { id: 3, city: "Wien", page: "/kontakt", timestamp: "Vor 28 Sek." },
  { id: 4, city: "London", page: "/preise", timestamp: "Vor 45 Sek." },
  { id: 5, city: "Zurich", page: "/", timestamp: "Vor 1 Min." },
  { id: 6, city: "Paris", page: "/ueber-uns", timestamp: "Vor 1 Min." },
  { id: 7, city: "Amsterdam", page: "/produkte", timestamp: "Vor 2 Min." },
  { id: 8, city: "Berlin", page: "/", timestamp: "Vor 2 Min." },
]

// ─── Pulsing Dot Component ─────────────────────────────────────
function PulsingDot({ color = "#22C55E", size = 8 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, opacity: 0.4 }}
        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  )
}

// ─── Connected Dashboard ────────────────────────────────────────
function LiveDashboard() {
  const [visitorCount] = useState(76)
  const maxPageViewers = Math.max(...DEMO_PAGES.map((p) => p.viewers))

  return (
    <div className="space-y-5">
      {/* Live Counter Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded bg-gradient-to-br from-[#6C5CE7] to-[#5643CC] p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <PulsingDot color="#22C55E" size={12} />
          <span className="text-sm font-medium text-white/80">Echtzeit-Daten</span>
          <span className="text-xs text-white/50 ml-auto">Demo-Daten</span>
        </div>
        <div className="flex items-baseline gap-3">
          <motion.span
            className="text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {visitorCount}
          </motion.span>
          <span className="text-xl text-white/70 font-medium">Besucher jetzt aktiv</span>
        </div>
        <div className="flex gap-6 mt-4 text-sm text-white/60">
          <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> 142 Seitenaufrufe/Min.</span>
          <span className="flex items-center gap-1.5"><MousePointer className="h-4 w-4" /> 34 Events/Min.</span>
        </div>
      </motion.div>

      {/* Standort-Ubersicht + Aktive Seiten */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Standort-Ubersicht */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#00CEC9]/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-[#00CEC9]" />
              </div>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Standort-Ubersicht</h2>
            </div>
            <span className="text-[11px] text-gray-400">Top 6 Standorte</span>
          </div>
          <div className="space-y-3">
            {DEMO_LOCATIONS.map((loc, i) => (
              <motion.div
                key={loc.city}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <PulsingDot color="#00CEC9" size={8} />
                </div>
                <span className="text-lg">{loc.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#0F172A] truncate">{loc.city}</span>
                    <span className="text-[12px] text-gray-500 ml-2">{loc.visitors} Besucher</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#00CEC9] to-[#00CEC9]/60"
                      initial={{ width: 0 }}
                      animate={{ width: `${loc.percent}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                    />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#00CEC9] w-10 text-right">{loc.percent}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Aktive Seiten */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#6C5CE7]/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-[#6C5CE7]" />
              </div>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Aktive Seiten</h2>
            </div>
            <span className="text-[11px] text-gray-400">Jetzt aufgerufen</span>
          </div>
          <div className="space-y-3">
            {DEMO_PAGES.map((page, i) => (
              <motion.div
                key={page.path}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-[#0F172A] truncate">{page.title}</span>
                    <span className="text-[12px] font-bold text-[#6C5CE7] ml-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />{page.viewers}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mb-1.5">{page.path}</div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#6C5CE7]/50"
                      initial={{ width: 0 }}
                      animate={{ width: `${(page.viewers / maxPageViewers) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Referrer + Gerate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Referrer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#E84393]/10 flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-[#E84393]" />
              </div>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Herkunft</h2>
            </div>
          </div>
          <div className="space-y-4">
            {DEMO_REFERRERS.map((ref, i) => (
              <motion.div
                key={ref.source}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{ref.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-500">{ref.visitors} Besucher</span>
                    <span className="text-[11px] font-bold" style={{ color: ref.color }}>{ref.percent}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: ref.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${ref.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gerate */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#F97316]/10 flex items-center justify-center">
                <Monitor className="h-4 w-4 text-[#F97316]" />
              </div>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Gerate</h2>
            </div>
          </div>
          <div className="space-y-5">
            {DEMO_DEVICES.map((device, i) => (
              <motion.div
                key={device.type}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${device.color}10` }}
                >
                  <device.icon className="h-5 w-5" style={{ color: device.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{device.type}</span>
                    <span className="text-[14px] font-bold" style={{ color: device.color }}>{device.percent}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: device.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percent}%` }}
                      transition={{ duration: 1, delay: 0.35 + i * 0.08 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Device summary */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-400">
            <span>Total aktive Gerate</span>
            <span className="font-bold text-[#0F172A] dark:text-white">76</span>
          </div>
        </motion.div>
      </div>

      {/* Live Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#22C55E]/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-[#22C55E]" />
            </div>
            <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Live Aktivitat</h2>
            <PulsingDot color="#22C55E" size={6} />
          </div>
          <span className="text-[11px] text-gray-400">Letzte Aktionen</span>
        </div>
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
          {DEMO_FEED.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center shrink-0">
                <MapPin className="h-3.5 w-3.5 text-[#6C5CE7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#0F172A] dark:text-white">
                  Besucher aus <span className="font-semibold">{entry.city}</span> hat{" "}
                  <span className="font-semibold text-[#6C5CE7]">{entry.page}</span> aufgerufen
                </p>
              </div>
              <span className="text-[11px] text-gray-400 shrink-0 flex items-center gap-1">
                <Clock className="h-3 w-3" />{entry.timestamp}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Connection Required Card ───────────────────────────────────
function ConnectionRequired() {
  const features = [
    { label: "Live-Besucherzahl", desc: "Aktive Nutzer in Echtzeit" },
    { label: "Aktive Seiten", desc: "Welche Seiten gerade aufgerufen werden" },
    { label: "Herkunftslander", desc: "Woher deine Besucher kommen" },
    { label: "Gerate", desc: "Desktop, Mobil oder Tablet" },
  ]

  return (
    <div className="relative">
      {/* Blurred Preview Behind */}
      <div className="absolute inset-0 overflow-hidden rounded pointer-events-none select-none" aria-hidden>
        <div className="blur-[6px] opacity-40 scale-[0.98] origin-top">
          <LiveDashboard />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white/95" />
      </div>

      {/* Connection Card */}
      <div className="relative z-10 flex items-center justify-center min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg mx-auto"
        >
          <div className="rounded bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl shadow-xl border border-gray-100 dark:border-white/[0.06] p-8 text-center">
            {/* Animated Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded bg-gradient-to-br from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center shadow-lg"
              >
                <MapPin className="h-10 w-10 text-white" />
              </motion.div>
            </div>

            <h2 className="text-xl font-bold text-[#0F172A] mb-2">
              Verbinde Google Analytics
            </h2>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6 max-w-sm mx-auto">
              Verbinde dein Google Analytics-Konto, um Echtzeit-Besucherdaten deiner Website
              zu sehen. Alle Daten werden live und direkt von Google abgerufen.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="rounded bg-gray-50 p-3 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-3.5 w-3.5 text-[#6C5CE7]" />
                    <span className="text-[12px] font-bold text-[#0F172A] dark:text-white">{f.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link href="/dashboard/settings/integrations">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-6 rounded bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] text-white font-semibold text-[14px] shadow-lg shadow-[#6C5CE7]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                Google Analytics verbinden
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>

            <p className="text-[11px] text-gray-400 mt-4">
              Sichere OAuth2-Verbindung. Deine Daten bleiben privat.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────
export default function LiveBesucherPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Google Analytics is connected
    async function checkConnection() {
      try {
        const res = await fetch("/api/integrations/status?platform=GOOGLE_ANALYTICS")
        if (res.ok) {
          const data = await res.json()
          setIsConnected(data.connected === true)
        }
      } catch {
        // Default to not connected
        setIsConnected(false)
      } finally {
        setLoading(false)
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center shadow-md">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Live Besucher</h1>
            <p className="text-[13px] text-gray-500 dark:text-white/50 mt-0.5">Echtzeit-Besucherdaten deiner Website</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <PulsingDot color="#22C55E" size={8} />
          <span className="text-[12px] font-semibold text-emerald-700">Echtzeit</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#6C5CE7]"
          />
        </div>
      ) : isConnected ? (
        <LiveDashboard />
      ) : (
        <ConnectionRequired />
      )}
    </div>
  )
}
