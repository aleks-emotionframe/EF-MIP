"use client"

import { useState } from "react"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import {
  Camera, ThumbsUp, PlayCircle, Briefcase, Music2,
  Users, Heart, Eye, MessageSquare, Share2, TrendingUp,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react"

type PlatformKey = "instagram" | "facebook" | "youtube" | "linkedin" | "tiktok"

const PLATFORMS: { key: PlatformKey; label: string; icon: any; color: string; bg: string }[] = [
  { key: "instagram", label: "Instagram", icon: Camera, color: "#E1306C", bg: "bg-pink-50" },
  { key: "facebook", label: "Facebook", icon: ThumbsUp, color: "#1877F2", bg: "bg-blue-50" },
  { key: "youtube", label: "YouTube", icon: PlayCircle, color: "#FF0000", bg: "bg-red-50" },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase, color: "#0A66C2", bg: "bg-sky-50" },
  { key: "tiktok", label: "TikTok", icon: Music2, color: "#000000", bg: "bg-gray-50" },
]

const PLATFORM_DATA: Record<PlatformKey, {
  kpis: { label: string; value: string; change: number; icon: any }[]
  chartData: { name: string; Follower: number; Engagement: number; Reichweite: number }[]
  topPosts: { title: string; likes: number; kommentare: number; geteilt: number }[]
}> = {
  instagram: {
    kpis: [
      { label: "Follower", value: "15,200", change: 3.1, icon: Users },
      { label: "Engagement-Rate", value: "4.8%", change: 0.6, icon: Heart },
      { label: "Reichweite", value: "42,300", change: 12.3, icon: Eye },
      { label: "Story-Aufrufe", value: "2,340", change: 7.2, icon: Eye },
    ],
    chartData: [
      { name: "Mo", Follower: 14980, Engagement: 4.2, Reichweite: 38000 },
      { name: "Di", Follower: 15010, Engagement: 4.5, Reichweite: 41000 },
      { name: "Mi", Follower: 15040, Engagement: 5.1, Reichweite: 45000 },
      { name: "Do", Follower: 15080, Engagement: 4.8, Reichweite: 43000 },
      { name: "Fr", Follower: 15120, Engagement: 5.3, Reichweite: 48000 },
      { name: "Sa", Follower: 15160, Engagement: 4.6, Reichweite: 40000 },
      { name: "So", Follower: 15200, Engagement: 4.9, Reichweite: 42000 },
    ],
    topPosts: [
      { title: "Hinter-den-Kulissen Reel", likes: 1240, kommentare: 89, geteilt: 56 },
      { title: "Produkt-Launch Karussell", likes: 980, kommentare: 124, geteilt: 45 },
      { title: "Team-Story Highlight", likes: 756, kommentare: 43, geteilt: 28 },
    ],
  },
  facebook: {
    kpis: [
      { label: "Seiten-Fans", value: "8,450", change: 1.2, icon: Users },
      { label: "Engagement", value: "2.1%", change: -0.3, icon: Heart },
      { label: "Beitrags-Reichweite", value: "12,300", change: -5.4, icon: Eye },
      { label: "Video-Aufrufe", value: "5,600", change: 8.1, icon: PlayCircle },
    ],
    chartData: [
      { name: "Mo", Follower: 8380, Engagement: 2.3, Reichweite: 13000 },
      { name: "Di", Follower: 8390, Engagement: 2.0, Reichweite: 11500 },
      { name: "Mi", Follower: 8400, Engagement: 2.4, Reichweite: 14000 },
      { name: "Do", Follower: 8420, Engagement: 1.8, Reichweite: 10800 },
      { name: "Fr", Follower: 8430, Engagement: 2.2, Reichweite: 12500 },
      { name: "Sa", Follower: 8440, Engagement: 1.9, Reichweite: 11000 },
      { name: "So", Follower: 8450, Engagement: 2.1, Reichweite: 12300 },
    ],
    topPosts: [
      { title: "Event-Ankündigung", likes: 320, kommentare: 45, geteilt: 78 },
      { title: "Blog-Teaser-Video", likes: 280, kommentare: 32, geteilt: 56 },
    ],
  },
  youtube: {
    kpis: [
      { label: "Follower", value: "5,840", change: 18.5, icon: Users },
      { label: "Aufrufe (30T)", value: "45,200", change: 22.1, icon: Eye },
      { label: "Wiedergabezeit", value: "1,240h", change: 15.3, icon: PlayCircle },
      { label: "Avg. CTR", value: "6.2%", change: 1.1, icon: TrendingUp },
    ],
    chartData: [
      { name: "Mo", Follower: 5680, Engagement: 5.8, Reichweite: 6200 },
      { name: "Di", Follower: 5710, Engagement: 6.1, Reichweite: 7100 },
      { name: "Mi", Follower: 5740, Engagement: 6.5, Reichweite: 7800 },
      { name: "Do", Follower: 5770, Engagement: 5.9, Reichweite: 6500 },
      { name: "Fr", Follower: 5790, Engagement: 6.3, Reichweite: 7200 },
      { name: "Sa", Follower: 5820, Engagement: 6.0, Reichweite: 6800 },
      { name: "So", Follower: 5840, Engagement: 6.2, Reichweite: 7000 },
    ],
    topPosts: [
      { title: "Tutorial: Social-Media-Strategie 2026", likes: 890, kommentare: 156, geteilt: 234 },
      { title: "Shorts: 3 schnelle Tipps", likes: 2400, kommentare: 89, geteilt: 567 },
    ],
  },
  linkedin: {
    kpis: [
      { label: "Follower", value: "3,120", change: 6.8, icon: Users },
      { label: "Impressionen", value: "18,900", change: 11.2, icon: Eye },
      { label: "Klicks", value: "1,240", change: 8.5, icon: TrendingUp },
      { label: "Engagement", value: "3.4%", change: 0.4, icon: Heart },
    ],
    chartData: [
      { name: "Mo", Follower: 3040, Engagement: 3.1, Reichweite: 2600 },
      { name: "Di", Follower: 3055, Engagement: 3.5, Reichweite: 2900 },
      { name: "Mi", Follower: 3070, Engagement: 3.2, Reichweite: 2700 },
      { name: "Do", Follower: 3085, Engagement: 3.8, Reichweite: 3100 },
      { name: "Fr", Follower: 3095, Engagement: 3.4, Reichweite: 2800 },
      { name: "Sa", Follower: 3105, Engagement: 2.8, Reichweite: 2200 },
      { name: "So", Follower: 3120, Engagement: 3.0, Reichweite: 2400 },
    ],
    topPosts: [
      { title: "Expertenmeinung: KI im Marketing", likes: 245, kommentare: 67, geteilt: 89 },
      { title: "Mitarbeiter-Vorstellung", likes: 189, kommentare: 34, geteilt: 23 },
    ],
  },
  tiktok: {
    kpis: [
      { label: "Follower", value: "12,400", change: 28.3, icon: Users },
      { label: "Video-Aufrufe", value: "234,000", change: 45.1, icon: Eye },
      { label: "Likes", value: "18,900", change: 32.4, icon: Heart },
      { label: "Geteilt", value: "3,400", change: 21.7, icon: Share2 },
    ],
    chartData: [
      { name: "Mo", Follower: 11200, Engagement: 8.2, Reichweite: 32000 },
      { name: "Di", Follower: 11500, Engagement: 9.1, Reichweite: 38000 },
      { name: "Mi", Follower: 11700, Engagement: 7.8, Reichweite: 29000 },
      { name: "Do", Follower: 11900, Engagement: 10.2, Reichweite: 42000 },
      { name: "Fr", Follower: 12050, Engagement: 8.9, Reichweite: 35000 },
      { name: "Sa", Follower: 12200, Engagement: 9.5, Reichweite: 40000 },
      { name: "So", Follower: 12400, Engagement: 8.7, Reichweite: 34000 },
    ],
    topPosts: [
      { title: "Viraler Tanz-Trend", likes: 8900, kommentare: 456, geteilt: 1200 },
      { title: "Ein-Tag-im-Leben Vlog", likes: 5600, kommentare: 234, geteilt: 890 },
      { title: "Schnelles Tutorial", likes: 3200, kommentare: 178, geteilt: 560 },
    ],
  },
}

export default function SocialPage() {
  const [active, setActive] = useState<PlatformKey>("instagram")
  const platform = PLATFORMS.find((p) => p.key === active)!
  const data = PLATFORM_DATA[active]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Social Media</h1>
        <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">Leistung deiner Plattformen im Überblick</p>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-medium whitespace-nowrap transition-all ${
              active === p.key
                ? "text-white shadow-md"
                : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
            }`}
            style={active === p.key ? { backgroundColor: p.color, boxShadow: `0 4px 14px ${p.color}30` } : {}}
          >
            <p.icon className="h-4 w-4" />
            {p.label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${platform.bg} flex items-center justify-center`}>
                <kpi.icon className="h-4 w-4" style={{ color: platform.color }} />
              </div>
              <span className={`flex items-center gap-0.5 text-[11px] font-bold ${kpi.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {kpi.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change >= 0 ? "+" : ""}{kpi.change}%
              </span>
            </div>
            <p className="text-[22px] font-extrabold text-[#0F172A] dark:text-white">{kpi.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white shadow-sm p-5">
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Follower-Entwicklung</h3>
          <p className="text-[11px] text-gray-400 mb-4">Letzte 7 Tage</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id={`grad-${active}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={platform.color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={platform.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} domain={["dataMin - 50", "dataMax + 50"]} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Area type="monotone" dataKey="Follower" stroke={platform.color} strokeWidth={2.5} fill={`url(#grad-${active})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm p-5">
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Tägliche Reichweite</h3>
          <p className="text-[11px] text-gray-400 mb-4">Letzte 7 Tage</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Bar dataKey="Reichweite" fill={platform.color} radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top-Beiträge */}
      <div className="rounded-2xl bg-white shadow-sm p-5">
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-4">Top-Beiträge</h3>
        <div className="space-y-3">
          {data.topPosts.map((post, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-50 p-3.5 hover:bg-gray-50/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-400 shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white truncate">{post.title}</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-gray-400 shrink-0">
                <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes.toLocaleString("de-CH")}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.kommentare}</span>
                <span className="flex items-center gap-1"><Share2 className="h-3 w-3" />{post.geteilt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
