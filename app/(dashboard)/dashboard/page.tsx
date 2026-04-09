import { Home, TrendingUp, Users, Activity } from "lucide-react"

const stats = [
  { label: "Aktive Kampagnen", value: "12", icon: Activity, color: "ef-primary" },
  { label: "Engagement Rate", value: "4.8%", icon: TrendingUp, color: "ef-secondary" },
  { label: "Clients", value: "24", icon: Users, color: "ef-accent" },
  { label: "AI Insights", value: "156", icon: Home, color: "ef-success" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Willkommen zurück! Hier ist dein Überblick.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 text-${stat.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 min-h-[300px]">
          <h2 className="text-lg font-semibold text-foreground mb-4">Emotion Trends</h2>
          <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
            Chart-Daten werden geladen...
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 min-h-[300px]">
          <h2 className="text-lg font-semibold text-foreground mb-4">Letzte Aktivitäten</h2>
          <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
            Aktivitäten werden geladen...
          </div>
        </div>
      </div>
    </div>
  )
}
