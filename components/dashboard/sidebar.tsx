"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home, Share2, BarChart3, Layers, Sparkles, FileText,
  TrendingUp, Globe, Users, Mail, Settings, Calendar,
  Hash, Target, Bell, ChevronRight, X, Inbox, Clock,
  PieChart, SmilePlus, GitCompare, Gauge, Link2, MapPin,
  FileBarChart, GitFork, Search, LogOut, Building2,
} from "lucide-react"
import { useSession } from "next-auth/react"

interface MenuItem { icon: any; label: string; href: string }
interface MenuSection { key: string; title: string; icon: any; items: MenuItem[]; singleLink?: string }

const menuSections: MenuSection[] = [
  {
    key: "home",
    title: "Dashboard",
    icon: Home,
    singleLink: "/dashboard",
    items: [],
  },
  {
    key: "social",
    title: "Social Media",
    icon: Share2,
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
    key: "web",
    title: "Web & SEO",
    icon: Globe,
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
    key: "ai",
    title: "KI & Strategie",
    icon: Sparkles,
    items: [
      { icon: Sparkles, label: "KI-Erkenntnisse", href: "/dashboard/ai-insights" },
      { icon: Layers, label: "Szenarien", href: "/dashboard/scenarios" },
    ],
  },
  {
    key: "marketing",
    title: "Marketing",
    icon: Mail,
    items: [
      { icon: Users, label: "Kontakte", href: "/dashboard/kontakte" },
      { icon: Mail, label: "E-Mail-Marketing", href: "/dashboard/email" },
    ],
  },
  {
    key: "general",
    title: "Allgemein",
    icon: FileText,
    items: [
      { icon: Bell, label: "Benachrichtigungen", href: "/dashboard/benachrichtigungen" },
      { icon: FileText, label: "Berichte", href: "/dashboard/reports" },
    ],
  },
]

export const PRIMARY_WIDTH = 230
export const SUB_WIDTH = 260

interface SidebarProps {
  onSubOpen?: (open: boolean) => void
}

export function Sidebar({ onSubOpen }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isSuperAdmin = session?.user?.globalRole === "SUPER_ADMIN"
  const [openSection, setOpenSectionRaw] = useState<string | null>(null)

  function setOpenSection(key: string | null) {
    setOpenSectionRaw(key)
    const section = key ? menuSections.find((s) => s.key === key) : null
    onSubOpen?.(!!section && section.items.length > 0)
  }

  const activeSection = menuSections.find((s) =>
    s.singleLink
      ? pathname === s.singleLink
      : s.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
  )

  function handleSectionClick(section: MenuSection) {
    if (section.singleLink) {
      setOpenSection(null)
      return
    }
    setOpenSection(openSection === section.key ? null : section.key)
  }

  const subSection = menuSections.find((s) => s.key === openSection)
  const isSubOpen = !!subSection && subSection.items.length > 0
  const anySubOpen = openSection !== null

  return (
    <>
      {/* ─── Primary Sidebar (Light) ─── */}
      <aside
        className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 bg-white dark:bg-[#1E293B] border-r border-gray-100 dark:border-white/[0.06]"
        style={{ width: PRIMARY_WIDTH }}
        role="navigation"
        aria-label="Hauptnavigation"
      >
        {/* Logo */}
        <div className="flex items-center h-[72px] px-5">
          <Link href="/dashboard" onClick={() => setOpenSection(null)} className="overflow-hidden">
            <img
              src="/logo-dark.svg"
              alt="EmotionFrame"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Sections */}
        <nav className="flex-1 flex flex-col gap-0.5 pt-3 px-3 overflow-y-auto sidebar-scroll">
          {isSuperAdmin && (
            <Link
              href="/dashboard/kunden"
              onClick={() => setOpenSection(null)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all mb-1 ${
                pathname.startsWith("/dashboard/kunden")
                  ? "bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white shadow-md shadow-[#00CEC9]/20"
                  : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]"
              }`}
            >
              <Building2 className="h-[18px] w-[18px] shrink-0" strokeWidth={pathname.startsWith("/dashboard/kunden") ? 2 : 1.5} />
              <span>Kunden</span>
            </Link>
          )}
          {menuSections.map((section) => {
            const isActive = activeSection?.key === section.key
            const isOpen = openSection === section.key
            const hasSubItems = section.items.length > 0

            const showActive = isActive && !anySubOpen
            const showGradient = isOpen || showActive

            return section.singleLink ? (
              <Link
                key={section.key}
                href={section.singleLink}
                onClick={() => setOpenSection(null)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                  showActive
                    ? "bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white shadow-md shadow-[#00CEC9]/20"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                }`}
              >
                <section.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={showActive ? 2 : 1.5} />
                <span>{section.title}</span>
              </Link>
            ) : (
              <button
                key={section.key}
                onClick={() => handleSectionClick(section)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all text-left w-full ${
                  showGradient
                    ? "bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white shadow-md shadow-[#00CEC9]/20"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                }`}
              >
                <section.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={showGradient ? 2 : 1.5} />
                <span className="flex-1">{section.title}</span>
                {hasSubItems && (
                  <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    isOpen ? "rotate-90" : ""
                  } ${showGradient ? "text-white/70" : "text-gray-300 dark:text-white/20"}`} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-1">
          <div className="mx-2 mb-2 border-t border-gray-100 dark:border-white/[0.06]" />
          <Link
            href="/dashboard/settings/integrations"
            onClick={() => setOpenSection(null)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
              pathname.startsWith("/dashboard/settings")
                ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]"
            }`}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
            <span>Einstellungen</span>
          </Link>
          <button className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-gray-400 dark:text-white/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full text-left">
            <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
            <span>Abmelden</span>
          </button>
        </div>
      </aside>

      {/* ─── Secondary Sub-Sidebar ─── */}
      <AnimatePresence>
        {isSubOpen && subSection && (
          <motion.aside
            initial={{ x: -SUB_WIDTH, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -SUB_WIDTH, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="hidden md:flex flex-col h-screen fixed top-0 z-45 bg-white dark:bg-[#1E293B] border-r border-gray-100 dark:border-white/[0.06] shadow-xl shadow-black/5 dark:shadow-black/30"
            style={{ left: PRIMARY_WIDTH, width: SUB_WIDTH }}
          >
            {/* Sub-header */}
            <div className="flex items-center justify-between h-[72px] px-5 border-b border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00CEC9]/15 to-[#6C5CE7]/10 flex items-center justify-center">
                  <subSection.icon className="h-3.5 w-3.5 text-[#00CEC9]" strokeWidth={2} />
                </div>
                <h2 className="text-[14px] font-bold text-[#0F172A] dark:text-white">{subSection.title}</h2>
              </div>
              <button
                onClick={() => setOpenSection(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/30 hover:text-gray-500 dark:hover:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sub-items */}
            <nav className="flex-1 px-3 pt-3 overflow-y-auto sidebar-scroll">
              <div className="space-y-0.5">
                {subSection.items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenSection(null)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all group ${
                        isActive
                          ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                          : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                      }`}
                    >
                      <item.icon
                        className={`h-[18px] w-[18px] shrink-0 ${
                          isActive ? "text-[#00CEC9]" : "text-gray-400 dark:text-white/30 group-hover:text-gray-600 dark:group-hover:text-white/60"
                        }`}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
