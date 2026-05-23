"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { List, Columns3, BarChart3, Settings, Sparkles, Brain } from "lucide-react"

const TABS = [
  { href: "/dashboard/akquise", label: "Leads", icon: List, exact: true },
  { href: "/dashboard/akquise/pipeline", label: "Pipeline", icon: Columns3, exact: true },
  { href: "/dashboard/akquise/dashboard", label: "KPIs", icon: BarChart3, exact: true },
  { href: "/dashboard/akquise/einstellungen", label: "Einstellungen", icon: Settings, exact: true },
  { href: "/dashboard/akquise/ki-training", label: "KI-Training", icon: Brain, exact: true },
]

export function AkquiseNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 mb-6 border-b border-gray-200 pb-3">
      {TABS.map((tab) => {
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded transition-colors ${
              isActive
                ? "bg-[#00CEC9]/10 text-[#00CEC9]"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
