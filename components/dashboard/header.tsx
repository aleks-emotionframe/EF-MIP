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
} from "lucide-react"

function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }))
}

export function Header() {
  const { data: session } = useSession()
  const breadcrumbs = useBreadcrumbs()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const orgMenuRef = useRef<HTMLDivElement>(null)

  const isSuperAdmin = session?.user?.globalRole === "SUPER_ADMIN"
  const activeOrg = session?.user?.memberships?.find(
    (m) => m.organizationId === session?.user?.activeOrganizationId
  )

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

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            <span
              className={
                crumb.isLast
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Organization Switcher (Super Admin) */}
        {isSuperAdmin && session?.user?.memberships && (
          <div ref={orgMenuRef} className="relative">
            <button
              onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-[140px] truncate">
                {activeOrg?.organizationName ?? "Org wählen"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {showOrgSwitcher && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg">
                {session.user.memberships.map((m) => (
                  <button
                    key={m.organizationId}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      m.organizationId === session.user.activeOrganizationId
                        ? "bg-ef-primary/10 text-[#6C5CE7]"
                        : "hover:bg-muted text-foreground"
                    }`}
                    onClick={() => setShowOrgSwitcher(false)}
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{m.organizationName}</span>
                    <span className="ml-auto text-xs text-muted-foreground capitalize">
                      {m.role.toLowerCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Org Name (non-super-admin) */}
        {!isSuperAdmin && activeOrg && (
          <span className="hidden sm:block text-sm text-muted-foreground">
            {activeOrg.organizationName}
          </span>
        )}

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-ef-primary/20 flex items-center justify-center text-sm font-semibold text-[#6C5CE7]">
              {session?.user?.name?.[0]?.toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg">
              {/* User info */}
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </p>
              </div>

              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <User className="h-4 w-4" />
                Profil
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="h-4 w-4" />
                Einstellungen
              </button>
              <div className="border-t border-border mt-1 pt-1">
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-red-50 transition-colors"
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
