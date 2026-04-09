"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  Share2,
  BarChart3,
  Layers,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Share2, label: "Social", href: "/dashboard/social" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Layers, label: "Scenarios", href: "/dashboard/scenarios" },
  { icon: Sparkles, label: "AI Insights", href: "/dashboard/ai-insights" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
]

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings/integrations" },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 68 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-white border-r border-gray-100"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#a29bfe] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">EF</span>
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="font-semibold text-[15px] text-gray-900 tracking-tight">EmotionFrame</span>
          </motion.div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100" />

      {/* Main Nav */}
      <nav className="flex-1 pt-4 px-3 space-y-0.5 overflow-y-auto">
        <motion.p
          initial={false}
          animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto" }}
          transition={{ duration: 0.15 }}
          className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 overflow-hidden"
        >
          Menu
        </motion.p>
        {menuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <NavItem key={item.href} item={item} isActive={isActive} isCollapsed={isCollapsed} />
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-3 space-y-0.5">
        <div className="mx-1 mb-2 border-t border-gray-100" />
        {bottomItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <NavItem key={item.href} item={item} isActive={isActive} isCollapsed={isCollapsed} />
          )
        })}
        <button
          onClick={onToggle}
          className="flex items-center w-full gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
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
  item,
  isActive,
  isCollapsed,
}: {
  item: { icon: any; label: string; href: string }
  isActive: boolean
  isCollapsed: boolean
}) {
  return (
    <Link
      href={item.href}
      title={isCollapsed ? item.label : undefined}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all group ${
        isActive
          ? "bg-gradient-to-r from-[#6C5CE7]/[0.08] to-[#a29bfe]/[0.04] text-[#6C5CE7]"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#6C5CE7]"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}

      <item.icon
        className={`h-[18px] w-[18px] shrink-0 ${isCollapsed ? "mx-auto" : ""} ${
          isActive ? "text-[#6C5CE7]" : "text-gray-400 group-hover:text-gray-600"
        }`}
        strokeWidth={isActive ? 2 : 1.7}
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
