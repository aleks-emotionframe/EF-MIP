"use client"

import { use, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Send,
  Copy,
  Check,
  Mail,
  FileText,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ExternalLink,
} from "lucide-react"

type TemplateType = "erstkontakt" | "followup1" | "followup2" | "termin"

interface OutreachEmail {
  subject: string
  body: string
  template: string
}

const TEMPLATE_OPTIONS: { value: TemplateType; label: string; description: string }[] = [
  { value: "erstkontakt", label: "Erstkontakt", description: "Erste Kontaktaufnahme" },
  { value: "followup1", label: "Follow-up 1", description: "Erstes Nachhaken" },
  { value: "followup2", label: "Follow-up 2", description: "Letzter Versuch" },
  { value: "termin", label: "Termin-Bestätigung", description: "Termin bestätigen" },
]

const DEMO_LEADS: Record<string, {
  name: string
  industry: string
  city: string
  score: number
  email: string
  website: string
  weaknesses: string[]
  strengths: string[]
}> = {
  "1": {
    name: "Restaurant Löwengarten",
    industry: "Gastronomie",
    city: "Zürich",
    score: 82,
    email: "info@loewengarten.ch",
    website: "https://loewengarten.ch",
    weaknesses: [
      "Website-Ladezeit zu langsam",
      "Unregelmässige Social-Media-Aktivität",
      "Keine Online-Reservierungsmöglichkeit",
      "SEO nicht optimiert",
    ],
    strengths: [
      "Gute Google-Bewertungen (4.2 Sterne)",
      "Instagram und Facebook Präsenz aufgebaut",
    ],
  },
  "demo-lead-01": {
    name: "Ristorante Bellavista",
    industry: "Gastronomie",
    city: "Zürich",
    score: 88,
    email: "info@bellavista-zh.ch",
    website: "https://bellavista-zh.ch",
    weaknesses: ["Keine Online-Reservierung", "Social Media unregelmässig"],
    strengths: ["Gute Google-Bewertungen", "Website vorhanden"],
  },
  "demo-lead-02": {
    name: "CrossFit Bern",
    industry: "Fitness",
    city: "Bern",
    score: 92,
    email: "kontakt@crossfit-bern.ch",
    website: "https://crossfit-bern.ch",
    weaknesses: ["TikTok noch nicht genutzt", "Keine Testimonial-Videos"],
    strengths: ["Starke Community", "Hohe Google-Bewertung"],
  },
  "demo-lead-03": {
    name: "Modehaus Schneider",
    industry: "Mode",
    city: "Basel",
    score: 45,
    email: "info@modehaus-schneider.ch",
    website: "https://modehaus-schneider.ch",
    weaknesses: ["Veraltete Website", "Kaum Social-Media-Aktivität"],
    strengths: ["Etablierte Marke", "Treue Kundschaft"],
  },
}

export default function OutreachPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const lead = DEMO_LEADS[id]

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("erstkontakt")
  const [generating, setGenerating] = useState(false)
  const [email, setEmail] = useState<OutreachEmail | null>(null)
  const [editedSubject, setEditedSubject] = useState("")
  const [editedBody, setEditedBody] = useState("")
  const [copied, setCopied] = useState(false)
  const [showCustomInstructions, setShowCustomInstructions] = useState(false)
  const [customInstructions, setCustomInstructions] = useState("")

  const leadName = lead?.name ?? "Unbekannter Lead"

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/akquise/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: id,
          template: selectedTemplate,
          customInstructions: customInstructions || undefined,
        }),
      })
      const data = await res.json()
      if (data.subject && data.body) {
        setEmail(data)
        setEditedSubject(data.subject)
        setEditedBody(data.body)
      }
    } catch {
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    const text = `Betreff: ${editedSubject}\n\n${editedBody}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const mailtoUrl = `mailto:${lead?.email ?? ""}?subject=${encodeURIComponent(editedSubject)}&body=${encodeURIComponent(editedBody)}`

  const scoreColor = (lead?.score ?? 0) >= 75 ? "text-emerald-600" : (lead?.score ?? 0) >= 50 ? "text-amber-600" : "text-red-600"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/akquise/${id}`}
          className="p-2 rounded bg-white border border-gray-100 hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Anschreiben für {leadName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">KI-gestütztes E-Mail-Anschreiben generieren</p>
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
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Vorlage wählen</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {TEMPLATE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedTemplate(opt.value)}
                  className={`p-3 rounded border text-left transition ${
                    selectedTemplate === opt.value
                      ? "border-[#6C5CE7] bg-[#6C5CE7]/5 ring-1 ring-[#6C5CE7]"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <p className={`text-sm font-semibold ${selectedTemplate === opt.value ? "text-[#6C5CE7]" : "text-[#0F172A]"}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowCustomInstructions(!showCustomInstructions)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F172A] transition"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showCustomInstructions ? "rotate-180" : ""}`} />
                Eigene Anweisungen
              </button>
              {showCustomInstructions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="mt-3"
                >
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="z.B. 'Erwähne unser aktuelles Angebot für Neukunden' oder 'Fokus auf Instagram-Marketing'"
                    className="w-full h-20 px-3 py-2 border border-gray-200 rounded text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6C5CE7] focus:border-[#6C5CE7] resize-none"
                  />
                </motion.div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? "Wird generiert..." : "Generieren"}
            </button>
          </motion.div>

          {email && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#6C5CE7]" />
                  <h2 className="text-lg font-semibold text-[#0F172A]">Generierte E-Mail</h2>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#6C5CE7]/10 text-[#6C5CE7]">
                  {email.template}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Betreff
                  </label>
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6C5CE7] focus:border-[#6C5CE7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Nachricht
                  </label>
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={16}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-[#0F172A] font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#6C5CE7] focus:border-[#6C5CE7] resize-y"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white border border-gray-200 text-[#0F172A] font-medium text-sm hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
                  Neu generieren
                </button>
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
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Versand-Optionen</h2>
            <div className="space-y-3">
              <button
                onClick={handleCopy}
                disabled={!email}
                className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded font-medium text-sm transition ${
                  email
                    ? copied
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-white border border-gray-200 text-[#0F172A] hover:bg-gray-50"
                    : "bg-gray-50 border border-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    In Zwischenablage kopieren
                  </>
                )}
              </button>

              {email ? (
                <a
                  href={mailtoUrl}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium text-sm hover:opacity-90 transition"
                >
                  <Send className="w-4 h-4" />
                  Per E-Mail senden
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-gray-50 border border-gray-100 text-gray-400 font-medium text-sm cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Per E-Mail senden
                </button>
              )}

              <div className="mt-4 p-3 rounded bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">SMTP-Status</span>
                </div>
                <p className="text-xs text-gray-400">Nicht konfiguriert - Mailto-Link wird verwendet</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Lead-Info</h2>
            {lead ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Unternehmen</p>
                  <p className="text-sm font-medium text-[#0F172A]">{lead.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Branche</p>
                    <p className="text-sm text-[#0F172A]">{lead.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Stadt</p>
                    <p className="text-sm text-[#0F172A]">{lead.city}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Score</p>
                  <p className={`text-xl font-bold ${scoreColor}`}>{lead.score}/100</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Schwächen</p>
                  <ul className="space-y-1.5">
                    {lead.weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Stärken</p>
                  <ul className="space-y-1.5">
                    {lead.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/dashboard/akquise/${id}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded bg-[#6C5CE7]/10 text-[#6C5CE7] font-medium text-sm hover:bg-[#6C5CE7]/20 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Vollständige Analyse
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Lead-Daten nicht verfügbar</p>
                <Link
                  href={`/dashboard/akquise/${id}`}
                  className="inline-flex items-center gap-2 mt-3 text-sm text-[#6C5CE7] hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Zur Lead-Seite
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
