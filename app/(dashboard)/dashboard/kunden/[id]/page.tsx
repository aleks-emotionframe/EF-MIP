"use client"

import { use, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCustomer } from "@/components/providers/customer-provider"
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  Share2,
  Briefcase,
  Video,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Pencil,
  Calendar,
  Shield,
  Trash2,
} from "lucide-react"

const DEMO_CUSTOMERS: Record<string, {
  id: string
  name: string
  slug: string
  industry: string
  plan: string
  isActive: boolean
  website: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  address: string
  country: string
  socialMedia: Record<string, string>
  shareToken: string
  createdAt: string
  updatedAt: string
}> = {
  "1": {
    id: "1",
    name: "TechStart GmbH",
    slug: "techstart",
    industry: "Technologie",
    plan: "PROFESSIONAL",
    isActive: true,
    website: "https://techstart.ch",
    contactPerson: "Marco Müller",
    contactEmail: "marco@techstart.ch",
    contactPhone: "+41 44 123 45 67",
    address: "Bahnhofstrasse 10, 8001 Zürich",
    country: "Schweiz",
    socialMedia: { instagram: "@techstart_ch", linkedin: "techstart-gmbh", facebook: "techstartch" },
    shareToken: "tk_abc123def456",
    createdAt: "2025-11-15",
    updatedAt: "2026-04-20",
  },
  "2": {
    id: "2",
    name: "Alpine Fashion AG",
    slug: "alpine-fashion",
    industry: "Mode & Retail",
    plan: "ENTERPRISE",
    isActive: true,
    website: "https://alpine-fashion.ch",
    contactPerson: "Sarah Brunner",
    contactEmail: "sarah@alpine-fashion.ch",
    contactPhone: "+41 31 987 65 43",
    address: "Marktgasse 5, 3011 Bern",
    country: "Schweiz",
    socialMedia: { instagram: "@alpinefashion", facebook: "alpinefashionag", tiktok: "@alpinestyle" },
    shareToken: "tk_xyz789ghi012",
    createdAt: "2025-09-20",
    updatedAt: "2026-03-15",
  },
}

const PLAN_CONFIG: Record<string, { label: string; color: string; bg: string; description: string }> = {
  STARTER: { label: "Starter", color: "text-gray-700 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-700", description: "Basis-Funktionen für kleine Unternehmen" },
  PROFESSIONAL: { label: "Professional", color: "text-[#6C5CE7]", bg: "bg-[#6C5CE7]/10", description: "Erweiterte Analyse & Reporting" },
  ENTERPRISE: { label: "Enterprise", color: "text-[#00CEC9]", bg: "bg-[#00CEC9]/10", description: "Vollständiger Zugang mit Premium-Support" },
}

const SOCIAL_CONFIG: Record<string, { icon: typeof Camera; label: string; urlPrefix: string }> = {
  instagram: { icon: Camera, label: "Camera", urlPrefix: "https://instagram.com/" },
  facebook: { icon: Share2, label: "Share2", urlPrefix: "https://facebook.com/" },
  linkedin: { icon: Briefcase, label: "LinkedIn", urlPrefix: "https://linkedin.com/company/" },
  youtube: { icon: Video, label: "YouTube", urlPrefix: "https://youtube.com/" },
  tiktok: { icon: Link2, label: "TikTok", urlPrefix: "https://tiktok.com/" },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function KundenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { setActiveCustomer } = useCustomer()
  const customer = DEMO_CUSTOMERS[id]
  const [copied, setCopied] = useState(false)
  const [isActive, setIsActive] = useState(customer?.isActive ?? false)

  function openDashboard() {
    if (!customer) return
    setActiveCustomer({
      id: customer.id,
      name: customer.name,
      slug: customer.slug,
      industry: customer.industry,
      plan: customer.plan,
      website: customer.website,
    })
    router.push("/dashboard")
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="w-16 h-16 text-gray-300 dark:text-white/20" />
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Kunde nicht gefunden</h1>
        <p className="text-gray-500 dark:text-white/50">Der angeforderte Kunde existiert nicht oder wurde entfernt.</p>
        <Link
          href="/dashboard/kunden"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium hover:opacity-90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>
      </div>
    )
  }

  const shareUrl = `https://ef-mip.vercel.app/share/${customer.shareToken}`
  const plan = PLAN_CONFIG[customer.plan] || PLAN_CONFIG.STARTER

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/kunden"
            className="p-2 rounded bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#0F172A] dark:text-white" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">{customer.name}</h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {isActive ? "Aktiv" : "Inaktiv"}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-white/50">{customer.industry} · {customer.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/[0.06] text-[#0F172A] dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition">
            <Pencil className="w-4 h-4" />
            Bearbeiten
          </button>
          <button
            onClick={openDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium text-sm hover:opacity-90 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Dashboard öffnen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-4">Unternehmensdaten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1">Firmenname</p>
                <p className="text-sm font-medium text-[#0F172A] dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 dark:text-white/40" />
                  {customer.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1">Branche</p>
                <p className="text-sm font-medium text-[#0F172A] dark:text-white">{customer.industry}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1">Website</p>
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#6C5CE7] hover:underline inline-flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {customer.website.replace("https://", "")}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1">Adresse</p>
                <p className="text-sm font-medium text-[#0F172A] dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-white/40" />
                  {customer.address}, {customer.country}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-4">Kontaktperson</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center text-white font-bold text-sm">
                  {customer.contactPerson.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A] dark:text-white">{customer.contactPerson}</p>
                  <p className="text-xs text-gray-500 dark:text-white/50">Hauptkontakt</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a
                  href={`mailto:${customer.contactEmail}`}
                  className="flex items-center gap-3 p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  <Mail className="w-5 h-5 text-[#6C5CE7]" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-white/40">E-Mail</p>
                    <p className="text-sm font-medium text-[#0F172A] dark:text-white">{customer.contactEmail}</p>
                  </div>
                </a>
                <a
                  href={`tel:${customer.contactPhone}`}
                  className="flex items-center gap-3 p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  <Phone className="w-5 h-5 text-[#00CEC9]" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-white/40">Telefon</p>
                    <p className="text-sm font-medium text-[#0F172A] dark:text-white">{customer.contactPhone}</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-4">Social Media</h2>
            <div className="space-y-3">
              {Object.entries(customer.socialMedia).map(([platform, handle]) => {
                const config = SOCIAL_CONFIG[platform]
                if (!config) return null
                const Icon = config.icon
                const url = `${config.urlPrefix}${handle.replace("@", "")}`
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#0F172A] dark:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A] dark:text-white">{config.label}</p>
                        <p className="text-xs text-gray-500 dark:text-white/50">{handle}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-white/30 opacity-0 group-hover:opacity-100 transition" />
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="w-5 h-5 text-[#6C5CE7]" />
              <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white">Kunden-Zugang</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-white/50 mb-1 font-medium">Share-Link für Kunden</p>
            <p className="text-xs text-gray-400 dark:text-white/40 mb-4">
              Teile diesen Link mit dem Kunden. Er erhält damit Zugang zu seinem Dashboard ohne Login.
            </p>
            <div className="flex items-stretch gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 min-w-0 px-3 py-2 rounded bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-[#0F172A] dark:text-white font-mono truncate"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition whitespace-nowrap ${
                  copied
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-[#6C5CE7]/10 text-[#6C5CE7] hover:bg-[#6C5CE7]/20"
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
                    Link kopieren
                  </>
                )}
              </button>
            </div>
            <button className="mt-3 text-xs text-gray-400 dark:text-white/40 hover:text-[#6C5CE7] dark:hover:text-[#6C5CE7] transition">
              Link neu generieren
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-4">Plan & Status</h2>
            <div className="space-y-4">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${plan.bg} ${plan.color}`}>
                  {plan.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-white/50 mt-2">{plan.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/50">Status</span>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-white/40" />
                  <span className="text-gray-500 dark:text-white/50">Erstellt am:</span>
                  <span className="text-[#0F172A] dark:text-white font-medium">{formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-white/40" />
                  <span className="text-gray-500 dark:text-white/50">Aktualisiert am:</span>
                  <span className="text-[#0F172A] dark:text-white font-medium">{formatDate(customer.updatedAt)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-4">Schnellaktionen</h2>
            <div className="space-y-3">
              <button
                onClick={openDashboard}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white font-medium text-sm hover:opacity-90 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Dashboard öffnen
              </button>
              <a
                href={`mailto:${customer.contactEmail}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 text-[#0F172A] dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition"
              >
                <Mail className="w-4 h-4" />
                E-Mail senden
              </a>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded font-medium text-sm transition ${
                  isActive
                    ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20"
                    : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                }`}
              >
                {isActive ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Kunde deaktivieren
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Kunde aktivieren
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
