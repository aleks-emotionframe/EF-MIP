"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"

const PRIMARY_WIDTH = 72

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#0B1437]">
      <Sidebar />

      <div
        className="hidden md:block min-h-screen"
        style={{ marginLeft: PRIMARY_WIDTH }}
      >
        <Header />
        <main className="p-6 max-w-[1600px]">{children}</main>
      </div>

      <div className="md:hidden min-h-screen">
        <Header />
        <main className="p-4 pb-20">{children}</main>
        <MobileNav />
      </div>
    </div>
  )
}
