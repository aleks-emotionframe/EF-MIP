"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useSidebar } from "@/hooks/use-sidebar"
import { motion } from "framer-motion"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed, toggle } = useSidebar()

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#0B1437]">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />

      <motion.div
        initial={false}
        animate={{ marginLeft: isCollapsed ? 68 : 272 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:block min-h-screen"
      >
        <Header />
        <main className="p-6 max-w-[1600px]">{children}</main>
      </motion.div>

      <div className="md:hidden min-h-screen">
        <Header />
        <main className="p-4 pb-20">{children}</main>
        <MobileNav />
      </div>
    </div>
  )
}
