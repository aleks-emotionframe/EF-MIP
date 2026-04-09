"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useSidebar } from "@/hooks/use-sidebar"
import { motion } from "framer-motion"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed, toggle } = useSidebar()

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />

      {/* Desktop Main */}
      <motion.div
        initial={false}
        animate={{ marginLeft: isCollapsed ? 68 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:block min-h-screen"
      >
        <Header />
        <main className="p-6">{children}</main>
      </motion.div>

      {/* Mobile */}
      <div className="md:hidden min-h-screen">
        <Header />
        <main className="p-4 pb-20">{children}</main>
        <MobileNav />
      </div>
    </div>
  )
}
