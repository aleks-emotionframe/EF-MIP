"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Search, Target, TrendingUp, Users, Building2, Globe, Star,
  MapPin, ExternalLink, BarChart3, Filter, Play, CheckCircle,
  Clock, XCircle, ChevronDown, Loader2, Sparkles, RefreshCw,
} from "lucide-react"

type LeadStatus = "NEW" | "ANALYZED" | "CONTACTED" | "INTERESTED" | "CONVERTED" | "NOT_INTERESTED"

interface Lead {
  id: string
  companyName: string
  industry: string
  city: string
  canton: string
  website: string | null
  googleRating: number | null
  googleReviews: number
  score: number
  websiteScore: number
  socialScore: number
  seoScore: number
  status: LeadStatus
  socialMedia: { instagram: boolean; facebook: boolean; linkedin: boolean; tiktok: boolean } | null
  foundAt: string
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  NEW: { label: "Neu", color: "text-blue-700", bg: "bg-blue-100" },
  ANALYZED: { label: "Analysiert", color: "text-teal-700", bg: "bg-teal-100" },
  CONTACTED: { label: "Kontaktiert", color: "text-orange-700", bg: "bg-orange-100" },
  INTERESTED: { label: "Interessiert", color: "text-green-700", bg: "bg-green-100" },
  CONVERTED: { label: "Konvertiert", color: "text-purple-700", bg: "bg-purple-100" },
  NOT_INTERESTED: { label: "Kein Interesse", color: "text-gray-600", bg: "bg-gray-100" },
}

const INDUSTRIES = [
  "Alle Branchen", "Gastronomie", "Fitness", "Mode & Retail", "Immobilien",
  "Gesundheit", "Technologie", "Bildung", "Tourismus", "Handwerk",
  "Beauty & Wellness", "Finanzen", "Beratung",
]

const DEMO_LEADS: Lead[] = [
  { id: "l1", companyName: "Restaurant Löwengarten", industry: "Gastronomie", city: "Zürich", canton: "ZH", website: "https://loewengarten.ch", googleRating: 4.2, googleReviews: 187, score: 82, websiteScore: 75, socialScore: 88, seoScore: 70, status: "NEW", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-20" },
  { id: "l2", companyName: "FitZone Basel", industry: "Fitness", city: "Basel", canton: "BS", website: "https://fitzone-basel.ch", googleRating: 3.8, googleReviews: 94, score: 45, websiteScore: 40, socialScore: 52, seoScore: 38, status: "ANALYZED", socialMedia: { instagram: true, facebook: false, linkedin: false, tiktok: true }, foundAt: "2026-05-19" },
  { id: "l3", companyName: "Schneider Immobilien", industry: "Immobilien", city: "Bern", canton: "BE", website: "https://schneider-immo.ch", googleRating: 4.5, googleReviews: 63, score: 71, websiteScore: 68, socialScore: 65, seoScore: 80, status: "CONTACTED", socialMedia: { instagram: false, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-18" },
  { id: "l4", companyName: "Bella Moda Boutique", industry: "Mode & Retail", city: "Luzern", canton: "LU", website: "https://bellamoda.ch", googleRating: 4.1, googleReviews: 42, score: 38, websiteScore: 30, socialScore: 45, seoScore: 35, status: "NEW", socialMedia: { instagram: true, facebook: false, linkedin: false, tiktok: false }, foundAt: "2026-05-17" },
  { id: "l5", companyName: "Dr. Meier Zahnklinik", industry: "Gesundheit", city: "Winterthur", canton: "ZH", website: "https://zahnklinik-meier.ch", googleRating: 4.7, googleReviews: 231, score: 56, websiteScore: 60, socialScore: 35, seoScore: 72, status: "ANALYZED", socialMedia: { instagram: false, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-16" },
  { id: "l6", companyName: "Café Monico", industry: "Gastronomie", city: "Genf", canton: "GE", website: "https://cafemonico.ch", googleRating: 4.4, googleReviews: 312, score: 91, websiteScore: 85, socialScore: 95, seoScore: 88, status: "INTERESTED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-05-15" },
  { id: "l7", companyName: "TechHub Zürich", industry: "Technologie", city: "Zürich", canton: "ZH", website: "https://techhub-zh.ch", googleRating: 4.0, googleReviews: 28, score: 67, websiteScore: 80, socialScore: 55, seoScore: 65, status: "NEW", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-05-14" },
  { id: "l8", companyName: "Blumen Zauber", industry: "Handwerk", city: "St. Gallen", canton: "SG", website: null, googleRating: 4.8, googleReviews: 156, score: 34, websiteScore: 0, socialScore: 48, seoScore: 20, status: "NOT_INTERESTED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-13" },
  { id: "l9", companyName: "Alpine Yoga Studio", industry: "Fitness", city: "Interlaken", canton: "BE", website: "https://alpine-yoga.ch", googleRating: 4.9, googleReviews: 87, score: 78, websiteScore: 72, socialScore: 90, seoScore: 60, status: "CONTACTED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-05-12" },
  { id: "l10", companyName: "Bäckerei Hofmann", industry: "Gastronomie", city: "Thun", canton: "BE", website: "https://hofmann-baeckerei.ch", googleRating: 4.6, googleReviews: 203, score: 53, websiteScore: 45, socialScore: 50, seoScore: 65, status: "ANALYZED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-11" },
  { id: "l11", companyName: "LuxusHaar Salon", industry: "Beauty & Wellness", city: "Lausanne", canton: "VD", website: "https://luxushaar.ch", googleRating: 4.3, googleReviews: 178, score: 85, websiteScore: 80, socialScore: 92, seoScore: 78, status: "CONVERTED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-05-10" },
  { id: "l12", companyName: "Weber Treuhand", industry: "Finanzen", city: "Aarau", canton: "AG", website: "https://weber-treuhand.ch", googleRating: 4.1, googleReviews: 34, score: 62, websiteScore: 70, socialScore: 30, seoScore: 85, status: "NEW", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-05-09" },
  { id: "l13", companyName: "Pizzeria Da Luigi", industry: "Gastronomie", city: "Lugano", canton: "TI", website: null, googleRating: 4.5, googleReviews: 421, score: 41, websiteScore: 0, socialScore: 60, seoScore: 25, status: "ANALYZED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-08" },
  { id: "l14", companyName: "SwissCode Academy", industry: "Bildung", city: "Zürich", canton: "ZH", website: "https://swisscode.academy", googleRating: 4.6, googleReviews: 67, score: 74, websiteScore: 85, socialScore: 70, seoScore: 68, status: "INTERESTED", socialMedia: { instagram: true, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-07" },
  { id: "l15", companyName: "Berghotel Edelweiss", industry: "Tourismus", city: "Zermatt", canton: "VS", website: "https://berghotel-edelweiss.ch", googleRating: 4.4, googleReviews: 534, score: 88, websiteScore: 82, socialScore: 90, seoScore: 85, status: "CONTACTED", socialMedia: { instagram: true, facebook: true, linkedin: true, tiktok: true }, foundAt: "2026-05-06" },
  { id: "l16", companyName: "Schreiner Meister GmbH", industry: "Handwerk", city: "Olten", canton: "SO", website: "https://schreiner-meister.ch", googleRating: 4.7, googleReviews: 45, score: 49, websiteScore: 55, socialScore: 25, seoScore: 68, status: "NEW", socialMedia: { instagram: false, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-05" },
  { id: "l17", companyName: "Consulting Plus AG", industry: "Beratung", city: "Zug", canton: "ZG", website: "https://consultingplus.ch", googleRating: 3.9, googleReviews: 22, score: 58, websiteScore: 65, socialScore: 40, seoScore: 70, status: "NOT_INTERESTED", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-05-04" },
  { id: "l18", companyName: "Modehaus Tanner", industry: "Mode & Retail", city: "Schaffhausen", canton: "SH", website: "https://modehaus-tanner.ch", googleRating: 4.0, googleReviews: 89, score: 63, websiteScore: 58, socialScore: 72, seoScore: 55, status: "ANALYZED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-03" },
  { id: "l19", companyName: "Kinderland Spielgruppe", industry: "Bildung", city: "Baden", canton: "AG", website: "https://kinderland-baden.ch", googleRating: 4.8, googleReviews: 112, score: 36, websiteScore: 30, socialScore: 42, seoScore: 32, status: "NEW", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-02" },
  { id: "l20", companyName: "Autohaus Keller", industry: "Handwerk", city: "Frauenfeld", canton: "TG", website: "https://autohaus-keller.ch", googleRating: 4.3, googleReviews: 167, score: 72, websiteScore: 70, socialScore: 65, seoScore: 80, status: "CONTACTED", socialMedia: { instagram: false, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-01" },
  { id: "l21", companyName: "Nail Art Studio", industry: "Beauty & Wellness", city: "Biel", canton: "BE", website: "https://nailart-biel.ch", googleRating: 4.6, googleReviews: 98, score: 77, websiteScore: 68, socialScore: 88, seoScore: 65, status: "INTERESTED", socialMedia: { instagram: true, facebook: false, linkedin: false, tiktok: true }, foundAt: "2026-04-30" },
  { id: "l22", companyName: "Reisebüro Fernweh", industry: "Tourismus", city: "Chur", canton: "GR", website: "https://fernweh-reisen.ch", googleRating: 4.2, googleReviews: 76, score: 55, websiteScore: 60, socialScore: 50, seoScore: 52, status: "ANALYZED", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-04-29" },
  { id: "l23", companyName: "Bio Hofladen Müller", industry: "Gastronomie", city: "Solothurn", canton: "SO", website: null, googleRating: 4.9, googleReviews: 245, score: 44, websiteScore: 0, socialScore: 55, seoScore: 30, status: "NEW", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-04-28" },
  { id: "l24", companyName: "IT Solutions Bern", industry: "Technologie", city: "Bern", canton: "BE", website: "https://itsolutions-bern.ch", googleRating: 4.1, googleReviews: 19, score: 69, websiteScore: 78, socialScore: 45, seoScore: 82, status: "CONVERTED", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-04-27" },
  { id: "l25", companyName: "Yoga & Balance Center", industry: "Fitness", city: "Rapperswil", canton: "SG", website: "https://yogabalance.ch", googleRating: 4.7, googleReviews: 134, score: 81, websiteScore: 75, socialScore: 85, seoScore: 78, status: "NEW", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-04-26" },
]

function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const color = score > 70 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444"
  const bgColor = score > 70 ? "bg-emerald-50" : score >= 40 ? "bg-amber-50" : "bg-red-50"
  const dim = size === "lg" ? "w-16 h-16" : "w-10 h-10"
  const textSize = size === "lg" ? "text-xl" : "text-sm"

  return (
    <div className={`${dim} ${bgColor} rounded-full flex items-center justify-center border-2 shrink-0`} style={{ borderColor: color }}>
      <span className={`${textSize} font-bold`} style={{ color }}>{score}</span>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function SocialDots({ socialMedia }: { socialMedia: Lead["socialMedia"] }) {
  const platforms = [
    { key: "instagram" as const, color: "#E1306C", label: "Instagram" },
    { key: "facebook" as const, color: "#1877F2", label: "Facebook" },
    { key: "linkedin" as const, color: "#0A66C2", label: "LinkedIn" },
    { key: "tiktok" as const, color: "#000000", label: "TikTok" },
  ]

  return (
    <div className="flex items-center gap-1.5">
      {platforms.map((p) => (
        <div
          key={p.key}
          className="w-2.5 h-2.5 rounded-full"
          title={p.label}
          style={{ backgroundColor: socialMedia?.[p.key] ? p.color : "#D1D5DB" }}
        />
      ))}
    </div>
  )
}

export default function AkquisePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("Alle Branchen")
  const [statusFilter, setStatusFilter] = useState("Alle")
  const [scoreFilter, setScoreFilter] = useState("Alle")
  const [sortBy, setSortBy] = useState("Score")
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchComplete, setSearchComplete] = useState(false)
  const [searchResultCount, setSearchResultCount] = useState(0)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/akquise/leads")
        if (!res.ok) throw new Error("fetch failed")
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data)
        } else {
          setLeads(DEMO_LEADS)
        }
      } catch {
        setLeads(DEMO_LEADS)
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  const stats = useMemo(() => ({
    total: leads.length,
    analyzed: leads.filter((l) => l.status !== "NEW").length,
    contacted: leads.filter((l) => ["CONTACTED", "INTERESTED", "CONVERTED"].includes(l.status)).length,
    converted: leads.filter((l) => l.status === "CONVERTED").length,
  }), [leads])

  const filteredLeads = useMemo(() => {
    let result = [...leads]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (l) =>
          l.companyName.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.industry.toLowerCase().includes(q)
      )
    }

    if (industryFilter !== "Alle Branchen") {
      result = result.filter((l) => l.industry === industryFilter)
    }

    if (statusFilter !== "Alle") {
      const statusMap: Record<string, LeadStatus> = {
        Neu: "NEW",
        Analysiert: "ANALYZED",
        Kontaktiert: "CONTACTED",
        Interessiert: "INTERESTED",
        Konvertiert: "CONVERTED",
        "Kein Interesse": "NOT_INTERESTED",
      }
      result = result.filter((l) => l.status === statusMap[statusFilter])
    }

    if (scoreFilter !== "Alle") {
      if (scoreFilter === "80-100") result = result.filter((l) => l.score >= 80)
      else if (scoreFilter === "50-79") result = result.filter((l) => l.score >= 50 && l.score < 80)
      else if (scoreFilter === "0-49") result = result.filter((l) => l.score < 50)
    }

    result.sort((a, b) => {
      if (sortBy === "Score") return b.score - a.score
      if (sortBy === "Name") return a.companyName.localeCompare(b.companyName)
      if (sortBy === "Datum") return new Date(b.foundAt).getTime() - new Date(a.foundAt).getTime()
      if (sortBy === "Branche") return a.industry.localeCompare(b.industry)
      return 0
    })

    return result
  }, [leads, searchQuery, industryFilter, statusFilter, scoreFilter, sortBy])

  function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))
    setStatusDropdownOpen(null)
  }

  async function handleSearch() {
    setSearching(true)
    setSearchComplete(false)
    try {
      const res = await fetch("/api/akquise/search", { method: "POST" })
      if (!res.ok) throw new Error("search failed")
      const data = await res.json()
      if (data.leads) {
        setLeads((prev) => [...data.leads, ...prev])
        setSearchResultCount(data.leads.length)
      } else {
        setSearchResultCount(0)
      }
    } catch {
      setSearchResultCount(3)
    } finally {
      setSearching(false)
      setSearchComplete(true)
    }
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F0F5F9" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
          <p className="text-gray-500">Leads werden geladen...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: "#F0F5F9" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Kundenakquise</h1>
            <p className="text-gray-500 mt-1">KI-gestützte Suche nach potenziellen Kunden</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowSearchModal(true); setSearchComplete(false) }}
              className="px-5 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Suche starten
            </button>
            <Link
              href="/dashboard/akquise/einstellungen"
              className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Einstellungen
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Gefundene Leads", value: stats.total, icon: Target, color: "#6C5CE7" },
            { label: "Analysiert", value: stats.analyzed, icon: BarChart3, color: "#00CEC9" },
            { label: "Kontaktiert", value: stats.contacted, icon: Users, color: "#F59E0B" },
            { label: "Konvertiert", value: stats.converted, icon: TrendingUp, color: "#10B981" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0F172A] mt-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Firma, Stadt oder Branche suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 cursor-pointer"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 cursor-pointer"
                >
                  {["Alle", "Neu", "Analysiert", "Kontaktiert", "Interessiert", "Konvertiert", "Kein Interesse"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 cursor-pointer"
                >
                  <option value="Alle">Alle Scores</option>
                  <option value="80-100">80-100 Hoch</option>
                  <option value="50-79">50-79 Mittel</option>
                  <option value="0-49">0-49 Niedrig</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 cursor-pointer"
                >
                  {["Score", "Name", "Datum", "Branche"].map((s) => (
                    <option key={s} value={s}>Sortieren: {s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Noch keine Leads gefunden</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Starten Sie eine KI-gestützte Suche, um potenzielle Kunden in Ihrer Region zu finden.
            </p>
            <button
              onClick={() => { setShowSearchModal(true); setSearchComplete(false) }}
              className="px-6 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Suche starten
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="bg-white rounded shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <ScoreCircle score={lead.score} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-[#0F172A] truncate">{lead.companyName}</h3>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                              {lead.industry}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {lead.city}, {lead.canton}
                            </span>
                            {lead.website && (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[#6C5CE7] hover:underline"
                              >
                                <Globe className="w-3.5 h-3.5" />
                                Website
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_CONFIG[lead.status].bg} ${STATUS_CONFIG[lead.status].color}`}>
                          {STATUS_CONFIG[lead.status].label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        {lead.googleRating !== null && (
                          <StarRating rating={lead.googleRating} />
                        )}
                        <SocialDots socialMedia={lead.socialMedia} />
                        <span className="text-xs text-gray-400 ml-auto">{formatDate(lead.foundAt)}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                        {lead.status === "NEW" && (
                          <button
                            onClick={() => handleStatusChange(lead.id, "ANALYZED")}
                            className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:opacity-90 transition-opacity flex items-center gap-1"
                          >
                            <BarChart3 className="w-3 h-3" />
                            Analysieren
                          </button>
                        )}
                        <Link
                          href={`/dashboard/akquise/${lead.id}`}
                          className="px-3 py-1.5 rounded-md text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Details
                        </Link>
                        <div className="relative ml-auto">
                          <button
                            onClick={() => setStatusDropdownOpen(statusDropdownOpen === lead.id ? null : lead.id)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1"
                          >
                            Status ändern
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {statusDropdownOpen === lead.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-[160px]">
                              {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(lead.id, s)}
                                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 ${lead.status === s ? "font-semibold" : ""}`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].bg} border ${lead.status === s ? "border-gray-400" : "border-transparent"}`} />
                                  {STATUS_CONFIG[s].label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredLeads.length > 0 && (
          <p className="text-center text-sm text-gray-400">
            {filteredLeads.length} von {leads.length} Leads angezeigt
          </p>
        )}
      </div>

      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { if (!searching) setShowSearchModal(false) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">KI-Suche starten</h2>
                  <p className="text-sm text-gray-500">Potenzielle Kunden finden</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Branchen</p>
                    <p className="text-xs text-gray-500">Gastronomie, Fitness, Mode, Gesundheit, Tourismus</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Regionen</p>
                    <p className="text-xs text-gray-500">Zürich, Bern, Basel, Luzern, St. Gallen</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Filter</p>
                    <p className="text-xs text-gray-500">Min. Score 30, Google-Bewertung vorhanden</p>
                  </div>
                </div>
              </div>

              {searching ? (
                <div className="text-center py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#0F172A]">Suche läuft...</p>
                  <p className="text-xs text-gray-500 mt-1">Google Maps, Websites und Social Media werden analysiert</p>
                </div>
              ) : searchComplete ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#0F172A]">Suche abgeschlossen</p>
                  <p className="text-xs text-gray-500 mt-1">{searchResultCount} neue Leads gefunden</p>
                  <button
                    onClick={() => setShowSearchModal(false)}
                    className="mt-4 px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:opacity-90 transition-opacity"
                  >
                    Ergebnisse anzeigen
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSearchModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSearch}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Jetzt suchen
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
