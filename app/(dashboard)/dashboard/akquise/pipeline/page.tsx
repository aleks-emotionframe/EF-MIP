"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Loader2,
  List,
} from "lucide-react"

type LeadStatus =
  | "NEU"
  | "RECHERCHIERT"
  | "ANGESCHRIEBEN"
  | "FOLLOW_UP"
  | "ANTWORT"
  | "TERMIN"
  | "OFFERTE"
  | "KUNDE"
  | "ABGELEHNT"

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
  socialMedia: {
    instagram: boolean
    facebook: boolean
    linkedin: boolean
    tiktok: boolean
  } | null
  foundAt: string
}

const STAGES: {
  key: LeadStatus
  label: string
  color: string
  bg: string
  border: string
  dot: string
}[] = [
  { key: "NEU", label: "Neu", color: "bg-blue-500", bg: "bg-blue-50", border: "border-l-blue-500", dot: "bg-blue-500" },
  { key: "RECHERCHIERT", label: "Recherchiert", color: "bg-teal-500", bg: "bg-teal-50", border: "border-l-teal-500", dot: "bg-teal-500" },
  { key: "ANGESCHRIEBEN", label: "Angeschrieben", color: "bg-orange-500", bg: "bg-orange-50", border: "border-l-orange-500", dot: "bg-orange-500" },
  { key: "FOLLOW_UP", label: "Follow-up", color: "bg-amber-500", bg: "bg-amber-50", border: "border-l-amber-500", dot: "bg-amber-500" },
  { key: "ANTWORT", label: "Antwort", color: "bg-green-500", bg: "bg-green-50", border: "border-l-green-500", dot: "bg-green-500" },
  { key: "TERMIN", label: "Termin", color: "bg-cyan-500", bg: "bg-cyan-50", border: "border-l-cyan-500", dot: "bg-cyan-500" },
  { key: "OFFERTE", label: "Offerte", color: "bg-indigo-500", bg: "bg-indigo-50", border: "border-l-indigo-500", dot: "bg-indigo-500" },
  { key: "KUNDE", label: "Kunde", color: "bg-purple-500", bg: "bg-purple-50", border: "border-l-purple-500", dot: "bg-purple-500" },
  { key: "ABGELEHNT", label: "Abgelehnt", color: "bg-gray-400", bg: "bg-gray-50", border: "border-l-gray-400", dot: "bg-gray-400" },
]

const DEMO_LEADS: Lead[] = [
  { id: "l1", companyName: "Restaurant Löwengarten", industry: "Gastronomie", city: "Zürich", canton: "ZH", website: "https://loewengarten.ch", googleRating: 4.2, googleReviews: 187, score: 82, websiteScore: 75, socialScore: 88, seoScore: 70, status: "NEU", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-20" },
  { id: "l2", companyName: "FitZone Basel", industry: "Fitness", city: "Basel", canton: "BS", website: "https://fitzone-basel.ch", googleRating: 3.8, googleReviews: 94, score: 45, websiteScore: 40, socialScore: 52, seoScore: 38, status: "RECHERCHIERT", socialMedia: { instagram: true, facebook: false, linkedin: false, tiktok: true }, foundAt: "2026-05-19" },
  { id: "l3", companyName: "Schneider Immobilien", industry: "Immobilien", city: "Bern", canton: "BE", website: "https://schneider-immo.ch", googleRating: 4.5, googleReviews: 63, score: 71, websiteScore: 68, socialScore: 65, seoScore: 80, status: "ANGESCHRIEBEN", socialMedia: { instagram: false, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-18" },
  { id: "l4", companyName: "Bella Moda Boutique", industry: "Mode & Retail", city: "Luzern", canton: "LU", website: "https://bellamoda.ch", googleRating: 4.1, googleReviews: 42, score: 38, websiteScore: 30, socialScore: 45, seoScore: 35, status: "NEU", socialMedia: { instagram: true, facebook: false, linkedin: false, tiktok: false }, foundAt: "2026-05-17" },
  { id: "l5", companyName: "Dr. Meier Zahnklinik", industry: "Gesundheit", city: "Winterthur", canton: "ZH", website: "https://zahnklinik-meier.ch", googleRating: 4.7, googleReviews: 231, score: 56, websiteScore: 60, socialScore: 35, seoScore: 72, status: "RECHERCHIERT", socialMedia: { instagram: false, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-16" },
  { id: "l6", companyName: "Café Monico", industry: "Gastronomie", city: "Genf", canton: "GE", website: "https://cafemonico.ch", googleRating: 4.4, googleReviews: 312, score: 91, websiteScore: 85, socialScore: 95, seoScore: 88, status: "ANTWORT", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-05-15" },
  { id: "l7", companyName: "TechHub Zürich", industry: "Technologie", city: "Zürich", canton: "ZH", website: "https://techhub-zh.ch", googleRating: 4.0, googleReviews: 28, score: 67, websiteScore: 80, socialScore: 55, seoScore: 65, status: "FOLLOW_UP", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-05-14" },
  { id: "l8", companyName: "Blumen Zauber", industry: "Handwerk", city: "St. Gallen", canton: "SG", website: null, googleRating: 4.8, googleReviews: 156, score: 34, websiteScore: 0, socialScore: 48, seoScore: 20, status: "ABGELEHNT", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-13" },
  { id: "l9", companyName: "Alpine Yoga Studio", industry: "Fitness", city: "Interlaken", canton: "BE", website: "https://alpine-yoga.ch", googleRating: 4.9, googleReviews: 87, score: 78, websiteScore: 72, socialScore: 90, seoScore: 60, status: "ANGESCHRIEBEN", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-05-12" },
  { id: "l10", companyName: "Bäckerei Hofmann", industry: "Gastronomie", city: "Thun", canton: "BE", website: "https://hofmann-baeckerei.ch", googleRating: 4.6, googleReviews: 203, score: 53, websiteScore: 45, socialScore: 50, seoScore: 65, status: "TERMIN", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-11" },
  { id: "l11", companyName: "LuxusHaar Salon", industry: "Beauty & Wellness", city: "Lausanne", canton: "VD", website: "https://luxushaar.ch", googleRating: 4.3, googleReviews: 178, score: 85, websiteScore: 80, socialScore: 92, seoScore: 78, status: "KUNDE", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-05-10" },
  { id: "l12", companyName: "Weber Treuhand", industry: "Finanzen", city: "Aarau", canton: "AG", website: "https://weber-treuhand.ch", googleRating: 4.1, googleReviews: 34, score: 62, websiteScore: 70, socialScore: 30, seoScore: 85, status: "NEU", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-05-09" },
  { id: "l13", companyName: "Pizzeria Da Luigi", industry: "Gastronomie", city: "Lugano", canton: "TI", website: null, googleRating: 4.5, googleReviews: 421, score: 41, websiteScore: 0, socialScore: 60, seoScore: 25, status: "OFFERTE", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-08" },
  { id: "l14", companyName: "SwissCode Academy", industry: "Bildung", city: "Zürich", canton: "ZH", website: "https://swisscode.academy", googleRating: 4.6, googleReviews: 67, score: 74, websiteScore: 85, socialScore: 70, seoScore: 68, status: "ANTWORT", socialMedia: { instagram: true, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-07" },
  { id: "l15", companyName: "Berghotel Edelweiss", industry: "Tourismus", city: "Zermatt", canton: "VS", website: "https://berghotel-edelweiss.ch", googleRating: 4.4, googleReviews: 534, score: 88, websiteScore: 82, socialScore: 90, seoScore: 85, status: "ANGESCHRIEBEN", socialMedia: { instagram: true, facebook: true, linkedin: true, tiktok: true }, foundAt: "2026-05-06" },
  { id: "l16", companyName: "Schreiner Meister GmbH", industry: "Handwerk", city: "Olten", canton: "SO", website: "https://schreiner-meister.ch", googleRating: 4.7, googleReviews: 45, score: 49, websiteScore: 55, socialScore: 25, seoScore: 68, status: "FOLLOW_UP", socialMedia: { instagram: false, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-05" },
  { id: "l17", companyName: "Consulting Plus AG", industry: "Beratung", city: "Zug", canton: "ZG", website: "https://consultingplus.ch", googleRating: 3.9, googleReviews: 22, score: 58, websiteScore: 65, socialScore: 40, seoScore: 70, status: "ABGELEHNT", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-05-04" },
  { id: "l18", companyName: "Modehaus Tanner", industry: "Mode & Retail", city: "Schaffhausen", canton: "SH", website: "https://modehaus-tanner.ch", googleRating: 4.0, googleReviews: 89, score: 63, websiteScore: 58, socialScore: 72, seoScore: 55, status: "RECHERCHIERT", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-03" },
  { id: "l19", companyName: "Kinderland Spielgruppe", industry: "Bildung", city: "Baden", canton: "AG", website: "https://kinderland-baden.ch", googleRating: 4.8, googleReviews: 112, score: 36, websiteScore: 30, socialScore: 42, seoScore: 32, status: "TERMIN", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-05-02" },
  { id: "l20", companyName: "Autohaus Keller", industry: "Handwerk", city: "Frauenfeld", canton: "TG", website: "https://autohaus-keller.ch", googleRating: 4.3, googleReviews: 167, score: 72, websiteScore: 70, socialScore: 65, seoScore: 80, status: "OFFERTE", socialMedia: { instagram: false, facebook: true, linkedin: true, tiktok: false }, foundAt: "2026-05-01" },
  { id: "l21", companyName: "Nail Art Studio", industry: "Beauty & Wellness", city: "Biel", canton: "BE", website: "https://nailart-biel.ch", googleRating: 4.6, googleReviews: 98, score: 77, websiteScore: 68, socialScore: 88, seoScore: 65, status: "ANTWORT", socialMedia: { instagram: true, facebook: false, linkedin: false, tiktok: true }, foundAt: "2026-04-30" },
  { id: "l22", companyName: "Reisebüro Fernweh", industry: "Tourismus", city: "Chur", canton: "GR", website: "https://fernweh-reisen.ch", googleRating: 4.2, googleReviews: 76, score: 55, websiteScore: 60, socialScore: 50, seoScore: 52, status: "FOLLOW_UP", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-04-29" },
  { id: "l23", companyName: "Bio Hofladen Müller", industry: "Gastronomie", city: "Solothurn", canton: "SO", website: null, googleRating: 4.9, googleReviews: 245, score: 44, websiteScore: 0, socialScore: 55, seoScore: 30, status: "NEU", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: false }, foundAt: "2026-04-28" },
  { id: "l24", companyName: "IT Solutions Bern", industry: "Technologie", city: "Bern", canton: "BE", website: "https://itsolutions-bern.ch", googleRating: 4.1, googleReviews: 19, score: 69, websiteScore: 78, socialScore: 45, seoScore: 82, status: "KUNDE", socialMedia: { instagram: false, facebook: false, linkedin: true, tiktok: false }, foundAt: "2026-04-27" },
  { id: "l25", companyName: "Yoga & Balance Center", industry: "Fitness", city: "Rapperswil", canton: "SG", website: "https://yogabalance.ch", googleRating: 4.7, googleReviews: 134, score: 81, websiteScore: 75, socialScore: 85, seoScore: 78, status: "NEU", socialMedia: { instagram: true, facebook: true, linkedin: false, tiktok: true }, foundAt: "2026-04-26" },
]

const STAGE_ORDER: LeadStatus[] = STAGES.map((s) => s.key)

function getScoreColor(score: number) {
  if (score >= 70) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-400" }
  if (score >= 40) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-400" }
  return { text: "text-red-500", bg: "bg-red-50", border: "border-red-400" }
}

function MiniStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-2.5 h-2.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  )
}

function LeadCard({
  lead,
  stage,
  onMove,
}: {
  lead: Lead
  stage: (typeof STAGES)[number]
  onMove: (leadId: string, direction: "prev" | "next") => void
}) {
  const router = useRouter()
  const scoreColors = getScoreColor(lead.score)
  const stageIdx = STAGE_ORDER.indexOf(lead.status)
  const canPrev = stageIdx > 0
  const canNext = stageIdx < STAGE_ORDER.length - 1

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded shadow-sm border border-gray-100 border-l-[3px] ${stage.border} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => router.push(`/dashboard/akquise/${lead.id}`)}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-1.5">
          <h4 className="text-[13px] font-semibold text-[#0F172A] leading-tight truncate flex-1">
            {lead.companyName}
          </h4>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ${scoreColors.bg} ${scoreColors.border}`}
          >
            <span className={`text-[10px] font-bold ${scoreColors.text}`}>{lead.score}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 truncate">
            {lead.industry}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] text-gray-400 truncate">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            {lead.city}
          </span>
        </div>

        {lead.googleRating !== null && (
          <div className="mt-1.5">
            <MiniStars rating={lead.googleRating} />
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMove(lead.id, "prev")
            }}
            disabled={!canPrev}
            className={`p-1 rounded transition-colors ${canPrev ? "hover:bg-gray-100 text-gray-500" : "text-gray-200 cursor-not-allowed"}`}
            title="Vorherige Stufe"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMove(lead.id, "next")
            }}
            disabled={!canNext}
            className={`p-1 rounded transition-colors ${canNext ? "hover:bg-gray-100 text-gray-500" : "text-gray-200 cursor-not-allowed"}`}
            title="Nächste Stufe"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

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

  const grouped = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      NEU: [],
      RECHERCHIERT: [],
      ANGESCHRIEBEN: [],
      FOLLOW_UP: [],
      ANTWORT: [],
      TERMIN: [],
      OFFERTE: [],
      KUNDE: [],
      ABGELEHNT: [],
    }
    for (const lead of leads) {
      if (map[lead.status]) {
        map[lead.status].push(lead)
      }
    }
    return map
  }, [leads])

  async function handleMove(leadId: string, direction: "prev" | "next") {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return

    const currentIdx = STAGE_ORDER.indexOf(lead.status)
    const newIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1
    if (newIdx < 0 || newIdx >= STAGE_ORDER.length) return

    const newStatus = STAGE_ORDER[newIdx]

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    )

    try {
      await fetch(`/api/akquise/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l))
      )
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F0F5F9" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
          <p className="text-gray-500">Pipeline wird geladen...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F0F5F9" }}>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Lead-Pipeline</h1>
            <p className="text-gray-500 mt-1">
              Verwalten Sie Ihre Leads visuell durch alle Phasen
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/akquise"
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <List className="w-4 h-4" />
              Listenansicht
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded shadow-sm border border-gray-100 px-5 py-3"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-[#0F172A]">
              {leads.length} Leads
            </span>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-3 flex-wrap">
              {STAGES.map((stage) => {
                const count = grouped[stage.key].length
                return (
                  <div key={stage.key} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${stage.dot}`} />
                    <span className="text-xs text-gray-500">{stage.label}</span>
                    <span className="text-xs font-semibold text-[#0F172A]">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        <div className="overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
            {STAGES.map((stage, colIdx) => (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: colIdx * 0.04 }}
                className="w-[240px] shrink-0 flex flex-col"
              >
                <div
                  className={`${stage.color} rounded-t-lg px-3 py-2.5 flex items-center justify-between`}
                >
                  <span className="text-sm font-semibold text-white">
                    {stage.label}
                  </span>
                  <span className="text-xs font-bold text-white/80 bg-white/20 rounded-full px-2 py-0.5">
                    {grouped[stage.key].length}
                  </span>
                </div>

                <div className={`${stage.bg} rounded-b-lg flex-1 p-2 space-y-2 min-h-[200px]`}>
                  <AnimatePresence mode="popLayout">
                    {grouped[stage.key].map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        stage={stage}
                        onMove={handleMove}
                      />
                    ))}
                  </AnimatePresence>
                  {grouped[stage.key].length === 0 && (
                    <div className="flex items-center justify-center h-24 text-xs text-gray-400">
                      Keine Leads
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
