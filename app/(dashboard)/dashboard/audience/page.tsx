"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  PieChart as PieChartIcon, Users, TrendingUp, MapPin, Calendar,
  ArrowUpRight, Info, Camera, PlayCircle, Briefcase, Music2,
} from "lucide-react"

// ─── Platform Tabs ──────────────────────────────────────────────
type PlatformKey = "alle" | "instagram" | "tiktok" | "youtube" | "linkedin"

const PLATFORMS: { key: PlatformKey; label: string; icon: any }[] = [
  { key: "alle", label: "Alle Plattformen", icon: Users },
  { key: "instagram", label: "Instagram", icon: Camera },
  { key: "tiktok", label: "TikTok", icon: Music2 },
  { key: "youtube", label: "YouTube", icon: PlayCircle },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase },
]

// ─── Demo Data ──────────────────────────────────────────────────
const followerGrowthData = [
  { name: "Mai", Follower: 36200 },
  { name: "Jun", Follower: 37100 },
  { name: "Jul", Follower: 38400 },
  { name: "Aug", Follower: 39200 },
  { name: "Sep", Follower: 40100 },
  { name: "Okt", Follower: 41500 },
  { name: "Nov", Follower: 42300 },
  { name: "Dez", Follower: 43100 },
  { name: "Jan", Follower: 44200 },
  { name: "Feb", Follower: 45600 },
  { name: "Mär", Follower: 46800 },
  { name: "Apr", Follower: 48200 },
]

const ageData = [
  { range: "13–17", value: 4 },
  { range: "18–24", value: 28 },
  { range: "25–34", value: 38 },
  { range: "35–44", value: 18 },
  { range: "45–54", value: 8 },
  { range: "55+", value: 4 },
]

const genderData = [
  { name: "Weiblich", value: 58, color: "#00CEC9" },
  { name: "Männlich", value: 38, color: "#6C5CE7" },
  { name: "Divers", value: 4, color: "#E84393" },
]

const topCities = [
  { name: "Zürich", value: 24 },
  { name: "Bern", value: 18 },
  { name: "Basel", value: 14 },
  { name: "Luzern", value: 11 },
  { name: "St. Gallen", value: 9 },
  { name: "Genf", value: 7 },
]

const topFans = [
  { initials: "LM", name: "Lena Meier", platform: "Instagram", interactions: 142, months: 8, color: "#00CEC9" },
  { initials: "TW", name: "Thomas Weber", platform: "TikTok", interactions: 128, months: 12, color: "#6C5CE7" },
  { initials: "SB", name: "Sarah Brunner", platform: "Instagram", interactions: 115, months: 6, color: "#E84393" },
  { initials: "MK", name: "Marco Keller", platform: "YouTube", interactions: 98, months: 10, color: "#F97316" },
  { initials: "AH", name: "Anna Huber", platform: "LinkedIn", interactions: 87, months: 5, color: "#00CEC9" },
  { initials: "DF", name: "David Fischer", platform: "Instagram", interactions: 76, months: 14, color: "#6C5CE7" },
]

const interestTags = [
  { label: "Marketing", color: "#6C5CE7" },
  { label: "Design", color: "#00CEC9" },
  { label: "Technologie", color: "#E84393" },
  { label: "Fotografie", color: "#F97316" },
  { label: "Reisen", color: "#0EA5E9" },
  { label: "Food", color: "#EAB308" },
  { label: "Fitness", color: "#22C55E" },
  { label: "Mode", color: "#EC4899" },
  { label: "Nachhaltigkeit", color: "#10B981" },
  { label: "Musik", color: "#8B5CF6" },
  { label: "Kunst", color: "#F43F5E" },
  { label: "Business", color: "#6366F1" },
  { label: "Gaming", color: "#14B8A6" },
  { label: "Beauty", color: "#D946EF" },
  { label: "Bildung", color: "#0284C7" },
]

const stats = [
  { label: "Total Follower", value: "48.2K", icon: Users, sub: "Alle Plattformen" },
  { label: "Wachstum/Monat", value: "+2.3K", icon: TrendingUp, sub: "+4.9% vs. Vormonat" },
  { label: "Ø Alter", value: "28 Jahre", icon: Calendar, sub: "Kernzielgruppe 18–34" },
  { label: "Top-Stadt", value: "Zürich", icon: MapPin, sub: "24% der Follower" },
]

// ─── Custom Tooltip ─────────────────────────────────────────────
const tooltipStyle = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  fontSize: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}

// ─── Component ──────────────────────────────────────────────────
export default function AudiencePage() {
  const [activePlatform, setActivePlatform] = useState<PlatformKey>("alle")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#00CEC9]/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-[#00CEC9]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Audience Insights</h1>
            <p className="text-[14px] text-gray-500 dark:text-white/50 mt-0.5">Zielgruppen-Analyse und Follower-Demografie</p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1 rounded-md bg-gray-100 p-1">
          {PLATFORMS.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePlatform(p.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                activePlatform === p.key
                  ? "bg-white text-[#0F172A] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <p.icon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Data Banner */}
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-[13px] text-blue-800 font-medium">Demo-Daten</p>
          <p className="text-[12px] text-blue-600 mt-0.5">
            Dies sind Beispieldaten zur Veranschaulichung. Verbinde deine Social-Media-Konten unter
            <span className="font-medium"> Einstellungen &rarr; Integrationen</span>, um echte Audience-Daten zu sehen.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#00CEC9]/[0.06] flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-[#00CEC9]" />
              </div>
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-[22px] font-extrabold text-[#0F172A] dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-gray-300 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid: Growth + Age */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Follower Growth */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Follower-Wachstum</h3>
          <p className="text-[11px] text-gray-400 mb-4">Letzte 12 Monate</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followerGrowthData}>
                <defs>
                  <linearGradient id="gradFollower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00CEC9" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#00CEC9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} domain={["dataMin - 1000", "dataMax + 1000"]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [Number(value).toLocaleString("de-CH"), "Follower"]} />
                <Area type="monotone" dataKey="Follower" stroke="#00CEC9" strokeWidth={2.5} fill="url(#gradFollower)" dot={false} activeDot={{ r: 5, fill: "#00CEC9", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Altersverteilung</h3>
          <p className="text-[11px] text-gray-400 mb-4">Alter der Follower in Prozent</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} unit="%" domain={[0, 45]} />
                <YAxis type="category" dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#374151", fontWeight: 600 }} width={50} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, "Anteil"]} />
                <Bar dataKey="value" fill="#00CEC9" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid: Gender + Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gender Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Geschlecht</h3>
          <p className="text-[11px] text-gray-400 mb-4">Verteilung nach Geschlecht</p>
          <div className="flex items-center gap-8">
            <div className="w-[180px] h-[180px] shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {genderData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, "Anteil"]} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[20px] font-extrabold text-[#0F172A] dark:text-white">58%</p>
                  <p className="text-[10px] text-gray-400">Weiblich</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {genderData.map((g) => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                      <span className="text-[13px] font-medium text-gray-700">{g.name}</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#0F172A] dark:text-white">{g.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${g.value}%`, backgroundColor: g.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Top Standorte</h3>
          <p className="text-[11px] text-gray-400 mb-4">Städte mit den meisten Followern</p>
          <div className="space-y-3.5">
            {topCities.map((city, i) => (
              <div key={city.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{city.name}</span>
                    <span className="text-[12px] font-bold text-gray-900">{city.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(city.value / 24) * 100}%`, backgroundColor: "#00CEC9" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Fans */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6"
      >
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Top Fans</h3>
        <p className="text-[11px] text-gray-400 mb-4">Die engagiertesten Follower nach Interaktionen</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topFans.map((fan, i) => (
            <motion.div
              key={fan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.05, duration: 0.3 }}
              className="flex items-center gap-3 rounded-md border border-gray-100 p-4 hover:border-[#00CEC9]/30 hover:shadow-sm transition-all"
            >
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                style={{ backgroundColor: fan.color }}
              >
                {fan.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0F172A] truncate">{fan.name}</p>
                <p className="text-[11px] text-gray-400">{fan.platform}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] font-medium text-[#00CEC9]">{fan.interactions} Interaktionen</span>
                  <span className="text-[10px] text-gray-300">|</span>
                  <span className="text-[10px] text-gray-400">Seit {fan.months} Monaten aktiv</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interest Tags */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6"
      >
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Interessen-Tags</h3>
        <p className="text-[11px] text-gray-400 mb-4">Häufigste Interessen der Follower</p>
        <div className="flex flex-wrap gap-2">
          {interestTags.map((tag, i) => (
            <motion.span
              key={tag.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.03, duration: 0.25 }}
              className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-transform hover:scale-105 cursor-default"
              style={{
                backgroundColor: `${tag.color}12`,
                color: tag.color,
                border: `1px solid ${tag.color}30`,
              }}
            >
              {tag.label}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
