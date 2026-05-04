"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  SmilePlus, TrendingUp, ThumbsUp, Minus, ThumbsDown,
  Camera, MessageCircle, ArrowUpRight, ShieldCheck,
  Info, Hash,
} from "lucide-react"

/* ─── Colors ─── */
const POSITIVE = "#00CEC9"
const NEGATIVE = "#F97316"
const NEUTRAL  = "#94A3B8"
const PRIMARY  = "#6C5CE7"

/* ─── Time ranges ─── */
const TIME_RANGES = [
  { key: "7d",  label: "7 Tage" },
  { key: "30d", label: "30 Tage" },
  { key: "90d", label: "90 Tage" },
] as const

/* ─── Demo-Daten: Stimmungsverlauf (30 Tage) ─── */
const sentimentTimeline = Array.from({ length: 30 }, (_, i) => {
  const d   = new Date(2026, 2, 12 + i) // ab 12.03.2026
  const pos = 55 + Math.round(Math.sin(i / 4) * 12 + Math.random() * 6)
  const neg = 8  + Math.round(Math.cos(i / 3) * 4  + Math.random() * 3)
  const neu = 100 - pos - neg
  return {
    date: `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`,
    Positiv: pos,
    Neutral: Math.max(neu, 0),
    Negativ: neg,
  }
})

/* ─── Demo-Daten: Donut ─── */
const donutData = [
  { name: "Positiv",  value: 64, color: POSITIVE },
  { name: "Neutral",  value: 24, color: NEUTRAL  },
  { name: "Negativ",  value: 12, color: NEGATIVE },
]

/* ─── Demo-Daten: Kommentare ─── */
const comments = [
  { platform: "Instagram", author: "sarah_mktg", text: "Super Beitrag! Sehr inspirierend und professionell umgesetzt. 👏", sentiment: "Positiv" as const, time: "Vor 12 Min." },
  { platform: "Facebook",  author: "Marco Huber", text: "Die Preise sind leider etwas hoch im Vergleich zur Konkurrenz.", sentiment: "Negativ" as const, time: "Vor 28 Min." },
  { platform: "Instagram", author: "design.lover", text: "Genial! Kann ich das Preset haben?", sentiment: "Positiv" as const, time: "Vor 45 Min." },
  { platform: "LinkedIn",  author: "Claudia R.", text: "Interessanter Ansatz. Werde das im Team besprechen.", sentiment: "Neutral" as const, time: "Vor 1 Std." },
  { platform: "TikTok",    author: "vibes.ch", text: "Empfehlenswert! Nutze es seit 3 Monaten und bin begeistert.", sentiment: "Positiv" as const, time: "Vor 2 Std." },
  { platform: "Facebook",  author: "René Keller", text: "Die App lädt manchmal etwas langsam bei mir.", sentiment: "Negativ" as const, time: "Vor 3 Std." },
  { platform: "LinkedIn",  author: "Anna Baumann", text: "Danke für die Einladung zum Webinar.", sentiment: "Neutral" as const, time: "Vor 4 Std." },
  { platform: "Instagram", author: "kreativ.studio", text: "Absolute Empfehlung! Das beste Tool auf dem Markt.", sentiment: "Positiv" as const, time: "Vor 5 Std." },
]

/* ─── Demo-Daten: Keywords ─── */
const positiveKeywords = [
  { word: "super",           count: 142 },
  { word: "genial",          count: 98  },
  { word: "empfehlenswert",  count: 87  },
  { word: "professionell",   count: 76  },
  { word: "hilfreich",       count: 64  },
  { word: "innovativ",       count: 51  },
]
const negativeKeywords = [
  { word: "langsam",         count: 34  },
  { word: "teuer",           count: 28  },
  { word: "kompliziert",     count: 22  },
  { word: "fehler",          count: 18  },
  { word: "unübersichtlich", count: 14  },
  { word: "umständlich",     count: 9   },
]

/* ─── Sentiment badge helper ─── */
const sentimentConfig = {
  Positiv: { color: POSITIVE, bg: "bg-[#00CEC9]/10", text: "text-[#00CEC9]", border: "border-l-[#00CEC9]", icon: ThumbsUp  },
  Neutral: { color: NEUTRAL,  bg: "bg-[#94A3B8]/10", text: "text-[#94A3B8]", border: "border-l-[#94A3B8]", icon: Minus     },
  Negativ: { color: NEGATIVE, bg: "bg-[#F97316]/10", text: "text-[#F97316]", border: "border-l-[#F97316]", icon: ThumbsDown },
} as const

/* ─── Platform icon helper ─── */
function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "Instagram": return <Camera className="h-4 w-4 text-[#E1306C]" />
    case "TikTok":    return <Hash className="h-4 w-4 text-black" />
    case "LinkedIn":  return <MessageCircle className="h-4 w-4 text-[#0A66C2]" />
    default:          return <MessageCircle className="h-4 w-4 text-[#1877F2]" />
  }
}

/* ─── Circular progress ring component ─── */
function ScoreRing({ score }: { score: number }) {
  const size = 160
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (score / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={POSITIVE} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl">😊</span>
        <motion.span
          className="text-3xl font-extrabold text-[#0F172A] dark:text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {score}%
        </motion.span>
      </div>
    </div>
  )
}

/* ─── Custom recharts tooltip ─── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md bg-white border border-gray-200 shadow-lg px-4 py-3 text-[12px]">
      <p className="font-semibold text-[#0F172A] mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-gray-500">{p.dataKey}:</span>
          <span className="font-bold text-[#0F172A] dark:text-white">{p.value}%</span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function SentimentPage() {
  const [range, setRange] = useState<string>("30d")

  const statCards = [
    { label: "Positiv",  value: 64, color: POSITIVE, icon: ThumbsUp  },
    { label: "Neutral",  value: 24, color: NEUTRAL,  icon: Minus     },
    { label: "Negativ",  value: 12, color: NEGATIVE, icon: ThumbsDown },
  ]

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SmilePlus className="h-5 w-5 text-[#6C5CE7]" />
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Stimmungsanalyse</h1>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
            Automatische Auswertung aller Kommentare und Erwähnungen
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-gray-200 p-1">
          {TIME_RANGES.map((t) => (
            <button
              key={t.key}
              onClick={() => setRange(t.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                range === t.key
                  ? "bg-[#6C5CE7] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Demo-Hinweis ─── */}
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3 flex items-center gap-3">
        <Info className="h-4 w-4 text-blue-500 shrink-0" />
        <p className="text-[12px] text-blue-600">
          Demo-Daten – Die angezeigten Werte dienen zur Veranschaulichung und basieren nicht auf echten Plattformdaten.
        </p>
      </div>

      {/* ─── Hero: Overall Sentiment + 3 Stat Cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6 flex flex-col items-center justify-center text-center"
        >
          <ScoreRing score={78} />
          <p className="mt-3 text-[15px] font-bold text-[#0F172A] dark:text-white">Überwiegend positiv</p>
          <div className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +3% vs. Vormonat
          </div>
        </motion.div>

        {/* 3 Stat Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
                className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                    <Icon className="h-4.5 w-4.5" style={{ color: s.color }} />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                    {s.label}
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-[#0F172A] dark:text-white">{s.value}%</p>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 * (i + 1), ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ─── Stimmungsverlauf (Area Chart) + Donut ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Stimmungsverlauf</h3>
          <p className="text-[11px] text-gray-400 mb-4">Letzte 30 Tage – Verteilung in %</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentTimeline} stackOffset="expand">
                <defs>
                  <linearGradient id="gradPositiv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={POSITIVE} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={POSITIVE} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradNeutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={NEUTRAL} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={NEUTRAL} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradNegativ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={NEGATIVE} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={NEGATIVE} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} interval={4} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v: number) => `${Math.round(v * 100)}%`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Positiv" stackId="1" stroke={POSITIVE} strokeWidth={2} fill="url(#gradPositiv)" />
                <Area type="monotone" dataKey="Neutral" stackId="1" stroke={NEUTRAL} strokeWidth={2} fill="url(#gradNeutral)" />
                <Area type="monotone" dataKey="Negativ" stackId="1" stroke={NEGATIVE} strokeWidth={2} fill="url(#gradNegativ)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5 flex flex-col"
        >
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Verteilung</h3>
          <p className="text-[11px] text-gray-400 mb-2">Gesamtanteil nach Stimmung</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    dataKey="value" strokeWidth={0}
                    animationBegin={300} animationDuration={800}
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2.5 mt-2">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[12px] text-gray-600">{d.name}</span>
                </div>
                <span className="text-[12px] font-bold text-[#0F172A] dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Letzte Kommentare ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5"
      >
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Letzte Kommentare</h3>
        <p className="text-[11px] text-gray-400 mb-4">Aktuelle Erwähnungen aus allen Plattformen</p>
        <div className="space-y-2">
          {comments.map((c, i) => {
            const cfg = sentimentConfig[c.sentiment]
            const SentIcon = cfg.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.04 * i }}
                className={`flex items-start gap-3 rounded-md border-l-4 bg-gray-50/50 p-3.5 ${cfg.border}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <PlatformIcon platform={c.platform} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[12px] font-semibold text-[#0F172A] dark:text-white">{c.author}</span>
                    <span className="text-[10px] text-gray-400">· {c.platform}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{c.text}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                    <SentIcon className="h-3 w-3" />
                    {c.sentiment}
                  </span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ─── Top Keywords ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Positive Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#00CEC9]/10 flex items-center justify-center">
              <ThumbsUp className="h-4 w-4 text-[#00CEC9]" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-white">Positive Begriffe</h3>
              <p className="text-[10px] text-gray-400">Häufigste positive Wörter</p>
            </div>
          </div>
          <div className="space-y-3">
            {positiveKeywords.map((kw) => {
              const maxCount = positiveKeywords[0].count
              return (
                <div key={kw.word} className="flex items-center gap-3">
                  <span className="text-[12px] font-medium text-[#0F172A] w-28 truncate">{kw.word}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#00CEC9]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(kw.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 w-8 text-right">{kw.count}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Negative Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
              <ThumbsDown className="h-4 w-4 text-[#F97316]" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-white">Negative Begriffe</h3>
              <p className="text-[10px] text-gray-400">Häufigste negative Wörter</p>
            </div>
          </div>
          <div className="space-y-3">
            {negativeKeywords.map((kw) => {
              const maxCount = negativeKeywords[0].count
              return (
                <div key={kw.word} className="flex items-center gap-3">
                  <span className="text-[12px] font-medium text-[#0F172A] w-28 truncate">{kw.word}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#F97316]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(kw.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.55 }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 w-8 text-right">{kw.count}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ─── Frühwarnung / Alert Box ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-emerald-800">Shitstorm-Radar: Alles im grünen Bereich</h3>
          <p className="text-[12px] text-emerald-700/80 mt-1 leading-relaxed">
            Keine negativen Trends erkannt. Die Stimmung ist stabil positiv mit leicht steigender Tendenz.
            Der Anteil negativer Kommentare liegt unter dem Durchschnitt der letzten 90 Tage.
            Letzte Prüfung: Heute, 14:32 Uhr.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
