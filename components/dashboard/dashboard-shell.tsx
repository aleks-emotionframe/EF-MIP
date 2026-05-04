"use client"

import { Header } from "@/components/dashboard/header"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F0F5F9]">
      <Header />
      <main className="p-6 max-w-[1600px] mx-auto">{children}</main>
    </div>
  )
}
