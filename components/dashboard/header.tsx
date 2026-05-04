"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  User, Settings, LogOut, Building2, ChevronDown,
  Bell, Moon, Sun, Search, ArrowLeft, X,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/providers/theme-provider"
import { useCustomer } from "@/components/providers/customer-provider"

const pageTitles: Record<string, string> = {
  "/dashboard": "Übersicht",
  "/dashboard/social": "Soziale Medien",
  "/dashboard/social-inbox": "Social Inbox",
  "/dashboard/sentiment": "Stimmungsanalyse",
  "/dashboard/audience": "Audience Insights",
  "/dashboard/posting-zeiten": "Posting-Zeiten",
  "/dashboard/ab-vergleich": "A/B Vergleich",
  "/dashboard/analytics": "Analysen",
  "/dashboard/speed": "Website Speed",
  "/dashboard/backlinks": "Backlinks",
  "/dashboard/live-besucher": "Live Besucher",
  "/dashboard/seiten-ranking": "Seiten-Ranking",
  "/dashboard/funnel": "Conversion-Funnel",
  "/dashboard/content-luecken": "Content-Lücken",
  "/dashboard/scenarios": "Szenarien",
  "/dashboard/kalender": "Kalender",
  "/dashboard/content-generator": "Content-Generator",
  "/dashboard/hashtags": "Hashtag-Recherche",
  "/dashboard/konkurrenz": "Konkurrenz-Analyse",
  "/dashboard/benachrichtigungen": "Benachrichtigungen",
  "/dashboard/ai-insights": "KI-Erkenntnisse",
  "/dashboard/trends": "Trends",
  "/dashboard/seo": "SEO-Analyse",
  "/dashboard/kontakte": "Kontakte",
  "/dashboard/email": "E-Mail-Marketing",
  "/dashboard/reports": "Berichte",
  "/dashboard/settings": "Einstellungen",
  "/dashboard/settings/integrations": "Integrationen",
  "/dashboard/kunden": "Kundenübersicht",
  "/dashboard/kunden/neu": "Neuen Kunden registrieren",
  "/admin/clients": "Kunden",
}

export function Header() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { activeCustomer, clearCustomer } = useCustomer()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isSuperAdmin = session?.user?.globalRole === "SUPER_ADMIN"
  const isOnKundenPage = pathname.startsWith("/dashboard/kunden")
  const pageTitle = pageTitles[pathname] || pathname.split("/").pop()?.replace(/-/g, " ") || ""

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

  function handleBackToKunden() {
    clearCustomer()
    router.push("/dashboard/kunden")
  }

  return (
    <header className="h-[72px] bg-[#F0F5F9] dark:bg-[#0F172A] flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        {activeCustomer && !isOnKundenPage && (
          <button
            onClick={handleBackToKunden}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-white dark:hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h1 className="text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">{pageTitle}</h1>
          <p className="text-[12px] text-gray-500 dark:text-white/40 mt-0.5">
            {activeCustomer ? activeCustomer.name : "EmotionFrame"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Active Customer Badge */}
        {activeCustomer && !isOnKundenPage && (
          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#00CEC9]/10 to-[#6C5CE7]/10 rounded-full px-4 py-2 mr-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center text-[10px] font-bold text-white">
              {activeCustomer.name[0]}
            </div>
            <span className="text-[12px] font-semibold text-[#0F172A] dark:text-white max-w-[120px] truncate">
              {activeCustomer.name}
            </span>
            {activeCustomer.industry && (
              <span className="text-[10px] text-gray-400 dark:text-white/40">
                {activeCustomer.industry}
              </span>
            )}
            <button
              onClick={handleBackToKunden}
              className="ml-1 text-gray-400 hover:text-gray-600 dark:text-white/30 dark:hover:text-white/60 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F4F7FE] dark:bg-white/[0.05] rounded-full px-4 py-2 mr-2">
          <Search className="h-4 w-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            placeholder="Suchen..."
            className="bg-transparent text-[13px] text-gray-600 dark:text-white/70 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none w-40"
          />
        </div>

        {/* Dark Mode */}
        <button onClick={toggleTheme} aria-label={theme === "dark" ? "Helles Design" : "Dunkles Design"}
          className="rounded-full p-2.5 text-gray-400 dark:text-white/40 hover:bg-[#F4F7FE] dark:hover:bg-white/[0.05] transition-colors">
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Bell */}
        <button className="relative rounded-full p-2.5 text-gray-400 dark:text-white/40 hover:bg-[#F4F7FE] dark:hover:bg-white/[0.05] transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#F97316] rounded-full border-2 border-white dark:border-[#0F172A]" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-2" />

        {/* User */}
        <div ref={userMenuRef} className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 hover:bg-[#F4F7FE] dark:hover:bg-white/[0.05] transition-colors">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center text-[12px] font-bold text-white shadow-lg shadow-[#00CEC9]/20">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-[#0F172A] dark:text-white leading-tight">{session?.user?.name ?? "User"}</p>
              <p className="text-[11px] text-gray-400 dark:text-white/40 leading-tight">{isSuperAdmin ? "Super-Admin" : "Mitglied"}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-1.5 shadow-xl">
              <div className="px-3 py-2.5 border-b border-gray-100 dark:border-white/[0.05] mb-1">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">{session?.user?.name ?? "User"}</p>
                <p className="text-[11px] text-gray-400 dark:text-white/40 truncate">{session?.user?.email}</p>
              </div>
              {isSuperAdmin && (
                <Link href="/dashboard/kunden" onClick={() => { clearCustomer(); setShowUserMenu(false) }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">
                  <Building2 className="h-4 w-4 opacity-50" />Kundenübersicht
                </Link>
              )}
              <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">
                <User className="h-4 w-4 opacity-50" />Profil
              </button>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">
                <Settings className="h-4 w-4 opacity-50" />Einstellungen
              </button>
              <div className="border-t border-gray-100 dark:border-white/[0.05] mt-1 pt-1">
                <button onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <LogOut className="h-4 w-4" />Abmelden
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
