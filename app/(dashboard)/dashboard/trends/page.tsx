"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp, Search, PenTool, Bell, Zap, Target,
  Sparkles, ArrowUpRight, MessageSquare, ExternalLink,
  Loader2, RefreshCw, ChevronDown, ChevronUp, Clock,
  Info, Filter,
} from "lucide-react"

interface TrendItem {
  id: string
  title: string
  summary: string
  subreddit: string
  score: number
  comments: number
  url: string
  createdAt: string
  tags: string[]
}

interface TrendCategory {
  name: string
  icon: string
  trends: TrendItem[]
}

interface TrendsData {
  source: string
  fetchedAt: string
  timeframe: string
  totalPosts: number
  categories: TrendCategory[]
  isDemo?: boolean
}

const ICON_MAP: Record<string, any> = {
  "target": Target,
  "pen-tool": PenTool,
  "bell": Bell,
  "zap": Zap,
  "trending-up": TrendingUp,
  "search": Search,
  "sparkles": Sparkles,
}

const TAG_COLORS: Record<string, string> = {
  "Instagram": "#E1306C",
  "TikTok": "#000000",
  "LinkedIn": "#0A66C2",
  "Facebook": "#1877F2",
  "YouTube": "#FF0000",
  "X/Twitter": "#1DA1F2",
  "Threads": "#000000",
  "Kurzvideos": "#FD79A8",
  "KI": "#6C5CE7",
  "SEO": "#E37400",
  "Engagement": "#00CEC9",
  "Organisch": "#00B894",
  "Paid": "#FDCB6E",
}

export default function TrendsPage() {
  const [data, setData] = useState<TrendsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  async function fetchTrends() {
    setLoading(true)
    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeframe }),
      })
      const json = await res.json()
      setData(json)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrends() }, [timeframe])

  const allTrends = data?.categories.flatMap((c) => c.trends) ?? []
  const filteredCategories = activeCategory === "all"
    ? data?.categories ?? []
    : (data?.categories ?? []).filter((c) => c.name === activeCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#6C5CE7]" />
            <h1 className="text-xl font-semibold text-gray-900">Social-Media-Trends</h1>
          </div>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Aktuelle Trends aus Reddit-Communities – was die Branche gerade bewegt.
          </p>
        </div>
        <button onClick={fetchTrends} disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2.5 text-[12px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Aktualisieren
        </button>
      </div>

      {/* Source Info */}
      {data?.source === "demo" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] text-blue-800 font-medium">Demo-Daten</p>
            <p className="text-[12px] text-blue-600 mt-0.5">
              Trage deine Reddit API-Keys in den Umgebungsvariablen ein (REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD) um Live-Daten zu sehen.
            </p>
          </div>
        </div>
      )}
      {data?.source === "reddit-live" && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <p className="text-[12px] text-emerald-700">
            <span className="font-semibold">Live-Daten</span> aus {data.totalPosts} Reddit-Beiträgen · Aktualisiert: {new Date(data.fetchedAt).toLocaleString("de-CH")}
          </p>
        </div>
      )}

      {/* Timeframe + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
          {([
            { key: "day" as const, label: "Heute" },
            { key: "week" as const, label: "Diese Woche" },
            { key: "month" as const, label: "Dieser Monat" },
          ]).map((t) => (
            <button key={t.key} onClick={() => setTimeframe(t.key)}
              className={`relative rounded-lg px-4 py-1.5 text-[12px] font-medium transition-all ${timeframe === t.key ? "text-gray-900" : "text-gray-500"}`}>
              {timeframe === t.key && <motion.div layoutId="trend-time" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          <button onClick={() => setActiveCategory("all")}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${activeCategory === "all" ? "bg-[#6C5CE7] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            Alle
          </button>
          {(data?.categories ?? []).map((cat) => {
            const Icon = ICON_MAP[cat.icon] ?? Sparkles
            return (
              <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${activeCategory === cat.name ? "bg-[#6C5CE7] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                <Icon className="h-3 w-3" />
                {cat.name}
                <span className={`text-[10px] ${activeCategory === cat.name ? "text-white/70" : "text-gray-400"}`}>{cat.trends.length}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#6C5CE7]" />
          <span className="ml-2 text-[13px] text-gray-500">Reddit-Trends werden geladen...</span>
        </div>
      )}

      {/* Trends by Category */}
      {!loading && (
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = ICON_MAP[category.icon] ?? Sparkles
            return (
              <div key={category.name}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#6C5CE7]/[0.06] flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-[#6C5CE7]" />
                  </div>
                  <h2 className="text-[14px] font-semibold text-gray-900">{category.name}</h2>
                  <span className="text-[11px] text-gray-400">{category.trends.length} Trends</span>
                </div>

                <div className="space-y-2">
                  {category.trends.map((trend) => {
                    const isExp = expandedId === trend.id
                    return (
                      <motion.div key={trend.id} layout className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                        <button onClick={() => setExpandedId(isExp ? null : trend.id)}
                          className="w-full flex items-start gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors">

                          {/* Score */}
                          <div className="flex flex-col items-center shrink-0 w-12">
                            <ArrowUpRight className="h-3.5 w-3.5 text-[#6C5CE7]" />
                            <span className="text-[14px] font-bold text-gray-900">{trend.score >= 1000 ? `${(trend.score / 1000).toFixed(1)}k` : trend.score}</span>
                            <span className="text-[9px] text-gray-400">Upvotes</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-gray-900 leading-snug">{trend.title}</p>

                            {/* Tags */}
                            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                              <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 font-medium">r/{trend.subreddit}</span>
                              {trend.tags.map((tag) => (
                                <span key={tag} className="text-[10px] rounded px-1.5 py-0.5 font-medium text-white"
                                  style={{ backgroundColor: TAG_COLORS[tag] ?? "#9ca3af" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{trend.comments}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{trend.createdAt}</span>
                          </div>

                          <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExp ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isExp && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="px-4 pb-4 space-y-3">
                                {trend.summary && (
                                  <div className="rounded-lg bg-gray-50 p-3.5">
                                    <p className="text-[13px] text-gray-700 leading-relaxed">{trend.summary}</p>
                                  </div>
                                )}

                                {/* AI Takeaway */}
                                <div className="rounded-lg bg-[#6C5CE7]/[0.04] border border-[#6C5CE7]/10 p-3.5">
                                  <div className="flex items-start gap-2.5">
                                    <Sparkles className="h-4 w-4 text-[#6C5CE7] mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-[12px] font-semibold text-[#6C5CE7] mb-1">Was bedeutet das für dich?</p>
                                      <p className="text-[13px] text-gray-700 leading-relaxed">{generateTakeaway(trend)}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Mobile meta + Link */}
                                <div className="flex items-center justify-between">
                                  <div className="sm:hidden flex gap-3 text-[11px] text-gray-400">
                                    <span>{trend.comments} Kommentare</span>
                                    <span>{trend.createdAt}</span>
                                  </div>
                                  {trend.url !== "#" && (
                                    <a href={trend.url} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-[12px] font-medium text-[#6C5CE7] hover:underline">
                                      <ExternalLink className="h-3 w-3" />Auf Reddit ansehen
                                    </a>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {filteredCategories.length === 0 && !loading && (
            <div className="text-center py-16">
              <TrendingUp className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-[13px] text-gray-400">Keine Trends für diese Kategorie</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Generate contextual takeaway per trend ─────────────────────
function generateTakeaway(trend: TrendItem): string {
  const t = trend.title.toLowerCase()

  if (/carousel|karussell/i.test(t)) return "Teste Karussell-Posts für deine nächsten Beiträge. Erstelle 5-7 Slides mit einem starken Hook auf Slide 1 und einem Call-to-Action auf der letzten Slide."
  if (/hook|3.second|first.*second/i.test(t)) return "Überarbeite die ersten 0.5 Sekunden deiner Reels und TikToks. Nutze einen visuellen Pattern Interrupt (Texteinblendung, Zoom, Schnitt) statt eines gesprochenen Hooks."
  if (/blend|new.*feature|test/i.test(t)) return "Beobachte dieses Feature – wenn es ausgerollt wird, könnte Collaborative Content eine neue organische Reichweiten-Quelle werden. Plane jetzt schon Inhalte, die zum Teilen einladen."
  if (/hashtag|killed/i.test(t)) return "Setze auf Keyword-optimierte Texte statt Hashtags. Verwende relevante Begriffe natürlich im Beitragstext, besonders in den ersten 2 Zeilen."
  if (/ai.*flag|content.*flag/i.test(t)) return "Nutze KI als Unterstützung beim Brainstorming und Strukturieren, aber schreibe die finalen Texte selbst um. Authentische, persönliche Perspektiven werden vom Algorithmus bevorzugt."
  if (/grew.*follow|0.*to.*k/i.test(t)) return "Analysiere die genannte Strategie und adaptiere sie für deine Nische. Konsistenz und Nischen-Fokus sind die häufigsten Erfolgsfaktoren bei schnellem Wachstum."
  if (/comment|engagement.*hack/i.test(t)) return "Plane täglich 20-30 Minuten für strategisches Kommentieren unter relevanten Posts in deiner Branche ein. Schreibe dabei echte, wertvolle Kommentare – nicht nur Emojis."
  if (/sge|google.*ai|search.*generative/i.test(t)) return "Optimiere deine Inhalte für AI Overviews: Strukturierte Daten, FAQ-Sektionen und direkte Antworten auf häufige Fragen. Long-Tail Keywords werden wichtiger."
  if (/stop.*post.*daily|3x.*week|less.*more/i.test(t)) return "Teste eine reduzierte Posting-Frequenz bei höherer Qualität. Miss die Engagement-Rate pro Post (nicht gesamt) und vergleiche nach 4 Wochen."

  if (trend.score > 1000) return `Dieser Beitrag hat ${trend.score.toLocaleString("de-CH")} Upvotes und ${trend.comments} Kommentare – ein klares Zeichen, dass dieses Thema die Community stark beschäftigt. Prüfe, ob du diesen Trend für deine eigene Strategie nutzen kannst.`
  return `Dieser Trend aus r/${trend.subreddit} zeigt eine aktuelle Diskussion in der Branche. Beobachte die Entwicklung und überlege, ob du dazu Content erstellen oder deine Strategie anpassen solltest.`
}
