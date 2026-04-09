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
import { EFLogo } from "@/components/auth/ef-logo"

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Share2, label: "Social", href: "/dashboard/social" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Layers, label: "Scenarios", href: "/dashboard/scenarios" },
  { icon: Sparkles, label: "AI Insights", href: "/dashboard/ai-insights" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
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
      animate={{ width: isCollapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col h-screen bg-card border-r border-border fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <EFLogo size={36} />
          <motion.span
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
            transition={{ duration: 0.2 }}
            className="font-bold text-lg text-foreground whitespace-nowrap overflow-hidden"
          >
            EmotionFrame
          </motion.span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group"
            >
              {/* Active accent bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-[#6C5CE7]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Active background */}
              <div
                className={`absolute inset-0 rounded-lg transition-colors ${
                  isActive
                    ? "bg-ef-primary/10"
                    : "group-hover:bg-muted"
                }`}
              />

              <item.icon
                className={`relative z-10 h-5 w-5 shrink-0 transition-colors ${
                  isActive ? "text-[#6C5CE7]" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />

              <motion.span
                initial={false}
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : "auto",
                }}
                transition={{ duration: 0.2 }}
                className={`relative z-10 whitespace-nowrap overflow-hidden ${
                  isActive ? "text-[#6C5CE7]" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </motion.span>
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.aside>
  )
}
