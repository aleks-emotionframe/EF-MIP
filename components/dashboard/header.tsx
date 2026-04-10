"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  User, Settings, LogOut, Building2, ChevronDown,
  Bell, Moon, Sun, Search,
} from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

const pageTitles: Record<string, string> = {
  "/dashboard": "Übersicht",
  "/dashboard/social": "Soziale Medien",
  "/dashboard/analytics": "Analysen",
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
  "/admin/clients": "Kunden",
}

export function Header() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { data: session } = useSession()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const orgMenuRef = useRef<HTMLDivElement>(null)

  const isSuperAdmin = session?.user?.globalRole === "SUPER_ADMIN"
  const activeOrg = session?.user?.memberships?.find(
    (m) => m.organizationId === session?.user?.activeOrganizationId
  )
  const pageTitle = pageTitles[pathname] || pathname.split("/").pop()?.replace(/-/g, " ") || ""

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
      if (orgMenuRef.current && !orgMenuRef.current.contains(e.target as Node)) setShowOrgSwitcher(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U"

  return (
    <header className="h-[72px] bg-white dark:bg-[#111c44] border-b border-gray-100 dark:border-white/[0.05] flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left */}
      <div>
        <h1 className="text-[18px] font-bold text-[#1B2559] dark:text-white tracking-tight">{pageTitle}</h1>
        <p className="text-[12px] text-gray-500 dark:text-white/40 mt-0.5">
          {activeOrg?.organizationName ?? "EmotionFrame"}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F4F7FE] dark:bg-white/[0.05] rounded-full px-4 py-2 mr-2">
          <Search className="h-4 w-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            placeholder="Suchen..."
            className="bg-transparent text-[13px] text-gray-600 dark:text-white/70 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none w-40"
          />
        </div>

        {/* Org Switcher (Super Admin) */}
        {isSuperAdmin && session?.user?.memberships && (
          <div ref={orgMenuRef} className="relative">
            <button onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
              className="flex items-center gap-2 rounded-full bg-[#F4F7FE] dark:bg-white/[0.05] px-3 py-2 text-[12px] text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors">
              <Building2 className="h-3.5 w-3.5" />
              <span className="max-w-[100px] truncate font-medium">{activeOrg?.organizationName ?? "Org"}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
            {showOrgSwitcher && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111c44] p-1.5 shadow-xl">
                <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider">Organisationen</p>
                {session.user.memberships.map((m) => (
                  <button key={m.organizationId} onClick={() => setShowOrgSwitcher(false)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                      m.organizationId === session.user.activeOrganizationId
                        ? "bg-[#7B68EE]/10 text-[#7B68EE] font-medium"
                        : "hover:bg-gray-50 dark:hover:bg-white/[0.05] text-gray-700 dark:text-white/60"
                    }`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                      m.organizationId === session.user.activeOrganizationId
                        ? "bg-[#7B68EE]/15 text-[#7B68EE]"
                        : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40"
                    }`}>{m.organizationName[0]}</div>
                    <span className="truncate">{m.organizationName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dark Mode */}
        <button onClick={toggleTheme} aria-label={theme === "dark" ? "Helles Design" : "Dunkles Design"}
          className="rounded-full p-2.5 text-gray-400 dark:text-white/40 hover:bg-[#F4F7FE] dark:hover:bg-white/[0.05] transition-colors">
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Bell */}
        <button className="relative rounded-full p-2.5 text-gray-400 dark:text-white/40 hover:bg-[#F4F7FE] dark:hover:bg-white/[0.05] transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#7B68EE] rounded-full border-2 border-white dark:border-[#111c44]" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-2" />

        {/* User */}
        <div ref={userMenuRef} className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 hover:bg-[#F4F7FE] dark:hover:bg-white/[0.05] transition-colors">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7B68EE] to-[#4F46E5] flex items-center justify-center text-[12px] font-bold text-white shadow-lg shadow-[#4F46E5]/20">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-[#1B2559] dark:text-white leading-tight">{session?.user?.name ?? "User"}</p>
              <p className="text-[11px] text-gray-400 dark:text-white/40 leading-tight">{session?.user?.globalRole === "SUPER_ADMIN" ? "Super-Admin" : "Mitglied"}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111c44] p-1.5 shadow-xl">
              <div className="px-3 py-2.5 border-b border-gray-100 dark:border-white/[0.05] mb-1">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">{session?.user?.name ?? "User"}</p>
                <p className="text-[11px] text-gray-400 dark:text-white/40 truncate">{session?.user?.email}</p>
              </div>
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
