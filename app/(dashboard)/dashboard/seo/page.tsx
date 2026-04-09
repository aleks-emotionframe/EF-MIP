"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Globe, CheckCircle2, AlertTriangle, XCircle,
  Loader2, ExternalLink, Clock, FileText, Image as ImageIcon,
  Link2, Share2, Code, Zap, ChevronDown, ChevronUp,
  BarChart3, ArrowRight,
} from "lucide-react"

interface SEOCheck {
  category: string
  name: string
  status: "pass" | "warn" | "fail"
  value: string
  recommendation: string
}

interface SEOResult {
  url: string
  analyzedAt: string
  loadTimeMs: number
  score: number
  checks: SEOCheck[]
  meta: {
    title: string | null
    titleLength: number
    description: string | null
    descriptionLength: number
    canonical: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    viewport: string | null
    language: string | null
  }
  headings: { tag: string; text: string }[]
  images: { src: string; alt: string | null; hasAlt: boolean }[]
  links: { internal: number; external: number }
  performance: { htmlSizeKb: number; loadTimeMs: number }
}

const STATUS_ICON = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
}
const STATUS_COLOR = {
  pass: "text-emerald-600",
  warn: "text-amber-500",
  fail: "text-red-500",
}
const STATUS_BG = {
  pass: "bg-emerald-50",
  warn: "bg-amber-50",
  fail: "bg-red-50",
}
const STATUS_LABEL = {
  pass: "Bestanden",
  warn: "Warnung",
  fail: "Fehler",
}

const CATEGORY_ICON: Record<string, any> = {
  Meta: FileText,
  Technik: Code,
  Performance: Zap,
  Inhalt: FileText,
  Social: Share2,
  Links: Link2,
}

export default function SEOPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SEOResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.")
    } finally {
      setLoading(false)
    }
  }

  const categories = result
    ? ["all", ...Array.from(new Set(result.checks.map((c) => c.category)))]
    : []
  const filteredChecks = result?.checks.filter(
    (c) => activeCategory === "all" || c.category === activeCategory
  ) ?? []

  const passCount = result?.checks.filter((c) => c.status === "pass").length ?? 0
  const warnCount = result?.checks.filter((c) => c.status === "warn").length ?? 0
  const failCount = result?.checks.filter((c) => c.status === "fail").length ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#6C5CE7]" />
          <h1 className="text-xl font-semibold text-gray-900">SEO-Analyse</h1>
        </div>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Analysiere jede Website live und erhalte konkrete Verbesserungsvorschläge.
        </p>
      </div>

      {/* URL Input */}
      <form onSubmit={handleAnalyze} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Website-URL eingeben (z.B. example.com)"
            className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-[14px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none transition-all"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading || !url.trim()}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] px-6 py-3.5 text-[14px] font-semibold text-white hover:shadow-lg hover:shadow-[#6C5CE7]/30 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
          {loading ? "Analysiere..." : "Analysieren"}
        </motion.button>
      </form>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score + Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Score Circle */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col items-center justify-center">
                <div className={`relative w-28 h-28 rounded-full flex items-center justify-center ${
                  result.score >= 80 ? "bg-emerald-50" : result.score >= 50 ? "bg-amber-50" : "bg-red-50"
                }`}>
                  <svg className="absolute inset-0 w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                    <motion.circle
                      cx="50" cy="50" r="44" fill="none"
                      stroke={result.score >= 80 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - result.score / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <span className={`text-3xl font-bold ${
                    result.score >= 80 ? "text-emerald-600" : result.score >= 50 ? "text-amber-600" : "text-red-600"
                  }`}>{result.score}</span>
                </div>
                <p className="text-[12px] text-gray-500 mt-3">SEO-Score</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{result.url}</p>
              </div>

              {/* Stats */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col justify-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[13px] text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Bestanden</span>
                    <span className="text-[14px] font-bold text-emerald-600">{passCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[13px] text-gray-600"><AlertTriangle className="h-4 w-4 text-amber-500" />Warnungen</span>
                    <span className="text-[14px] font-bold text-amber-600">{warnCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[13px] text-gray-600"><XCircle className="h-4 w-4 text-red-500" />Fehler</span>
                    <span className="text-[14px] font-bold text-red-600">{failCount}</span>
                  </div>
                </div>
              </div>

              {/* Meta Preview */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Google-Vorschau</p>
                <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
                  <p className="text-[14px] text-[#1a0dab] font-medium leading-tight truncate">
                    {result.meta.title || "Kein Titel gefunden"}
                  </p>
                  <p className="text-[12px] text-[#006621] mt-0.5 truncate">{result.url}</p>
                  <p className="text-[12px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {result.meta.description || "Keine Meta-Beschreibung gefunden."}
                  </p>
                </div>
                <div className="flex gap-4 mt-3 text-[11px] text-gray-400">
                  <span><Clock className="inline h-3 w-3 mr-1" />{result.loadTimeMs}ms Ladezeit</span>
                  <span><FileText className="inline h-3 w-3 mr-1" />{result.performance.htmlSizeKb} KB HTML</span>
                  <span><Link2 className="inline h-3 w-3 mr-1" />{result.links.internal + result.links.external} Links</span>
                  <span><ImageIcon className="inline h-3 w-3 mr-1" />{result.images.length} Bilder</span>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => {
                const count = cat === "all" ? result.checks.length : result.checks.filter((c) => c.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-[#6C5CE7] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat === "all" ? "Alle" : cat}
                    <span className={`text-[10px] ${activeCategory === cat ? "text-white/70" : "text-gray-400"}`}>{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Checks List */}
            <div className="space-y-2">
              {filteredChecks.map((check) => {
                const Icon = STATUS_ICON[check.status]
                const isExpanded = expandedCheck === `${check.category}-${check.name}`

                return (
                  <div
                    key={`${check.category}-${check.name}`}
                    className="rounded-xl border border-gray-100 bg-white overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedCheck(isExpanded ? null : `${check.category}-${check.name}`)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg ${STATUS_BG[check.status]} flex items-center justify-center shrink-0`}>
                        <Icon className={`h-4 w-4 ${STATUS_COLOR[check.status]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-gray-900">{check.name}</span>
                          <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{check.category}</span>
                        </div>
                        <p className="text-[12px] text-gray-500 mt-0.5 truncate">{check.value}</p>
                      </div>
                      <span className={`text-[11px] font-medium ${STATUS_COLOR[check.status]} shrink-0 hidden sm:block`}>
                        {STATUS_LABEL[check.status]}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0">
                            <div className={`rounded-lg p-3.5 ${STATUS_BG[check.status]}`}>
                              <div className="flex items-start gap-2">
                                <ArrowRight className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${STATUS_COLOR[check.status]}`} />
                                <p className="text-[13px] text-gray-700 leading-relaxed">{check.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Headings Structure */}
            {result.headings.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Überschriften-Struktur</h3>
                <div className="space-y-1.5">
                  {result.headings.map((h, i) => {
                    const indent = parseInt(h.tag[1]) - 1
                    return (
                      <div key={i} className="flex items-center gap-2" style={{ paddingLeft: indent * 20 }}>
                        <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 shrink-0 ${
                          h.tag === "h1" ? "bg-[#6C5CE7]/10 text-[#6C5CE7]" : "bg-gray-100 text-gray-500"
                        }`}>{h.tag}</span>
                        <span className="text-[12px] text-gray-700 truncate">{h.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Images without Alt */}
            {result.images.filter((i) => !i.hasAlt).length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3">
                  Bilder ohne Alt-Text ({result.images.filter((i) => !i.hasAlt).length})
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {result.images.filter((i) => !i.hasAlt).map((img, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] rounded-lg p-2 bg-red-50">
                      <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span className="text-gray-600 truncate font-mono text-[11px]">{img.src}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="text-center py-20">
          <Globe className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-[15px] font-semibold text-gray-400 mb-1">Gib eine URL ein</h2>
          <p className="text-[13px] text-gray-400 max-w-md mx-auto">
            Die SEO-Analyse prüft deine Website live und zeigt dir genau was gut ist und was verbessert werden muss. Alle Daten sind echt – keine Schätzungen.
          </p>
        </div>
      )}
    </div>
  )
}
