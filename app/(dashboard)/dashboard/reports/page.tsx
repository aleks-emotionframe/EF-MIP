"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  GripVertical, Plus, X, Download, Eye, Calendar,
  BarChart3, Share2, Search, Sparkles, Layers, TrendingUp,
  FileText, Clock, Check, Loader2, ChevronDown,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
interface ReportSection {
  id: string
  key: string
  label: string
  icon: any
  color: string
  enabled: boolean
}

type TimePeriod = "week" | "month" | "quarter" | "custom"

const AVAILABLE_SECTIONS: Omit<ReportSection, "id" | "enabled">[] = [
  { key: "social_overview", label: "Soziale Medien Übersicht", icon: Share2, color: "#6C5CE7" },
  { key: "instagram", label: "Instagram Details", icon: Share2, color: "#E1306C" },
  { key: "facebook", label: "Facebook Details", icon: Share2, color: "#1877F2" },
  { key: "youtube", label: "YouTube Details", icon: Share2, color: "#FF0000" },
  { key: "linkedin", label: "LinkedIn Details", icon: Share2, color: "#0A66C2" },
  { key: "tiktok", label: "TikTok Details", icon: Share2, color: "#000" },
  { key: "analytics", label: "Analyse-Traffic", icon: BarChart3, color: "#E37400" },
  { key: "search_console", label: "Suchkonsole Rankings", icon: Search, color: "#4285F4" },
  { key: "ai_insights", label: "KI-Erkenntnisse Zusammenfassung", icon: Sparkles, color: "#6C5CE7" },
  { key: "scenarios", label: "Szenario-Ergebnisse", icon: Layers, color: "#00CEC9" },
]

const TIME_PERIODS: { key: TimePeriod; label: string }[] = [
  { key: "week", label: "Letzte Woche" },
  { key: "month", label: "Letzter Monat" },
  { key: "quarter", label: "Letztes Quartal" },
  { key: "custom", label: "Eigener Zeitraum" },
]

// ─── Demo preview data ──────────────────────────────────────────
const PREVIEW_DATA: Record<string, { title: string; metrics: { label: string; value: string; change: string }[] }> = {
  social_overview: {
    title: "Soziale Medien Übersicht",
    metrics: [
      { label: "Gesamt-Follower", value: "48.230", change: "+4,2%" },
      { label: "Engagement-Rate", value: "4,8%", change: "+0,6%" },
      { label: "Reichweite", value: "125.400", change: "+12,3%" },
      { label: "Impressionen", value: "342.100", change: "+8,7%" },
    ],
  },
  instagram: {
    title: "Instagram",
    metrics: [
      { label: "Follower", value: "15.200", change: "+3,1%" },
      { label: "Ø Likes", value: "842", change: "+15%" },
      { label: "Story-Aufrufe", value: "2.340", change: "+7,2%" },
    ],
  },
  facebook: {
    title: "Facebook",
    metrics: [
      { label: "Seiten-Fans", value: "8.450", change: "+1,2%" },
      { label: "Beitrags-Reichweite", value: "12.300", change: "-5,4%" },
    ],
  },
  youtube: {
    title: "YouTube",
    metrics: [
      { label: "Follower", value: "5.840", change: "+18,5%" },
      { label: "Aufrufe (30T)", value: "45.200", change: "+22,1%" },
    ],
  },
  linkedin: {
    title: "LinkedIn",
    metrics: [
      { label: "Follower", value: "3.120", change: "+6,8%" },
      { label: "Impressionen", value: "18.900", change: "+11,2%" },
    ],
  },
  tiktok: {
    title: "TikTok",
    metrics: [
      { label: "Follower", value: "12.400", change: "+28,3%" },
      { label: "Video-Aufrufe", value: "234.000", change: "+45,1%" },
    ],
  },
  analytics: {
    title: "Analytics Traffic",
    metrics: [
      { label: "Sitzungen", value: "34.200", change: "+9,1%" },
      { label: "Nutzer", value: "21.800", change: "+7,4%" },
      { label: "Absprungrate", value: "38,2%", change: "-2,1%" },
    ],
  },
  search_console: {
    title: "Suchkonsole Rankings",
    metrics: [
      { label: "Klicks", value: "8.420", change: "+14,3%" },
      { label: "Impressionen", value: "142.000", change: "+21,5%" },
      { label: "Ø Position", value: "12,4", change: "-1,8" },
    ],
  },
  ai_insights: {
    title: "KI Insights",
    metrics: [
      { label: "Anomalien erkannt", value: "3", change: "" },
      { label: "Trends erkannt", value: "5", change: "" },
      { label: "Empfehlungen", value: "7", change: "" },
    ],
  },
  scenarios: {
    title: "Szenario-Ergebnisse",
    metrics: [
      { label: "Simulationen", value: "4", change: "" },
      { label: "Bestes Szenario", value: "+18% Follower", change: "" },
    ],
  },
}

// ─── Page ───────────────────────────────────────────────────────
export default function ReportsPage() {
  const [sections, setSections] = useState<ReportSection[]>([
    { id: "1", key: "social_overview", label: "Social Media Übersicht", icon: Share2, color: "#6C5CE7", enabled: true },
    { id: "2", key: "analytics", label: "Analytics Traffic", icon: BarChart3, color: "#E37400", enabled: true },
    { id: "3", key: "ai_insights", label: "KI Insights Zusammenfassung", icon: Sparkles, color: "#6C5CE7", enabled: true },
  ])
  const [period, setPeriod] = useState<TimePeriod>("month")
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const usedKeys = sections.map((s) => s.key)
  const availableToAdd = AVAILABLE_SECTIONS.filter((s) => !usedKeys.includes(s.key))

  const addSection = useCallback((section: typeof AVAILABLE_SECTIONS[0]) => {
    setSections((prev) => [
      ...prev,
      { id: `s-${Date.now()}`, ...section, enabled: true },
    ])
    setShowAddMenu(false)
    setGenerated(false)
  }, [])

  const removeSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
    setGenerated(false)
  }, [])

  const handleGenerate = useCallback(() => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      // Trigger download simulation
      const link = document.createElement("a")
      link.href = "#"
      link.download = `EmotionFrame-Report-${new Date().toISOString().slice(0, 10)}.pdf`
      // In production: actual PDF blob URL
      alert("PDF-Bericht wurde erstellt! (Demo – im Produktivbetrieb als Download)")
    }, 2500)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00CEC9]" />
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Berichts-Generator</h1>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
            Stelle deinen Bericht zusammen und erstelle ein PDF.
          </p>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ─── LEFT: Builder (40%) ───────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Time Period */}
          <div className="rounded-2xl bg-white shadow-sm p-5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 block">Zeitraum</label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_PERIODS.map((tp) => (
                <button
                  key={tp.key}
                  onClick={() => { setPeriod(tp.key); setGenerated(false) }}
                  className={`rounded-xl py-2.5 text-[12px] font-medium transition-all ${
                    period === tp.key
                      ? "bg-[#00CEC9] text-white shadow-md shadow-[#00CEC9]/25"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections (Drag & Drop) */}
          <div className="rounded-2xl bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Berichts-Abschnitte</label>
              <span className="text-[11px] text-gray-400">{sections.length} Abschnitte</span>
            </div>

            <Reorder.Group
              axis="y"
              values={sections}
              onReorder={(newOrder) => { setSections(newOrder); setGenerated(false) }}
              className="space-y-2"
            >
              {sections.map((section) => (
                <Reorder.Item
                  key={section.id}
                  value={section}
                  className="rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-3.5 flex items-center gap-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                  whileDrag={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                >
                  <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${section.color}10` }}
                  >
                    <section.icon className="h-4 w-4" style={{ color: section.color }} />
                  </div>
                  <span className="flex-1 text-[13px] font-semibold text-[#0F172A] dark:text-white truncate">
                    {section.label}
                  </span>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="rounded-lg p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {/* Add Section */}
            <div className="relative mt-3">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                disabled={availableToAdd.length === 0}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 py-3 text-[12px] font-medium text-gray-400 hover:text-[#00CEC9] hover:border-[#00CEC9]/30 disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:border-gray-200 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Abschnitt hinzufügen
              </button>

              <AnimatePresence>
                {showAddMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute z-50 bottom-full mb-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg p-1 max-h-64 overflow-y-auto"
                  >
                    {availableToAdd.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => addSection(s)}
                        className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${s.color}10` }}>
                          <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                        </div>
                        {s.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Generate PDF */}
          <motion.button
            onClick={handleGenerate}
            disabled={generating || sections.length === 0}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-semibold text-white transition-all disabled:opacity-50 ${
              generating
                ? "bg-[#00CEC9]/70"
                : "bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:shadow-lg hover:shadow-[#00CEC9]/30"
            }`}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                PDF wird erstellt...
              </>
            ) : generated ? (
              <>
                <Check className="h-4 w-4" />
                PDF erneut erstellen
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                PDF erstellen
              </>
            )}
          </motion.button>
        </div>

        {/* ─── RIGHT: Live Preview (60%) ─────────────────────── */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* PDF Header Preview */}
            <div className="bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="font-bold text-sm">EF</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold">EmotionFrame Bericht</h2>
                  <p className="text-[12px] text-white/70">EmotionFrame Demo</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-white/60">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{TIME_PERIODS.find((t) => t.key === period)?.label}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Erstellt: {new Date().toLocaleDateString("de-CH")}</span>
                <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{sections.length} Abschnitte</span>
              </div>
            </div>

            {/* Section Previews */}
            <div className="p-5 space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-[13px] text-gray-400">Füge Abschnitte hinzu um die Vorschau zu sehen</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {sections.map((section, idx) => {
                    const data = PREVIEW_DATA[section.key]
                    if (!data) return null
                    return (
                      <motion.div
                        key={section.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-xl border border-gray-100 p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${section.color}10` }}>
                            <section.icon className="h-3 w-3" style={{ color: section.color }} />
                          </div>
                          <h3 className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{data.title}</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {data.metrics.map((m) => (
                            <div key={m.label} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[10px] text-gray-400 mb-0.5">{m.label}</p>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-[15px] font-bold text-gray-900">{m.value}</span>
                                {m.change && (
                                  <span className={`text-[10px] font-semibold ${
                                    m.change.startsWith("+") ? "text-emerald-600"
                                    : m.change.startsWith("-") ? "text-red-500"
                                    : "text-gray-400"
                                  }`}>{m.change}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Chart placeholder */}
                        <div className="mt-3 h-20 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 flex items-center justify-center">
                          <div className="flex items-end gap-1 h-10">
                            {[35, 55, 45, 70, 60, 80, 65, 75, 85, 70, 90, 78].map((h, i) => (
                              <div
                                key={i}
                                className="w-3 rounded-t"
                                style={{ height: `${h}%`, backgroundColor: `${section.color}${i % 2 === 0 ? "30" : "18"}` }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}

              {/* Footer */}
              {sections.length > 0 && (
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-[10px] text-gray-400">
                  <span>EmotionFrame Platform &middot; Automatisch erstellt</span>
                  <span>Seite 1 von {Math.max(1, Math.ceil(sections.length / 3))}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
