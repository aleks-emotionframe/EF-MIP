"use client"

import { useState } from "react"
import { Sidebar, PRIMARY_WIDTH, SUB_WIDTH } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { motion } from "framer-motion"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSubOpen, setIsSubOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F0F5F9] dark:bg-[#0B1437]">
      <Sidebar onSubOpen={setIsSubOpen} />

      <motion.div
        initial={false}
        animate={{ marginLeft: isSubOpen ? PRIMARY_WIDTH + SUB_WIDTH : PRIMARY_WIDTH }}
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
