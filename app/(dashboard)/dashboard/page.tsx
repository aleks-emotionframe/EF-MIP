"use client"

import {
  Activity,
  TrendingUp,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  {
    label: "Aktive Kampagnen",
    value: "12",
    change: "+3",
    trend: "up" as const,
    icon: Activity,
    color: "#6C5CE7",
    bg: "bg-[#6C5CE7]/[0.06]",
  },
  {
    label: "Engagement Rate",
    value: "4.8%",
    change: "+0.6%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "#00CEC9",
    bg: "bg-[#00CEC9]/[0.06]",
  },
  {
    label: "Clients",
    value: "24",
    change: "+2",
    trend: "up" as const,
    icon: Users,
    color: "#FD79A8",
    bg: "bg-[#FD79A8]/[0.06]",
  },
  {
    label: "AI Insights",
    value: "156",
    change: "-8",
    trend: "down" as const,
    icon: Sparkles,
    color: "#FDCB6E",
    bg: "bg-[#FDCB6E]/[0.08]",
  },
]

const activities = [
  { text: "Neue Emotion-Analyse für TechVision abgeschlossen", time: "Vor 12 Min.", dot: "#6C5CE7" },
  { text: 'Kampagne "Sommer 2026" wurde aktiviert', time: "Vor 1 Std.", dot: "#00CEC9" },
  { text: "3 neue Sentiment-Alerts für GreenLeaf", time: "Vor 2 Std.", dot: "#FD79A8" },
  { text: 'Report "Q1 Engagement" generiert', time: "Vor 4 Std.", dot: "#FDCB6E" },
  { text: "AI Insight: Positiver Trend bei MediaPulse erkannt", time: "Vor 5 Std.", dot: "#6C5CE7" },
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
        <h1 className="text-xl font-semibold text-gray-900">Willkommen zurück</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Hier ist dein Überblick für heute.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-white p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className="h-[18px] w-[18px]" style={{ color: stat.color }} />
              </div>
              <div className={`flex items-center gap-0.5 text-[12px] font-medium ${
                stat.trend === "up" ? "text-emerald-600" : "text-red-500"
              }`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-[12px] text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Emotion Trend Chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Emotion Trends</h2>
              <p className="text-[12px] text-gray-500 mt-0.5">Letzte 7 Tage</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6C5CE7]" />Positiv
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FD79A8]" />Negativ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#DFE4EA]" />Neutral
              </span>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradPositiv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNegativ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FD79A8" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#FD79A8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="positiv"
                  stroke="#6C5CE7"
                  strokeWidth={2}
                  fill="url(#gradPositiv)"
                />
                <Area
                  type="monotone"
                  dataKey="negativ"
                  stroke="#FD79A8"
                  strokeWidth={2}
                  fill="url(#gradNegativ)"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stroke="#DFE4EA"
                  strokeWidth={1.5}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900">Aktivitäten</h2>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: activity.dot }}
                  />
                  {i < activities.length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 mt-1.5" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-[13px] text-gray-700 leading-snug">{activity.text}</p>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">Top Clients</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">Nach Sentiment Score</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topClients.map((client) => (
            <div
              key={client.name}
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3.5 hover:bg-gray-50/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-500 shrink-0">
                {client.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 truncate">{client.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6C5CE7]"
                      style={{ width: `${client.score}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-gray-500">{client.score}</span>
                  <span className={`text-[11px] font-medium ${
                    client.change.startsWith("+") ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {client.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
