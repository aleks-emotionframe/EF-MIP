"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Sparkles, ArrowUpRight, ExternalLink, Lock,
  TrendingUp, BarChart3, FileText, Loader2, Info, Target,
  ChevronDown, ChevronUp,
} from "lucide-react"

/* ─── Types ─── */
interface KeywordGap {
  keyword: string
  volume: number
  difficulty: "einfach" | "mittel" | "schwer"
  yourPos: number | null
  compPos: number
  potential: number
}

interface ContentSuggestion {
  title: string
  keyword: string
  wordCount: number
  topics: string[]
}

/* ─── Data ─── */
const DEMO_KEYWORDS: KeywordGap[] = [
  { keyword: "social media strategie 2026", volume: 2400, difficulty: "mittel", yourPos: null, compPos: 3, potential: 88 },
  { keyword: "instagram marketing tipps", volume: 4800, difficulty: "einfach", yourPos: null, compPos: 5, potential: 92 },
  { keyword: "content kalender erstellen", volume: 1900, difficulty: "einfach", yourPos: null, compPos: 2, potential: 85 },
  { keyword: "tiktok für unternehmen", volume: 3200, difficulty: "mittel", yourPos: 42, compPos: 7, potential: 78 },
  { keyword: "linkedin algorithmus", volume: 1600, difficulty: "schwer", yourPos: null, compPos: 4, potential: 72 },
  { keyword: "engagement rate berechnen", volume: 2100, difficulty: "einfach", yourPos: 38, compPos: 1, potential: 82 },
  { keyword: "hashtag strategie instagram", volume: 1400, difficulty: "mittel", yourPos: null, compPos: 8, potential: 68 },
  { keyword: "social media reporting", volume: 1100, difficulty: "einfach", yourPos: 25, compPos: 6, potential: 75 },
  { keyword: "influencer marketing kosten", volume: 2800, difficulty: "schwer", yourPos: null, compPos: 3, potential: 65 },
  { keyword: "facebook ads optimierung", volume: 3600, difficulty: "schwer", yourPos: null, compPos: 2, potential: 60 },
]

const DEMO_SUGGESTIONS: ContentSuggestion[] = [
  { title: "Die ultimative Social-Media-Strategie für 2026", keyword: "social media strategie 2026", wordCount: 2500, topics: ["Plattform-Trends", "KI-Tools", "Content-Planung", "ROI-Messung"] },
  { title: "Instagram Marketing: 15 bewährte Tipps für mehr Reichweite", keyword: "instagram marketing tipps", wordCount: 1800, topics: ["Reels-Strategie", "Hashtag-Optimierung", "Story-Formate", "Follower-Wachstum"] },
  { title: "Content-Kalender erstellen: Schritt-für-Schritt Anleitung", keyword: "content kalender erstellen", wordCount: 1500, topics: ["Vorlagen", "Tools", "Frequenz", "Themenplanung"] },
]

const difficultyConfig = {
  einfach: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", dark: "dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20" },
  mittel: { color: "text-amber-600 bg-amber-50 border-amber-200", dark: "dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20" },
  schwer: { color: "text-red-600 bg-red-50 border-red-200", dark: "dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20" },
}

type SortKey = "volume" | "potential" | "difficulty"

export default function ContentLueckenPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [compUrl, setCompUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>("potential")
  const [sortAsc, setSortAsc] = useState(false)
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(0)

  useEffect(() => {
    fetch("/api/integrations/status?platform=SEARCH_CONSOLE")
      .then((r) => r.json())
      .then((d) => setIsConnected(d.connected === true))
      .catch(() => setIsConnected(false))
      .finally(() => setLoading(false))
  }, [])

  function handleAnalyze() {
    if (!compUrl.trim()) return
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const sorted = [...DEMO_KEYWORDS].sort((a, b) => {
    const mul = sortAsc ? 1 : -1
    if (sortBy === "volume") return (a.volume - b.volume) * mul
    if (sortBy === "potential") return (a.potential - b.potential) * mul
    const d = { einfach: 1, mittel: 2, schwer: 3 }
    return (d[a.difficulty] - d[b.difficulty]) * mul
  })

  function toggleSort(key: SortKey) {
    if (sortBy === key) setSortAsc(!sortAsc)
    else { setSortBy(key); setSortAsc(false) }
  }

  const SortIcon = ({ k }: { k: SortKey }) => sortBy === k
    ? sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
    : <ChevronDown className="h-3 w-3 opacity-30" />

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00CEC9]/[0.06] flex items-center justify-center">
            <Search className="h-5 w-5 text-[#00CEC9]" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0F172A] dark:text-white">Content-Lücken-Analyse</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#00CEC9]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00CEC9]/[0.06] flex items-center justify-center">
            <Search className="h-5 w-5 text-[#00CEC9]" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#0F172A] dark:text-white">Content-Lücken-Analyse</h1>
            <p className="text-[12px] text-gray-500 dark:text-white/40">Finde Keywords die dir fehlen</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-[#6C5CE7]/[0.08] px-3 py-1.5 text-[11px] font-semibold text-[#6C5CE7]">
          <Sparkles className="h-3 w-3" />KI-powered
        </span>
      </div>

      {/* Not connected */}
      {!isConnected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm">
          {/* Blurred preview */}
          <div className="absolute inset-0 z-0 blur-[6px] opacity-30 pointer-events-none p-8">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-white/5" />)}
            </div>
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-white/5" />)}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8 py-16">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00CEC9]/20 to-[#6C5CE7]/20 flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-[#00CEC9]" />
            </motion.div>
            <h2 className="text-[22px] font-bold text-[#0F172A] dark:text-white mb-2">Verbinde Google Search Console</h2>
            <p className="text-[14px] text-gray-500 dark:text-white/50 max-w-md mb-8">
              Finde Keywords für die deine Konkurrenz rankt, du aber nicht &ndash; und erhalte KI-gestützte Content-Vorschläge
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg w-full">
              {[
                { icon: Target, label: "Keyword-Chancen", desc: "Ungenutzte Keywords finden" },
                { icon: BarChart3, label: "Wettbewerber-Vergleich", desc: "Deine vs. Konkurrenz-Rankings" },
                { icon: FileText, label: "Content-Vorschläge", desc: "KI-generierte Artikel-Ideen" },
                { icon: TrendingUp, label: "Suchvolumen-Analyse", desc: "Monatliche Suchanfragen" },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-3 rounded-xl bg-[#F4F7FE] dark:bg-white/[0.04] p-4 text-left">
                  <f.icon className="h-5 w-5 text-[#00CEC9] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{f.label}</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="/dashboard/settings/integrations"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-6 py-3 text-[14px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 transition-all">
              <Lock className="h-4 w-4" />Search Console verbinden
            </a>
          </div>
        </motion.div>
      )}

      {/* Connected */}
      {isConnected && (
        <>
          {/* Competitor URL input */}
          <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-4">Konkurrenz-Website analysieren</h2>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={compUrl}
                  onChange={(e) => setCompUrl(e.target.value)}
                  placeholder="z.B. konkurrenz-agentur.ch"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 pl-11 pr-4 py-3 text-[14px] focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none transition-all"
                />
              </div>
              <button onClick={handleAnalyze} disabled={analyzing || !compUrl.trim()}
                className="rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-6 py-3 text-[14px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 disabled:opacity-50 transition-all flex items-center gap-2">
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Analysieren
              </button>
            </div>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 rounded-xl bg-[#00CEC9]/[0.06] border border-[#00CEC9]/20 p-4">
            <Info className="h-4 w-4 text-[#00CEC9] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#0F172A] dark:text-white/70">
              Die Analyse basiert auf deinen echten Search Console Daten. Gib eine Konkurrenz-URL ein, um Keyword-Lücken zu finden.
              {showResults && " Die angezeigten Daten sind Demo-Daten zur Veranschaulichung."}
            </p>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Gefundene Lücken", value: "10", icon: Target, color: "#00CEC9" },
                    { label: "Ges. Suchvolumen", value: "24.9K", icon: TrendingUp, color: "#6C5CE7" },
                    { label: "Schwierigkeit Ø", value: "Mittel", icon: BarChart3, color: "#F97316" },
                    { label: "Content-Vorschläge", value: "3", icon: Sparkles, color: "#E84393" },
                  ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl bg-white dark:bg-[#1E293B] p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}10` }}>
                          <s.icon className="h-4 w-4" style={{ color: s.color }} />
                        </div>
                      </div>
                      <p className="text-[24px] font-extrabold text-[#0F172A] dark:text-white">{s.value}</p>
                      <p className="text-[12px] text-gray-500 dark:text-white/40 mt-1">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Keywords table */}
                <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
                    <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Keyword-Chancen</h2>
                    <p className="text-[12px] text-gray-500 dark:text-white/40 mt-0.5">Keywords, für die deine Konkurrenz rankt</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-white/[0.06] text-left">
                          <th className="px-6 py-3 font-semibold text-gray-500 dark:text-white/40">Keyword</th>
                          <th className="px-4 py-3 font-semibold text-gray-500 dark:text-white/40 cursor-pointer select-none" onClick={() => toggleSort("volume")}>
                            <span className="flex items-center gap-1">Suchvolumen <SortIcon k="volume" /></span>
                          </th>
                          <th className="px-4 py-3 font-semibold text-gray-500 dark:text-white/40 cursor-pointer select-none" onClick={() => toggleSort("difficulty")}>
                            <span className="flex items-center gap-1">Schwierigkeit <SortIcon k="difficulty" /></span>
                          </th>
                          <th className="px-4 py-3 font-semibold text-gray-500 dark:text-white/40">Deine Pos.</th>
                          <th className="px-4 py-3 font-semibold text-gray-500 dark:text-white/40">Konkurrenz</th>
                          <th className="px-4 py-3 font-semibold text-gray-500 dark:text-white/40 cursor-pointer select-none" onClick={() => toggleSort("potential")}>
                            <span className="flex items-center gap-1">Potential <SortIcon k="potential" /></span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((kw, i) => (
                          <motion.tr key={kw.keyword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-[#F4F7FE] dark:hover:bg-white/[0.03] transition-colors">
                            <td className="px-6 py-3 font-medium text-[#0F172A] dark:text-white">{kw.keyword}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-white/60">{kw.volume.toLocaleString()}/Mo</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${difficultyConfig[kw.difficulty].color} ${difficultyConfig[kw.difficulty].dark}`}>
                                {kw.difficulty}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-white/40">{kw.yourPos ? `#${kw.yourPos}` : "—"}</td>
                            <td className="px-4 py-3 font-medium text-[#0F172A] dark:text-white">#{kw.compPos}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden max-w-[80px]">
                                  <div className="h-full rounded-full bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7]" style={{ width: `${kw.potential}%` }} />
                                </div>
                                <span className="text-[12px] font-semibold text-[#0F172A] dark:text-white">{kw.potential}%</span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* KI Content Suggestions */}
                <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00CEC9]/20 to-[#6C5CE7]/20 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-[#6C5CE7]" />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">KI Content-Vorschläge</h2>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">Basierend auf den gefundenen Keyword-Lücken</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {DEMO_SUGGESTIONS.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
                        className="rounded-xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
                        <button onClick={() => setExpandedSuggestion(expandedSuggestion === i ? null : i)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F4F7FE] dark:hover:bg-white/[0.03] transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center text-[11px] font-bold text-white">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{s.title}</p>
                              <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">Keyword: {s.keyword}</p>
                            </div>
                          </div>
                          {expandedSuggestion === i ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                        </button>
                        <AnimatePresence>
                          {expandedSuggestion === i && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden">
                              <div className="px-5 pb-4 pt-1 border-t border-gray-100 dark:border-white/[0.06]">
                                <div className="flex items-center gap-4 mb-3 text-[12px] text-gray-500 dark:text-white/40">
                                  <span>~{s.wordCount} Wörter</span>
                                  <span>•</span>
                                  <span>{s.topics.length} Themenbereiche</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {s.topics.map((t) => (
                                    <span key={t} className="rounded-full bg-[#00CEC9]/[0.08] border border-[#00CEC9]/20 px-3 py-1 text-[11px] font-medium text-[#00CEC9]">{t}</span>
                                  ))}
                                </div>
                                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-4 py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 transition-all">
                                  <FileText className="h-3.5 w-3.5" />Artikel erstellen
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
