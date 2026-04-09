"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  LineChart,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Eye,
  Sparkles,
  Clock,
  Loader2,
  Brain,
  BookOpen,
  Target,
  Zap,
} from "lucide-react"

type InsightType = "anomaly" | "trend" | "recommendation" | "forecast"
type Priority = "critical" | "high" | "medium" | "low"
type FilterTab = "all" | InsightType

interface Insight {
  id: string
  type: InsightType
  priority: Priority
  title: string
  description: string
  confidence: number
  platform?: string
  metric_name?: string
  created_at: string
  actions: string[]
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "anomaly", label: "Anomalien" },
  { key: "trend", label: "Trends" },
  { key: "recommendation", label: "Empfehlungen" },
  { key: "forecast", label: "Vorhersagen" },
]

const TYPE_CONFIG: Record<InsightType, { icon: any; color: string; bg: string; label: string }> = {
  anomaly: { icon: AlertTriangle, color: "#EF4444", bg: "bg-red-50", label: "Anomalie" },
  trend: { icon: TrendingUp, color: "#6C5CE7", bg: "bg-[#6C5CE7]/[0.06]", label: "Trend" },
  recommendation: { icon: Lightbulb, color: "#F59E0B", bg: "bg-amber-50", label: "Empfehlung" },
  forecast: { icon: LineChart, color: "#00CEC9", bg: "bg-teal-50", label: "Vorhersage" },
}

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; label: string }> = {
  critical: { color: "text-red-700", bg: "bg-red-100", label: "Kritisch" },
  high: { color: "text-orange-700", bg: "bg-orange-100", label: "Hoch" },
  medium: { color: "text-blue-700", bg: "bg-blue-100", label: "Mittel" },
  low: { color: "text-gray-600", bg: "bg-gray-100", label: "Gering" },
}

const LEARNING_TIMELINE = [
  { date: "09.04.2026", text: "Rückmeldung verarbeitet: Video-Inhalt-Empfehlung als 'Nützlich' bewertet", icon: BookOpen },
  { date: "07.04.2026", text: "Anomalie-Erkennung kalibriert – Schwellwert für Instagram angepasst", icon: Target },
  { date: "05.04.2026", text: "Neues Modell trainiert mit 2 Wochen zusätzlichen Daten", icon: Brain },
  { date: "01.04.2026", text: "Monatliches Neutraining abgeschlossen – Genauigkeit: 89,2 %", icon: Zap },
]

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days_back: 7 }),
        })
        const data = await res.json()
        setInsights(data.insights ?? [])
      } catch {
        setInsights([])
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  const filtered = activeFilter === "all"
    ? insights
    : insights.filter((i) => i.type === activeFilter)

  const handleFeedback = (insightId: string, feedback: string) => {
    setFeedbackGiven((prev) => ({ ...prev, [insightId]: feedback }))
    fetch("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insight_id: insightId, feedback }),
    }).catch(() => {})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#6C5CE7]" />
            <h1 className="text-xl font-semibold text-gray-900">AI Insights</h1>
          </div>
          <p className="text-[13px] text-gray-500 mt-0.5">
            KI-gestützte Analyse deiner Plattform-Daten
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200) }}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Neu erstellen
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
        {FILTER_TABS.map((tab) => {
          const count = tab.key === "all"
            ? insights.length
            : insights.filter((i) => i.type === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`relative rounded-lg px-4 py-1.5 text-[12px] font-medium transition-all ${
                activeFilter === tab.key
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {activeFilter === tab.key && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab.label}
                {count > 0 && (
                  <span className="ml-1.5 text-[10px] text-gray-400">{count}</span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Insights Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#6C5CE7]" />
          <span className="ml-2 text-[13px] text-gray-500">Erkenntnisse werden erstellt...</span>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((insight) => {
              const typeConf = TYPE_CONFIG[insight.type]
              const prioConf = PRIORITY_CONFIG[insight.priority]
              const isExpanded = expandedId === insight.id
              const feedback = feedbackGiven[insight.id]

              return (
                <motion.div
                  key={insight.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-sm transition-shadow"
                >
                  {/* Main Row */}
                  <div
                    className="flex items-start gap-4 p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${typeConf.bg} flex items-center justify-center shrink-0`}>
                      <typeConf.icon className="h-[18px] w-[18px]" style={{ color: typeConf.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-[14px] font-semibold text-gray-900">{insight.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${prioConf.bg} ${prioConf.color}`}>
                          {prioConf.label}
                        </span>
                        {insight.platform && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            {insight.platform}
                          </span>
                        )}
                      </div>

                      <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                        {insight.description}
                      </p>

                      {/* Confidence Bar */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="text-[10px] text-gray-400 font-medium">Vertrauen</span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: typeConf.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence * 100}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Expand Toggle */}
                    <button className="mt-1 text-gray-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0 border-t border-gray-50">
                          {/* Actions */}
                          {insight.actions.length > 0 && (
                            <div className="mt-4">
                              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Empfohlene Massnahmen
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {insight.actions.map((action, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[12px] text-gray-600"
                                  >
                                    {action}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-4">
                            {feedback ? (
                              <span className="text-[12px] text-emerald-600 flex items-center gap-1">
                                <Check className="h-3.5 w-3.5" />
                                Rückmeldung: {feedback === "useful" ? "Nützlich" : feedback === "implemented" ? "Umgesetzt" : "Ignoriert"}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleFeedback(insight.id, "implemented") }}
                                  className="flex items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#5A4BD1] transition-colors"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Umsetzen
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleFeedback(insight.id, "not_useful") }}
                                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[12px] text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Ignorieren
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleFeedback(insight.id, "useful") }}
                                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[12px] text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Nützlich
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-[13px] text-gray-400">Keine Erkenntnisse für diesen Filter</p>
            </div>
          )}
        </div>
      )}

      {/* Learning Timeline */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 mt-8">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="h-4 w-4 text-[#6C5CE7]" />
          <h2 className="text-[15px] font-semibold text-gray-900">Lernverlauf</h2>
          <span className="text-[11px] text-gray-400">Was die KI bisher gelernt hat</span>
        </div>
        <div className="space-y-0">
          {LEARNING_TIMELINE.map((entry, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/[0.06] flex items-center justify-center shrink-0">
                  <entry.icon className="h-3.5 w-3.5 text-[#6C5CE7]" />
                </div>
                {i < LEARNING_TIMELINE.length - 1 && (
                  <div className="w-px flex-1 bg-gray-100 my-1" />
                )}
              </div>
              <div className="pb-5">
                <p className="text-[13px] text-gray-700 leading-snug">{entry.text}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {entry.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
