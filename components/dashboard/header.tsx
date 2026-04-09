"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  ChevronRight,
  User,
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  Bell,
} from "lucide-react"

const pageTitles: Record<string, string> = {
  "/dashboard": "Übersicht",
  "/dashboard/social": "Soziale Medien",
  "/dashboard/analytics": "Analysen",
  "/dashboard/scenarios": "Szenarien",
  "/dashboard/kalender": "Kalender",
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
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (orgMenuRef.current && !orgMenuRef.current.contains(e.target as Node)) {
        setShowOrgSwitcher(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U"

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Page Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-[15px] font-semibold text-gray-900 capitalize">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Org Switcher */}
        {isSuperAdmin && session?.user?.memberships && (
          <div ref={orgMenuRef} className="relative">
            <button
              onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-[7px] text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-gray-400" />
              <span className="max-w-[120px] truncate font-medium">
                {activeOrg?.organizationName ?? "Organisation wählen"}
              </span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {showOrgSwitcher && (
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg border border-gray-200 bg-white p-1 shadow-lg shadow-gray-200/50">
                <p className="px-2.5 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Organisationen</p>
                {session.user.memberships.map((m) => (
                  <button
                    key={m.organizationId}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                      m.organizationId === session.user.activeOrganizationId
                        ? "bg-[#6C5CE7]/[0.06] text-[#6C5CE7] font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => setShowOrgSwitcher(false)}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      m.organizationId === session.user.activeOrganizationId
                        ? "bg-[#6C5CE7]/10 text-[#6C5CE7]"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {m.organizationName[0]}
                    </div>
                    <span className="truncate flex-1 text-left">{m.organizationName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Org Badge (non-admin) */}
        {!isSuperAdmin && activeOrg && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[13px] text-gray-500 bg-gray-50 rounded-lg px-3 py-[7px]">
            <Building2 className="h-3.5 w-3.5 text-gray-400" />
            {activeOrg.organizationName}
          </span>
        )}

        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#6C5CE7] rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-gray-50 transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-[#a29bfe] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-medium text-gray-800 leading-tight">
                {session?.user?.name ?? "User"}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {session?.user?.globalRole === "SUPER_ADMIN" ? "Super-Admin" : "Mitglied"}
              </p>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg border border-gray-200 bg-white p-1 shadow-lg shadow-gray-200/50">
              <div className="px-2.5 py-2 border-b border-gray-100 mb-1">
                <p className="text-[13px] font-medium text-gray-900 truncate">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {session?.user?.email}
                </p>
              </div>

              <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                <User className="h-4 w-4 text-gray-400" />
                Profil
              </button>
              <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 text-gray-400" />
                Einstellungen
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
