"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import {
  ChevronDown, Play, Save, Trash2, GitCompare, Loader2, Sparkles,
  TrendingUp, TrendingDown, Users, Eye, Heart, DollarSign,
  Calendar, Layers, MessageSquare, Megaphone, PenTool, Zap,
  ArrowUpRight, ArrowDownRight, RotateCcw, Check,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
type ScenarioType = "budget" | "frequency" | "new_platform" | "content" | "custom"

interface ScenarioConfig {
  type: ScenarioType
  platform: string
  budget?: number
  frequency?: number
  contentType?: string
  timeframeDays: number
  customChange?: number
}

interface KPIImpact {
  label: string
  current: string
  projected: string
  change: number
  icon: any
}

interface SavedScenario {
  id: string
  name: string
  type: ScenarioType
  platform: string
  createdAt: string
  kpis: KPIImpact[]
  chartData: any[]
}

// ─── Constants ──────────────────────────────────────────────────
const SCENARIO_TYPES: { key: ScenarioType; label: string; icon: any; desc: string }[] = [
  { key: "budget", label: "Budget erhöhen auf Kanal", icon: DollarSign, desc: "Mehr Budget = mehr Reichweite" },
  { key: "frequency", label: "Posting-Frequenz ändern", icon: Calendar, desc: "Wie oft posten?" },
  { key: "new_platform", label: "Neue Plattform starten", icon: Layers, desc: "Was wäre wenn?" },
  { key: "content", label: "Content-Strategie ändern", icon: PenTool, desc: "Anderer Content-Mix" },
  { key: "custom", label: "Eigenes Szenario", icon: Zap, desc: "Freie Parameter" },
]

const PLATFORMS = ["Instagram", "Facebook", "YouTube", "LinkedIn", "TikTok", "Google Ads"]
const CONTENT_TYPES = ["Reels/Shorts", "Stories", "Karussell-Beiträge", "Live-Videos", "Blog/Artikel", "Infografiken"]

// ─── Demo chart data generator ──────────────────────────────────
function generateChartData(config: ScenarioConfig): any[] {
  const days = config.timeframeDays
  const data: any[] = []
  const baseFollowers = 15200
  const dailyGrowth = 12

  let changeMultiplier = 1.0
  if (config.type === "budget") changeMultiplier = 1 + (config.budget ?? 2000) / 10000
  if (config.type === "frequency") changeMultiplier = 1 + (config.frequency ?? 5) / 20
  if (config.type === "new_platform") changeMultiplier = 1.3
  if (config.type === "content") changeMultiplier = 1.2
  if (config.type === "custom") changeMultiplier = 1 + (config.customChange ?? 15) / 100

  // Historical (30 days)
  for (let i = -30; i <= 0; i++) {
    const date = new Date(Date.now() + i * 86400000)
    const noise = Math.random() * 80 - 40
    const val = baseFollowers + (30 + i) * dailyGrowth + noise
    data.push({
      date: date.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit" }),
      day: i,
      Ist: Math.round(val),
      Szenario: null,
      upper: null,
      lower: null,
    })
  }

  // Forecast
  const lastIst = data[data.length - 1].ist
  for (let i = 1; i <= days; i++) {
    const date = new Date(Date.now() + i * 86400000)
    const baseVal = lastIst + i * dailyGrowth
    const scenarioVal = lastIst + i * dailyGrowth * changeMultiplier
    const confidence = i * 3

    data.push({
      date: date.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit" }),
      day: i,
      Ist: null,
      Szenario: Math.round(scenarioVal),
      Basis: Math.round(baseVal),
      upper: Math.round(scenarioVal + confidence),
      lower: Math.round(scenarioVal - confidence),
    })
  }

  return data
}

function generateKPIs(config: ScenarioConfig): KPIImpact[] {
  const mult = config.type === "budget" ? (config.budget ?? 2000) / 5000
    : config.type === "frequency" ? (config.frequency ?? 5) / 10
    : config.type === "custom" ? (config.customChange ?? 15) / 50
    : 0.25

  return [
    { label: `Follower in ${config.timeframeDays}T`, current: "15,200", projected: `${(15200 + Math.round(2340 * mult * (config.timeframeDays / 90))).toLocaleString("de-CH")}`, change: Math.round(18 * mult), icon: Users },
    { label: "Engagement-Rate", current: "4.7%", projected: `${(4.7 + 0.5 * mult).toFixed(1)}%`, change: Math.round(10 * mult), icon: Heart },
    { label: "Reichweite/Beitrag", current: "3,240", projected: `${(3240 + Math.round(890 * mult)).toLocaleString("de-CH")}`, change: Math.round(27 * mult), icon: Eye },
    { label: "Impressionen", current: "45,600", projected: `${(45600 + Math.round(12400 * mult)).toLocaleString("de-CH")}`, change: Math.round(22 * mult), icon: Megaphone },
  ]
}

// ─── Custom Dropdown ────────────────────────────────────────────
function CustomDropdown<T extends string>({
  options,
  value,
  onChange,
  renderOption,
  placeholder,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
  renderOption?: (v: T) => React.ReactNode
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-md border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] px-4 py-3 text-[13px] text-left hover:border-gray-300 dark:hover:border-white/[0.12] focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 transition-all"
      >
        <span className={value ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>
          {renderOption ? renderOption(value) : value || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-md border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] shadow-lg shadow-gray-200/50 dark:shadow-black/30 p-1 max-h-64 overflow-y-auto"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={`w-full text-left rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                  value === opt ? "bg-[#00CEC9]/[0.06] text-[#00CEC9] font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                }`}
              >
                {renderOption ? renderOption(opt) : opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Slider ─────────────────────────────────────────────────────
function LabeledSlider({
  label, min, max, step, value, onChange, unit, format,
}: {
  label: string; min: number; max: number; step: number
  value: number; onChange: (v: number) => void
  unit?: string; format?: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-[14px] font-bold text-gray-900 dark:text-white">
          {format ? format(value) : value}{unit ? ` ${unit}` : ""}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-100 dark:bg-white/[0.04] accent-[#00CEC9] [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00CEC9] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
        />
        <div
          className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] pointer-events-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────
export default function ScenariosPage() {
  const [config, setConfig] = useState<ScenarioConfig>({
    type: "budget",
    platform: "Instagram",
    budget: 2000,
    frequency: 5,
    contentType: "Reels/Shorts",
    timeframeDays: 90,
    customChange: 15,
  })
  const [calculating, setCalculating] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])
  const [kpis, setKpis] = useState<KPIImpact[]>([])
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    {
      id: "saved-1", name: "Budget +50% Instagram", type: "budget", platform: "Instagram",
      createdAt: "05.04.2026", kpis: [], chartData: [],
    },
    {
      id: "saved-2", name: "TikTok Launch Q2", type: "new_platform", platform: "TikTok",
      createdAt: "02.04.2026", kpis: [], chartData: [],
    },
  ])
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [saveName, setSaveName] = useState("")
  const [showSaveInput, setShowSaveInput] = useState(false)

  const handleCalculate = useCallback(() => {
    setCalculating(true)
    setTimeout(() => {
      setChartData(generateChartData(config))
      setKpis(generateKPIs(config))
      setHasResult(true)
      setCalculating(false)
    }, 1800)
  }, [config])

  const handleSave = () => {
    if (!saveName.trim()) return
    const newScenario: SavedScenario = {
      id: `saved-${Date.now()}`,
      name: saveName,
      type: config.type,
      platform: config.platform,
      createdAt: new Date().toLocaleDateString("de-CH"),
      kpis,
      chartData,
    }
    setSavedScenarios((prev) => [newScenario, ...prev])
    setSaveName("")
    setShowSaveInput(false)
  }

  const handleDelete = (id: string) => {
    setSavedScenarios((prev) => prev.filter((s) => s.id !== id))
    setCompareIds((prev) => prev.filter((i) => i !== id))
  }

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 2 ? [...prev, id] : prev
    )
  }

  const typeConfig = SCENARIO_TYPES.find((t) => t.key === config.type)!

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#00CEC9]" />
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Szenario Simulator</h1>
        </div>
        <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
          Was wäre wenn? Simuliere verschiedene Strategien und sehe die Auswirkungen.
        </p>
      </div>

      {/* Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── LEFT: Builder (40%) ───────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6 space-y-5">
            <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Szenario konfigurieren</h2>

            {/* Scenario Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Szenario-Typ</label>
              <div className="space-y-1.5">
                {SCENARIO_TYPES.map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setConfig((p) => ({ ...p, type: st.key }))}
                    className={`w-full flex items-center gap-3 rounded-md px-4 py-3 text-left transition-all ${
                      config.type === st.key
                        ? "bg-[#00CEC9]/[0.06] border-2 border-[#00CEC9]/30 shadow-sm"
                        : "border-2 border-transparent hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      config.type === st.key ? "bg-[#00CEC9]/10" : "bg-gray-100 dark:bg-white/[0.04]"
                    }`}>
                      <st.icon className={`h-4 w-4 ${config.type === st.key ? "text-[#00CEC9]" : "text-gray-400 dark:text-gray-500"}`} />
                    </div>
                    <div>
                      <p className={`text-[13px] font-medium ${config.type === st.key ? "text-[#00CEC9]" : "text-gray-800 dark:text-gray-200"}`}>
                        {st.label}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{st.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Plattform</label>
              <CustomDropdown
                options={PLATFORMS}
                value={config.platform}
                onChange={(v) => setConfig((p) => ({ ...p, platform: v }))}
                placeholder="Plattform wählen"
              />
            </div>

            {/* Dynamic Fields */}
            <AnimatePresence mode="wait">
              <motion.div
                key={config.type}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {config.type === "budget" && (
                  <LabeledSlider
                    label="Monatsbudget" min={500} max={20000} step={250}
                    value={config.budget ?? 2000} onChange={(v) => setConfig((p) => ({ ...p, budget: v }))}
                    format={(v) => `CHF ${v.toLocaleString("de-CH")}`}
                  />
                )}

                {config.type === "frequency" && (
                  <LabeledSlider
                    label="Beiträge pro Woche" min={1} max={21} step={1}
                    value={config.frequency ?? 5} onChange={(v) => setConfig((p) => ({ ...p, frequency: v }))}
                    unit="Beiträge/Woche"
                  />
                )}

                {config.type === "content" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Inhaltstyp-Fokus</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CONTENT_TYPES.map((ct) => (
                        <button
                          key={ct}
                          onClick={() => setConfig((p) => ({ ...p, contentType: ct }))}
                          className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${
                            config.contentType === ct
                              ? "bg-[#00CEC9]/[0.08] text-[#00CEC9] border border-[#00CEC9]/20"
                              : "bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-gray-300 border border-transparent hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                          }`}
                        >
                          {ct}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {config.type === "custom" && (
                  <LabeledSlider
                    label="Erwartete Veränderung" min={-50} max={100} step={5}
                    value={config.customChange ?? 15}
                    onChange={(v) => setConfig((p) => ({ ...p, customChange: v }))}
                    format={(v) => `${v > 0 ? "+" : ""}${v}%`}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Timeframe */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Zeitraum</label>
              <div className="flex gap-2">
                {[30, 60, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setConfig((p) => ({ ...p, timeframeDays: d }))}
                    className={`flex-1 rounded-md py-2.5 text-[13px] font-medium transition-all ${
                      config.timeframeDays === d
                        ? "bg-[#00CEC9] text-white shadow-md shadow-[#00CEC9]/25"
                        : "bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    {d} Tage
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <motion.button
              onClick={handleCalculate}
              disabled={calculating}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center justify-center gap-2 rounded-md py-3.5 text-[14px] font-semibold text-white transition-all ${
                calculating
                  ? "bg-[#00CEC9]/70"
                  : "bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:shadow-lg hover:shadow-[#00CEC9]/30"
              }`}
            >
              {calculating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Berechne Szenario...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Szenario berechnen
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* ─── RIGHT: Results (60%) ──────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Chart */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Prognose</h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {hasResult ? `${config.platform} · ${typeConfig.label} · ${config.timeframeDays} Tage` : "Starte eine Simulation um Ergebnisse zu sehen"}
                </p>
              </div>
              {hasResult && (
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#6C5CE7] rounded" />Ist-Daten</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#00CEC9] rounded border-dashed" style={{ borderBottom: "2px dashed #00CEC9", height: 0 }} />Szenario</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#00CEC9]/10 rounded" />Vertrauen</span>
                </div>
              )}
            </div>

            <div className="h-[320px]">
              {hasResult ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00CEC9" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#00CEC9" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <ReferenceLine x={chartData.find((d) => d.day === 0)?.date} stroke="#e5e7eb" strokeDasharray="4 4" label={{ value: "Heute", position: "top", fontSize: 10, fill: "#9ca3af" }} />
                    <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confGrad)" />
                    <Area type="monotone" dataKey="lower" stroke="none" fill="white" />
                    <Line type="monotone" dataKey="Ist" stroke="#6C5CE7" strokeWidth={2.5} dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="Basis" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="6 4" dot={false} connectNulls={false} />
                    <Line type="monotone" dataKey="Szenario" stroke="#00CEC9" strokeWidth={2.5} strokeDasharray="8 4" dot={false} connectNulls={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                  <Sparkles className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-[13px] text-gray-400">Konfiguriere ein Szenario und klicke auf &quot;Berechnen&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* KPI Impact Cards */}
          <AnimatePresence>
            {hasResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                {kpis.map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
                        <kpi.icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className={`flex items-center gap-0.5 text-[12px] font-bold ${kpi.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {kpi.change >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {kpi.change >= 0 ? "+" : ""}{kpi.change}%
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">{kpi.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-gray-400 dark:text-gray-500 line-through">{kpi.current}</span>
                      <span className="text-[16px] font-bold text-gray-900 dark:text-white">{kpi.projected}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save */}
          {hasResult && (
            <div className="flex items-center gap-2">
              {showSaveInput ? (
                <div className="flex-1 flex gap-2">
                  <input
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    placeholder="Szenario-Name..."
                    autoFocus
                    className="flex-1 rounded-md border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] px-4 py-2.5 text-[13px] dark:text-white focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none"
                  />
                  <button onClick={handleSave} className="rounded-md bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#00B4A3] transition-colors">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setShowSaveInput(false)} className="rounded-md border border-gray-200 dark:border-white/[0.06] px-3 py-2.5 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSaveInput(true)}
                  className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-white/[0.06] px-4 py-2.5 text-[12px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  Szenario speichern
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Saved Scenarios ─────────────────────────────────── */}
      {savedScenarios.length > 0 && (
        <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Gespeicherte Szenarien</h2>
            {compareIds.length === 2 && (
              <button className="flex items-center gap-1.5 rounded-lg bg-[#00CEC9]/[0.08] px-3 py-1.5 text-[12px] font-medium text-[#00CEC9]">
                <GitCompare className="h-3.5 w-3.5" />
                Vergleich anzeigen
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vergleich</th>
                  <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Typ</th>
                  <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Plattform</th>
                  <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Erstellt</th>
                  <th className="text-right py-2.5 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {savedScenarios.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 dark:border-white/[0.06] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.06] transition-colors">
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleCompare(s.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          compareIds.includes(s.id) ? "bg-[#00CEC9] border-[#00CEC9]" : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {compareIds.includes(s.id) && <Check className="h-3 w-3 text-white" />}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#0F172A] dark:text-white">{s.name}</td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400 capitalize">{SCENARIO_TYPES.find((t) => t.key === s.type)?.label}</td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{s.platform}</td>
                    <td className="py-3 px-3 text-gray-400 dark:text-gray-500">{s.createdAt}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {compareIds.length > 0 && compareIds.length < 2 && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3">Wähle 2 Szenarien zum Vergleichen aus.</p>
          )}
        </div>
      )}
    </div>
  )
}
