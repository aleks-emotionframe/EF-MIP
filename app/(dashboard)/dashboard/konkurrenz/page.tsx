"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts"
import {
  Target, Plus, X, Users, Heart, Eye, TrendingUp,
  ArrowUpRight, ArrowDownRight, Minus, Trash2,
  Camera, ThumbsUp, PlayCircle, Briefcase, Music2,
} from "lucide-react"

interface Competitor {
  id: string
  name: string
  website: string
  platforms: { platform: string; handle: string; follower: number; engagement: number; postsPerWeek: number }[]
  totalFollower: number
  avgEngagement: number
  strength: string
  weakness: string
}

const DEMO_COMPETITORS: Competitor[] = [
  {
    id: "c1", name: "SocialBee", website: "socialbee.io",
    platforms: [
      { platform: "Instagram", handle: "@socialbee", follower: 45200, engagement: 3.2, postsPerWeek: 7 },
      { platform: "LinkedIn", handle: "SocialBee", follower: 28400, engagement: 4.1, postsPerWeek: 5 },
      { platform: "TikTok", handle: "@socialbee", follower: 12800, engagement: 6.8, postsPerWeek: 4 },
    ],
    totalFollower: 86400, avgEngagement: 4.7,
    strength: "Starke Präsenz auf LinkedIn mit Thought-Leadership-Content",
    weakness: "Geringe TikTok-Aktivität, wenig Video-Content",
  },
  {
    id: "c2", name: "Hootsuite", website: "hootsuite.com",
    platforms: [
      { platform: "Instagram", handle: "@hootsuite", follower: 182000, engagement: 1.8, postsPerWeek: 10 },
      { platform: "YouTube", handle: "Hootsuite", follower: 95000, engagement: 2.5, postsPerWeek: 3 },
      { platform: "LinkedIn", handle: "Hootsuite", follower: 520000, engagement: 2.1, postsPerWeek: 8 },
      { platform: "TikTok", handle: "@hootsuite", follower: 67000, engagement: 4.2, postsPerWeek: 5 },
    ],
    totalFollower: 864000, avgEngagement: 2.7,
    strength: "Enorme Reichweite, starke Markenbekanntheit",
    weakness: "Niedrige Engagement-Rate durch zu breiten Content-Mix",
  },
  {
    id: "c3", name: "Later", website: "later.com",
    platforms: [
      { platform: "Instagram", handle: "@latermedia", follower: 620000, engagement: 2.9, postsPerWeek: 8 },
      { platform: "TikTok", handle: "@latermedia", follower: 234000, engagement: 7.1, postsPerWeek: 6 },
    ],
    totalFollower: 854000, avgEngagement: 5.0,
    strength: "Extrem starkes TikTok-Engagement, virale Kurzvideos",
    weakness: "Kaum LinkedIn-Präsenz, verpasst B2B-Zielgruppe",
  },
]

const YOUR_DATA = {
  name: "EmotionFrame",
  totalFollower: 48230,
  avgEngagement: 4.8,
  platforms: [
    { platform: "Instagram", follower: 15200, engagement: 4.8 },
    { platform: "LinkedIn", follower: 3120, engagement: 3.4 },
    { platform: "TikTok", follower: 12400, engagement: 8.7 },
    { platform: "YouTube", follower: 5840, engagement: 6.2 },
    { platform: "Facebook", follower: 8450, engagement: 2.1 },
  ],
}

const PLATFORM_ICON: Record<string, any> = {
  Instagram: Camera, Facebook: ThumbsUp, YouTube: PlayCircle, LinkedIn: Briefcase, TikTok: Music2,
}
const PLATFORM_COLOR: Record<string, string> = {
  Instagram: "#E1306C", Facebook: "#1877F2", YouTube: "#FF0000", LinkedIn: "#0A66C2", TikTok: "#000",
}

export default function KonkurrenzPage() {
  const [competitors, setCompetitors] = useState(DEMO_COMPETITORS)
  const [selectedId, setSelectedId] = useState<string | null>("c1")
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState("")
  const [newWebsite, setNewWebsite] = useState("")

  const selected = competitors.find((c) => c.id === selectedId)

  // Comparison chart data
  const comparisonData = [
    { name: "EmotionFrame", Follower: YOUR_DATA.totalFollower / 1000, Engagement: YOUR_DATA.avgEngagement, fill: "#6C5CE7" },
    ...competitors.map((c) => ({ name: c.name, Follower: c.totalFollower / 1000, Engagement: c.avgEngagement, fill: "#00CEC9" })),
  ]

  // Radar data for selected competitor
  const radarData = selected ? [
    { metric: "Follower", du: Math.min(YOUR_DATA.totalFollower / 10000, 10), konkurrent: Math.min(selected.totalFollower / 10000, 10) },
    { metric: "Engagement", du: YOUR_DATA.avgEngagement, konkurrent: selected.avgEngagement },
    { metric: "Plattformen", du: YOUR_DATA.platforms.length * 2, konkurrent: selected.platforms.length * 2 },
    { metric: "Reichweite", du: 6, konkurrent: selected.totalFollower > YOUR_DATA.totalFollower ? 8 : 5 },
    { metric: "Content", du: 7, konkurrent: selected.platforms.reduce((a, p) => a + p.postsPerWeek, 0) / 2 },
  ] : []

  function handleAdd() {
    if (!newName) return
    setCompetitors((prev) => [...prev, {
      id: `c-${Date.now()}`, name: newName, website: newWebsite,
      platforms: [{ platform: "Instagram", handle: `@${newName.toLowerCase().replace(/\s/g, "")}`, follower: 0, engagement: 0, postsPerWeek: 0 }],
      totalFollower: 0, avgEngagement: 0, strength: "Noch nicht analysiert", weakness: "Noch nicht analysiert",
    }])
    setNewName(""); setNewWebsite(""); setShowAdd(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#00CEC9]" />
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Konkurrenz-Analyse</h1>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">Vergleiche deine Performance mit Wettbewerbern.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-4 py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 transition-all">
          <Plus className="h-3.5 w-3.5" />Wettbewerber hinzufügen
        </button>
      </div>

      {/* Competitor Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {competitors.map((c) => (
          <div key={c.id} className="relative group/comp">
            <button onClick={() => setSelectedId(c.id)}
              className={`rounded-xl px-4 py-2.5 text-[12px] font-medium whitespace-nowrap transition-all ${selectedId === c.id ? "bg-[#00CEC9] text-white shadow-md shadow-[#00CEC9]/25" : "bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`}>
              {c.name}
            </button>
            <button onClick={() => { setCompetitors((prev) => prev.filter((x) => x.id !== c.id)); if (selectedId === c.id) setSelectedId(null) }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white items-center justify-center text-[10px] hidden group-hover/comp:flex"><X className="h-2.5 w-2.5" /></button>
          </div>
        ))}
      </div>

      {/* Comparison Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart: Follower */}
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-5">
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Follower-Vergleich</h3>
          <p className="text-[11px] text-gray-400 mb-4">in Tausend</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6b7280" }} width={100} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="Follower" radius={[0, 6, 6, 0]}>
                  {comparisonData.map((entry, i) => (
                    <motion.rect key={i} fill={i === 0 ? "#6C5CE7" : "#00CEC9"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        {selected && (
          <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-5">
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Du vs. {selected.name}</h3>
            <p className="text-[11px] text-gray-400 mb-4">Stärken-Vergleich</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Du" dataKey="du" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name={selected.name} dataKey="konkurrent" stroke="#00CEC9" fill="#00CEC9" fillOpacity={0.1} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#6C5CE7] rounded" />Du</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#00CEC9] rounded" />{selected.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Competitor Detail */}
      {selected && (
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">{selected.name}</h3>
              <p className="text-[12px] text-gray-400">{selected.website}</p>
            </div>
            <div className="flex gap-3">
              <div className="text-right">
                <p className="text-[22px] font-extrabold text-[#0F172A] dark:text-white">{(selected.totalFollower / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-gray-400">Follower</p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-[#6C5CE7]">{selected.avgEngagement}%</p>
                <p className="text-[10px] text-gray-400">Engagement</p>
              </div>
            </div>
          </div>

          {/* Platform breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selected.platforms.map((p) => {
              const Icon = PLATFORM_ICON[p.platform] ?? Users
              const color = PLATFORM_COLOR[p.platform] ?? "#6b7280"
              const yourPlatform = YOUR_DATA.platforms.find((yp) => yp.platform === p.platform)
              const followerDiff = yourPlatform ? ((p.follower - yourPlatform.follower) / yourPlatform.follower * 100) : 0

              return (
                <div key={p.platform} className="rounded-xl border border-gray-100 dark:border-white/[0.06] p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" style={{ color }} />
                    <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{p.platform}</span>
                    <span className="text-[10px] text-gray-400 ml-auto">{p.handle}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">{(p.follower / 1000).toFixed(1)}k</p>
                      <p className="text-[9px] text-gray-400">Follower</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">{p.engagement}%</p>
                      <p className="text-[9px] text-gray-400">Engagement</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">{p.postsPerWeek}</p>
                      <p className="text-[9px] text-gray-400">Posts/Woche</p>
                    </div>
                  </div>
                  {yourPlatform && (
                    <div className={`mt-2 rounded-lg px-2 py-1 text-[10px] font-medium text-center ${followerDiff > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {followerDiff > 0 ? `${followerDiff.toFixed(0)}% mehr Follower als du` : `Du hast ${Math.abs(followerDiff).toFixed(0)}% mehr Follower`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">Stärke</p>
              <p className="text-[13px] text-emerald-800 leading-relaxed">{selected.strength}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">Schwäche</p>
              <p className="text-[13px] text-amber-800 leading-relaxed">{selected.weakness}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-2xl">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4">Wettbewerber hinzufügen</h2>
              <div className="space-y-3">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Firmenname" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] focus:border-[#00CEC9] focus:outline-none" />
                <input value={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} placeholder="Website (z.B. competitor.com)" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] focus:border-[#00CEC9] focus:outline-none" />
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50">Abbrechen</button>
                <button onClick={handleAdd} disabled={!newName} className="flex-1 rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] py-2.5 text-[13px] font-semibold text-white hover:bg-[#00B4A3] disabled:opacity-50">Hinzufügen</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
