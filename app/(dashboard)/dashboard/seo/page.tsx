"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Globe, CheckCircle2, AlertTriangle, XCircle,
  Loader2, Clock, FileText, Image as ImageIcon,
  Link2, Share2, Code, Zap, ChevronDown, ChevronUp,
  BarChart3, ArrowRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, Lightbulb, Target, Minus, Info,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
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

interface Keyword {
  query: string
  position: number
  prevPosition: number | null
  clicks: number
  impressions: number
  ctr: number
  tip: string
}

type MainTab = "analyse" | "keywords"

const STATUS_ICON = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle }
const STATUS_COLOR = { pass: "text-emerald-600", warn: "text-amber-500", fail: "text-red-500" }
const STATUS_BG = { pass: "bg-emerald-50", warn: "bg-amber-50", fail: "bg-red-50" }
const STATUS_LABEL = { pass: "Bestanden", warn: "Warnung", fail: "Fehler" }

// ─── Demo keywords (marked as demo, real data comes from Search Console) ──
const DEMO_KEYWORDS: Keyword[] = [
  { query: "emotionframe", position: 1, prevPosition: 1, clicks: 890, impressions: 12400, ctr: 7.2, tip: "Dein Brand-Keyword rankt auf Platz 1 – sehr gut! Stelle sicher, dass dein Google Business Profil gepflegt ist und Sitelinks angezeigt werden." },
  { query: "social media analytics tool", position: 4, prevPosition: 6, clicks: 340, impressions: 8900, ctr: 3.8, tip: "Position 4 → Top 3 möglich! Optimiere den Titel-Tag auf dieses Keyword, füge es in die H1 ein und erstelle einen ausführlichen Ratgeber-Beitrag dazu." },
  { query: "engagement rate berechnen", position: 3, prevPosition: 3, clicks: 280, impressions: 6200, ctr: 4.5, tip: "Stabile Position 3. Um auf Platz 1-2 zu kommen: Füge ein interaktives Berechnungs-Tool hinzu, das direkt im Browser funktioniert. Google bevorzugt Seiten mit hoher Nutzerinteraktion." },
  { query: "instagram insights tool", position: 6, prevPosition: 8, clicks: 190, impressions: 5400, ctr: 3.5, tip: "Guter Aufwärtstrend (+2 Positionen)! Erstelle eine dedizierte Landingpage nur für Instagram-Analytics mit Vergleichstabellen zu Konkurrenz-Tools." },
  { query: "social media report erstellen", position: 7, prevPosition: 5, clicks: 145, impressions: 4100, ctr: 3.5, tip: "Position gefallen (-2). Prüfe ob ein Konkurrent neuen Content veröffentlicht hat. Aktualisiere deinen Beitrag mit aktuellen Screenshots und einem kostenlosen Template-Download." },
  { query: "sentiment analyse tool deutsch", position: 2, prevPosition: 3, clicks: 210, impressions: 3800, ctr: 5.5, tip: "Platz 2 und steigend! Füge FAQ-Schema-Markup hinzu (z.B. \"Was ist Sentiment-Analyse?\") um ein Featured Snippet zu erhalten." },
  { query: "social media monitoring schweiz", position: 5, prevPosition: 5, clicks: 120, impressions: 2900, ctr: 4.1, tip: "Stabil auf Platz 5. Erstelle eine Schweiz-spezifische Seite mit lokalen Referenzen, CHF-Preisen und Schweizer Kundenstimmen für besseres lokales Ranking." },
  { query: "ki social media marketing", position: 9, prevPosition: 12, clicks: 85, impressions: 3200, ctr: 2.7, tip: "Grosses Potenzial – starker Aufwärtstrend von Position 12 auf 9. Erstelle einen umfassenden Leitfaden \"KI im Social Media Marketing 2026\" mit mindestens 2000 Wörtern." },
  { query: "tiktok analytics kostenlos", position: 12, prevPosition: 14, clicks: 60, impressions: 4500, ctr: 1.3, tip: "Niedrige CTR bei hohen Impressionen. Optimiere den Meta-Title: Füge \"kostenlos\" und \"2026\" hinzu. Ein attraktiverer Titel kann die CTR verdoppeln." },
  { query: "social media strategie vorlage", position: 15, prevPosition: 18, clicks: 35, impressions: 5100, ctr: 0.7, tip: "Hohes Suchvolumen (5'100 Impressionen), aber Seite 2. Erstelle eine herunterladbare PDF-Vorlage als Lead-Magnet. Seiten mit Downloads ranken besser durch höhere Verweildauer." },
  { query: "competitor analysis social media", position: 8, prevPosition: 7, clicks: 95, impressions: 2100, ctr: 4.5, tip: "Leichter Rückgang (-1). Füge einen interaktiven Vergleich hinzu wo Nutzer ihren Account mit Konkurrenten vergleichen können. Das erhöht die Verweildauer massiv." },
  { query: "facebook engagement 2026", position: 11, prevPosition: null, clicks: 45, impressions: 1800, ctr: 2.5, tip: "Neues Keyword! Du rankst bereits auf Seite 2. Schreibe einen aktuellen Blog-Beitrag mit dem Titel \"Facebook Engagement 2026: Zahlen, Trends & Strategien\" um schnell auf Seite 1 zu kommen." },
]

// ─── Page ───────────────────────────────────────────────────────
export default function SEOPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SEOResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [mainTab, setMainTab] = useState<MainTab>("analyse")
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null)
  const [keywordSort, setKeywordSort] = useState<"position" | "clicks" | "impressions" | "ctr">("position")
  const [keywordFilter, setKeywordFilter] = useState("")

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
      if (data.error) setError(data.error)
      else setResult(data)
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.")
    } finally {
      setLoading(false)
    }
  }

  const categories = result ? ["all", ...Array.from(new Set(result.checks.map((c) => c.category)))] : []
  const filteredChecks = result?.checks.filter((c) => activeCategory === "all" || c.category === activeCategory) ?? []
  const passCount = result?.checks.filter((c) => c.status === "pass").length ?? 0
  const warnCount = result?.checks.filter((c) => c.status === "warn").length ?? 0
  const failCount = result?.checks.filter((c) => c.status === "fail").length ?? 0

  const sortedKeywords = [...DEMO_KEYWORDS]
    .filter((k) => !keywordFilter || k.query.toLowerCase().includes(keywordFilter.toLowerCase()))
    .sort((a, b) => {
      if (keywordSort === "position") return a.position - b.position
      if (keywordSort === "clicks") return b.clicks - a.clicks
      if (keywordSort === "impressions") return b.impressions - a.impressions
      return b.ctr - a.ctr
    })

  const hasAnalysis = result || loading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#6C5CE7]" />
          <h1 className="text-xl font-semibold text-gray-900">SEO-Analyse</h1>
        </div>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Website analysieren und Keyword-Rankings einsehen.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
        {([
          { key: "analyse" as MainTab, label: "Website-Analyse" },
          { key: "keywords" as MainTab, label: "Keyword-Rankings" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMainTab(tab.key)}
            className={`relative rounded-lg px-5 py-2 text-[13px] font-medium transition-all ${
              mainTab === tab.key ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {mainTab === tab.key && (
              <motion.div layoutId="seo-tab" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB: Website-Analyse ──────────────────────────────── */}
      {mainTab === "analyse" && (
        <>
          {/* URL Input */}
          <form onSubmit={handleAnalyze} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="Website-URL eingeben (z.B. example.com)"
                className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-[14px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none transition-all"
              />
            </div>
            <motion.button type="submit" disabled={loading || !url.trim()} whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] px-6 py-3.5 text-[14px] font-semibold text-white hover:shadow-lg hover:shadow-[#6C5CE7]/30 disabled:opacity-50 transition-all flex items-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              {loading ? "Analysiere..." : "Analysieren"}
            </motion.button>
          </form>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{error}</div>}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Score + Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col items-center justify-center">
                    <div className={`relative w-28 h-28 rounded-full flex items-center justify-center ${result.score >= 80 ? "bg-emerald-50" : result.score >= 50 ? "bg-amber-50" : "bg-red-50"}`}>
                      <svg className="absolute inset-0 w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                        <motion.circle cx="50" cy="50" r="44" fill="none"
                          stroke={result.score >= 80 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 44}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - result.score / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <span className={`text-3xl font-bold ${result.score >= 80 ? "text-emerald-600" : result.score >= 50 ? "text-amber-600" : "text-red-600"}`}>{result.score}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-3">SEO-Score</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col justify-center space-y-3">
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[13px] text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Bestanden</span><span className="text-[14px] font-bold text-emerald-600">{passCount}</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[13px] text-gray-600"><AlertTriangle className="h-4 w-4 text-amber-500" />Warnungen</span><span className="text-[14px] font-bold text-amber-600">{warnCount}</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[13px] text-gray-600"><XCircle className="h-4 w-4 text-red-500" />Fehler</span><span className="text-[14px] font-bold text-red-600">{failCount}</span></div>
                  </div>
                  <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Google-Vorschau</p>
                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
                      <p className="text-[14px] text-[#1a0dab] font-medium leading-tight truncate">{result.meta.title || "Kein Titel gefunden"}</p>
                      <p className="text-[12px] text-[#006621] mt-0.5 truncate">{result.url}</p>
                      <p className="text-[12px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">{result.meta.description || "Keine Meta-Beschreibung gefunden."}</p>
                    </div>
                    <div className="flex gap-4 mt-3 text-[11px] text-gray-400 flex-wrap">
                      <span><Clock className="inline h-3 w-3 mr-1" />{result.loadTimeMs}ms</span>
                      <span><FileText className="inline h-3 w-3 mr-1" />{result.performance.htmlSizeKb} KB</span>
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
                      <button key={cat} onClick={() => setActiveCategory(cat)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${activeCategory === cat ? "bg-[#6C5CE7] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        {cat === "all" ? "Alle" : cat}
                        <span className={`text-[10px] ${activeCategory === cat ? "text-white/70" : "text-gray-400"}`}>{count}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Checks */}
                <div className="space-y-2">
                  {filteredChecks.map((check) => {
                    const Icon = STATUS_ICON[check.status]
                    const isExp = expandedCheck === `${check.category}-${check.name}`
                    return (
                      <div key={`${check.category}-${check.name}`} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                        <button onClick={() => setExpandedCheck(isExp ? null : `${check.category}-${check.name}`)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors">
                          <div className={`w-8 h-8 rounded-lg ${STATUS_BG[check.status]} flex items-center justify-center shrink-0`}><Icon className={`h-4 w-4 ${STATUS_COLOR[check.status]}`} /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><span className="text-[13px] font-medium text-gray-900">{check.name}</span><span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{check.category}</span></div>
                            <p className="text-[12px] text-gray-500 mt-0.5 truncate">{check.value}</p>
                          </div>
                          <span className={`text-[11px] font-medium ${STATUS_COLOR[check.status]} shrink-0 hidden sm:block`}>{STATUS_LABEL[check.status]}</span>
                          {isExp ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                        </button>
                        <AnimatePresence>{isExp && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="px-4 pb-4 pt-0"><div className={`rounded-lg p-3.5 ${STATUS_BG[check.status]}`}><div className="flex items-start gap-2"><ArrowRight className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${STATUS_COLOR[check.status]}`} /><p className="text-[13px] text-gray-700 leading-relaxed">{check.recommendation}</p></div></div></div>
                          </motion.div>
                        )}</AnimatePresence>
                      </div>
                    )
                  })}
                </div>

                {/* Headings */}
                {result.headings.length > 0 && (
                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Überschriften-Struktur</h3>
                    <div className="space-y-1.5">
                      {result.headings.map((h, i) => (
                        <div key={i} className="flex items-center gap-2" style={{ paddingLeft: (parseInt(h.tag[1]) - 1) * 20 }}>
                          <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 shrink-0 ${h.tag === "h1" ? "bg-[#6C5CE7]/10 text-[#6C5CE7]" : "bg-gray-100 text-gray-500"}`}>{h.tag}</span>
                          <span className="text-[12px] text-gray-700 truncate">{h.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images without alt */}
                {result.images.filter((i) => !i.hasAlt).length > 0 && (
                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Bilder ohne Alt-Text ({result.images.filter((i) => !i.hasAlt).length})</h3>
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

          {!result && !loading && !error && (
            <div className="text-center py-20">
              <Globe className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-[15px] font-semibold text-gray-400 mb-1">Gib eine URL ein</h2>
              <p className="text-[13px] text-gray-400 max-w-md mx-auto">Alle Daten sind echt – keine Schätzungen.</p>
            </div>
          )}
        </>
      )}

      {/* ─── TAB: Keyword-Rankings ─────────────────────────────── */}
      {mainTab === "keywords" && (
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] text-blue-800 font-medium">Demo-Daten</p>
              <p className="text-[12px] text-blue-600 mt-0.5">
                Dies sind Beispieldaten zur Veranschaulichung. Verbinde deine Google Search Console unter
                <span className="font-medium"> Einstellungen → Integrationen</span>, um echte Keyword-Rankings zu sehen.
              </p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-[11px] text-gray-400">Keywords getrackt</p>
              <p className="text-[22px] font-bold text-gray-900 mt-1">{DEMO_KEYWORDS.length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-[11px] text-gray-400">Top 3 Positionen</p>
              <p className="text-[22px] font-bold text-emerald-600 mt-1">{DEMO_KEYWORDS.filter((k) => k.position <= 3).length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-[11px] text-gray-400">Top 10 Positionen</p>
              <p className="text-[22px] font-bold text-[#6C5CE7] mt-1">{DEMO_KEYWORDS.filter((k) => k.position <= 10).length}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-[11px] text-gray-400">Ø Klickrate</p>
              <p className="text-[22px] font-bold text-gray-900 mt-1">{(DEMO_KEYWORDS.reduce((a, k) => a + k.ctr, 0) / DEMO_KEYWORDS.length).toFixed(1)}%</p>
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text" value={keywordFilter} onChange={(e) => setKeywordFilter(e.target.value)}
                placeholder="Keyword suchen..."
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-[13px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              {([
                { key: "position" as const, label: "Position" },
                { key: "clicks" as const, label: "Klicks" },
                { key: "impressions" as const, label: "Impressionen" },
                { key: "ctr" as const, label: "CTR" },
              ]).map((s) => (
                <button key={s.key} onClick={() => setKeywordSort(s.key)}
                  className={`rounded-lg px-3 py-2 text-[11px] font-medium transition-all ${keywordSort === s.key ? "bg-[#6C5CE7] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Table */}
          <div className="space-y-2">
            {sortedKeywords.map((kw) => {
              const isExp = expandedKeyword === kw.query
              const posChange = kw.prevPosition !== null ? kw.prevPosition - kw.position : null
              const posColor = kw.position <= 3 ? "bg-emerald-100 text-emerald-700" : kw.position <= 10 ? "bg-blue-100 text-blue-700" : kw.position <= 20 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"

              return (
                <div key={kw.query} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                  <button onClick={() => setExpandedKeyword(isExp ? null : kw.query)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors">

                    {/* Position */}
                    <div className="flex items-center gap-2 shrink-0 w-20">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-bold ${posColor}`}>
                        {kw.position}
                      </span>
                      {posChange !== null && posChange !== 0 && (
                        <span className={`flex items-center text-[11px] font-semibold ${posChange > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {posChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(posChange)}
                        </span>
                      )}
                      {posChange === 0 && <Minus className="h-3 w-3 text-gray-300" />}
                      {posChange === null && <span className="text-[10px] text-blue-500 font-medium">Neu</span>}
                    </div>

                    {/* Keyword */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{kw.query}</p>
                    </div>

                    {/* Metrics */}
                    <div className="hidden sm:flex items-center gap-6 text-[12px] text-gray-500 shrink-0">
                      <div className="text-right w-16">
                        <p className="font-semibold text-gray-800">{kw.clicks.toLocaleString("de-CH")}</p>
                        <p className="text-[10px] text-gray-400">Klicks</p>
                      </div>
                      <div className="text-right w-20">
                        <p className="font-semibold text-gray-800">{kw.impressions.toLocaleString("de-CH")}</p>
                        <p className="text-[10px] text-gray-400">Impressionen</p>
                      </div>
                      <div className="text-right w-14">
                        <p className="font-semibold text-gray-800">{kw.ctr}%</p>
                        <p className="text-[10px] text-gray-400">CTR</p>
                      </div>
                    </div>

                    <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isExp ? "rotate-180" : ""}`} />
                  </button>

                  {/* Expanded: KI-Tipp */}
                  <AnimatePresence>
                    {isExp && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3">
                          {/* Mobile metrics */}
                          <div className="sm:hidden flex gap-4 text-[12px]">
                            <span><strong>{kw.clicks}</strong> Klicks</span>
                            <span><strong>{kw.impressions.toLocaleString("de-CH")}</strong> Impressionen</span>
                            <span><strong>{kw.ctr}%</strong> CTR</span>
                          </div>

                          {/* Tip */}
                          <div className="rounded-lg bg-[#6C5CE7]/[0.04] border border-[#6C5CE7]/10 p-4">
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[#6C5CE7]/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Lightbulb className="h-3.5 w-3.5 text-[#6C5CE7]" />
                              </div>
                              <div>
                                <p className="text-[12px] font-semibold text-[#6C5CE7] mb-1">Optimierungs-Tipp</p>
                                <p className="text-[13px] text-gray-700 leading-relaxed">{kw.tip}</p>
                              </div>
                            </div>
                          </div>

                          {/* Position bar */}
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-gray-400 w-24 shrink-0">Google-Position</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: kw.position <= 3 ? "#10b981" : kw.position <= 10 ? "#6C5CE7" : kw.position <= 20 ? "#f59e0b" : "#ef4444" }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(100 - (kw.position - 1) * 5, 5)}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                            <span className="text-[11px] font-medium text-gray-600 w-8 text-right">#{kw.position}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {sortedKeywords.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-10 w-10 text-gray-200 mx-auto mb-3" />
              <p className="text-[13px] text-gray-400">Keine Keywords gefunden</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
