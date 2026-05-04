"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ZAxis, Cell,
} from "recharts"
import {
  Search, Sparkles, ArrowRight, ExternalLink,
  TrendingUp, BarChart3, Target, FileText,
  ChevronUp, ChevronDown, Loader2, Zap,
  AlertCircle, Eye, Award, BookOpen,
} from "lucide-react"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard"
type SortKey = "keyword" | "volume" | "difficulty" | "yourPos" | "compPos" | "potential"

interface KeywordGap {
  keyword: string
  volume: number
  difficulty: Difficulty
  yourPosition: number | null
  competitorPosition: number
  potential: number // 0-100
}

interface ContentSuggestion {
  title: string
  wordCount: number
  topics: string[]
  keyword: string
}

// ─── Blurred preview data (shown behind overlay) ────────────────
const PREVIEW_KEYWORDS: KeywordGap[] = [
  { keyword: "social media strategie 2026", volume: 4800, difficulty: "medium", yourPosition: null, competitorPosition: 3, potential: 92 },
  { keyword: "instagram algorithmus tipps", volume: 6200, difficulty: "easy", yourPosition: null, competitorPosition: 2, potential: 88 },
  { keyword: "content kalender vorlage", volume: 3400, difficulty: "easy", yourPosition: 18, competitorPosition: 1, potential: 85 },
  { keyword: "tiktok marketing schweiz", volume: 2100, difficulty: "medium", yourPosition: null, competitorPosition: 5, potential: 81 },
  { keyword: "engagement rate verbessern", volume: 5100, difficulty: "hard", yourPosition: 12, competitorPosition: 4, potential: 78 },
  { keyword: "social media reporting tool", volume: 3800, difficulty: "hard", yourPosition: 15, competitorPosition: 2, potential: 75 },
]

const PREVIEW_SUGGESTIONS: ContentSuggestion[] = [
  { title: "Social Media Strategie 2026: Der ultimative Leitfaden", wordCount: 2500, topics: ["Plattform-Auswahl", "Content-Planung", "KPI-Definition"], keyword: "social media strategie 2026" },
  { title: "Instagram Algorithmus 2026: So erreichst du mehr Menschen", wordCount: 1800, topics: ["Feed-Ranking", "Reels-Boost", "Hashtag-Strategie"], keyword: "instagram algorithmus tipps" },
]

const PREVIEW_SCATTER = [
  { keyword: "social media strategie", volume: 4800, difficulty: 45, potential: 92 },
  { keyword: "instagram algorithmus", volume: 6200, difficulty: 30, potential: 88 },
  { keyword: "content kalender", volume: 3400, difficulty: 25, potential: 85 },
  { keyword: "tiktok marketing", volume: 2100, difficulty: 50, potential: 81 },
  { keyword: "engagement rate", volume: 5100, difficulty: 72, potential: 78 },
  { keyword: "reporting tool", volume: 3800, difficulty: 68, potential: 75 },
  { keyword: "hashtag analyse", volume: 2900, difficulty: 35, potential: 70 },
  { keyword: "social media audit", volume: 1600, difficulty: 40, potential: 65 },
]

// ─── Difficulty helpers ─────────────────────────────────────────
const DIFF_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy: { label: "Einfach", color: "text-emerald-700", bg: "bg-emerald-100" },
  medium: { label: "Mittel", color: "text-amber-700", bg: "bg-amber-100" },
  hard: { label: "Schwer", color: "text-red-700", bg: "bg-red-100" },
}

const SCATTER_COLORS = ["#00CEC9", "#6C5CE7", "#F97316", "#E84393", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

// ─── Feature bullets for CTA card ───────────────────────────────
const FEATURES = [
  { icon: Target, text: "Keyword-Chancen", desc: "Finde Keywords, bei denen deine Konkurrenz rankt, du aber nicht" },
  { icon: BarChart3, text: "Wettbewerber-Vergleich", desc: "Vergleiche deine Rankings direkt mit Konkurrenten" },
  { icon: Sparkles, text: "Content-Vorschläge", desc: "KI-generierte Artikel-Ideen basierend auf echten Suchdaten" },
  { icon: TrendingUp, text: "Suchvolumen-Analyse", desc: "Echte Suchvolumen und Schwierigkeitsgrade pro Keyword" },
]

// ─── Component ──────────────────────────────────────────────────
export default function ContentLueckenPage() {
  // In production, this would be fetched from API checking Integration status
  const [isConnected] = useState(false)
  const [competitorUrl, setCompetitorUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [keywords, setKeywords] = useState<KeywordGap[]>([])
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([])
  const [sortKey, setSortKey] = useState<SortKey>("potential")
  const [sortAsc, setSortAsc] = useState(false)

  // ── Sort logic ──
  const sortedKeywords = useMemo(() => {
    const data = analyzed ? keywords : PREVIEW_KEYWORDS
    return [...data].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case "keyword": cmp = a.keyword.localeCompare(b.keyword); break
        case "volume": cmp = a.volume - b.volume; break
        case "difficulty": {
          const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 }
          cmp = order[a.difficulty] - order[b.difficulty]; break
        }
        case "yourPos": cmp = (a.yourPosition ?? 999) - (b.yourPosition ?? 999); break
        case "compPos": cmp = a.competitorPosition - b.competitorPosition; break
        case "potential": cmp = a.potential - b.potential; break
      }
      return sortAsc ? cmp : -cmp
    })
  }, [keywords, sortKey, sortAsc, analyzed])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 text-gray-300" />
    return sortAsc
      ? <ChevronUp className="h-3 w-3 text-gray-500" />
      : <ChevronDown className="h-3 w-3 text-gray-500" />
  }

  // ── Analyze handler (will call real API when SC is connected) ──
  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!competitorUrl.trim() || !isConnected) return
    setAnalyzing(true)
    try {
      // TODO: Call /api/content-gaps with competitor URL
      // const res = await fetch("/api/content-gaps", { method: "POST", body: JSON.stringify({ url: competitorUrl }) })
      // const data = await res.json()
      // setKeywords(data.keywords)
      // setSuggestions(data.suggestions)
      setAnalyzed(true)
    } catch {
      // Error handling
    } finally {
      setAnalyzing(false)
    }
  }

  // ── Stats from current data ──
  const statsData = analyzed ? keywords : PREVIEW_KEYWORDS
  const totalGaps = statsData.length
  const totalVolume = statsData.reduce((s, k) => s + k.volume, 0)
  const avgDiff = statsData.length > 0
    ? Math.round(statsData.reduce((s, k) => s + ({ easy: 25, medium: 50, hard: 80 }[k.difficulty]), 0) / statsData.length)
    : 0
  const suggestionCount = analyzed ? suggestions.length : PREVIEW_SUGGESTIONS.length

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-[#00CEC9]" />
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Content-Lücken-Analyse</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#6C5CE7]/10 to-[#E84393]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#6C5CE7]">
            <Sparkles className="h-3 w-3" />
            KI-powered
          </span>
        </div>
        <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
          Finde Keyword-Chancen und erhalte KI-gestützte Content-Vorschläge.
        </p>
      </div>

      {/* ── Not Connected State ───────────────────────────────── */}
      {!isConnected && (
        <div className="relative">
          {/* Blurred preview behind */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
            <div className="filter blur-[6px] opacity-40 pointer-events-none p-6 space-y-4">
              {/* Fake stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Gefundene Lücken", val: "47" },
                  { label: "Suchvolumen", val: "128'400" },
                  { label: "Schwierigkeit", val: "42%" },
                  { label: "Vorschläge", val: "12" },
                ].map((s) => (
                  <div key={s.label} className="rounded-md bg-white dark:bg-[#1E293B] p-4">
                    <p className="text-[11px] text-gray-400">{s.label}</p>
                    <p className="text-[20px] font-bold text-gray-900 mt-1">{s.val}</p>
                  </div>
                ))}
              </div>
              {/* Fake table rows */}
              <div className="rounded-md bg-white dark:bg-[#1E293B] p-4 space-y-3">
                {PREVIEW_KEYWORDS.map((kw) => (
                  <div key={kw.keyword} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-[13px] font-medium text-gray-700 flex-1">{kw.keyword}</span>
                    <span className="text-[12px] text-gray-500">{kw.volume.toLocaleString("de-CH")}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${DIFF_CONFIG[kw.difficulty].bg} ${DIFF_CONFIG[kw.difficulty].color}`}>
                      {DIFF_CONFIG[kw.difficulty].label}
                    </span>
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00CEC9] rounded-full" style={{ width: `${kw.potential}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connection CTA overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-sm shadow-lg p-8 md:p-12"
          >
            <div className="max-w-2xl mx-auto text-center">
              {/* Animated search icon */}
              <div className="relative mx-auto w-20 h-20 mb-6">
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00CEC9]/20 to-[#6C5CE7]/20"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative w-20 h-20 rounded-lg bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -5, 0], y: [0, -2, 0, -1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Search className="h-9 w-9 text-white" />
                  </motion.div>
                </div>
              </div>

              <h2 className="text-[22px] font-bold text-[#0F172A] dark:text-white mb-3">
                Verbinde Google Search Console
              </h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
                Finde Keywords für die deine Konkurrenz rankt, du aber nicht &ndash; und erhalte KI-gestützte Content-Vorschläge basierend auf echten Suchdaten.
              </p>

              {/* Feature bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left max-w-xl mx-auto">
                {FEATURES.map((f, idx) => (
                  <motion.div
                    key={f.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-start gap-3 rounded-md bg-gray-50 p-3.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00CEC9]/10 flex items-center justify-center shrink-0">
                      <f.icon className="h-4 w-4 text-[#00CEC9]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{f.text}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Link href="/dashboard/settings/integrations">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-8 py-4 text-[15px] font-semibold text-white shadow-lg shadow-[#00CEC9]/25 hover:shadow-xl hover:shadow-[#00CEC9]/30 transition-shadow"
                >
                  <ExternalLink className="h-4 w-4" />
                  Search Console verbinden
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>

              <p className="text-[11px] text-gray-400 mt-4">
                Nur Lesezugriff &ndash; deine Daten bleiben sicher.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Connected State ───────────────────────────────────── */}
      {isConnected && (
        <div className="space-y-6">
          {/* URL Input */}
          <form onSubmit={handleAnalyze} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="Konkurrenz-Website eingeben (z.B. hootsuite.com)"
                className="w-full rounded-md border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-[14px] focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none transition-all"
              />
            </div>
            <motion.button
              type="submit"
              disabled={analyzing || !competitorUrl.trim()}
              whileTap={{ scale: 0.97 }}
              className="rounded-md bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-6 py-3.5 text-[14px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              {analyzing ? "Analysiere..." : "Analysieren"}
            </motion.button>
          </form>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Gefundene Lücken", value: totalGaps, icon: Target, color: "#00CEC9", suffix: "" },
              { label: "Geschätztes Suchvolumen", value: totalVolume.toLocaleString("de-CH"), icon: Eye, color: "#6C5CE7", suffix: "/Mt." },
              { label: "Schwierigkeit \u00D8", value: avgDiff, icon: AlertCircle, color: "#F97316", suffix: "%" },
              { label: "Content-Vorschläge", value: suggestionCount, icon: FileText, color: "#E84393", suffix: "" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400">{stat.label}</p>
                <p className="text-[22px] font-bold text-[#0F172A] dark:text-white mt-0.5">
                  {stat.value}<span className="text-[13px] font-normal text-gray-400 ml-0.5">{stat.suffix}</span>
                </p>
              </motion.div>
            ))}
          </div>

          {/* Keyword-Chancen Table */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-[#00CEC9]" />
                Keyword-Chancen
              </h3>
              <span className="text-[11px] text-gray-400">
                {sortedKeywords.length} Keywords
              </span>
            </div>

            {/* Table header */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-t border-gray-100">
                    {([
                      { key: "keyword" as SortKey, label: "Keyword", width: "w-auto" },
                      { key: "volume" as SortKey, label: "Suchvolumen/Monat", width: "w-32" },
                      { key: "difficulty" as SortKey, label: "Schwierigkeit", width: "w-28" },
                      { key: "yourPos" as SortKey, label: "Deine Position", width: "w-28" },
                      { key: "compPos" as SortKey, label: "Konkurrenz Pos.", width: "w-28" },
                      { key: "potential" as SortKey, label: "Potential-Score", width: "w-36" },
                    ]).map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={`${col.width} text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 transition-colors select-none`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          <SortIcon col={col.key} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {sortedKeywords.map((kw, i) => (
                      <motion.tr
                        key={kw.keyword}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Keyword */}
                        <td className="px-4 py-3">
                          <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{kw.keyword}</span>
                        </td>
                        {/* Volume */}
                        <td className="px-4 py-3">
                          <span className="text-[13px] font-bold text-[#0F172A] dark:text-white">{kw.volume.toLocaleString("de-CH")}</span>
                        </td>
                        {/* Difficulty */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full ${DIFF_CONFIG[kw.difficulty].bg} ${DIFF_CONFIG[kw.difficulty].color}`}>
                            {DIFF_CONFIG[kw.difficulty].label}
                          </span>
                        </td>
                        {/* Your Position */}
                        <td className="px-4 py-3">
                          {kw.yourPosition !== null ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700 text-[13px] font-bold">
                              {kw.yourPosition}
                            </span>
                          ) : (
                            <span className="text-[13px] text-gray-300 font-medium">&ndash;</span>
                          )}
                        </td>
                        {/* Competitor Position */}
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-[13px] font-bold">
                            {kw.competitorPosition}
                          </span>
                        </td>
                        {/* Potential Score */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: kw.potential >= 80
                                    ? "linear-gradient(90deg, #00CEC9, #6C5CE7)"
                                    : kw.potential >= 60
                                    ? "linear-gradient(90deg, #F97316, #FBBF24)"
                                    : "#E5E7EB",
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${kw.potential}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                              />
                            </div>
                            <span className="text-[12px] font-bold text-[#0F172A] dark:text-white w-8 text-right">{kw.potential}</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {sortedKeywords.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-[13px] text-gray-400">Gib eine Konkurrenz-URL ein, um Keyword-Lücken zu finden.</p>
              </div>
            )}
          </div>

          {/* KI Content-Vorschläge */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden relative">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6C5CE7] via-[#E84393] to-[#00CEC9] p-[1px] pointer-events-none">
              <div className="w-full h-full rounded-lg bg-white dark:bg-[#1E293B]" />
            </div>

            <div className="relative z-10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#E84393] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">KI Content-Vorschläge</h3>
                <span className="text-[10px] text-[#6C5CE7] font-semibold bg-[#6C5CE7]/10 rounded-full px-2 py-0.5">
                  Claude AI
                </span>
              </div>

              {analyzed && suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-md border border-gray-100 p-4 hover:border-[#6C5CE7]/20 hover:bg-[#6C5CE7]/[0.02] transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold text-[#0F172A] dark:text-white mb-1">{s.title}</p>
                          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                            <span className="flex items-center gap-1"><FileText className="h-3 w-3" />~{s.wordCount.toLocaleString("de-CH")} Wörter</span>
                            <span className="flex items-center gap-1"><Search className="h-3 w-3" />{s.keyword}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {s.topics.map((t) => (
                              <span key={t} className="text-[10px] font-medium bg-gray-100 text-gray-600 rounded-md px-2 py-0.5">{t}</span>
                            ))}
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="shrink-0 rounded-lg bg-[#6C5CE7] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#5643CC] transition-colors flex items-center gap-1.5"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Artikel erstellen
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-md bg-[#6C5CE7]/10 flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-5 w-5 text-[#6C5CE7]" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A] dark:text-white mb-1">
                    Bereit für KI-Vorschläge
                  </p>
                  <p className="text-[12px] text-gray-400 max-w-sm mx-auto">
                    Gib eine Konkurrenz-URL ein und starte die Analyse. Die KI erstellt dann massgeschneiderte Content-Vorschläge basierend auf deinen echten Search Console Daten.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Keyword-Verteilung Chart */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5">
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-[#F97316]" />
              Keyword-Verteilung
            </h3>
            <p className="text-[12px] text-gray-400 mb-4">Suchvolumen vs. Schwierigkeit &ndash; Grosse Punkte = hohes Potential</p>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="difficulty"
                    name="Schwierigkeit"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    label={{ value: "Schwierigkeit (%)", position: "insideBottom", offset: -10, style: { fontSize: 11, fill: "#94a3b8" } }}
                  />
                  <YAxis
                    type="number"
                    dataKey="volume"
                    name="Suchvolumen"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    label={{ value: "Suchvolumen", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11, fill: "#94a3b8" } }}
                  />
                  <ZAxis type="number" dataKey="potential" range={[80, 500]} name="Potential" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="rounded-lg bg-white shadow-lg border border-gray-100 p-3 text-[12px]">
                          <p className="font-semibold text-[#0F172A] mb-1">{d.keyword}</p>
                          <p className="text-gray-500">Suchvolumen: <span className="font-bold text-[#0F172A] dark:text-white">{d.volume.toLocaleString("de-CH")}</span></p>
                          <p className="text-gray-500">Schwierigkeit: <span className="font-bold text-[#0F172A] dark:text-white">{d.difficulty}%</span></p>
                          <p className="text-gray-500">Potential: <span className="font-bold text-[#00CEC9]">{d.potential}</span></p>
                        </div>
                      )
                    }}
                  />
                  <Scatter data={PREVIEW_SCATTER} fill="#00CEC9">
                    {PREVIEW_SCATTER.map((_, i) => (
                      <Cell key={i} fill={SCATTER_COLORS[i % SCATTER_COLORS.length]} fillOpacity={0.7} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
