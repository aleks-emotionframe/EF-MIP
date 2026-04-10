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
  FileBarChart, GitFork, Search,
} from "lucide-react"

interface MenuItem { icon: any; label: string; href: string }
interface MenuSection { key: string; title: string; icon: any; items: MenuItem[]; singleLink?: string }

const menuSections: MenuSection[] = [
  {
    key: "home",
    title: "Übersicht",
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

export const PRIMARY_WIDTH = 220
export const SUB_WIDTH = 260

interface SidebarProps {
  onSubOpen?: (open: boolean) => void
}

export function Sidebar({ onSubOpen }: SidebarProps) {
  const pathname = usePathname()
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

  return (
    <>
      {/* ─── Primary Sidebar ─── */}
      <aside
        className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 bg-[#0F172A] dark:bg-[#060C18]"
        style={{ width: PRIMARY_WIDTH }}
        role="navigation"
        aria-label="Hauptnavigation"
      >
        {/* Logo */}
        <div className="flex items-center h-[72px] px-5">
          <Link href="/dashboard" onClick={() => setOpenSection(null)} className="overflow-hidden">
            <img
              src="/EmotionFrame_Logo_w.png"
              alt="EmotionFrame"
              className="h-9 w-auto shrink-0"
            />
          </Link>
        </div>

        {/* Sections */}
        <nav className="flex-1 flex flex-col gap-1 pt-2 px-3 overflow-y-auto sidebar-scroll">
          {menuSections.map((section) => {
            const isActive = activeSection?.key === section.key
            const isOpen = openSection === section.key
            const hasSubItems = section.items.length > 0

            return section.singleLink ? (
              <Link
                key={section.key}
                href={section.singleLink}
                onClick={() => setOpenSection(null)}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all group ${
                  isActive
                    ? "bg-[#00CEC9]/15 text-[#00CEC9]"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-[#00CEC9]" />
                )}
                <section.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                <span>{section.title}</span>
              </Link>
            ) : (
              <button
                key={section.key}
                onClick={() => handleSectionClick(section)}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all group text-left w-full ${
                  isOpen
                    ? "bg-[#00CEC9] text-white shadow-lg shadow-[#00CEC9]/20"
                    : isActive
                    ? "bg-[#00CEC9]/15 text-[#00CEC9]"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                }`}
              >
                {isActive && !isOpen && (
                  <div className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-[#00CEC9]" />
                )}
                <section.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isOpen || isActive ? 2 : 1.5} />
                <span className="flex-1">{section.title}</span>
                {hasSubItems && (
                  <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    isOpen ? "rotate-90" : ""
                  } ${isOpen ? "text-white/70" : "text-white/20 group-hover:text-white/40"}`} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom: Settings */}
        <div className="px-3 pb-4">
          <div className="mx-2 mb-3 border-t border-white/[0.06]" />
          <Link
            href="/dashboard/settings/integrations"
            onClick={() => setOpenSection(null)}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
              pathname.startsWith("/dashboard/settings")
                ? "bg-[#00CEC9]/15 text-[#00CEC9]"
                : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
            }`}
          >
            {pathname.startsWith("/dashboard/settings") && (
              <div className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-[#00CEC9]" />
            )}
            <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={pathname.startsWith("/dashboard/settings") ? 2 : 1.5} />
            <span>Einstellungen</span>
          </Link>
        </div>
      </aside>

      {/* ─── Secondary Sub-Sidebar ─── */}
      <AnimatePresence>
        {isSubOpen && subSection && (
          <>
            <motion.aside
              initial={{ x: -SUB_WIDTH, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -SUB_WIDTH, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="hidden md:flex flex-col h-screen fixed top-0 z-45 bg-[#1E293B] dark:bg-[#0F172A] border-r border-white/[0.06] shadow-2xl shadow-black/30"
              style={{ left: PRIMARY_WIDTH, width: SUB_WIDTH }}
            >
              {/* Sub-header */}
              <div className="flex items-center justify-between h-[72px] px-5">
                <div className="flex items-center gap-2.5">
                  <subSection.icon className="h-4 w-4 text-[#00CEC9]" strokeWidth={2} />
                  <h2 className="text-[15px] font-bold text-white tracking-tight">{subSection.title}</h2>
                </div>
                <button
                  onClick={() => setOpenSection(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sub-items */}
              <nav className="flex-1 px-3 overflow-y-auto sidebar-scroll">
                <div className="space-y-[2px]">
                  {subSection.items.map((item) => {
                    const isActive =
                      pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenSection(null)}
                        className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all group ${
                          isActive
                            ? "bg-gradient-to-r from-[#00CEC9]/15 to-[#6C5CE7]/[0.05] text-white"
                            : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-gradient-to-b from-[#00CEC9] to-[#6C5CE7]" />
                        )}
                        <item.icon
                          className={`h-[18px] w-[18px] shrink-0 ${
                            isActive ? "text-[#00CEC9]" : "text-white/40 group-hover:text-white/70"
                          }`}
                          strokeWidth={isActive ? 2 : 1.6}
                        />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
