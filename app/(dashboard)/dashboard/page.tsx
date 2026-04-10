"use client"

import {
  Activity, TrendingUp, Users, Sparkles, ArrowUpRight,
  ArrowDownRight, MoreHorizontal, Clock,
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

const chartData = [
  { name: "Mo", positiv: 65, negativ: 28, neutral: 42 },
  { name: "Di", positiv: 72, negativ: 22, neutral: 38 },
  { name: "Mi", positiv: 58, negativ: 35, neutral: 45 },
  { name: "Do", positiv: 81, negativ: 18, neutral: 32 },
  { name: "Fr", positiv: 76, negativ: 24, neutral: 36 },
  { name: "Sa", positiv: 68, negativ: 30, neutral: 40 },
  { name: "So", positiv: 85, negativ: 15, neutral: 28 },
]

const stats = [
  { label: "Aktive Kampagnen", value: "12", change: "+3", trend: "up" as const, icon: Activity, gradient: "from-[#6C5CE7] to-[#5643CC]" },
  { label: "Engagement-Rate", value: "4.8%", change: "+0.6%", trend: "up" as const, icon: TrendingUp, gradient: "from-[#00CEC9] to-[#00B4D8]" },
  { label: "Kunden", value: "24", change: "+2", trend: "up" as const, icon: Users, gradient: "from-[#FF6B6B] to-[#EE5A24]" },
  { label: "KI-Erkenntnisse", value: "156", change: "-8", trend: "down" as const, icon: Sparkles, gradient: "from-[#FDCB6E] to-[#F39C12]" },
]

const activities = [
  { text: "Neue Emotion-Analyse für TechVision abgeschlossen", time: "Vor 12 Min.", dot: "#6C5CE7" },
  { text: 'Kampagne "Sommer 2026" wurde aktiviert', time: "Vor 1 Std.", dot: "#00CEC9" },
  { text: "3 neue Sentiment-Alerts für GreenLeaf", time: "Vor 2 Std.", dot: "#FF6B6B" },
  { text: 'Report "Q1 Engagement" generiert', time: "Vor 4 Std.", dot: "#FDCB6E" },
  { text: "KI-Erkenntnis: Positiver Trend bei MediaPulse erkannt", time: "Vor 5 Std.", dot: "#6C5CE7" },
]

const topClients = [
  { name: "TechVision GmbH", score: 92, change: "+5" },
  { name: "GreenLeaf AG", score: 87, change: "+3" },
  { name: "MediaPulse", score: 74, change: "-2" },
  { name: "Urban Brands", score: 68, change: "+8" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B2559] dark:text-white">Willkommen zurück</h1>
        <p className="text-[14px] text-gray-600 dark:text-white/50 mt-1">Hier ist dein Überblick für heute.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className={`flex items-center gap-0.5 text-[13px] font-semibold ${
                stat.trend === "up" ? "text-emerald-500" : "text-red-500"
              }`}>
                {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-[28px] font-extrabold text-[#1B2559] dark:text-white tracking-tight">{stat.value}</p>
            <p className="text-[13px] text-gray-500 dark:text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-[#1B2559] dark:text-white">Emotion Trends</h2>
              <p className="text-[12px] text-gray-500 dark:text-white/40 mt-0.5">Letzte 7 Tage</p>
            </div>
            <div className="flex items-center gap-5 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />Positiv</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />Negativ</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-white/20" />Neutral</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#a0aec0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#a0aec0" }} />
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="positiv" stroke="#6C5CE7" strokeWidth={2.5} fill="url(#gradPos)" />
                <Area type="monotone" dataKey="negativ" stroke="#FF6B6B" strokeWidth={2} fill="url(#gradNeg)" />
                <Area type="monotone" dataKey="neutral" stroke="#CBD5E0" strokeWidth={1.5} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activities */}
        <div className="rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-bold text-[#1B2559] dark:text-white">Aktivitäten</h2>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-5">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: activity.dot }} />
                  {i < activities.length - 1 && <div className="w-px flex-1 bg-gray-100 dark:bg-white/[0.06] mt-2" />}
                </div>
                <div className="pb-1">
                  <p className="text-[13px] text-[#1B2559] dark:text-white/80 leading-snug">{activity.text}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/30 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />{activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-bold text-[#1B2559] dark:text-white">Top Kunden</h2>
            <p className="text-[12px] text-gray-500 dark:text-white/40 mt-0.5">Nach Stimmungs-Score</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topClients.map((client) => (
            <div key={client.name} className="flex items-center gap-3 rounded-xl bg-[#F4F7FE] dark:bg-white/[0.04] p-4 hover:bg-[#EEF2FF] dark:hover:bg-white/[0.06] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6C5CE7]/20 to-[#5643CC]/10 flex items-center justify-center text-[13px] font-bold text-[#6C5CE7] shrink-0">
                {client.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1B2559] dark:text-white truncate">{client.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-white dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#5643CC]" style={{ width: `${client.score}%` }} />
                  </div>
                  <span className="text-[12px] font-bold text-[#1B2559] dark:text-white">{client.score}</span>
                  <span className={`text-[11px] font-semibold ${client.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>{client.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
