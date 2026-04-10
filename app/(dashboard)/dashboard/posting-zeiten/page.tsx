"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock, Star, Calendar, TrendingUp, Crown,
  Camera, ThumbsUp, Briefcase, Video, Play,
  CalendarPlus,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Platform = "alle" | "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube"

interface CellData {
  day: number
  hour: number
  engagement: number
}

/* ------------------------------------------------------------------ */
/*  Demo-Data Generator                                                */
/* ------------------------------------------------------------------ */
const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 6–23

function generateHeatmapData(platform: Platform): CellData[] {
  const data: CellData[] = []

  // Base patterns – realistic: higher Tue/Thu evenings, lower weekends mornings
  const dayWeights: Record<number, number> = {
    0: 1.1,  // Montag
    1: 1.35, // Dienstag  (peak day)
    2: 1.15, // Mittwoch
    3: 1.3,  // Donnerstag (high)
    4: 1.05, // Freitag
    5: 0.7,  // Samstag
    6: 0.6,  // Sonntag
  }

  const hourWeights: Record<number, number> = {
    6: 0.2, 7: 0.35, 8: 0.55, 9: 0.65, 10: 0.7, 11: 0.75,
    12: 0.9, 13: 0.8, 14: 0.7, 15: 0.75, 16: 0.85, 17: 1.1,
    18: 1.4, 19: 1.3, 20: 1.15, 21: 1.0, 22: 0.6, 23: 0.3,
  }

  // Platform-specific modifiers
  const platformMod: Record<Platform, { dayBoost?: Partial<Record<number, number>>; hourBoost?: Partial<Record<number, number>> }> = {
    alle: {},
    instagram: { hourBoost: { 12: 0.15, 18: 0.2, 19: 0.15 } },
    facebook: { hourBoost: { 9: 0.1, 13: 0.15, 17: 0.1 }, dayBoost: { 2: 0.1 } },
    linkedin: { hourBoost: { 8: 0.3, 9: 0.25, 10: 0.2, 17: -0.1, 18: -0.2 }, dayBoost: { 1: 0.15, 3: 0.1, 5: -0.3, 6: -0.3 } },
    tiktok: { hourBoost: { 19: 0.25, 20: 0.3, 21: 0.25, 22: 0.2 }, dayBoost: { 5: 0.15, 6: 0.1 } },
    youtube: { hourBoost: { 14: 0.15, 15: 0.2, 16: 0.15 }, dayBoost: { 5: 0.1 } },
  }

  const mod = platformMod[platform]

  // Seeded pseudo-random for consistency per platform
  let seed = platform.charCodeAt(0) * 137
  function pseudoRandom() {
    seed = (seed * 16807 + 7) % 2147483647
    return (seed % 1000) / 1000
  }

  for (let day = 0; day < 7; day++) {
    for (const hour of HOURS) {
      const base = (dayWeights[day] ?? 1) * (hourWeights[hour] ?? 0.5)
      const dayBoost = mod.dayBoost?.[day] ?? 0
      const hourBoost = mod.hourBoost?.[hour] ?? 0
      const noise = (pseudoRandom() - 0.5) * 0.3
      const raw = base + dayBoost + hourBoost + noise
      const engagement = Math.max(0.1, Math.min(raw * 3.5, 7.2))
      data.push({ day, hour, engagement: Math.round(engagement * 100) / 100 })
    }
  }

  return data
}

function getTopThree(data: CellData[]): CellData[] {
  return [...data].sort((a, b) => b.engagement - a.engagement).slice(0, 3)
}

function getStatsForPlatform(data: CellData[]) {
  const top = getTopThree(data)
  const bestCell = top[0]

  // Best hour: most frequently appearing hour in top 10
  const topTen = [...data].sort((a, b) => b.engagement - a.engagement).slice(0, 10)
  const hourCounts: Record<number, number> = {}
  topTen.forEach((c) => { hourCounts[c.hour] = (hourCounts[c.hour] || 0) + 1 })
  const bestHour = Number(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])

  // Best day: highest average
  const dayAvg: Record<number, number[]> = {}
  data.forEach((c) => { (dayAvg[c.day] ??= []).push(c.engagement) })
  const bestDay = Number(
    Object.entries(dayAvg)
      .map(([d, vals]) => ({ d, avg: vals.reduce((s, v) => s + v, 0) / vals.length }))
      .sort((a, b) => b.avg - a.avg)[0].d
  )

  return {
    bestHour: `${bestHour}:00`,
    bestDay: DAYS[bestDay],
    peakEngagement: `${bestCell.engagement.toFixed(1)}%`,
    postsPerWeek: 5,
  }
}

function getDayBarData(data: CellData[]) {
  const dayAvg: Record<number, number[]> = {}
  data.forEach((c) => { (dayAvg[c.day] ??= []).push(c.engagement) })
  return DAYS.map((name, i) => {
    const vals = dayAvg[i] ?? []
    const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
    return { name: name.slice(0, 2), fullName: name, engagement: Math.round(avg * 100) / 100 }
  })
}

/* ------------------------------------------------------------------ */
/*  Color helpers                                                      */
/* ------------------------------------------------------------------ */
function getCellColor(engagement: number, max: number): string {
  const ratio = engagement / max
  if (ratio >= 0.92) return "#F97316"       // peak – orange/gold
  if (ratio >= 0.75) return "#00CEC9"       // high – teal
  if (ratio >= 0.5) return "rgba(0,206,201,0.55)"  // medium
  if (ratio >= 0.25) return "rgba(0,206,201,0.25)"  // low-medium
  return "rgba(0,206,201,0.08)"              // low
}

function getCellGlow(engagement: number, max: number): string {
  const ratio = engagement / max
  if (ratio >= 0.92) return "0 0 12px rgba(249,115,22,0.5)"
  return "none"
}

/* ------------------------------------------------------------------ */
/*  Platform tabs config                                               */
/* ------------------------------------------------------------------ */
const PLATFORM_TABS: { key: Platform; label: string; icon?: React.ElementType }[] = [
  { key: "alle", label: "Alle" },
  { key: "instagram", label: "Instagram", icon: Camera },
  { key: "facebook", label: "Facebook", icon: ThumbsUp },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase },
  { key: "tiktok", label: "TikTok", icon: Video },
  { key: "youtube", label: "YouTube", icon: Play },
]

/* ------------------------------------------------------------------ */
/*  Custom Recharts Tooltip                                            */
/* ------------------------------------------------------------------ */
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-[12px]">
      <p className="font-bold text-[#0F172A]">{item.fullName}</p>
      <p className="text-gray-500">Ø Engagement: <span className="font-semibold text-[#00CEC9]">{item.engagement}%</span></p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function PostingZeitenPage() {
  const [platform, setPlatform] = useState<Platform>("alle")
  const [hoveredCell, setHoveredCell] = useState<CellData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const heatmapData = generateHeatmapData(platform)
  const maxEngagement = Math.max(...heatmapData.map((c) => c.engagement))
  const topThree = getTopThree(heatmapData)
  const stats = getStatsForPlatform(heatmapData)
  const barData = getDayBarData(heatmapData)

  const topThreeSet = new Set(topThree.map((c) => `${c.day}-${c.hour}`))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00CEC9]/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-[#00CEC9]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
              Beste Posting-Zeiten
            </h1>
            <p className="text-[13px] text-gray-500 dark:text-white/50 mt-0.5">
              Finde die optimalen Zeitfenster für maximales Engagement
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-medium text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Demo-Daten
        </span>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {PLATFORM_TABS.map((tab) => {
          const active = platform === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setPlatform(tab.key)}
              className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-all ${
                active
                  ? "bg-[#00CEC9] text-white shadow-md shadow-[#00CEC9]/25"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              {tab.key === "tiktok" && (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.26 8.26 0 0 0 4.76 1.5V6.85a4.79 4.79 0 0 1-1-.16z" />
                </svg>
              )}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Beste Stunde", value: stats.bestHour, icon: Clock, color: "#00CEC9" },
          { label: "Bester Tag", value: stats.bestDay, icon: Calendar, color: "#6C5CE7" },
          { label: "Ø Engagement Peak", value: stats.peakEngagement, icon: TrendingUp, color: "#F97316" },
          { label: "Empfohlene Posts/Woche", value: String(stats.postsPerWeek), icon: Star, color: "#E84393" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl bg-white shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}0F` }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-[22px] font-extrabold text-[#0F172A] dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Heatmap */}
      <div className="rounded-2xl bg-white shadow-sm p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Engagement-Heatmap</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Hover für Details &middot; Sterne markieren die Top-3 Zeiten</p>
          </div>
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(0,206,201,0.08)" }} />
              Niedrig
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(0,206,201,0.55)" }} />
              Mittel
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[#00CEC9]" />
              Hoch
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[#F97316]" />
              Peak
            </div>
          </div>
        </div>

        <div className="relative min-w-[640px]">
          {/* Hour labels */}
          <div className="grid gap-[3px] ml-[72px]" style={{ gridTemplateColumns: `repeat(18, minmax(0, 1fr))` }}>
            {HOURS.map((h) => (
              <div key={h} className="text-center text-[10px] text-gray-400 font-medium pb-1">
                {h}:00
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {DAYS.map((dayName, dayIdx) => (
            <div key={dayName} className="flex items-center gap-0 mb-[3px]">
              {/* Day label */}
              <div className="w-[72px] shrink-0 text-[12px] font-semibold text-[#0F172A] dark:text-white pr-2 text-right">
                {dayName}
              </div>
              {/* Cells */}
              <div className="flex-1 grid gap-[3px]" style={{ gridTemplateColumns: `repeat(18, minmax(0, 1fr))` }}>
                {HOURS.map((hour) => {
                  const cell = heatmapData.find((c) => c.day === dayIdx && c.hour === hour)!
                  const isTop = topThreeSet.has(`${dayIdx}-${hour}`)
                  const rank = topThree.findIndex((t) => t.day === dayIdx && t.hour === hour)
                  const bg = getCellColor(cell.engagement, maxEngagement)
                  const glow = getCellGlow(cell.engagement, maxEngagement)

                  return (
                    <motion.div
                      key={`${dayIdx}-${hour}`}
                      className="relative aspect-square rounded-md cursor-pointer flex items-center justify-center"
                      style={{
                        backgroundColor: bg,
                        boxShadow: glow,
                      }}
                      whileHover={{ scale: 1.25, zIndex: 20 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setHoveredCell(cell)
                        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 })
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {isTop && (
                        <Crown
                          className="h-3 w-3 drop-shadow-sm"
                          style={{
                            color: rank === 0 ? "#F97316" : rank === 1 ? "#00CEC9" : "#6C5CE7",
                          }}
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Tooltip (portal-style fixed) */}
          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 pointer-events-none"
                style={{
                  left: tooltipPos.x,
                  top: tooltipPos.y,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div className="bg-[#0F172A] text-white rounded-lg px-3 py-2 text-[12px] shadow-xl whitespace-nowrap">
                  <p className="font-bold">{DAYS[hoveredCell.day]}, {hoveredCell.hour}:00 Uhr</p>
                  <p className="text-[#00CEC9] font-semibold">{hoveredCell.engagement.toFixed(1)}% Engagement</p>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-[#0F172A]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Empfohlene Zeiten */}
      <div className="rounded-2xl bg-white shadow-sm p-5">
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Empfohlene Zeiten</h3>
        <p className="text-[11px] text-gray-400 mb-4">Die Top-3 Zeitfenster mit dem höchsten erwarteten Engagement</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topThree.map((cell, idx) => {
            const rankColors = ["#F97316", "#00CEC9", "#6C5CE7"]
            const rankBg = ["rgba(249,115,22,0.08)", "rgba(0,206,201,0.08)", "rgba(108,92,231,0.08)"]
            const rankBorder = ["border-orange-200", "border-teal-200", "border-purple-200"]
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`relative rounded-xl border ${rankBorder[idx]} p-4`}
                style={{ backgroundColor: rankBg[idx] }}
              >
                {/* Rank badge */}
                <div
                  className="absolute -top-3 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold text-white shadow-md"
                  style={{ backgroundColor: rankColors[idx] }}
                >
                  #{idx + 1}
                </div>
                <div className="mt-2">
                  <p className="text-[18px] font-extrabold text-[#0F172A] dark:text-white">
                    {DAYS[cell.day]}
                  </p>
                  <p className="text-[14px] font-semibold text-gray-600 mt-0.5">
                    {cell.hour}:00 Uhr
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3.5 w-3.5" style={{ color: rankColors[idx] }} />
                    <span className="text-[14px] font-bold" style={{ color: rankColors[idx] }}>
                      {cell.engagement.toFixed(1)}%
                    </span>
                    <span className="text-[11px] text-gray-400 ml-0.5">erw. Engagement</span>
                  </div>
                </div>
                <button
                  className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: rankColors[idx] }}
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Jetzt planen
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bar Chart – Engagement by Day */}
      <div className="rounded-2xl bg-white shadow-sm p-5">
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Engagement nach Wochentag</h3>
        <p className="text-[11px] text-gray-400 mb-4">Durchschnittliches Engagement pro Tag</p>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(0,206,201,0.04)" }} />
              <Bar dataKey="engagement" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {barData.map((entry, i) => {
                  const maxAvg = Math.max(...barData.map((d) => d.engagement))
                  const ratio = entry.engagement / maxAvg
                  const color = ratio >= 0.95 ? "#00CEC9" : ratio >= 0.8 ? "rgba(0,206,201,0.7)" : "rgba(0,206,201,0.35)"
                  return <Cell key={i} fill={color} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
