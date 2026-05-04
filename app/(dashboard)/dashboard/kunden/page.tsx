"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2, Plus, Search, Globe, Mail, Phone, MapPin,
  Camera, Share2, Briefcase, Video, ExternalLink,
  Users, Crown, Calendar,
} from "lucide-react"
import { useCustomer } from "@/components/providers/customer-provider"

interface Customer {
  id: string
  name: string
  slug: string
  industry: string
  plan: "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE"
  isActive: boolean
  website: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: Record<string, string>
  createdAt: string
}

const DEMO_CUSTOMERS: Customer[] = [
  {
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
    socialMedia: { instagram: "@techstart_ch", linkedin: "techstart-gmbh", facebook: "techstartch" },
    createdAt: "2025-11-15",
  },
  {
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
    socialMedia: { instagram: "@alpinefashion", facebook: "alpinefashionag", tiktok: "@alpinestyle" },
    createdAt: "2025-09-20",
  },
  {
    id: "3",
    name: "GastroZürich",
    slug: "gastro-zuerich",
    industry: "Gastronomie",
    plan: "STARTER",
    isActive: true,
    website: "https://gastro-zuerich.ch",
    contactPerson: "Thomas Weber",
    contactEmail: "thomas@gastro-zuerich.ch",
    contactPhone: "+41 44 555 12 34",
    address: "Langstrasse 42, 8004 Zürich",
    socialMedia: { instagram: "@gastrozuerich", facebook: "gastrozuerich" },
    createdAt: "2026-01-10",
  },
  {
    id: "4",
    name: "SwissTravel AG",
    slug: "swisstravel",
    industry: "Tourismus",
    plan: "PROFESSIONAL",
    isActive: false,
    website: "https://swisstravel.ch",
    contactPerson: "Anna Keller",
    contactEmail: "anna@swisstravel.ch",
    contactPhone: "+41 41 678 90 12",
    address: "Seestrasse 15, 6003 Luzern",
    socialMedia: { instagram: "@swisstravel", linkedin: "swisstravel-ag", youtube: "SwissTravelTV" },
    createdAt: "2025-06-01",
  },
  {
    id: "5",
    name: "FinanceHub AG",
    slug: "financehub",
    industry: "Finanzdienstleistungen",
    plan: "ENTERPRISE",
    isActive: true,
    website: "https://financehub.ch",
    contactPerson: "David Steiner",
    contactEmail: "david@financehub.ch",
    contactPhone: "+41 61 234 56 78",
    address: "Aeschenvorstadt 71, 4051 Basel",
    socialMedia: { linkedin: "financehub-ag" },
    createdAt: "2025-03-22",
  },
]

const PLAN_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  FREE: { label: "Free", bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-300" },
  STARTER: { label: "Starter", bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
  PROFESSIONAL: { label: "Professional", bg: "bg-[#00CEC9]/10", text: "text-[#00CEC9]" },
  ENTERPRISE: { label: "Enterprise", bg: "bg-[#6C5CE7]/10", text: "text-[#6C5CE7]" },
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Camera,
  facebook: Share2,
  linkedin: Briefcase,
  youtube: Video,
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function KundenPage() {
  const router = useRouter()
  const { setActiveCustomer } = useCustomer()
  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState("ALL")

  const filtered = useMemo(() => {
    return DEMO_CUSTOMERS.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(search.toLowerCase())
      const matchesPlan = planFilter === "ALL" || c.plan === planFilter
      return matchesSearch && matchesPlan
    })
  }, [search, planFilter])

  const totalCustomers = DEMO_CUSTOMERS.length
  const activeCustomers = DEMO_CUSTOMERS.filter((c) => c.isActive).length
  const newThisMonth = DEMO_CUSTOMERS.filter((c) => {
    const d = new Date(c.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const enterpriseCustomers = DEMO_CUSTOMERS.filter((c) => c.plan === "ENTERPRISE").length

  const stats = [
    { label: "Total Kunden", value: totalCustomers, icon: Users, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
    { label: "Aktive Kunden", value: activeCustomers, icon: Users, bg: "bg-emerald-500/10", iconColor: "text-emerald-500", showDot: true },
    { label: "Neue diesen Monat", value: newThisMonth, icon: Calendar, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
    { label: "Enterprise Kunden", value: enterpriseCustomers, icon: Crown, bg: "bg-amber-500/10", iconColor: "text-amber-500" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Kunden</h1>
        <p className="text-sm text-gray-500 dark:text-white/50 mt-1">Verwalte deine Kunden und deren Organisationen</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-5 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F172A] dark:text-white leading-tight flex items-center gap-2">
                {s.value}
                {s.showDot && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Kunden suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 text-sm text-[#0F172A] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 transition-all"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2.5 rounded bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 transition-all appearance-none cursor-pointer pr-8"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
        >
          <option value="ALL">Alle Pläne</option>
          <option value="FREE">Free</option>
          <option value="STARTER">Starter</option>
          <option value="PROFESSIONAL">Professional</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
        <Link
          href="/dashboard/kunden/neu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Kunde registrieren
        </Link>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-16 flex flex-col items-center justify-center text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Noch keine Kunden</h2>
          <p className="text-sm text-gray-500 dark:text-white/50 max-w-sm mb-6">
            Registriere deinen ersten Kunden, um mit dem Social-Media-Management zu starten.
          </p>
          <Link
            href="/dashboard/kunden/neu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Kunde registrieren
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((customer, i) => {
            const plan = PLAN_CONFIG[customer.plan]
            const initial = customer.name.charAt(0).toUpperCase()
            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6 flex flex-col transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-lg">{initial}</span>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white leading-tight">{customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-[11px] font-medium text-gray-600 dark:text-white/60">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {customer.industry}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${plan.bg} ${plan.text}`}>
                      {plan.label}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${customer.isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}`} title={customer.isActive ? "Aktiv" : "Inaktiv"} />
                  </div>
                </div>

                <div className="space-y-2.5 mb-4 flex-1">
                  <a
                    href={customer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#00CEC9] hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{customer.website.replace("https://", "")}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                  </a>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                    <Users className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span>{customer.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{customer.contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                  {(["instagram", "facebook", "linkedin", "youtube"] as const).map((platform) => {
                    const Icon = SOCIAL_ICONS[platform]
                    const connected = !!customer.socialMedia[platform]
                    return (
                      <div
                        key={platform}
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          connected
                            ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                            : "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-white/20"
                        }`}
                        title={connected ? customer.socialMedia[platform] : `${platform} nicht verbunden`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-white/30">
                    <Calendar className="h-3 w-3" />
                    {formatDate(customer.createdAt)}
                  </span>
                  <button
                    onClick={() => {
                      setActiveCustomer({
                        id: customer.id,
                        name: customer.name,
                        slug: customer.slug,
                        industry: customer.industry,
                        plan: customer.plan,
                        website: customer.website,
                      })
                      router.push("/dashboard")
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white text-xs font-semibold hover:shadow-md transition-all"
                  >
                    Dashboard öffnen
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
