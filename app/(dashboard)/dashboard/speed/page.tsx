"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gauge, Search, Loader2, ChevronDown, ChevronUp,
  Zap, Eye, ShieldCheck, FileSearch,
  AlertTriangle, Info, Globe,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
interface MetricValue {
  value: number
  display: string
  score: number
}

interface PageSpeedResult {
  url: string
  fetchTime: string
  scores: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  }
  coreWebVitals: {
    lcp: MetricValue
    fid: MetricValue
    cls: MetricValue
    fcp: MetricValue
    ttfb: MetricValue
    si: MetricValue
    tbt: MetricValue
  }
  opportunities: {
    title: string
    description: string
    savings: string
    score: number
  }[]
  diagnostics: {
    title: string
    description: string
    score: number
  }[]
}

// ─── Helpers ────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 90) return "#10b981"
  if (score >= 50) return "#f59e0b"
  return "#ef4444"
}

function scoreTextClass(score: number) {
  if (score >= 90) return "text-emerald-600"
  if (score >= 50) return "text-amber-600"
  return "text-red-600"
}

function scoreBgClass(score: number) {
  if (score >= 90) return "bg-emerald-50"
  if (score >= 50) return "bg-amber-50"
  return "bg-red-50"
}

function dotColor(score: number) {
  if (score >= 0.9) return "bg-emerald-500"
  if (score >= 0.5) return "bg-amber-500"
  return "bg-red-500"
}

function scoreLabel(score: number) {
  if (score >= 90) return "Gut"
  if (score >= 50) return "Verbesserungsbedarf"
  return "Schlecht"
}

const CIRCUMFERENCE = 2 * Math.PI * 44

const SCORE_CATEGORIES = [
  { key: "performance" as const, label: "Performance", icon: Zap },
  { key: "accessibility" as const, label: "Barrierefreiheit", icon: Eye },
  { key: "bestPractices" as const, label: "Best Practices", icon: ShieldCheck },
  { key: "seo" as const, label: "SEO", icon: FileSearch },
]

const METRIC_INFO: Record<string, { label: string; description: string }> = {
  lcp: {
    label: "Largest Contentful Paint",
    description: "Misst die Ladezeit des grössten sichtbaren Elements. Ziel: unter 2.5 Sekunden.",
  },
  fid: {
    label: "Max Potential FID",
    description: "Maximale potenzielle Verzögerung bei der ersten Nutzerinteraktion. Ziel: unter 100ms.",
  },
  cls: {
    label: "Cumulative Layout Shift",
    description: "Misst die visuelle Stabilität der Seite. Ziel: unter 0.1.",
  },
  fcp: {
    label: "First Contentful Paint",
    description: "Zeit bis zum ersten sichtbaren Inhalt auf dem Bildschirm. Ziel: unter 1.8 Sekunden.",
  },
  ttfb: {
    label: "Time to First Byte",
    description: "Antwortzeit des Servers. Ziel: unter 800ms.",
  },
  si: {
    label: "Speed Index",
    description: "Wie schnell der sichtbare Bereich vollständig geladen wird. Ziel: unter 3.4 Sekunden.",
  },
  tbt: {
    label: "Total Blocking Time",
    description: "Gesamtzeit, in der der Hauptthread blockiert ist. Ziel: unter 200ms.",
  },
}

// ─── Score Ring Component ───────────────────────────────────────
function ScoreRing({
  score,
  label,
  icon: Icon,
  delay = 0,
}: {
  score: number
  label: string
  icon: React.ComponentType<{ className?: string }>
  delay?: number
}) {
  const color = scoreColor(score)

  return (
    <motion.div
      className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-6 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="absolute inset-0 w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="44"
            fill="none" stroke="#e5e7eb" strokeWidth="6"
          />
          <motion.circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - score / 100) }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
          />
        </svg>
        <motion.span
          className={`text-3xl font-bold ${scoreTextClass(score)}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.5 }}
        >
          {score}
        </motion.span>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-[12px] font-medium text-gray-500">{label}</span>
      </div>
      <span
        className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${scoreBgClass(score)} ${scoreTextClass(score)}`}
      >
        {scoreLabel(score)}
      </span>
    </motion.div>
  )
}

// ─── Page ───────────────────────────────────────────────────────
export default function SpeedPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PageSpeedResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedOpp, setExpandedOpp] = useState<number | null>(null)

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)
    setExpandedOpp(null)

    try {
      // Prepend https:// if no protocol
      let targetUrl = trimmed
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`
      }

      const res = await fetch(`/api/pagespeed?url=${encodeURIComponent(targetUrl)}`)
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || `Fehler: HTTP ${res.status}`)
      } else {
        setResult(data)
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-[#00CEC9]" />
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
            Website Speed Monitor
          </h1>
        </div>
        <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
          Echte Google PageSpeed Insights Daten -- analysiere die Performance jeder Website.
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
            className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-[14px] focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none transition-all"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading || !url.trim()}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#00A8A3] px-6 py-3.5 text-[14px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Gauge className="h-4 w-4" />
          )}
          {loading ? "Analysiere..." : "Analysieren"}
        </motion.button>
      </form>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-12 flex flex-col items-center justify-center"
          >
            <Loader2 className="h-10 w-10 text-[#00CEC9] animate-spin mb-4" />
            <p className="text-[14px] font-medium text-gray-700">
              Seite wird analysiert...
            </p>
            <p className="text-[12px] text-gray-400 mt-1">
              Google PageSpeed Insights wird abgefragt. Das kann bis zu 30 Sekunden dauern.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-medium text-red-800">Analyse fehlgeschlagen</p>
            <p className="text-[12px] text-red-600 mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!result && !loading && !error && (
        <div className="text-center py-20">
          <Gauge className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-[15px] font-semibold text-gray-400 mb-1">
            Gib eine URL ein um zu starten
          </h2>
          <p className="text-[13px] text-gray-400 max-w-md mx-auto">
            100% echte Daten von Google PageSpeed Insights -- keine Schätzungen.
          </p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analyzed URL Info */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 flex items-center gap-3">
              <Globe className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-[13px] text-gray-600 truncate flex-1 font-mono">
                {result.url}
              </span>
              <span className="text-[11px] text-gray-400 shrink-0">
                {result.fetchTime
                  ? new Date(result.fetchTime).toLocaleString("de-CH")
                  : ""}
              </span>
            </div>

            {/* Score Rings */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SCORE_CATEGORIES.map((cat, i) => (
                <ScoreRing
                  key={cat.key}
                  score={result.scores[cat.key]}
                  label={cat.label}
                  icon={cat.icon}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* Core Web Vitals */}
            <div>
              <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-3">
                Core Web Vitals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.keys(METRIC_INFO) as (keyof typeof METRIC_INFO)[]).map(
                  (key, i) => {
                    const metric =
                      result.coreWebVitals[
                        key as keyof typeof result.coreWebVitals
                      ]
                    if (!metric) return null
                    const info = METRIC_INFO[key]

                    return (
                      <motion.div
                        key={key}
                        className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-5"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                              {key.toUpperCase()}
                            </p>
                            <p className="text-[12px] text-gray-500 mt-0.5">
                              {info.label}
                            </p>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full shrink-0 mt-1 ${dotColor(
                              metric.score
                            )}`}
                          />
                        </div>
                        <p className="text-[22px] font-bold text-[#0F172A] dark:text-white mt-2">
                          {metric.display || `${metric.value}`}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                          {info.description}
                        </p>
                      </motion.div>
                    )
                  }
                )}
              </div>
            </div>

            {/* Opportunities */}
            {result.opportunities.length > 0 && (
              <div>
                <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-3">
                  Optimierungs-Vorschläge
                </h2>
                <div className="space-y-2">
                  {result.opportunities.map((opp, i) => {
                    const isExpanded = expandedOpp === i
                    const severityColor =
                      opp.score >= 0.5
                        ? "bg-amber-500"
                        : "bg-red-500"

                    return (
                      <div
                        key={i}
                        className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedOpp(isExpanded ? null : i)
                          }
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${severityColor}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">
                              {opp.title}
                            </p>
                          </div>
                          {opp.savings && (
                            <span className="text-[11px] font-medium text-[#F97316] bg-orange-50 rounded-full px-2.5 py-1 shrink-0">
                              {opp.savings} Einsparung
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                          )}
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
                              <div className="px-4 pb-4">
                                <div className="rounded-lg bg-gray-50 p-3.5">
                                  <p className="text-[12px] text-gray-600 leading-relaxed">
                                    {opp.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Diagnostics */}
            {result.diagnostics.length > 0 && (
              <div>
                <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-3">
                  Diagnose
                </h2>
                <div className="space-y-2">
                  {result.diagnostics.map((diag, i) => (
                    <motion.div
                      key={i}
                      className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <Info className="h-4 w-4 text-[#6C5CE7] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">
                            {diag.title}
                          </p>
                          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                            {diag.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Source Note */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-[11px] text-emerald-700">
                Alle Daten stammen direkt von der Google PageSpeed Insights API -- 100% echte Messwerte, keine Schätzungen.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
