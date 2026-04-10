"use client"

import {
  Activity, TrendingUp, Users, Eye, ArrowUpRight, ArrowDownRight,
  Download, Heart, Share2, MessageSquare,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

/* ─── Data ─── */
const visitorData = [
  { name: "Jan", besucher: 1200, neueFollower: 340, engagement: 890 },
  { name: "Feb", besucher: 1450, neueFollower: 420, engagement: 1020 },
  { name: "Mär", besucher: 1380, neueFollower: 380, engagement: 950 },
  { name: "Apr", besucher: 1680, neueFollower: 510, engagement: 1180 },
  { name: "Mai", besucher: 1520, neueFollower: 460, engagement: 1090 },
  { name: "Jun", besucher: 1890, neueFollower: 580, engagement: 1340 },
  { name: "Jul", besucher: 2100, neueFollower: 640, engagement: 1520 },
]

const revenueData = [
  { name: "Mo", online: 420, offline: 180 },
  { name: "Di", online: 380, offline: 220 },
  { name: "Mi", online: 510, offline: 190 },
  { name: "Do", online: 460, offline: 240 },
  { name: "Fr", online: 620, offline: 310 },
  { name: "Sa", online: 340, offline: 150 },
  { name: "So", online: 280, offline: 120 },
]

const satisfactionData = [
  { name: "Zufrieden", value: 68, color: "#00CEC9" },
  { name: "Neutral", value: 22, color: "#6C5CE7" },
  { name: "Unzufrieden", value: 10, color: "#F97316" },
]

const targetData = [
  { subject: "Reichweite", ist: 78, ziel: 90 },
  { subject: "Engagement", ist: 86, ziel: 80 },
  { subject: "Follower", ist: 65, ziel: 85 },
  { subject: "Content", ist: 92, ziel: 75 },
  { subject: "Conversions", ist: 58, ziel: 70 },
]

const topContent = [
  { rank: 1, title: "Instagram Reel: Sommer-Kampagne", platform: "Instagram", engagement: "12.4K", trend: 48 },
  { rank: 2, title: "LinkedIn Artikel: KI im Marketing", platform: "LinkedIn", engagement: "8.2K", trend: 32 },
  { rank: 3, title: "TikTok: Behind the Scenes", platform: "TikTok", engagement: "6.8K", trend: -5 },
  { rank: 4, title: "Facebook Post: Kundenstory", platform: "Facebook", engagement: "4.1K", trend: 15 },
]

const platformData = [
  { name: "Instagram", value: 38, color: "#E4405F" },
  { name: "LinkedIn", value: 24, color: "#0A66C2" },
  { name: "TikTok", value: 20, color: "#00CEC9" },
  { name: "Facebook", value: 12, color: "#1877F2" },
  { name: "YouTube", value: 6, color: "#FF0000" },
]

const engagementBarData = [
  { name: "Wo 1", likes: 420, kommentare: 180, shares: 90 },
  { name: "Wo 2", likes: 380, kommentare: 210, shares: 120 },
  { name: "Wo 3", likes: 510, kommentare: 240, shares: 95 },
  { name: "Wo 4", likes: 460, kommentare: 190, shares: 140 },
]

const stats = [
  { label: "Gesamt-Reichweite", value: "48.2K", change: "+12%", trend: "up" as const, icon: Eye, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
  { label: "Interaktionen", value: "3.840", change: "+8%", trend: "up" as const, icon: Heart, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
  { label: "Neue Follower", value: "642", change: "+24%", trend: "up" as const, icon: Users, bg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
  { label: "Aktive Kampagnen", value: "8", change: "-2", trend: "down" as const, icon: Activity, bg: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
]

const platformColors: Record<string, string> = {
  Instagram: "#E4405F",
  LinkedIn: "#0A66C2",
  TikTok: "#00CEC9",
  Facebook: "#1877F2",
  YouTube: "#FF0000",
}

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* ─── Row 1: Stats + Visitor Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Today Stats Card */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Heutige Performance</h2>
              <p className="text-[12px] text-gray-400 dark:text-white/40">Zusammenfassung</p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-[11px] font-medium text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <Download className="h-3 w-3" />Export
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`h-4 w-4 ${s.iconColor}`} />
                </div>
                <div>
                  <p className="text-[18px] font-bold text-[#0F172A] dark:text-white leading-tight">{s.value}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/40 leading-tight">{s.label}</p>
                  <p className={`text-[10px] font-semibold leading-tight mt-0.5 ${s.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                    {s.change} ggü. gestern
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Insights Chart */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Besucher-Trends</h2>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6C5CE7]" />Besucher</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00CEC9]" />Neue Follower</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E84393]" />Engagement</span>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                <Line type="monotone" dataKey="besucher" stroke="#6C5CE7" strokeWidth={2.5} dot={{ r: 3, fill: "#6C5CE7" }} />
                <Line type="monotone" dataKey="neueFollower" stroke="#00CEC9" strokeWidth={2} dot={{ r: 3, fill: "#00CEC9" }} />
                <Line type="monotone" dataKey="engagement" stroke="#E84393" strokeWidth={2} dot={{ r: 3, fill: "#E84393" }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Revenue + Satisfaction + Target ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Reach */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Gesamt-Reichweite</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">Organisch vs. Bezahlt</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                <Bar dataKey="online" name="Organisch" fill="#6C5CE7" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="offline" name="Bezahlt" fill="#00CEC9" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#6C5CE7]" />Organisch</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00CEC9]" />Bezahlt</span>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Kundenzufriedenheit</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-2">Basierend auf Sentiment-Analyse</p>
          <div className="h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={satisfactionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {satisfactionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 text-[11px]">
            {satisfactionData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </div>

        {/* Target vs Reality */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Ziel vs. Realität</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-2">Monatliche KPI-Erreichung</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={targetData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar name="Ist" dataKey="ist" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Ziel" dataKey="ziel" stroke="#00CEC9" fill="#00CEC9" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-1 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-[#6C5CE7]" />Ist</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-[#00CEC9] border-dashed" />Ziel</span>
          </div>
        </div>
      </div>

      {/* ─── Row 3: Top Content + Platform + Engagement ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Top Content */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-4">Top Inhalte</h2>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-gray-400 dark:text-white/30 text-left">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium text-right">Engagement</th>
                <th className="pb-3 font-medium text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topContent.map((c) => (
                <tr key={c.rank} className="border-t border-gray-50 dark:border-white/[0.04]">
                  <td className="py-3 font-semibold text-gray-400 dark:text-white/30">{String(c.rank).padStart(2, "0")}</td>
                  <td className="py-3">
                    <p className="font-medium text-[#0F172A] dark:text-white truncate max-w-[160px]">{c.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">{c.platform}</p>
                  </td>
                  <td className="py-3 text-right font-semibold text-[#0F172A] dark:text-white">{c.engagement}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-0.5">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(Math.abs(c.trend) * 2, 100)}%`,
                            backgroundColor: c.trend >= 0 ? "#00CEC9" : "#F97316",
                          }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ml-1 ${c.trend >= 0 ? "text-[#00CEC9]" : "text-[#F97316]"}`}>
                        {c.trend > 0 ? "+" : ""}{c.trend}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Follower by Platform */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Follower nach Plattform</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-3">Verteilung über alle Kanäle</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" outerRadius={65} dataKey="value" strokeWidth={2} stroke="#fff">
                  {platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {platformData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-gray-600 dark:text-white/60">{p.name}</span>
                </span>
                <span className="font-semibold text-[#0F172A] dark:text-white">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Engagement-Übersicht</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">Likes, Kommentare & Shares</p>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementBarData} barGap={1}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                <Bar dataKey="likes" name="Likes" fill="#6C5CE7" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="kommentare" name="Kommentare" fill="#00CEC9" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="shares" name="Shares" fill="#F97316" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#6C5CE7]" />Likes</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00CEC9]" />Kommentare</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#F97316]" />Shares</span>
          </div>
        </div>
      </div>
    </div>
  )
}
