"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Link2, ExternalLink, TrendingUp, TrendingDown, Shield,
  AlertTriangle, ArrowUpRight, Globe, Search,
  ChevronDown, ChevronRight, CheckCircle2, XCircle, Info,
  Loader2, Minus, Lock,
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts"

// ─── Types ──────────────────────────────────────────────────────
interface BacklinkStats {
  total: number
  referringDomains: number
  newLast30: number
  lostLast30: number
}

interface ReferringDomain {
  domain: string
  links: number
  authority: number
  status: "aktiv" | "verloren"
}

interface NewBacklink {
  date: string
  from: string
  to: string
  anchor: string
}

interface ToxicLink {
  url: string
  reason: string
  risk: "hoch" | "mittel"
}

interface GrowthPoint {
  month: string
  backlinks: number
}

// ─── Page ───────────────────────────────────────────────────────
export default function BacklinksPage() {
  const [connected, setConnected] = useState(false)
  const [checking, setChecking] = useState(true)
  const [selectedDomain, setSelectedDomain] = useState("emotionframe.ch")
  const [domainOpen, setDomainOpen] = useState(false)

  const domains = ["emotionframe.ch", "blog.emotionframe.ch"]

  // Check if Search Console is connected
  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch("/api/integrations/connect?platform=SEARCH_CONSOLE")
        const data = await res.json()
        // If we get an OAuth URL back, the platform is not yet connected
        // If connected, the API would return linked data instead of a URL
        setConnected(!data.url)
      } catch {
        setConnected(false)
      } finally {
        setChecking(false)
      }
    }
    checkConnection()
  }, [])

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 text-[#6C5CE7] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[#00CEC9]" />
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
              Backlink-Tracker
            </h1>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
            Verweisende Links und Domain-Autoritat uberwachen.
          </p>
        </div>

        {/* Domain Selector */}
        <div className="relative">
          <button
            onClick={() => setDomainOpen(!domainOpen)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-gray-400" />
            {selectedDomain}
            <ChevronDown
              className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                domainOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {domainOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1 w-56 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] shadow-lg z-20 overflow-hidden"
              >
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDomain(d)
                      setDomainOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors ${
                      d === selectedDomain
                        ? "text-[#6C5CE7] font-semibold bg-[#6C5CE7]/5"
                        : "text-gray-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Conditional Render ────────────────────────────────── */}
      {!connected ? <NotConnectedState /> : <ConnectedState domain={selectedDomain} />}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOT CONNECTED STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function NotConnectedState() {
  const features = [
    {
      icon: Link2,
      title: "Backlink-Ubersicht",
      desc: "Alle verweisenden Links auf einen Blick mit Echtzeit-Zahlen aus der Search Console.",
    },
    {
      icon: TrendingUp,
      title: "Neue & verlorene Links",
      desc: "Verfolge welche Backlinks neu dazukommen und welche verloren gehen.",
    },
    {
      icon: Shield,
      title: "Domain Authority",
      desc: "Bewertung der Qualitat jeder verweisenden Domain.",
    },
    {
      icon: AlertTriangle,
      title: "Toxische Links erkennen",
      desc: "Automatische Warnung bei potenziell schadlichen Backlinks.",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left: Info */}
            <div className="flex-1 space-y-6">
              {/* Icon + Title */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00CEC9]/10 to-[#6C5CE7]/10 flex items-center justify-center">
                  <Search className="h-7 w-7 text-[#6C5CE7]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
                    Verbinde Google Search Console
                  </h2>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    Um echte Backlink-Daten zu sehen
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Der Backlink-Tracker zeigt dir alle verweisenden Links auf deine Website.
                Verbinde deine Google Search Console, um Echtzeit-Daten zu deinen
                Backlinks, verweisenden Domains und Link-Qualitat zu erhalten.
              </p>

              {/* Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00CEC9]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="h-4 w-4 text-[#00CEC9]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{f.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.a
                href="/dashboard/settings/integrations"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] px-6 py-3.5 text-[14px] font-semibold text-white shadow-lg shadow-[#6C5CE7]/20 hover:shadow-xl hover:shadow-[#6C5CE7]/30 transition-shadow"
              >
                <ExternalLink className="h-4 w-4" />
                Search Console verbinden
                <ChevronRight className="h-4 w-4" />
              </motion.a>
            </div>

            {/* Right: Dashboard Preview Mockup (blurred placeholder) */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="relative rounded-2xl border border-gray-200/60 bg-gradient-to-br from-gray-50 to-gray-100/50 p-5 overflow-hidden">
                {/* Blur overlay */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <span className="text-[11px] font-medium text-gray-400">
                      Vorschau
                    </span>
                  </div>
                </div>

                {/* Fake stats */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {[
                    { label: "Backlinks", val: "2'847" },
                    { label: "Domains", val: "412" },
                    { label: "Neu (30T)", val: "+86" },
                    { label: "Verloren", val: "-12" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-white/80 p-3"
                    >
                      <div className="text-[10px] text-gray-400">{s.label}</div>
                      <div className="text-[16px] font-bold text-gray-600 mt-0.5">
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fake chart lines */}
                <div className="rounded-xl bg-white/80 p-3 mb-3">
                  <div className="text-[10px] text-gray-400 mb-2">Wachstum</div>
                  <svg
                    viewBox="0 0 200 60"
                    className="w-full h-12 text-[#00CEC9]"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      points="0,50 30,45 60,42 90,38 120,30 150,25 180,18 200,15"
                    />
                    <polyline
                      fill="none"
                      stroke="#6C5CE7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="4,4"
                      points="0,55 30,52 60,48 90,46 120,42 150,38 180,35 200,32"
                    />
                  </svg>
                </div>

                {/* Fake table rows */}
                <div className="space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg bg-white/80 p-2"
                    >
                      <div className="w-4 h-4 rounded bg-gray-200" />
                      <div className="flex-1 h-2.5 rounded bg-gray-200" />
                      <div className="w-8 h-2.5 rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 flex items-start gap-3"
      >
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-[13px] text-blue-800 font-medium">
            Warum Google Search Console?
          </p>
          <p className="text-[12px] text-blue-600 mt-1 leading-relaxed">
            Die Search Console ist Googles offizielles Tool und liefert die
            zuverlassigsten Daten zu verweisenden Links. Nach der Verbindung werden
            deine Backlink-Daten automatisch synchronisiert und hier angezeigt
            &mdash; keine Schatzungen, nur echte Daten.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONNECTED STATE
// These sections will be populated with real Search Console data
// once the integration is connected and the API endpoints are wired up.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ConnectedState({ domain }: { domain: string }) {
  // TODO: Replace with real Search Console API call
  // e.g. const { data } = useSWR(`/api/backlinks?domain=${domain}`)
  const [loading, setLoading] = useState(false)

  // Domain change triggers a simulated refetch
  const [activeDomain, setActiveDomain] = useState(domain)
  if (domain !== activeDomain) {
    setActiveDomain(domain)
    setLoading(true)
  }

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [loading])

  // ── Demo data (clearly marked, will be replaced by real SC data) ──
  const stats: BacklinkStats = {
    total: 2847,
    referringDomains: 412,
    newLast30: 86,
    lostLast30: 12,
  }

  const growthData: GrowthPoint[] = [
    { month: "Okt", backlinks: 1920 },
    { month: "Nov", backlinks: 2080 },
    { month: "Dez", backlinks: 2210 },
    { month: "Jan", backlinks: 2350 },
    { month: "Feb", backlinks: 2540 },
    { month: "Mar", backlinks: 2690 },
    { month: "Apr", backlinks: 2847 },
  ]

  const topDomains: ReferringDomain[] = [
    { domain: "techcrunch.com", links: 24, authority: 94, status: "aktiv" },
    { domain: "srf.ch", links: 18, authority: 89, status: "aktiv" },
    { domain: "netzwoche.ch", links: 15, authority: 72, status: "aktiv" },
    { domain: "startupticker.ch", links: 12, authority: 68, status: "aktiv" },
    { domain: "t3n.de", links: 9, authority: 85, status: "aktiv" },
    { domain: "marketing.ch", links: 7, authority: 61, status: "verloren" },
    { domain: "digitec.ch", links: 6, authority: 78, status: "aktiv" },
  ]

  const newBacklinks: NewBacklink[] = [
    { date: "09.04.2026", from: "techcrunch.com/best-tools-2026", to: "/", anchor: "EmotionFrame" },
    { date: "07.04.2026", from: "srf.ch/digital/social-media-tools", to: "/produkte", anchor: "Social Media Analytics" },
    { date: "05.04.2026", from: "netzwoche.ch/ki-marketing", to: "/blog/ki-social-media", anchor: "KI-gestutzte Analyse" },
    { date: "03.04.2026", from: "startupticker.ch/news", to: "/", anchor: "Schweizer Startup" },
    { date: "01.04.2026", from: "t3n.de/tools/social-analytics", to: "/preise", anchor: "Pricing" },
  ]

  const toxicLinks: ToxicLink[] = [
    { url: "spamsite-xyz.ru/links", reason: "Spam-Domain, niedriger Trust Score", risk: "hoch" },
    { url: "link-farm-abc.info/page", reason: "Link-Farm erkannt, unnatürliches Linkprofil", risk: "mittel" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 text-[#6C5CE7] animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Demo-Daten Banner */}
      <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-[13px] text-amber-800 font-medium">Demo-Daten</p>
          <p className="text-[12px] text-amber-600 mt-0.5">
            Die angezeigten Daten sind Beispieldaten zur Veranschaulichung. Echte
            Daten werden nach der Search Console Verbindung geladen.
          </p>
        </div>
      </div>

      {/* ─── Stats Cards ──────────────────────────────────────── */}
      {/* Will be populated with real SC data once connected */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Backlinks",
            value: stats.total.toLocaleString("de-CH"),
            icon: Link2,
            color: "#6C5CE7",
            bg: "bg-[#6C5CE7]/5",
          },
          {
            label: "Verweisende Domains",
            value: stats.referringDomains.toLocaleString("de-CH"),
            icon: Globe,
            color: "#00CEC9",
            bg: "bg-[#00CEC9]/5",
          },
          {
            label: "Neue (letzte 30 Tage)",
            value: `+${stats.newLast30}`,
            icon: TrendingUp,
            color: "#10b981",
            bg: "bg-emerald-50",
            positive: true,
          },
          {
            label: "Verlorene",
            value: `-${stats.lostLast30}`,
            icon: TrendingDown,
            color: "#ef4444",
            bg: "bg-red-50",
            negative: true,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-[26px] font-bold text-[#0F172A] dark:text-white">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ─── Growth Chart ─────────────────────────────────────── */}
      {/* Will be populated with real SC data once connected */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">
              Backlink-Wachstum
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Entwicklung der letzten 7 Monate
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />
              Backlinks
            </span>
          </div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  fontSize: 13,
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  Number(value).toLocaleString("de-CH"),
                  "Backlinks",
                ]}
              />
              <Line
                type="monotone"
                dataKey="backlinks"
                stroke="#6C5CE7"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6C5CE7", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#6C5CE7", strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ─── Two-Column: Top Domains + New Backlinks ──────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Referring Domains */}
        {/* Will be populated with real SC data once connected */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-4">
            Top Verweisende Domains
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Domain
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Links
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Authority
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {topDomains.map((d) => (
                  <tr
                    key={d.domain}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                          <Globe className="h-3 w-3 text-gray-400" />
                        </div>
                        <span className="text-[13px] font-medium text-[#0F172A] dark:text-white">
                          {d.domain}
                        </span>
                      </div>
                    </td>
                    <td className="text-right text-[13px] font-semibold text-[#0F172A] dark:text-white py-3">
                      {d.links}
                    </td>
                    <td className="text-right py-3">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-6 rounded-md text-[11px] font-bold ${
                          d.authority >= 80
                            ? "bg-emerald-50 text-emerald-700"
                            : d.authority >= 60
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {d.authority}
                      </span>
                    </td>
                    <td className="text-right py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          d.status === "aktiv"
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {d.status === "aktiv" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {d.status === "aktiv" ? "Aktiv" : "Verloren"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* New Backlinks */}
        {/* Will be populated with real SC data once connected */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-4">
            Neue Backlinks
          </h3>
          <div className="space-y-3">
            {newBacklinks.map((bl, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 p-3.5 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-[12px] font-semibold text-[#0F172A] dark:text-white truncate max-w-[200px]">
                      {bl.from}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                    {bl.date}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-8 text-[11px] text-gray-500">
                  <span className="truncate">
                    <span className="text-gray-400">Ziel:</span>{" "}
                    <span className="font-medium text-gray-600">{bl.to}</span>
                  </span>
                  <Minus className="h-2.5 w-2.5 text-gray-300 shrink-0" />
                  <span className="truncate">
                    <span className="text-gray-400">Anchor:</span>{" "}
                    <span className="font-medium text-[#6C5CE7]">{bl.anchor}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Toxic Links Warning ──────────────────────────────── */}
      {/* Will be populated with real SC data once connected */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">
              Toxische Links
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {toxicLinks.length} potenziell schadliche Backlinks erkannt
            </p>
          </div>
        </div>
        <div className="px-6 pb-6 space-y-2.5">
          {toxicLinks.map((link, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl p-4 ${
                link.risk === "hoch"
                  ? "bg-red-50 border border-red-100"
                  : "bg-amber-50 border border-amber-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  link.risk === "hoch" ? "bg-red-100" : "bg-amber-100"
                }`}
              >
                <AlertTriangle
                  className={`h-3 w-3 ${
                    link.risk === "hoch" ? "text-red-600" : "text-amber-600"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white truncate">
                    {link.url}
                  </p>
                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      link.risk === "hoch"
                        ? "bg-red-200 text-red-700"
                        : "bg-amber-200 text-amber-700"
                    }`}
                  >
                    {link.risk}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 mt-1">{link.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
