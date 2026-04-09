"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Share2,
  BarChart3,
  Sparkles,
  Settings,
} from "lucide-react"

const mobileItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Share2, label: "Social", href: "/dashboard/social" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Sparkles, label: "AI", href: "/dashboard/ai-insights" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                isActive
                  ? "text-[#6C5CE7]"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
