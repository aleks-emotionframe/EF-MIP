"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  GitFork, ArrowRight, TrendingDown, Users, Percent,
  Footprints, LogOut, Sparkles, ChevronDown, ExternalLink,
  AlertTriangle, Lightbulb, BarChart3,
} from "lucide-react"
import Link from "next/link"

/* ──────────────────────────── Types ──────────────────────────── */

interface FunnelStep {
  label: string
  visitors: number
  percent: number
  color: string
}

interface DropOffInfo {
  from: string
  to: string
  lost: number
  lostPercent: number
  reasons: { label: string; percent: number }[]
  suggestion: string
}

/* ──────────────────────────── Demo Data ─────────────────────── */

const FUNNEL_STEPS: FunnelStep[] = [
  { label: "Website-Besucher", visitors: 12480, percent: 100, color: "#00CEC9" },
  { label: "Seitenaufrufe", visitors: 8986, percent: 72, color: "#2DB5B0" },
  { label: "Kontaktseite", visitors: 3494, percent: 28, color: "#4C9ADA" },
  { label: "Formular gestartet", visitors: 1872, percent: 15, color: "#6C5CE7" },
  { label: "Anfrage gesendet", visitors: 998, percent: 8, color: "#5B4ACF" },
]

const DROP_OFFS: DropOffInfo[] = [
  {
    from: "Website-Besucher",
    to: "Seitenaufrufe",
    lost: 3494,
    lostPercent: 28,
    reasons: [
      { label: "Bounce (Seite sofort verlassen)", percent: 18 },
      { label: "Exit nach Startseite", percent: 7 },
      { label: "Externe Links geklickt", percent: 3 },
    ],
    suggestion: "Die Absprungrate auf der Startseite ist hoch. Ein auffälligerer Hero-Bereich mit klarer Handlungsaufforderung könnte die Verweildauer verbessern.",
  },
  {
    from: "Seitenaufrufe",
    to: "Kontaktseite",
    lost: 5492,
    lostPercent: 44,
    reasons: [
      { label: "Navigation zu anderen Seiten", percent: 28 },
      { label: "Session beendet", percent: 12 },
      { label: "Zurück zur Startseite", percent: 4 },
    ],
    suggestion: "Viele Besucher finden die Kontaktseite nicht. Platziere einen sichtbaren CTA-Button auf jeder Unterseite und teste eine Sticky-Navigationsleiste.",
  },
  {
    from: "Kontaktseite",
    to: "Formular gestartet",
    lost: 1622,
    lostPercent: 13,
    reasons: [
      { label: "Seite angesehen, aber nicht interagiert", percent: 8 },
      { label: "Telefonnummer kopiert statt Formular", percent: 3 },
      { label: "Exit", percent: 2 },
    ],
    suggestion: "Das Formular wird von vielen nicht begonnen. Reduziere die sichtbaren Felder auf 3-4 und zeige eine geschätzte Ausfüllzeit an (z.B. «Dauert nur 2 Minuten»).",
  },
  {
    from: "Formular gestartet",
    to: "Anfrage gesendet",
    lost: 874,
    lostPercent: 7,
    reasons: [
      { label: "Formular abgebrochen", percent: 4 },
      { label: "Validierungsfehler → Exit", percent: 2 },
      { label: "Session-Timeout", percent: 1 },
    ],
    suggestion: "7% brechen das Formular ab. Implementiere Auto-Save, inline Validierung und einen Fortschrittsbalken. Entferne optionale Felder oder verschiebe sie auf Seite 2.",
  },
]

const CONVERSION_OVER_TIME = [
  { date: "01.04", rate: 6.8 },
  { date: "02.04", rate: 7.2 },
  { date: "03.04", rate: 7.5 },
  { date: "04.04", rate: 8.1 },
  { date: "05.04", rate: 7.9 },
  { date: "06.04", rate: 8.4 },
  { date: "07.04", rate: 8.0 },
  { date: "08.04", rate: 8.8 },
  { date: "09.04", rate: 9.2 },
  { date: "10.04", rate: 8.6 },
]

const STATS = [
  { label: "Gesamt-Besucher", value: "12'480", icon: Users, color: "#00CEC9" },
  { label: "Conversion-Rate", value: "8,0%", icon: Percent, color: "#6C5CE7" },
  { label: "Durchschnittliche Schritte", value: "3,2", icon: Footprints, color: "#F97316" },
  { label: "Absprungrate", value: "28%", icon: LogOut, color: "#E84393" },
]

const TIME_RANGES = ["7 Tage", "30 Tage", "90 Tage"]

/* ──────────────────────────── Component ─────────────────────── */

export default function FunnelPage() {
  const [isConnected] = useState(false)
  const [timeRange, setTimeRange] = useState("30 Tage")
  const [expandedDropOff, setExpandedDropOff] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#6C5CE7]/10 flex items-center justify-center">
            <GitFork className="h-5 w-5 text-[#6C5CE7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Conversion-Funnel</h1>
            <p className="text-[13px] text-gray-500 dark:text-white/50">Vom Besucher zur Conversion</p>
          </div>
        </div>

        {/* Time range selector */}
        <div className="relative">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] rounded-md shadow-sm border border-gray-100 dark:border-white/10 p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  timeRange === range
                    ? "bg-[#6C5CE7] text-white shadow-sm"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Conditional: Not Connected ───────────────────────── */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Animated icon */}
            <motion.div
              className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#6C5CE7]/10 to-[#00CEC9]/10 flex items-center justify-center mb-6"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <GitFork className="h-10 w-10 text-[#6C5CE7]" />
            </motion.div>

            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">
              Verbinde Google Analytics
            </h2>
            <p className="text-[14px] text-gray-500 dark:text-white/50 max-w-md mb-8">
              Visualisiere den Weg deiner Besucher vom ersten Klick bis zur Conversion
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-lg w-full">
              {[
                { icon: BarChart3, label: "Funnel-Visualisierung", desc: "Schritt-für-Schritt Trichter" },
                { icon: TrendingDown, label: "Drop-off-Analyse", desc: "Wo gehen Besucher verloren?" },
                { icon: Percent, label: "Conversion-Rate", desc: "Echtzeit-Kennzahlen" },
                { icon: Sparkles, label: "KI-Empfehlungen", desc: "Datenbasierte Optimierung" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-start gap-3 p-3 rounded-md bg-gray-50 dark:bg-white/[0.04] text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <feature.icon className="h-4 w-4 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{feature.label}</p>
                    <p className="text-[11px] text-gray-400 dark:text-white/40">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/dashboard/settings/integrations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#6C5CE7] text-white font-semibold text-[14px] shadow-lg shadow-[#6C5CE7]/20 hover:shadow-xl hover:shadow-[#6C5CE7]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Google Analytics verbinden
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Connected State ──────────────────────────────────── */}
      {isConnected && (
        <>
          {/* Demo notice */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <p className="text-[12px] text-amber-700 dark:text-amber-400">
              Dies sind Demo-Daten zur Veranschaulichung. Verbinde Google Analytics unter{" "}
              <Link href="/dashboard/settings/integrations" className="underline font-medium">
                Einstellungen → Integrationen
              </Link>{" "}
              für echte Funnel-Daten.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}0F` }}
                  >
                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-[22px] font-extrabold text-[#0F172A] dark:text-white">{stat.value}</p>
                <p className="text-[11px] text-gray-400 dark:text-white/40 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Visual Funnel ────────────────────────────────── */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6">
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Conversion-Trichter</h3>
            <p className="text-[11px] text-gray-400 dark:text-white/40 mb-6">
              5-Stufen-Funnel · Letzte {timeRange}
            </p>

            <div className="max-w-2xl mx-auto space-y-0">
              {FUNNEL_STEPS.map((step, index) => {
                const widthPercent = 40 + (step.percent / 100) * 60 // min 40%, max 100%
                const nextStep = FUNNEL_STEPS[index + 1]
                const dropOff = DROP_OFFS[index]

                return (
                  <div key={step.label}>
                    {/* Funnel bar */}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                      style={{ originX: 0.5 }}
                      className="relative mx-auto"
                    >
                      <div
                        className="relative mx-auto overflow-hidden"
                        style={{
                          width: `${widthPercent}%`,
                          clipPath: nextStep
                            ? `polygon(0 0, 100% 0, ${50 + ((40 + (nextStep.percent / 100) * 60) / widthPercent) * 50}% 100%, ${50 - ((40 + (nextStep.percent / 100) * 60) / widthPercent) * 50}% 100%)`
                            : `polygon(0 0, 100% 0, 95% 100%, 5% 100%)`,
                        }}
                      >
                        <div
                          className="py-4 px-6 text-center"
                          style={{
                            background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`,
                          }}
                        >
                          <p className="text-white font-bold text-[14px] drop-shadow-sm">{step.label}</p>
                          <p className="text-white/90 text-[12px] font-medium">
                            {step.visitors.toLocaleString("de-CH")} Besucher · {step.percent}%
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Drop-off indicator between steps */}
                    {dropOff && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.15 + 0.3 }}
                        className="flex items-center justify-center gap-2 py-1.5"
                      >
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20">
                          <TrendingDown className="h-3 w-3 text-[#F97316]" />
                          <span className="text-[11px] font-semibold text-[#F97316]">
                            {dropOff.lostPercent}% verloren
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Drop-off Analyse ─────────────────────────────── */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6">
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Drop-off Analyse</h3>
            <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">
              Wo und warum verlierst du Besucher?
            </p>

            <div className="space-y-3">
              {DROP_OFFS.map((drop, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border border-gray-100 dark:border-white/10 rounded-md overflow-hidden"
                >
                  {/* Header - clickable */}
                  <button
                    onClick={() => setExpandedDropOff(expandedDropOff === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                        <TrendingDown className="h-4 w-4 text-[#F97316]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white">
                          {drop.from} → {drop.to}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-white/40">
                          {drop.lost.toLocaleString("de-CH")} Besucher verloren ({drop.lostPercent}%)
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        expandedDropOff === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded content */}
                  {expandedDropOff === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 dark:border-white/10 px-4 pb-4 pt-3"
                    >
                      {/* Reasons */}
                      <p className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                        Wohin gehen die Besucher?
                      </p>
                      <div className="space-y-2 mb-4">
                        {drop.reasons.map((reason) => (
                          <div key={reason.label} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] text-gray-600 dark:text-white/60">{reason.label}</span>
                                <span className="text-[12px] font-semibold text-[#0F172A] dark:text-white">{reason.percent}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#F97316]"
                                  style={{ width: `${(reason.percent / drop.lostPercent) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Suggestion */}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-[#6C5CE7]/5 dark:bg-[#6C5CE7]/10">
                        <Lightbulb className="h-4 w-4 text-[#6C5CE7] shrink-0 mt-0.5" />
                        <p className="text-[12px] text-[#6C5CE7] dark:text-[#6C5CE7] leading-relaxed">
                          {drop.suggestion}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Conversion über Zeit ─────────────────────────── */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5">
            <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Conversion über Zeit</h3>
            <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">
              Conversion-Rate im Zeitverlauf · Letzte {timeRange}
            </p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CONVERSION_OVER_TIME}>
                  <defs>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 12]}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "6px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Conversion-Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#6C5CE7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#6C5CE7", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#6C5CE7", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── KI-Empfehlungen ──────────────────────────────── */}
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#6C5CE7]" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">KI-Empfehlungen</h3>
                <p className="text-[11px] text-gray-400 dark:text-white/40">Basierend auf deinen Funnel-Daten</p>
              </div>
            </div>

            <div className="p-4 rounded-md bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-gray-300 dark:text-white/20 shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-gray-500 dark:text-white/50">
                  Verbinde Google Analytics für KI-Empfehlungen
                </p>
                <p className="text-[11px] text-gray-400 dark:text-white/40 mt-0.5">
                  Mit echten Funnel-Daten generiert die KI personalisierte Optimierungsvorschläge für jeden Conversion-Schritt.
                </p>
              </div>
              <Link
                href="/dashboard/settings/integrations"
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6C5CE7] text-white text-[11px] font-semibold hover:bg-[#5B4ACF] transition-colors"
              >
                Verbinden
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
