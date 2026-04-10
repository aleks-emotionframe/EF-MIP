"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home, Share2, BarChart3, Layers, Sparkles, FileText,
  TrendingUp, Globe, Users, Mail, Settings, Calendar,
  Hash, Target, Bell, ChevronRight, X,
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
      { icon: Calendar, label: "Kalender", href: "/dashboard/kalender" },
      { icon: Sparkles, label: "Content-Generator", href: "/dashboard/content-generator" },
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

const PRIMARY_WIDTH = 72
const SUB_WIDTH = 240

export function Sidebar() {
  const pathname = usePathname()
  const [openSection, setOpenSection] = useState<string | null>(null)

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
    setOpenSection((prev) => (prev === section.key ? null : section.key))
  }

  const subSection = menuSections.find((s) => s.key === openSection)
  const isSubOpen = !!subSection && subSection.items.length > 0

  return (
    <>
      {/* ─── Primary Icon Sidebar ─── */}
      <aside
        className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 bg-[#0F172A] dark:bg-[#060C18]"
        style={{ width: PRIMARY_WIDTH }}
        role="navigation"
        aria-label="Hauptnavigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-[72px]">
          <Link href="/dashboard" onClick={() => setOpenSection(null)}>
            <div className="w-10 h-10 overflow-hidden">
              <img
                src="/EmotionFrame_Logo_w.png"
                alt="EmotionFrame"
                className="h-10 w-auto max-w-none"
              />
            </div>
          </Link>
        </div>

        {/* Section Icons */}
        <nav className="flex-1 flex flex-col items-center gap-1 pt-2 px-2">
          {menuSections.map((section) => {
            const isActive = activeSection?.key === section.key
            const isOpen = openSection === section.key

            return section.singleLink ? (
              <Link
                key={section.key}
                href={section.singleLink}
                onClick={() => setOpenSection(null)}
                title={section.title}
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                  isActive && !isOpen
                    ? "bg-[#00CEC9]/15 text-[#00CEC9]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
                }`}
              >
                {isActive && !isOpen && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#00CEC9]" />
                )}
                <section.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
              </Link>
            ) : (
              <button
                key={section.key}
                onClick={() => handleSectionClick(section)}
                title={section.title}
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                  isOpen
                    ? "bg-[#00CEC9] text-white shadow-lg shadow-[#00CEC9]/25"
                    : isActive
                    ? "bg-[#00CEC9]/15 text-[#00CEC9]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
                }`}
              >
                {isActive && !isOpen && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#00CEC9]" />
                )}
                <section.icon className="h-5 w-5" strokeWidth={isOpen || isActive ? 2 : 1.5} />
              </button>
            )
          })}
        </nav>

        {/* Bottom: Settings */}
        <div className="flex flex-col items-center gap-1 px-2 pb-4">
          <div className="w-8 border-t border-white/[0.06] mb-2" />
          <Link
            href="/dashboard/settings/integrations"
            title="Einstellungen"
            onClick={() => setOpenSection(null)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
              pathname.startsWith("/dashboard/settings")
                ? "bg-[#00CEC9]/15 text-[#00CEC9]"
                : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
            }`}
          >
            <Settings className="h-5 w-5" strokeWidth={pathname.startsWith("/dashboard/settings") ? 2 : 1.5} />
          </Link>
        </div>
      </aside>

      {/* ─── Secondary Sub-Sidebar ─── */}
      <AnimatePresence>
        {isSubOpen && subSection && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/20 md:hidden"
              onClick={() => setOpenSection(null)}
            />

            <motion.aside
              initial={{ x: -SUB_WIDTH, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -SUB_WIDTH, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="hidden md:flex flex-col h-screen fixed top-0 z-40 bg-[#1E293B] dark:bg-[#0F172A] border-r border-white/[0.06] shadow-2xl shadow-black/20"
              style={{ left: PRIMARY_WIDTH, width: SUB_WIDTH }}
            >
              {/* Sub-header */}
              <div className="flex items-center justify-between h-[72px] px-5">
                <h2 className="text-[15px] font-bold text-white tracking-tight">{subSection.title}</h2>
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
                        {isActive && (
                          <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/30" />
                        )}
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
