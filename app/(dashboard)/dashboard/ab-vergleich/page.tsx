"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts"
import {
  GitCompare, Plus, X, Sparkles, Trophy, Heart, MessageCircle,
  Share2, Eye, Bookmark, MousePointerClick, Camera, Briefcase,
  Music2, ThumbsUp, PlayCircle, ChevronRight, ImageIcon,
} from "lucide-react"

/* ──────────────────────────── Types ──────────────────────────── */

interface Variant {
  label: string
  color: string
  caption: string
  hook: string
  imageDesc: string
  prognose: number
  confidence: number
  likes: number
  kommentare: number
  shares: number
  reichweite: number
}

interface PastTest {
  id: string
  name: string
  platform: string
  datum: string
  gewinner: "A" | "B"
  verbesserung: number
}

/* ──────────────────────────── Demo Data ──────────────────────── */

const VARIANTE_A: Variant = {
  label: "A",
  color: "#00CEC9",
  caption: "5 Tipps für mehr Reichweite auf Instagram – diese Strategien nutzen die Top-Creator 2026. Jetzt lesen und umsetzen!",
  hook: "5 Tipps für mehr Reichweite",
  imageDesc: "Infografik – 5 Social-Media Tipps",
  prognose: 2400,
  confidence: 72,
  likes: 184,
  kommentare: 23,
  shares: 41,
  reichweite: 2380,
}

const VARIANTE_B: Variant = {
  label: "B",
  color: "#6C5CE7",
  caption: "Wusstest du, dass 80% der Creator diesen Fehler machen? So verdoppelst du dein Engagement in nur 7 Tagen.",
  hook: "Wusstest du, dass 80%…?",
  imageDesc: "Carousel – Engagement Hacks",
  prognose: 3100,
  confidence: 81,
  likes: 247,
  kommentare: 58,
  shares: 73,
  reichweite: 3070,
}

const CHART_DATA = [
  { metric: "Reichweite", A: 2380, B: 3070 },
  { metric: "Engagement", A: 248, B: 378 },
  { metric: "Klicks", A: 134, B: 201 },
  { metric: "Saves", A: 56, B: 89 },
]

const PAST_TESTS: PastTest[] = [
  { id: "t1", name: "Hook-Vergleich Carousel", platform: "Instagram", datum: "02.04.2026", gewinner: "B", verbesserung: 29 },
  { id: "t2", name: "Video-Länge 30s vs 60s", platform: "TikTok", datum: "27.03.2026", gewinner: "A", verbesserung: 14 },
  { id: "t3", name: "CTA Button-Farbe", platform: "Facebook", datum: "19.03.2026", gewinner: "B", verbesserung: 8 },
  { id: "t4", name: "Storytelling vs. Listicle", platform: "LinkedIn", datum: "11.03.2026", gewinner: "A", verbesserung: 22 },
  { id: "t5", name: "Thumbnail-Varianten", platform: "YouTube", datum: "03.03.2026", gewinner: "B", verbesserung: 17 },
]

const PLATFORM_ICON: Record<string, React.ComponentType<any>> = {
  Instagram: Camera,
  Facebook: ThumbsUp,
  YouTube: PlayCircle,
  LinkedIn: Briefcase,
  TikTok: Music2,
}

const PLATFORM_COLOR: Record<string, string> = {
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  YouTube: "#FF0000",
  LinkedIn: "#0A66C2",
  TikTok: "#000000",
}

/* ──────────────────────────── Helpers ────────────────────────── */

function fmt(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(".", ",") + "K" : String(n)
}

/* ──────────────────────────── Component ──────────────────────── */

export default function ABVergleichPage() {
  const [showModal, setShowModal] = useState(false)
  const [testName, setTestName] = useState("")
  const [testPlatform, setTestPlatform] = useState("Instagram")
  const [textA, setTextA] = useState("")
  const [textB, setTextB] = useState("")

  const winnerIsB = VARIANTE_B.reichweite > VARIANTE_A.reichweite

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-[#00CEC9]" />
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">A/B Content Vergleich</h1>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
            Teste verschiedene Content-Varianten und finde heraus, was besser performt.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-4 py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Neuer Test
        </button>
      </div>

      {/* Demo-Daten Badge */}
      <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-700 font-medium">
        <Sparkles className="h-3.5 w-3.5" />
        Demo-Daten – Aktiver A/B-Test mit simulierten Ergebnissen
      </div>

      {/* ─── Active Test Hero: Side-by-Side ─────────────────────── */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Variante A */}
        <VariantCard variant={VARIANTE_A} isWinner={!winnerIsB} />

        {/* VS Badge */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/30 ring-4 ring-white"
          >
            <span className="text-white font-extrabold text-lg">VS</span>
          </motion.div>
        </div>

        {/* Mobile VS */}
        <div className="flex lg:hidden justify-center -my-3">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/30 ring-4 ring-white"
          >
            <span className="text-white font-bold text-sm">VS</span>
          </motion.div>
        </div>

        {/* Variante B */}
        <VariantCard variant={VARIANTE_B} isWinner={winnerIsB} />
      </div>

      {/* ─── Performance-Vergleich Chart ────────────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-6">
        <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Performance-Vergleich</h2>
        <p className="text-[11px] text-gray-400 mb-5">Metriken im direkten Vergleich (Demo-Daten)</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} barGap={4} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "12px" }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", paddingBottom: "8px" }}
              />
              <Bar dataKey="A" name="Variante A" fill="#00CEC9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="B" name="Variante B" fill="#6C5CE7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── KI-Analyse ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#6C5CE7]/5 to-[#00CEC9]/5 border border-[#6C5CE7]/15 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white">KI-Analyse</h2>
          <span className="text-[10px] text-gray-400 ml-auto">Demo-Daten</span>
        </div>
        <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          <strong>Variante B performt 29% besser.</strong> Der kürzere Hook und die Frage am Anfang erzeugen mehr Engagement. Die Neugier-getriebene Formulierung führt zu deutlich höherer Klickrate.
        </p>
        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold text-[#0F172A] dark:text-white">Wichtige Erkenntnisse:</h3>
          <ul className="space-y-1.5 text-[12px] text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-[#00CEC9] mt-0.5 shrink-0" />
              Fragen im Hook steigern die Kommentarrate um 152%
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-[#00CEC9] mt-0.5 shrink-0" />
              Konkrete Zahlen (z.B. &laquo;80%&raquo;) erhöhen die Glaubwürdigkeit und das Engagement
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-[#00CEC9] mt-0.5 shrink-0" />
              Kürzere Captions (unter 150 Zeichen) performen auf Instagram 23% besser
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-[#00CEC9] mt-0.5 shrink-0" />
              Zeitversprechen (&laquo;in 7 Tagen&raquo;) erzeugen Dringlichkeit und mehr Saves
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Vergangene Tests ───────────────────────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm p-6">
        <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">Vergangene Tests</h2>
        <p className="text-[11px] text-gray-400 mb-4">Abgeschlossene A/B-Tests (Demo-Daten)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Test-Name</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Plattform</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Datum</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Gewinner</th>
                <th className="text-right py-3 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Verbesserung</th>
              </tr>
            </thead>
            <tbody>
              {PAST_TESTS.map((test) => {
                const PlatformIcon = PLATFORM_ICON[test.platform] ?? Camera
                const platColor = PLATFORM_COLOR[test.platform] ?? "#6b7280"
                return (
                  <tr key={test.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer group">
                    <td className="py-3.5 px-3 font-medium text-[#0F172A] dark:text-white group-hover:text-[#6C5CE7] transition-colors">
                      {test.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5">
                        <PlatformIcon className="h-3.5 w-3.5" style={{ color: platColor }} />
                        <span className="text-gray-600">{test.platform}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500">{test.datum}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                        style={{ backgroundColor: test.gewinner === "A" ? "#00CEC9" : "#6C5CE7" }}
                      >
                        <Trophy className="h-3 w-3" />
                        Variante {test.gewinner}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-green-600">+{test.verbesserung}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Neuer Test Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1E293B] shadow-xl p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-[#00CEC9]" />
                  <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Neuer A/B-Test</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Test-Name */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Test-Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="z.B. Hook-Vergleich Carousel"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] text-[#0F172A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00CEC9]/30 focus:border-[#00CEC9] transition-all"
                />
              </div>

              {/* Plattform */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Plattform</label>
                <select
                  value={testPlatform}
                  onChange={(e) => setTestPlatform(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#00CEC9]/30 focus:border-[#00CEC9] transition-all"
                >
                  {Object.keys(PLATFORM_ICON).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Variante A */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#00CEC9] text-white text-[9px] font-bold">A</span>
                  Variante A
                </label>
                <textarea
                  value={textA}
                  onChange={(e) => setTextA(e.target.value)}
                  rows={3}
                  placeholder="Text der ersten Variante..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] text-[#0F172A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00CEC9]/30 focus:border-[#00CEC9] transition-all resize-none"
                />
              </div>

              {/* Variante B */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#6C5CE7] text-white text-[9px] font-bold">B</span>
                  Variante B
                </label>
                <textarea
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                  rows={3}
                  placeholder="Text der zweiten Variante..."
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] text-[#0F172A] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  KI-Prognose starten
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ──────────────────────────── Variant Card ───────────────────── */

function VariantCard({ variant, isWinner }: { variant: Variant; isWinner: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: variant.label === "A" ? 0 : 0.15 }}
      className={`relative rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden transition-shadow ${
        isWinner ? "ring-2 ring-green-400/60 shadow-green-100" : ""
      }`}
    >
      {/* Winner Banner */}
      {isWinner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-[11px] font-bold text-white shadow-md shadow-green-500/30"
        >
          <Trophy className="h-3 w-3" />
          Gewinner
        </motion.div>
      )}

      {/* Label Badge */}
      <div className="p-5 pb-0">
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-[13px] font-bold"
          style={{ backgroundColor: variant.color }}
        >
          {variant.label}
        </span>
      </div>

      {/* Mock Post Preview */}
      <div className="p-5">
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          {/* Image placeholder */}
          <div
            className="h-44 flex flex-col items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${variant.color}15, ${variant.color}08)` }}
          >
            <ImageIcon className="h-8 w-8" style={{ color: variant.color, opacity: 0.5 }} />
            <span className="text-[11px] font-medium" style={{ color: variant.color, opacity: 0.7 }}>
              {variant.imageDesc}
            </span>
          </div>

          {/* Post content */}
          <div className="p-4 space-y-3">
            {/* Author line */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7]" />
              <div>
                <p className="text-[11px] font-semibold text-[#0F172A] dark:text-white">emotionframe</p>
                <p className="text-[9px] text-gray-400">Gesponsert</p>
              </div>
            </div>

            {/* Caption */}
            <p className="text-[12px] text-gray-700 leading-relaxed">{variant.caption}</p>

            {/* Quick reactions */}
            <div className="flex items-center gap-4 pt-1 text-gray-400">
              <Heart className="h-4 w-4" />
              <MessageCircle className="h-4 w-4" />
              <Share2 className="h-4 w-4" />
              <Bookmark className="h-4 w-4 ml-auto" />
            </div>
          </div>
        </div>

        {/* KI-Prognose */}
        <div className="mt-4 rounded-xl bg-gray-50 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#F97316]" />
              KI-Prognose
            </span>
            <span className="text-[11px] text-gray-400">Demo-Daten</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#0F172A] dark:text-white">
              Erwartete Reichweite: {fmt(variant.prognose)}
            </span>
            <span className="text-[11px] font-medium" style={{ color: variant.color }}>{variant.confidence}% Konfidenz</span>
          </div>
          {/* Confidence bar */}
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${variant.confidence}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: variant.color }}
            />
          </div>
        </div>

        {/* Metrics after posting */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetricTile icon={Heart} label="Likes" value={variant.likes} color={variant.color} />
          <MetricTile icon={MessageCircle} label="Kommentare" value={variant.kommentare} color={variant.color} />
          <MetricTile icon={Share2} label="Shares" value={variant.shares} color={variant.color} />
          <MetricTile icon={Eye} label="Reichweite" value={variant.reichweite} color={variant.color} />
        </div>
      </div>
    </motion.div>
  )
}

/* ──────────────────────────── Metric Tile ────────────────────── */

function MetricTile({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  value: number
  color: string
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <div>
        <p className="text-[13px] font-bold text-[#0F172A] dark:text-white">{fmt(value)}</p>
        <p className="text-[10px] text-gray-400">{label}</p>
      </div>
    </div>
  )
}
