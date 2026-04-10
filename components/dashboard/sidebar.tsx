"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home, Share2, BarChart3, Layers, Sparkles, FileText,
  TrendingUp, Globe, Users, Mail, Settings, Calendar,
  Hash, ChevronDown, ChevronLeft, ChevronRight, Target, Bell,
} from "lucide-react"

interface MenuItem { icon: any; label: string; href: string }
interface MenuSection { title: string; items: MenuItem[] }

const menuSections: MenuSection[] = [
  { title: "Übersicht", items: [
    { icon: Home, label: "Startseite", href: "/dashboard" },
  ]},
  { title: "Social Media", items: [
    { icon: Share2, label: "Soziale Medien", href: "/dashboard/social" },
    { icon: Calendar, label: "Kalender", href: "/dashboard/kalender" },
    { icon: Sparkles, label: "Content-Generator", href: "/dashboard/content-generator" },
    { icon: Hash, label: "Hashtags", href: "/dashboard/hashtags" },
    { icon: Target, label: "Konkurrenz", href: "/dashboard/konkurrenz" },
    { icon: TrendingUp, label: "Trends", href: "/dashboard/trends" },
  ]},
  { title: "Web & SEO", items: [
    { icon: BarChart3, label: "Analysen", href: "/dashboard/analytics" },
    { icon: Globe, label: "SEO-Analyse", href: "/dashboard/seo" },
  ]},
  { title: "KI & Strategie", items: [
    { icon: Sparkles, label: "KI-Erkenntnisse", href: "/dashboard/ai-insights" },
    { icon: Layers, label: "Szenarien", href: "/dashboard/scenarios" },
  ]},
  { title: "Marketing", items: [
    { icon: Users, label: "Kontakte", href: "/dashboard/kontakte" },
    { icon: Mail, label: "E-Mail-Marketing", href: "/dashboard/email" },
  ]},
  { title: "Allgemein", items: [
    { icon: Bell, label: "Benachrichtigungen", href: "/dashboard/benachrichtigungen" },
    { icon: FileText, label: "Berichte", href: "/dashboard/reports" },
  ]},
]

interface SidebarProps { isCollapsed: boolean; onToggle: () => void }

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function toggleSection(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const activeSectionTitle = menuSections.find((s) =>
    s.items.some((i) => i.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(i.href))
  )?.title

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 68 : 272 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#1B2559] dark:bg-[#0f1535]"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      {/* Logo */}
      <div className="flex items-center h-[72px] px-5">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B68EE] to-[#4F46E5] flex items-center justify-center shrink-0 shadow-lg shadow-[#4F46E5]/30">
            <span className="text-white font-extrabold text-[14px]">EF</span>
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="font-bold text-[17px] text-white tracking-tight">Emotion</span>
            <span className="font-bold text-[17px] text-[#7B68EE] tracking-tight">Frame</span>
          </motion.div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 pt-2 px-3 overflow-y-auto sidebar-scroll">
        {menuSections.map((section) => {
          const isSectionCollapsed = collapsed[section.title] && activeSectionTitle !== section.title
          const hasActiveItem = section.items.some((i) =>
            i.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(i.href)
          )

          return (
            <div key={section.title} className="mb-1">
              {/* Section Header */}
              <motion.button
                onClick={() => !isCollapsed && toggleSection(section.title)}
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto" }}
                transition={{ duration: 0.15 }}
                className="w-full flex items-center justify-between px-3 py-[7px] rounded-lg hover:bg-white/[0.04] transition-colors overflow-hidden"
              >
                <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                  hasActiveItem ? "text-[#7B68EE]" : "text-white/30"
                }`}>
                  {section.title}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${
                  hasActiveItem ? "text-[#7B68EE]/60" : "text-white/20"
                } ${isSectionCollapsed ? "-rotate-90" : ""}`} />
              </motion.button>

              {/* Items */}
              <AnimatePresence initial={false}>
                {!isSectionCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-[2px] pb-2">
                      {section.items.map((item) => {
                        const isActive =
                          item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href)
                        return (
                          <NavItem key={item.href} item={item} isActive={isActive} isCollapsed={isCollapsed} />
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-[2px]">
        <div className="mx-2 mb-3 border-t border-white/[0.06]" />
        <NavItem
          item={{ icon: Settings, label: "Einstellungen", href: "/dashboard/settings/integrations" }}
          isActive={pathname.startsWith("/dashboard/settings")}
          isCollapsed={isCollapsed}
        />
        <button
          onClick={onToggle}
          className="flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-[18px] w-[18px] shrink-0 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="h-[18px] w-[18px] shrink-0" />
              <span className="text-[13px]">Einklappen</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}

function NavItem({
  item, isActive, isCollapsed,
}: {
  item: MenuItem; isActive: boolean; isCollapsed: boolean
}) {
  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.label : undefined}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all group ${
        isActive
          ? "bg-gradient-to-r from-[#7B68EE]/20 to-[#7B68EE]/[0.05] text-white shadow-sm"
          : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-[#7B68EE]"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}

      <item.icon
        className={`h-[18px] w-[18px] shrink-0 ${isCollapsed ? "mx-auto" : ""} ${
          isActive ? "text-[#7B68EE]" : "text-white/30 group-hover:text-white/60"
        }`}
        strokeWidth={isActive ? 2 : 1.6}
      />

      <motion.span
        initial={false}
        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
        transition={{ duration: 0.15 }}
        className="overflow-hidden whitespace-nowrap"
      >
        {item.label}
      </motion.span>
    </Link>
  )
}
