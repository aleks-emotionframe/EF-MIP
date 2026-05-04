"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Home, Share2, BarChart3, Layers, Sparkles, FileText,
  TrendingUp, Globe, Users, Mail, Settings, Calendar,
  Hash, Target, Bell, Inbox, Clock,
  PieChart, SmilePlus, GitCompare, Gauge, Link2, MapPin,
  FileBarChart, GitFork, Search, LogOut, Building2,
  User, LayoutDashboard, ChevronDown, X, Plus, Shield,
} from "lucide-react"
import { useCustomer, type ActiveCustomer } from "@/components/providers/customer-provider"

const EF_OWN_CUSTOMER: ActiveCustomer = {
  id: "ef",
  name: "EmotionFrame",
  slug: "emotionframe",
  industry: "Marketing & Technologie",
  plan: "ENTERPRISE",
  website: "https://emotionframe.com",
}

interface MenuItem { icon: any; label: string; href: string }
interface MenuSection { key: string; title: string; icon: any; items: MenuItem[]; singleLink?: string }

const menuSections: MenuSection[] = [
  { key: "home", title: "Dashboard", icon: Home, singleLink: "/dashboard", items: [] },
  {
    key: "social", title: "Social Media", icon: Share2,
    items: [
      { icon: Share2, label: "Soziale Medien", href: "/dashboard/social" },
      { icon: Inbox, label: "Social Inbox", href: "/dashboard/social-inbox" },
      { icon: SmilePlus, label: "Stimmungsanalyse", href: "/dashboard/sentiment" },
      { icon: PieChart, label: "Audience Insights", href: "/dashboard/audience" },
      { icon: Calendar, label: "Kalender", href: "/dashboard/kalender" },
      { icon: Clock, label: "Posting-Zeiten", href: "/dashboard/posting-zeiten" },
      { icon: Sparkles, label: "Content-Generator", href: "/dashboard/content-generator" },
      { icon: GitCompare, label: "A/B Vergleich", href: "/dashboard/ab-vergleich" },
      { icon: Hash, label: "Hashtags", href: "/dashboard/hashtags" },
      { icon: Target, label: "Konkurrenz", href: "/dashboard/konkurrenz" },
      { icon: TrendingUp, label: "Trends", href: "/dashboard/trends" },
    ],
  },
  {
    key: "web", title: "Web & SEO", icon: Globe,
    items: [
      { icon: BarChart3, label: "Analysen", href: "/dashboard/analytics" },
      { icon: Globe, label: "SEO-Analyse", href: "/dashboard/seo" },
      { icon: Gauge, label: "Website Speed", href: "/dashboard/speed" },
      { icon: Link2, label: "Backlinks", href: "/dashboard/backlinks" },
      { icon: MapPin, label: "Live Besucher", href: "/dashboard/live-besucher" },
      { icon: FileBarChart, label: "Seiten-Ranking", href: "/dashboard/seiten-ranking" },
      { icon: GitFork, label: "Conversion-Funnel", href: "/dashboard/funnel" },
      { icon: Search, label: "Content-Lücken", href: "/dashboard/content-luecken" },
    ],
  },
  {
    key: "ai", title: "KI & Strategie", icon: Sparkles,
    items: [
      { icon: Sparkles, label: "KI-Erkenntnisse", href: "/dashboard/ai-insights" },
      { icon: Layers, label: "Szenarien", href: "/dashboard/scenarios" },
    ],
  },
  {
    key: "marketing", title: "Marketing", icon: Mail,
    items: [
      { icon: Users, label: "Kontakte", href: "/dashboard/kontakte" },
      { icon: Mail, label: "E-Mail-Marketing", href: "/dashboard/email" },
    ],
  },
  {
    key: "general", title: "Allgemein", icon: FileText,
    items: [
      { icon: Bell, label: "Benachrichtigungen", href: "/dashboard/benachrichtigungen" },
      { icon: FileText, label: "Berichte", href: "/dashboard/reports" },
    ],
  },
]

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { activeCustomer, setActiveCustomer, clearCustomer } = useCustomer()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isSuperAdmin = session?.user?.globalRole === "SUPER_ADMIN"
  const hasCustomer = !!activeCustomer
  const isOnKundenPage = pathname.startsWith("/dashboard/kunden")
  const showFullNav = hasCustomer && !isOnKundenPage

  const activeSection = menuSections.find((s) =>
    s.singleLink
      ? pathname === s.singleLink
      : s.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
  )

  const subSection = menuSections.find((s) => s.key === openSection)
  const isSubOpen = !!subSection && subSection.items.length > 0

  useEffect(() => {
    if (!showFullNav) return
    const current = menuSections.find((s) =>
      s.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    )
    if (current) {
      setOpenSection(current.key)
    }
  }, [pathname, showFullNav])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U"

  function handleSectionClick(section: MenuSection) {
    if (section.singleLink) {
      setOpenSection(null)
      return
    }
    setOpenSection(openSection === section.key ? null : section.key)
  }

  function handleBackToKunden() {
    clearCustomer()
    setOpenSection(null)
    router.push("/dashboard/kunden")
  }

  return (
    <div className="sticky top-0 z-30">
      {/* ─── Top Bar: Admin/Global Actions ─── */}
      <header className="h-[52px] bg-[#0F172A] flex items-center justify-between px-6">
        {/* Left: Logo + Admin Links */}
        <div className="flex items-center gap-1">
          <Link href={hasCustomer ? "/dashboard" : "/dashboard/kunden"} className="shrink-0 mr-4">
            <img src="/logo-dark.svg" alt="EmotionFrame" className="h-7 w-auto brightness-0 invert" />
          </Link>

          {isSuperAdmin && (
            <>
              <Link
                href="/dashboard/kunden"
                onClick={() => { clearCustomer(); setOpenSection(null) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                  isOnKundenPage && !pathname.includes("/neu")
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                Kundenübersicht
              </Link>
              <Link
                href="/dashboard/kunden/neu"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                  pathname === "/dashboard/kunden/neu"
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                Kunde registrieren
              </Link>
              <Link
                href="/dashboard/settings/integrations"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                  pathname === "/dashboard/settings/integrations"
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Allgemeine Einstellungen
              </Link>
              <Link
                href="/dashboard/settings/credentials"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                  pathname === "/dashboard/settings/credentials"
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                Admin Einstellungen
              </Link>
            </>
          )}
        </div>

        {/* Right: EF Dashboard + Bell + User */}
        <div className="flex items-center gap-1">
          {isSuperAdmin && (
            <button
              onClick={() => {
                setActiveCustomer(EF_OWN_CUSTOMER)
                setOpenSection(null)
                router.push("/dashboard")
              }}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeCustomer?.id === "ef"
                  ? "bg-[#6C5CE7]/30 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Unser Dashboard
            </button>
          )}

          <button className="relative rounded-full p-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F97316] rounded-full" />
          </button>

          <div className="w-px h-5 bg-white/15 mx-2" />

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-white/10 transition-colors">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center text-[10px] font-bold text-white">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-medium text-white leading-tight">{session?.user?.name ?? "User"}</p>
                <p className="text-[10px] text-white/40 leading-tight">{isSuperAdmin ? "Admin" : "Mitglied"}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded border border-gray-200 bg-white p-1.5 shadow-xl z-50">
                <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">{session?.user?.name ?? "User"}</p>
                  <p className="text-[11px] text-gray-400 truncate">{session?.user?.email}</p>
                </div>
                <button className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                  <User className="h-4 w-4 opacity-50" />Profil
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" />Abmelden
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Second Bar: Project Nav (only when customer active) ─── */}
      {showFullNav && (
        <div className="h-[44px] bg-white border-b border-gray-100 flex items-center px-6 gap-1">
          {/* Customer Indicator */}
          <div className="flex items-center gap-2 mr-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center text-[10px] font-bold text-white">
              {activeCustomer!.name[0]}
            </div>
            <span className="text-[12px] font-semibold text-[#0F172A] max-w-[100px] truncate">
              {activeCustomer!.name}
            </span>
            <button onClick={handleBackToKunden} className="text-gray-300 hover:text-gray-500 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="w-px h-5 bg-gray-200 mr-2" />

          {/* Nav Items */}
          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {menuSections.map((section) => {
              const isActive = activeSection?.key === section.key
              const isOpen = openSection === section.key
              const hasSubItems = section.items.length > 0

              return section.singleLink ? (
                <Link
                  key={section.key}
                  href={section.singleLink}
                  onClick={() => setOpenSection(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded whitespace-nowrap transition-colors ${
                    isActive && !openSection
                      ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <section.icon className="h-3.5 w-3.5" />
                  {section.title}
                </Link>
              ) : (
                <button
                  key={section.key}
                  onClick={() => handleSectionClick(section)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded whitespace-nowrap transition-colors ${
                    isOpen || (isActive && !openSection)
                      ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <section.icon className="h-3.5 w-3.5" />
                  {section.title}
                  {hasSubItems && (
                    <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </button>
              )
            })}

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <Link
              href="/dashboard/settings/integrations"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded whitespace-nowrap transition-colors ${
                pathname.startsWith("/dashboard/settings")
                  ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              Einstellungen
            </Link>
          </nav>
        </div>
      )}

      {/* ─── Third Bar: Sub Navigation (when section open) ─── */}
      <AnimatePresence>
        {isSubOpen && subSection && showFullNav && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-[#F8FAFC] border-b border-gray-100 overflow-hidden"
          >
            <div className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 mr-3">
                <subSection.icon className="h-3.5 w-3.5 text-[#00CEC9]" />
                <span className="text-[11px] font-semibold text-[#0F172A]">{subSection.title}</span>
              </div>
              <div className="w-px h-4 bg-gray-200 mr-1" />
              {subSection.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                        : "text-gray-500 hover:text-gray-800 hover:bg-white"
                    }`}
                  >
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </Link>
                )
              })}
              <button
                onClick={() => setOpenSection(null)}
                className="ml-auto shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
