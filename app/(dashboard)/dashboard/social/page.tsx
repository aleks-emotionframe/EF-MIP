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
  chartData: { name: string; followers: number; engagement: number; reach: number }[]
  topPosts: { title: string; likes: number; comments: number; shares: number }[]
}> = {
  instagram: {
    kpis: [
      { label: "Followers", value: "15,200", change: 3.1, icon: Users },
      { label: "Engagement Rate", value: "4.8%", change: 0.6, icon: Heart },
      { label: "Reichweite", value: "42,300", change: 12.3, icon: Eye },
      { label: "Story Views", value: "2,340", change: 7.2, icon: Eye },
    ],
    chartData: [
      { name: "Mo", followers: 14980, engagement: 4.2, reach: 38000 },
      { name: "Di", followers: 15010, engagement: 4.5, reach: 41000 },
      { name: "Mi", followers: 15040, engagement: 5.1, reach: 45000 },
      { name: "Do", followers: 15080, engagement: 4.8, reach: 43000 },
      { name: "Fr", followers: 15120, engagement: 5.3, reach: 48000 },
      { name: "Sa", followers: 15160, engagement: 4.6, reach: 40000 },
      { name: "So", followers: 15200, engagement: 4.9, reach: 42000 },
    ],
    topPosts: [
      { title: "Behind-the-Scenes Reel", likes: 1240, comments: 89, shares: 56 },
      { title: "Produkt-Launch Karussell", likes: 980, comments: 124, shares: 45 },
      { title: "Team Story Highlight", likes: 756, comments: 43, shares: 28 },
    ],
  },
  facebook: {
    kpis: [
      { label: "Page Fans", value: "8,450", change: 1.2, icon: Users },
      { label: "Engagement", value: "2.1%", change: -0.3, icon: Heart },
      { label: "Post Reach", value: "12,300", change: -5.4, icon: Eye },
      { label: "Video Views", value: "5,600", change: 8.1, icon: PlayCircle },
    ],
    chartData: [
      { name: "Mo", followers: 8380, engagement: 2.3, reach: 13000 },
      { name: "Di", followers: 8390, engagement: 2.0, reach: 11500 },
      { name: "Mi", followers: 8400, engagement: 2.4, reach: 14000 },
      { name: "Do", followers: 8420, engagement: 1.8, reach: 10800 },
      { name: "Fr", followers: 8430, engagement: 2.2, reach: 12500 },
      { name: "Sa", followers: 8440, engagement: 1.9, reach: 11000 },
      { name: "So", followers: 8450, engagement: 2.1, reach: 12300 },
    ],
    topPosts: [
      { title: "Event-Ankündigung", likes: 320, comments: 45, shares: 78 },
      { title: "Blog-Teaser Video", likes: 280, comments: 32, shares: 56 },
    ],
  },
  youtube: {
    kpis: [
      { label: "Subscribers", value: "5,840", change: 18.5, icon: Users },
      { label: "Views (30d)", value: "45,200", change: 22.1, icon: Eye },
      { label: "Watch Time", value: "1,240h", change: 15.3, icon: PlayCircle },
      { label: "Avg. CTR", value: "6.2%", change: 1.1, icon: TrendingUp },
    ],
    chartData: [
      { name: "Mo", followers: 5680, engagement: 5.8, reach: 6200 },
      { name: "Di", followers: 5710, engagement: 6.1, reach: 7100 },
      { name: "Mi", followers: 5740, engagement: 6.5, reach: 7800 },
      { name: "Do", followers: 5770, engagement: 5.9, reach: 6500 },
      { name: "Fr", followers: 5790, engagement: 6.3, reach: 7200 },
      { name: "Sa", followers: 5820, engagement: 6.0, reach: 6800 },
      { name: "So", followers: 5840, engagement: 6.2, reach: 7000 },
    ],
    topPosts: [
      { title: "Tutorial: Social Media Strategie 2026", likes: 890, comments: 156, shares: 234 },
      { title: "Shorts: 3 Quick Tips", likes: 2400, comments: 89, shares: 567 },
    ],
  },
  linkedin: {
    kpis: [
      { label: "Followers", value: "3,120", change: 6.8, icon: Users },
      { label: "Impressions", value: "18,900", change: 11.2, icon: Eye },
      { label: "Clicks", value: "1,240", change: 8.5, icon: TrendingUp },
      { label: "Engagement", value: "3.4%", change: 0.4, icon: Heart },
    ],
    chartData: [
      { name: "Mo", followers: 3040, engagement: 3.1, reach: 2600 },
      { name: "Di", followers: 3055, engagement: 3.5, reach: 2900 },
      { name: "Mi", followers: 3070, engagement: 3.2, reach: 2700 },
      { name: "Do", followers: 3085, engagement: 3.8, reach: 3100 },
      { name: "Fr", followers: 3095, engagement: 3.4, reach: 2800 },
      { name: "Sa", followers: 3105, engagement: 2.8, reach: 2200 },
      { name: "So", followers: 3120, engagement: 3.0, reach: 2400 },
    ],
    topPosts: [
      { title: "Thought Leadership: KI im Marketing", likes: 245, comments: 67, shares: 89 },
      { title: "Mitarbeiter-Spotlight", likes: 189, comments: 34, shares: 23 },
    ],
  },
  tiktok: {
    kpis: [
      { label: "Followers", value: "12,400", change: 28.3, icon: Users },
      { label: "Video Views", value: "234,000", change: 45.1, icon: Eye },
      { label: "Likes", value: "18,900", change: 32.4, icon: Heart },
      { label: "Shares", value: "3,400", change: 21.7, icon: Share2 },
    ],
    chartData: [
      { name: "Mo", followers: 11200, engagement: 8.2, reach: 32000 },
      { name: "Di", followers: 11500, engagement: 9.1, reach: 38000 },
      { name: "Mi", followers: 11700, engagement: 7.8, reach: 29000 },
      { name: "Do", followers: 11900, engagement: 10.2, reach: 42000 },
      { name: "Fr", followers: 12050, engagement: 8.9, reach: 35000 },
      { name: "Sa", followers: 12200, engagement: 9.5, reach: 40000 },
      { name: "So", followers: 12400, engagement: 8.7, reach: 34000 },
    ],
    topPosts: [
      { title: "Viraler Dance-Trend", likes: 8900, comments: 456, shares: 1200 },
      { title: "Day-in-the-life Vlog", likes: 5600, comments: 234, shares: 890 },
      { title: "Quick Tutorial", likes: 3200, comments: 178, shares: 560 },
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
        <h1 className="text-xl font-semibold text-gray-900">Social Media</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Performance deiner Plattformen im Überblick</p>
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
          <div key={kpi.label} className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${platform.bg} flex items-center justify-center`}>
                <kpi.icon className="h-4 w-4" style={{ color: platform.color }} />
              </div>
              <span className={`flex items-center gap-0.5 text-[11px] font-bold ${kpi.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {kpi.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change >= 0 ? "+" : ""}{kpi.change}%
              </span>
            </div>
            <p className="text-[18px] font-bold text-gray-900">{kpi.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Follower-Entwicklung</h3>
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
                <Area type="monotone" dataKey="followers" stroke={platform.color} strokeWidth={2.5} fill={`url(#grad-${active})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Reichweite pro Tag</h3>
          <p className="text-[11px] text-gray-400 mb-4">Letzte 7 Tage</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Bar dataKey="reach" fill={platform.color} radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Top Posts</h3>
        <div className="space-y-3">
          {data.topPosts.map((post, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-50 p-3.5 hover:bg-gray-50/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-400 shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 truncate">{post.title}</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-gray-400 shrink-0">
                <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes.toLocaleString("de-CH")}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.comments}</span>
                <span className="flex items-center gap-1"><Share2 className="h-3 w-3" />{post.shares}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
