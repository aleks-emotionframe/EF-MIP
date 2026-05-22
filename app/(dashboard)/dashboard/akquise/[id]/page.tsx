"use client"

import { use, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Sparkles,
  Share2,
  Search,
  Trash2,
  ChevronDown,
  Zap,
  Target,
  BarChart3,
  Smartphone,
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  ExternalLink,
} from "lucide-react"

const DEMO_LEADS: Record<string, {
  id: string
  name: string
  industry: string
  city: string
  score: number
  status: string
  address: string
  phone: string
  email: string
  website: string
  googleRating: number
  googleReviews: number
  analyzed: boolean
  websiteScore: number
  socialScore: number
  seoScore: number
  websiteAnalysis: {
    overall: number
    seo: number
    speed: number
    mobile: number
    content: number
    issues: string[]
    opportunities: string[]
  }
  socialAnalysis: {
    platforms: { name: string; found: boolean; handle: string; url: string }[]
    score: number
    issues: string[]
    opportunities: string[]
  }
  recommendations: {
    title: string
    description: string
    impact: string
    effort: string
    category: string
  }[]
  aiSummary: string
  quickWins: string[]
  longTermStrategy: string
  strengths: string[]
  weaknesses: string[]
  estimatedMonthlyValue: number
}> = {
  "1": {
    id: "1",
    name: "Restaurant Löwengarten",
    industry: "Gastronomie",
    city: "Zürich",
    score: 82,
    status: "Analysiert",
    address: "Limmatstrasse 42, 8005 Zürich",
    phone: "+41 44 321 65 87",
    email: "info@loewengarten.ch",
    website: "https://loewengarten.ch",
    googleRating: 4.2,
    googleReviews: 187,
    analyzed: true,
    websiteScore: 65,
    socialScore: 45,
    seoScore: 72,
    websiteAnalysis: {
      overall: 65,
      seo: 72,
      speed: 48,
      mobile: 71,
      content: 69,
      issues: [
        "Ladezeit über 4 Sekunden auf Mobile",
        "Keine strukturierten Daten (Schema.org) vorhanden",
        "Bilder nicht optimiert (WebP fehlt)",
        "Kein SSL-Zertifikat auf Unterseiten",
        "Meta-Beschreibungen fehlen auf 60% der Seiten",
      ],
      opportunities: [
        "Online-Reservierungssystem integrieren",
        "Speisekarte als strukturierte Daten einbinden",
        "Google Fonts lokal hosten für bessere Ladezeit",
        "Lazy Loading für Bilder implementieren",
      ],
    },
    socialAnalysis: {
      platforms: [
        { name: "Instagram", found: true, handle: "@loewengarten_zh", url: "https://instagram.com/loewengarten_zh" },
        { name: "Facebook", found: true, handle: "Restaurant Löwengarten", url: "https://facebook.com/loewengarten" },
        { name: "LinkedIn", found: false, handle: "", url: "" },
        { name: "TikTok", found: false, handle: "", url: "" },
      ],
      score: 45,
      issues: [
        "Instagram: Nur 2-3 Posts pro Monat",
        "Facebook: Letzer Post vor 3 Wochen",
        "Keine einheitliche Bildsprache",
        "Stories werden nicht genutzt",
        "Keine Reels oder Video-Content",
      ],
      opportunities: [
        "Regelmässige Instagram Stories mit Tagesmenü",
        "Behind-the-scenes Content aus der Küche",
        "User Generated Content fördern",
        "Google Business Beiträge nutzen",
      ],
    },
    recommendations: [
      {
        title: "Instagram-Strategie aufbauen",
        description: "Regelmässiger Content-Plan mit 4-5 Posts pro Woche, tägliche Stories mit Tagesmenü und Behind-the-scenes Content",
        impact: "hoch",
        effort: "mittel",
        category: "Social Media",
      },
      {
        title: "Google Business optimieren",
        description: "Profil vollständig ausfüllen, regelmässige Beiträge, auf alle Bewertungen antworten, Fotos aktualisieren",
        impact: "hoch",
        effort: "einfach",
        category: "Local SEO",
      },
      {
        title: "Website-Geschwindigkeit verbessern",
        description: "Bilder komprimieren, Caching einrichten, CSS/JS minimieren. Ziel: Ladezeit unter 2 Sekunden",
        impact: "mittel",
        effort: "mittel",
        category: "Website",
      },
      {
        title: "SEO-Grundlagen implementieren",
        description: "Meta-Tags optimieren, strukturierte Daten einbinden, lokale Keywords integrieren",
        impact: "hoch",
        effort: "mittel",
        category: "SEO",
      },
      {
        title: "Newsletter einführen",
        description: "Monatlicher Newsletter mit Events, Spezialmenüs und Angeboten. E-Mail-Liste über Website und vor Ort aufbauen",
        impact: "mittel",
        effort: "einfach",
        category: "E-Mail Marketing",
      },
      {
        title: "Online-Reservierungssystem",
        description: "Integration eines Reservierungstools auf der Website und in Google Business für direkte Buchungen",
        impact: "hoch",
        effort: "aufwändig",
        category: "Website",
      },
    ],
    aiSummary:
      "Das Restaurant Löwengarten hat eine solide Basis mit guten Google-Bewertungen (4.2 Sterne, 187 Bewertungen) und einer bestehenden Online-Präsenz. Die grössten Verbesserungspotenziale liegen in der Social-Media-Strategie und der technischen Website-Optimierung. Mit gezielten Massnahmen in diesen Bereichen kann die Online-Sichtbarkeit deutlich gesteigert und neue Gäste gewonnen werden.",
    quickWins: [
      "Google Business Profil vollständig ausfüllen und Fotos aktualisieren",
      "Auf alle Google-Bewertungen antworten",
      "Instagram-Posting-Frequenz auf 4x pro Woche erhöhen",
      "Tägliche Instagram Stories mit Tagesmenü starten",
    ],
    longTermStrategy:
      "Langfristig sollte eine ganzheitliche Digital-Marketing-Strategie entwickelt werden, die Social Media, SEO und E-Mail-Marketing verbindet. Ein professionelles Online-Reservierungssystem reduziert den Aufwand und erhöht die Buchungsrate. Content-Marketing mit Rezepten, Koch-Videos und Geschichten rund um das Restaurant stärkt die Marke und bindet Gäste langfristig.",
    strengths: [
      "Gute Google-Bewertungen (4.2 Sterne)",
      "Hohe Anzahl Bewertungen (187)",
      "Website vorhanden und erreichbar",
      "Instagram und Facebook Präsenz aufgebaut",
      "Zentrale Lage in Zürich",
    ],
    weaknesses: [
      "Website-Ladezeit zu langsam",
      "Unregelmässige Social-Media-Aktivität",
      "Keine Online-Reservierungsmöglichkeit",
      "SEO nicht optimiert",
      "Kein Newsletter oder E-Mail-Marketing",
      "Keine Video-Inhalte",
    ],
    estimatedMonthlyValue: 1850,
  },
}

const STATUS_OPTIONS = ["Neu", "Kontaktiert", "Analysiert", "In Verhandlung", "Gewonnen", "Verloren"]

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-[#0F172A]">{score}</span>
    </div>
  )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-[#0F172A]">{score}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function ImpactBadge({ level }: { level: string }) {
  const config: Record<string, string> = {
    hoch: "bg-emerald-100 text-emerald-700",
    mittel: "bg-amber-100 text-amber-700",
    niedrig: "bg-gray-100 text-gray-600",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config[level] || config.niedrig}`}>
      {level}
    </span>
  )
}

function EffortBadge({ level }: { level: string }) {
  const config: Record<string, string> = {
    einfach: "bg-blue-100 text-blue-700",
    mittel: "bg-purple-100 text-purple-700",
    "aufwändig": "bg-red-100 text-red-700",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config[level] || config.mittel}`}>
      {level}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    Neu: "bg-blue-100 text-blue-700",
    Kontaktiert: "bg-amber-100 text-amber-700",
    Analysiert: "bg-purple-100 text-purple-700",
    "In Verhandlung": "bg-cyan-100 text-cyan-700",
    Gewonnen: "bg-emerald-100 text-emerald-700",
    Verloren: "bg-red-100 text-red-700",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[status] || config.Neu}`}>
      {status}
    </span>
  )
}

function PlatformIcon({ name }: { name: string }) {
  switch (name) {
    case "Instagram":
      return <Instagram className="w-5 h-5" />
    case "Facebook":
      return <Facebook className="w-5 h-5" />
    case "LinkedIn":
      return <Linkedin className="w-5 h-5" />
    default:
      return <Share2 className="w-5 h-5" />
  }
}

export default function AkquiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const lead = DEMO_LEADS[id]
  const [status, setStatus] = useState(lead?.status ?? "Neu")
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Search className="w-16 h-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-[#0F172A]">Lead nicht gefunden</h1>
        <p className="text-gray-500">Der angeforderte Lead existiert nicht oder wurde entfernt.</p>
        <Link
          href="/dashboard/akquise"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium hover:opacity-90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>
      </div>
    )
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      await fetch("/api/akquise/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id }),
      })
    } catch {
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/akquise"
            className="p-2 rounded bg-white border border-gray-100 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
          </Link>
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#0F172A]">{lead.name}</h1>
                <StatusBadge status={status} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-600">
                  {lead.industry}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  {lead.city}
                </span>
              </div>
            </div>
            <ScoreCircle score={lead.score} size={56} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!lead.analyzed && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white border border-gray-100 text-[#0F172A] font-medium text-sm hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {analyzing ? "Analysiert..." : "Analysieren"}
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white border border-gray-100 text-[#0F172A] font-medium text-sm hover:bg-gray-50 transition"
            >
              Status ändern
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-gray-100 z-10">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatus(opt)
                      setShowStatusDropdown(false)
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      status === opt ? "text-[#6C5CE7] font-medium" : "text-[#0F172A]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            href={`/dashboard/kunden/neu?name=${encodeURIComponent(lead.name)}&industry=${encodeURIComponent(lead.industry)}&website=${encodeURIComponent(lead.website)}&email=${encodeURIComponent(lead.email)}&phone=${encodeURIComponent(lead.phone)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium text-sm hover:opacity-90 transition"
          >
            <TrendingUp className="w-4 h-4" />
            Als Kunde übernehmen
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Unternehmensdaten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Name</p>
                <p className="text-sm font-medium text-[#0F172A] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {lead.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Branche</p>
                <p className="text-sm font-medium text-[#0F172A]">{lead.industry}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Adresse</p>
                <p className="text-sm font-medium text-[#0F172A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {lead.address}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Stadt</p>
                <p className="text-sm font-medium text-[#0F172A]">{lead.city}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Telefon</p>
                <a href={`tel:${lead.phone}`} className="text-sm font-medium text-[#6C5CE7] hover:underline flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {lead.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">E-Mail</p>
                <a href={`mailto:${lead.email}`} className="text-sm font-medium text-[#6C5CE7] hover:underline flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {lead.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Website</p>
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#6C5CE7] hover:underline inline-flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {lead.website.replace("https://", "")}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Google Bewertung</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(lead.googleRating)
                            ? "text-amber-400 fill-amber-400"
                            : star - 0.5 <= lead.googleRating
                            ? "text-amber-400 fill-amber-400/50"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A]">{lead.googleRating}</span>
                  <span className="text-xs text-gray-500">({lead.googleReviews} Bewertungen)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {lead.analyzed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#6C5CE7]" />
                <h2 className="text-lg font-semibold text-[#0F172A]">Website-Analyse</h2>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Gesamtbewertung</span>
                  <span className="text-sm font-bold text-[#0F172A]">{lead.websiteAnalysis.overall}/100</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      lead.websiteAnalysis.overall >= 75
                        ? "bg-emerald-500"
                        : lead.websiteAnalysis.overall >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${lead.websiteAnalysis.overall}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "SEO", score: lead.websiteAnalysis.seo, icon: Search },
                  { label: "Speed", score: lead.websiteAnalysis.speed, icon: Zap },
                  { label: "Mobile", score: lead.websiteAnalysis.mobile, icon: Smartphone },
                  { label: "Content", score: lead.websiteAnalysis.content, icon: FileText },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 rounded bg-gray-50">
                    <item.icon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`text-lg font-bold ${
                      item.score >= 75 ? "text-emerald-600" : item.score >= 50 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {item.score}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Probleme
                  </h3>
                  <ul className="space-y-2">
                    {lead.websiteAnalysis.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Chancen
                  </h3>
                  <ul className="space-y-2">
                    {lead.websiteAnalysis.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {lead.analyzed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-[#00CEC9]" />
                <h2 className="text-lg font-semibold text-[#0F172A]">Social Media Analyse</h2>
              </div>
              <div className="space-y-3 mb-6">
                {lead.socialAnalysis.platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between p-3 rounded bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon name={platform.name} />
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{platform.name}</p>
                        {platform.found && (
                          <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#6C5CE7] hover:underline"
                          >
                            {platform.handle}
                          </a>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        platform.found
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {platform.found ? "Gefunden" : "Nicht gefunden"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Social Score</span>
                  <span className="text-sm font-bold text-[#0F172A]">{lead.socialAnalysis.score}/100</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      lead.socialAnalysis.score >= 75
                        ? "bg-emerald-500"
                        : lead.socialAnalysis.score >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${lead.socialAnalysis.score}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Probleme
                  </h3>
                  <ul className="space-y-2">
                    {lead.socialAnalysis.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Chancen
                  </h3>
                  <ul className="space-y-2">
                    {lead.socialAnalysis.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {lead.analyzed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
                <h2 className="text-lg font-semibold text-[#0F172A]">KI-Empfehlungen</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">{lead.aiSummary}</p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 font-semibold text-[#0F172A]">Titel</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#0F172A] hidden sm:table-cell">Beschreibung</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#0F172A]">Impact</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#0F172A]">Aufwand</th>
                      <th className="text-left py-3 px-2 font-semibold text-[#0F172A] hidden md:table-cell">Kategorie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.recommendations.map((rec, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="py-3 px-2 font-medium text-[#0F172A]">{rec.title}</td>
                        <td className="py-3 px-2 text-gray-500 hidden sm:table-cell max-w-xs">{rec.description}</td>
                        <td className="py-3 px-2"><ImpactBadge level={rec.impact} /></td>
                        <td className="py-3 px-2"><EffortBadge level={rec.effort} /></td>
                        <td className="py-3 px-2 text-gray-500 hidden md:table-cell">{rec.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Quick Wins
                  </h3>
                  <ul className="space-y-2">
                    {lead.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#6C5CE7]" />
                    Langfristige Strategie
                  </h3>
                  <p className="text-sm text-gray-500">{lead.longTermStrategy}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Potenzial-Score</h2>
            <div className="flex justify-center mb-6">
              <ScoreCircle score={lead.score} size={140} />
            </div>
            <div className="space-y-4">
              <ScoreBar label="Website Score" score={lead.websiteScore} />
              <ScoreBar label="Social Score" score={lead.socialScore} />
              <ScoreBar label="SEO Score" score={lead.seoScore} />
            </div>
            <div className="mt-6 p-4 rounded bg-gradient-to-r from-[#00CEC9]/10 to-[#6C5CE7]/10 border border-[#6C5CE7]/20">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Geschätzter Monatswert</p>
              <p className="text-2xl font-bold text-[#0F172A]">
                CHF {lead.estimatedMonthlyValue.toLocaleString("de-CH")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Stärken & Schwächen</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Stärken
                </h3>
                <ul className="space-y-2">
                  {lead.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Schwächen
                </h3>
                <ul className="space-y-2">
                  {lead.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Aktionen</h2>
            <div className="space-y-3">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                <BarChart3 className="w-4 h-4" />
                {analyzing ? "Analyse läuft..." : "Analyse starten"}
              </button>
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-white border border-gray-200 text-[#0F172A] font-medium text-sm hover:bg-gray-50 transition"
              >
                <Mail className="w-4 h-4" />
                E-Mail senden
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-white border border-gray-200 text-[#0F172A] font-medium text-sm hover:bg-gray-50 transition"
              >
                <Phone className="w-4 h-4" />
                Anrufen
              </a>
              <Link
                href={`/dashboard/kunden/neu?name=${encodeURIComponent(lead.name)}&industry=${encodeURIComponent(lead.industry)}&website=${encodeURIComponent(lead.website)}&email=${encodeURIComponent(lead.email)}&phone=${encodeURIComponent(lead.phone)}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-[#6C5CE7]/10 text-[#6C5CE7] font-medium text-sm hover:bg-[#6C5CE7]/20 transition"
              >
                <TrendingUp className="w-4 h-4" />
                Als Kunde übernehmen
              </Link>
              <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-red-50 text-red-600 border border-red-200 font-medium text-sm hover:bg-red-100 transition">
                <Trash2 className="w-4 h-4" />
                Lead löschen
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}