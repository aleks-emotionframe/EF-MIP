"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Copy, Check, Loader2, Clock, Calendar,
  Lightbulb, Hash, Camera, ThumbsUp, PlayCircle,
  Briefcase, Music2, ArrowRight, RefreshCw,
} from "lucide-react"

const PLATFORMS = [
  { key: "Instagram", icon: Camera, color: "#E1306C" },
  { key: "Facebook", icon: ThumbsUp, color: "#1877F2" },
  { key: "LinkedIn", icon: Briefcase, color: "#0A66C2" },
  { key: "TikTok", icon: Music2, color: "#000000" },
  { key: "YouTube", icon: PlayCircle, color: "#FF0000" },
]

const TONES = [
  { key: "professionell", label: "Professionell" },
  { key: "locker", label: "Locker & Freundlich" },
  { key: "inspirierend", label: "Inspirierend" },
  { key: "humorvoll", label: "Humorvoll" },
  { key: "informativ", label: "Informativ" },
]

interface GenerateResult {
  content: string
  hashtags: string[]
  bestTime: string
  bestDay: string
  tips: string[]
  charCount: number
  source: string
  needsApiKey?: boolean
  profileConnected?: boolean
}

export default function ContentGeneratorPage() {
  const [platform, setPlatform] = useState("Instagram")
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("professionell")
  const [language, setLanguage] = useState("Deutsch")
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [includeEmoji, setIncludeEmoji] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!topic.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/content-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic, tone, language, includeHashtags, includeEmoji }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    const text = result.content + (result.hashtags.length ? "\n\n" + result.hashtags.map((h) => `#${h}`).join(" ") : "")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedPlatform = PLATFORMS.find((p) => p.key === platform)!

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#00CEC9]" />
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Content-Generator</h1>
        </div>
        <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
          KI-gestützter Content für deine Social-Media-Kanäle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── LEFT: Config ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-6 space-y-5">
            {/* Platform */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Plattform</label>
              <div className="flex gap-2 mt-2">
                {PLATFORMS.map((p) => (
                  <button key={p.key} onClick={() => setPlatform(p.key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${platform === p.key ? "text-white" : "bg-gray-50 text-gray-600 border border-gray-200"}`}
                    style={platform === p.key ? { backgroundColor: p.color } : {}}>
                    <p.icon className="h-3.5 w-3.5" />{p.key}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Thema / Beschreibung</label>
              <textarea
                value={topic} onChange={(e) => setTopic(e.target.value)}
                rows={4} placeholder="Worüber soll der Beitrag sein? z.B. 'Neue Funktion unseres Analytics-Tools vorgestellen' oder 'Tipps für mehr Engagement auf Instagram'"
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-[13px] mt-1.5 focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none resize-none"
              />
            </div>

            {/* Tone */}
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tonalität</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TONES.map((t) => (
                  <button key={t.key} onClick={() => setTone(t.key)}
                    className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${tone === t.key ? "bg-[#00CEC9]/[0.08] text-[#00CEC9] border border-[#00CEC9]/20" : "bg-gray-50 text-gray-600 border border-transparent"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} className="rounded border-gray-300 text-[#00CEC9] focus:ring-[#00CEC9]" />
                <span className="text-[12px] text-gray-600">Hashtags</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeEmoji} onChange={(e) => setIncludeEmoji(e.target.checked)} className="rounded border-gray-300 text-[#00CEC9] focus:ring-[#00CEC9]" />
                <span className="text-[12px] text-gray-600">Emojis</span>
              </label>
            </div>

            {/* Generate Button */}
            <motion.button onClick={handleGenerate} disabled={loading || !topic.trim()} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] py-3.5 text-[14px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 disabled:opacity-50 transition-all">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Wird generiert..." : "Content generieren"}
            </motion.button>
          </div>
        </div>

        {/* ─── RIGHT: Result ─────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Generated Content */}
                <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <selectedPlatform.icon className="h-4 w-4" style={{ color: selectedPlatform.color }} />
                      <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">{platform}-Beitrag</h3>
                      {result.source === "claude" && (
                        <span className="text-[10px] bg-[#00CEC9]/[0.08] text-[#00CEC9] rounded-full px-2 py-0.5 font-medium">
                          {result.profileConnected ? "KI · Profil-basiert" : "KI-generiert"}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleGenerate} className="rounded-lg p-2 text-gray-400 hover:text-[#00CEC9] hover:bg-[#00CEC9]/[0.06] transition-colors" title="Neu generieren">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Kopiert!" : "Kopieren"}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="rounded-md bg-gray-50 p-4 text-[13px] text-gray-800 leading-relaxed whitespace-pre-line min-h-[120px]">
                    {result.content}
                  </div>

                  {/* Hashtags */}
                  {result.hashtags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Hashtags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.hashtags.map((tag) => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-[#00CEC9]/[0.06] px-2.5 py-1 text-[11px] font-medium text-[#00CEC9]">
                            <Hash className="h-3 w-3 mr-0.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Character count */}
                  {result.charCount > 0 && (
                    <p className="mt-3 text-[11px] text-gray-400">{result.charCount} Zeichen</p>
                  )}
                </div>

                {/* Posting Time + Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-[#00CEC9]" />
                      <h3 className="text-[14px] font-semibold text-[#0F172A] dark:text-white">Beste Posting-Zeit</h3>
                    </div>
                    <p className="text-[14px] font-bold text-gray-900">{result.bestTime}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-[12px] text-gray-500">{result.bestDay}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {result.profileConnected
                        ? `Basierend auf deinem ${platform}-Profil`
                        : `Basierend auf allgemeinen ${platform}-Daten · Verbinde dein Profil für personalisierte Zeiten`
                      }
                    </p>
                  </div>

                  <div className="rounded-lg bg-white dark:bg-[#1E293B] shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <h3 className="text-[14px] font-semibold text-[#0F172A] dark:text-white">Tipps</h3>
                    </div>
                    <div className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 text-[#00CEC9] mt-1 shrink-0" />
                          <p className="text-[12px] text-gray-600 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Service info */}
                {result.needsApiKey && (
                  <div className="rounded-md border border-amber-100 bg-amber-50/50 p-4 flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] text-amber-800 font-medium">KI-Content wird eingerichtet</p>
                      <p className="text-[12px] text-amber-600 mt-0.5">
                        Die vollständige KI-Content-Generierung wird gerade für dein Konto aktiviert. In der Zwischenzeit findest du hier bereits die besten Posting-Zeiten und plattformspezifische Tipps.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center py-20">
                <Sparkles className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h2 className="text-[15px] font-semibold text-gray-400 mb-1">Content generieren</h2>
                <p className="text-[13px] text-gray-400 max-w-md mx-auto">
                  Wähle eine Plattform, beschreibe dein Thema und lass die KI einen optimierten Beitrag erstellen.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
