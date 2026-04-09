"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Layers,
  BarChart3,
  Sparkles,
  FileText,
} from "lucide-react"

const mobileItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Layers, label: "Scenarios", href: "/dashboard/scenarios" },
  { icon: Sparkles, label: "AI", href: "/dashboard/ai-insights" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-lg safe-area-bottom" role="navigation" aria-label="Mobile Navigation">
      <div className="flex items-center justify-around h-16 px-1">
        {mobileItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors ${
                isActive ? "text-[#6C5CE7]" : "text-gray-400"
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.7} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
