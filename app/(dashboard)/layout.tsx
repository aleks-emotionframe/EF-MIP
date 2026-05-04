import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CustomerProvider } from "@/components/providers/customer-provider"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CustomerProvider>
          <DashboardShell>{children}</DashboardShell>
        </CustomerProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
