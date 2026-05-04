"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts"
import {
  FileBarChart, ArrowUpRight, ArrowDownRight, Sparkles,
  Eye, Clock, MousePointerClick, ChevronDown, ChevronUp,
  ExternalLink, Trophy, Medal, Award, TrendingUp,
  BarChart3, Zap, Target, Lightbulb, ArrowRight, Minus,
  CheckCircle2, Loader2,
} from "lucide-react"
import Link from "next/link"

/* ──────────────────────────── Types ──────────────────────────── */

interface PageData {
  rank: number
  path: string
  title: string
  views: number
  avgTime: string
  avgTimeSeconds: number
  bounceRate: number
  trend: "up" | "down" | "stable"
  trendValue: number
  score: number
}

interface AISuggestion {
  id: string
  page: string
  type: "warning" | "tip" | "success"
  title: string
  description: string
}

type TimeRange = "7d" | "30d" | "90d"
type SortKey = "rank" | "views" | "avgTimeSeconds" | "bounceRate" | "score"
type SortDir = "asc" | "desc"

/* ──────────────────────────── Constants ──────────────────────── */

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7 Tage" },
  { value: "30d", label: "30 Tage" },
  { value: "90d", label: "90 Tage" },
]

const FEATURE_PREVIEW = [
  { icon: Eye, label: "Seitenaufrufe-Ranking", desc: "Die meistbesuchten Seiten auf einen Blick" },
  { icon: Clock, label: "Verweildauer", desc: "Wie lange Besucher auf jeder Seite bleiben" },
  { icon: MousePointerClick, label: "Absprungrate", desc: "Welche Seiten Besucher sofort verlassen" },
  { icon: Sparkles, label: "KI-Empfehlungen", desc: "Automatische Optimierungsvorschläge" },
]

const PODIUM_STYLES = [
  { bg: "bg-amber-50", border: "border-amber-200", iconColor: "text-amber-500", badgeBg: "bg-amber-100", badgeText: "text-amber-700", label: "Gold" },
  { bg: "bg-gray-50", border: "border-gray-200", iconColor: "text-gray-400", badgeBg: "bg-gray-100", badgeText: "text-gray-600", label: "Silber" },
  { bg: "bg-orange-50", border: "border-orange-200", iconColor: "text-orange-400", badgeBg: "bg-orange-100", badgeText: "text-orange-600", label: "Bronze" },
]

const PODIUM_ICONS = [Trophy, Medal, Award]

/* ──────────────────────────── Helpers ────────────────────────── */

function bounceRateColor(rate: number): string {
  if (rate < 40) return "text-emerald-600"
  if (rate <= 60) return "text-amber-500"
  return "text-red-500"
}

function bounceRateBg(rate: number): string {
  if (rate < 40) return "bg-emerald-50"
  if (rate <= 60) return "bg-amber-50"
  return "bg-red-50"
}

function scoreColor(score: number): string {
  if (score >= 80) return "#10B981"
  if (score >= 60) return "#F59E0B"
  return "#EF4444"
}

function formatNumber(n: number): string {
  return n.toLocaleString("de-CH")
}

/* ──────────────────────────── Page ───────────────────────────── */

export default function SeitenRankingPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [isGAConnected, setIsGAConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>("rank")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)
  const [pages, setPages] = useState<PageData[]>([])
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])

  // Check GA connection status
  useEffect(() => {
    async function checkConnection() {
      setLoading(true)
      try {
        const res = await fetch("/api/integrations/status?platform=GOOGLE_ANALYTICS")
        if (res.ok) {
          const data = await res.json()
          setIsGAConnected(data.connected === true)
        } else {
          setIsGAConnected(false)
        }
      } catch {
        // API not available or error — treat as not connected
        setIsGAConnected(false)
      } finally {
        setLoading(false)
      }
    }
    checkConnection()
  }, [])

  // Sort handler
  const handleSort = useCallback((key: SortKey) => {
    setSortDir((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "desc"))
    setSortKey(key)
  }, [sortKey])

  const sortedPages = [...pages].sort((a, b) => {
    const mult = sortDir === "asc" ? 1 : -1
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * mult
  })

  const chartData = pages.slice(0, 10).map((p) => ({
    name: p.path.length > 20 ? p.path.slice(0, 18) + "..." : p.path,
    Seitenaufrufe: p.views,
    path: p.path,
  }))

  const CHART_COLORS = ["#6C5CE7", "#00CEC9", "#F97316", "#6C5CE7", "#00CEC9", "#F97316", "#6C5CE7", "#00CEC9", "#F97316", "#6C5CE7"]

  // ── Loading State ──
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#6C5CE7]/10 flex items-center justify-center">
            <FileBarChart className="h-5 w-5 text-[#6C5CE7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Seiten-Performance</h1>
            <p className="text-[13px] text-gray-500 dark:text-white/50">Lade Daten...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-[#6C5CE7] animate-spin" />
        </div>
      </div>
    )
  }

  // ── Not Connected State ──
  if (!isGAConnected) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#6C5CE7]/10 flex items-center justify-center">
              <FileBarChart className="h-5 w-5 text-[#6C5CE7]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Seiten-Performance</h1>
              <p className="text-[13px] text-gray-500 dark:text-white/50">Ranking deiner Webseiten nach Performance</p>
            </div>
          </div>
          <div className="flex gap-1 rounded bg-gray-100 dark:bg-white/[0.04] p-1">
            {TIME_RANGES.map((tr) => (
              <button
                key={tr.value}
                onClick={() => setTimeRange(tr.value)}
                className={`px-3 py-1.5 rounded text-[12px] font-medium transition-all ${
                  timeRange === tr.value
                    ? "bg-white dark:bg-white/10 text-[#0F172A] dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-white/40 dark:hover:text-white/60"
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Connection Required Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden"
        >
          {/* Decorative gradient top bar */}
          <div className="h-1 bg-gradient-to-r from-[#6C5CE7] via-[#00CEC9] to-[#F97316]" />

          <div className="p-8 md:p-12 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded bg-gradient-to-br from-[#6C5CE7]/10 to-[#00CEC9]/10 flex items-center justify-center mb-6"
            >
              <FileBarChart className="h-10 w-10 text-[#6C5CE7]" />
            </motion.div>

            {/* Title & Description */}
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">
              Verbinde Google Analytics
            </h2>
            <p className="text-[14px] text-gray-500 dark:text-white/50 max-w-lg mx-auto mb-8">
              Erfahre welche Seiten am besten performen und wo Optimierungsbedarf besteht.
              Verbinde Google Analytics, um dein persoenliches Seiten-Ranking zu sehen.
            </p>

            {/* Feature Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              {FEATURE_PREVIEW.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded bg-gray-50 dark:bg-white/[0.04] text-left"
                >
                  <div className="w-9 h-9 rounded bg-[#6C5CE7]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <feature.icon className="h-4.5 w-4.5 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{feature.label}</p>
                    <p className="text-[12px] text-gray-400 dark:text-white/40 mt-0.5">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Blurred preview mockup */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative max-w-3xl mx-auto mb-8 rounded overflow-hidden"
            >
              <div className="blur-sm select-none pointer-events-none opacity-60">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    { path: "/startseite", views: "4'820", time: "2:34", rate: "32%" },
                    { path: "/produkte", views: "2'340", time: "3:12", rate: "28%" },
                    { path: "/blog", views: "1'890", time: "4:45", rate: "18%" },
                  ].map((mock, i) => (
                    <div key={i} className={`rounded p-4 border ${PODIUM_STYLES[i].bg} ${PODIUM_STYLES[i].border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-lg font-bold ${PODIUM_STYLES[i].iconColor}`}>#{i + 1}</span>
                        <span className="text-[13px] font-semibold text-[#0F172A]">{mock.path}</span>
                      </div>
                      <div className="flex gap-4 text-[11px] text-gray-500">
                        <span>{mock.views} Aufrufe</span>
                        <span>{mock.time} avg.</span>
                        <span>{mock.rate} Absprung</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded bg-gray-50 p-4">
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                        <span className="text-[12px] font-bold text-gray-400 w-6">#{i}</span>
                        <div className="flex-1 h-3 bg-gray-200 rounded" />
                        <div className="w-16 h-3 bg-gray-200 rounded" />
                        <div className="w-12 h-3 bg-gray-200 rounded" />
                        <div className="w-20 h-2 bg-gray-200 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0F172A] via-transparent to-transparent" />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                href="/dashboard/settings/integrations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#6C5CE7] text-white font-semibold text-[14px] hover:bg-[#5B4BD6] transition-colors shadow-lg shadow-[#6C5CE7]/25"
              >
                Google Analytics verbinden
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-[11px] text-gray-400 dark:text-white/30 mt-3">
                Kostenlos &middot; 2 Klicks &middot; Jederzeit trennbar
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Connected State ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#6C5CE7]/10 flex items-center justify-center">
            <FileBarChart className="h-5 w-5 text-[#6C5CE7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Seiten-Performance</h1>
            <p className="text-[13px] text-gray-500 dark:text-white/50">Ranking deiner Webseiten nach Performance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-medium">GA verbunden</span>
          </div>
          <div className="flex gap-1 rounded bg-gray-100 dark:bg-white/[0.04] p-1">
            {TIME_RANGES.map((tr) => (
              <button
                key={tr.value}
                onClick={() => setTimeRange(tr.value)}
                className={`px-3 py-1.5 rounded text-[12px] font-medium transition-all ${
                  timeRange === tr.value
                    ? "bg-white dark:bg-white/10 text-[#0F172A] dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-white/40 dark:hover:text-white/60"
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state when connected but no data yet */}
      {pages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 p-12 text-center"
        >
          <div className="mx-auto w-16 h-16 rounded bg-[#00CEC9]/10 flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-[#00CEC9]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Daten werden geladen</h3>
          <p className="text-[13px] text-gray-500 dark:text-white/50 max-w-md mx-auto">
            Google Analytics ist verbunden. Die Seiten-Performance-Daten werden beim naechsten Sync geladen.
            Schau in Kuerze wieder vorbei.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pages.slice(0, 3).map((page, i) => {
              const style = PODIUM_STYLES[i]
              const Icon = PODIUM_ICONS[i]
              return (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded border ${style.border} ${style.bg} p-5 relative overflow-hidden`}
                >
                  {/* Rank badge */}
                  <div className={`absolute top-3 right-3 w-8 h-8 rounded-full ${style.badgeBg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${style.iconColor}`} />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-2xl font-extrabold ${style.iconColor}`}>#{i + 1}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${style.badgeText} ${style.badgeBg} px-2 py-0.5 rounded-full`}>
                      {style.label}
                    </span>
                  </div>

                  <p className="text-[14px] font-bold text-[#0F172A] dark:text-white truncate mb-1">
                    {page.title || page.path}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-white/40 truncate mb-4 font-mono">{page.path}</p>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[11px] text-gray-400">Aufrufe</p>
                      <p className="text-[15px] font-bold text-[#0F172A] dark:text-white">{formatNumber(page.views)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">Verweildauer</p>
                      <p className="text-[15px] font-bold text-[#0F172A] dark:text-white">{page.avgTime}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">Absprung</p>
                      <p className={`text-[15px] font-bold ${bounceRateColor(page.bounceRate)}`}>{page.bounceRate}%</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Full Pages Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Alle Seiten</h3>
              <p className="text-[11px] text-gray-400 dark:text-white/40 mt-0.5">Sortierbar nach allen Spalten</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                    {([
                      { key: "rank" as SortKey, label: "Rang" },
                      { key: "path" as SortKey | "path", label: "Seite" },
                      { key: "views" as SortKey, label: "Seitenaufrufe" },
                      { key: "avgTimeSeconds" as SortKey, label: "Verweildauer" },
                      { key: "bounceRate" as SortKey, label: "Absprungrate" },
                      { key: "trend" as SortKey | "trend", label: "Trend" },
                      { key: "score" as SortKey, label: "Performance" },
                    ]).map((col) => (
                      <th
                        key={col.key}
                        onClick={() => col.key !== "path" && col.key !== "trend" ? handleSort(col.key as SortKey) : undefined}
                        className={`px-4 py-3 text-left font-semibold text-gray-500 dark:text-white/50 whitespace-nowrap ${
                          col.key !== "path" && col.key !== "trend" ? "cursor-pointer hover:text-[#0F172A] dark:hover:text-white select-none" : ""
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          {sortKey === col.key && (
                            sortDir === "asc"
                              ? <ChevronUp className="h-3 w-3" />
                              : <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPages.map((page) => (
                    <tr
                      key={page.path}
                      className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-[#0F172A] dark:text-white">#{page.rank}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#0F172A] dark:text-white truncate max-w-[200px]">
                            {page.title || page.path}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono truncate max-w-[200px]">{page.path}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0F172A] dark:text-white">{formatNumber(page.views)}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-white/70">{page.avgTime}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${bounceRateColor(page.bounceRate)} ${bounceRateBg(page.bounceRate)}`}>
                          {page.bounceRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-[12px] font-semibold ${
                          page.trend === "up" ? "text-emerald-600" : page.trend === "down" ? "text-red-500" : "text-gray-400"
                        }`}>
                          {page.trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
                          {page.trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
                          {page.trend === "stable" && <Minus className="h-3.5 w-3.5" />}
                          {page.trend !== "stable" && `${page.trendValue}%`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${page.score}%`,
                                backgroundColor: scoreColor(page.score),
                              }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 w-8">
                            {page.score}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Bottom row: Chart + AI suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 p-5"
            >
              <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Seitenaufrufe-Verteilung</h3>
              <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">Top 10 Seiten nach Aufrufen</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        fontSize: "12px",
                      }}
                      formatter={(value: any) => [formatNumber(Number(value)), "Seitenaufrufe"]}
                    />
                    <Bar dataKey="Seitenaufrufe" radius={[0, 6, 6, 0]} barSize={20}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* KI-Optimierungsvorschlaege */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 p-5"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-[#F97316]" />
                <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">KI-Optimierungsvorschlaege</h3>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">Automatisch generierte Empfehlungen</p>

              {suggestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded bg-[#F97316]/10 flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-[#F97316]" />
                  </div>
                  <p className="text-[13px] font-medium text-[#0F172A] dark:text-white mb-1">
                    KI-Analyse wird vorbereitet
                  </p>
                  <p className="text-[12px] text-gray-400 dark:text-white/40 max-w-xs">
                    Sobald genuegend Seiten-Daten vorliegen, generiert die KI automatisch Optimierungsvorschlaege fuer deine Seiten.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      className="rounded border border-gray-100 dark:border-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedSuggestion(expandedSuggestion === s.id ? null : s.id)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                          s.type === "warning" ? "bg-red-50 text-red-500"
                          : s.type === "tip" ? "bg-amber-50 text-amber-500"
                          : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {s.type === "warning" ? <Target className="h-3.5 w-3.5" /> :
                           s.type === "tip" ? <Lightbulb className="h-3.5 w-3.5" /> :
                           <Zap className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#0F172A] dark:text-white truncate">{s.title}</p>
                          <p className="text-[11px] text-gray-400 font-mono truncate">{s.page}</p>
                        </div>
                        {expandedSuggestion === s.id
                          ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                          : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                        }
                      </button>
                      <AnimatePresence>
                        {expandedSuggestion === s.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-0">
                              <p className="text-[12px] text-gray-600 dark:text-white/60 leading-relaxed">
                                {s.description}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}
