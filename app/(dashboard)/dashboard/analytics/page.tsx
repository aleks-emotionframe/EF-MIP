"use client"

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import {
  Users, Eye, Clock, ArrowUpRight, ArrowDownRight,
  MousePointer, Globe, Smartphone, Monitor, TrendingUp,
} from "lucide-react"

const trafficData = [
  { name: "01.04", Sitzungen: 1120, Nutzer: 780, Seitenaufrufe: 3200 },
  { name: "02.04", Sitzungen: 1340, Nutzer: 920, Seitenaufrufe: 3800 },
  { name: "03.04", Sitzungen: 1180, Nutzer: 840, Seitenaufrufe: 3400 },
  { name: "04.04", Sitzungen: 1560, Nutzer: 1100, Seitenaufrufe: 4200 },
  { name: "05.04", Sitzungen: 1420, Nutzer: 980, Seitenaufrufe: 3900 },
  { name: "06.04", Sitzungen: 1680, Nutzer: 1200, Seitenaufrufe: 4600 },
  { name: "07.04", Sitzungen: 1520, Nutzer: 1050, Seitenaufrufe: 4100 },
  { name: "08.04", Sitzungen: 1380, Nutzer: 960, Seitenaufrufe: 3700 },
  { name: "09.04", Sitzungen: 1740, Nutzer: 1280, Seitenaufrufe: 4800 },
]

const sourceData = [
  { name: "Organische Suche", value: 42, color: "#6C5CE7" },
  { name: "Direkt", value: 24, color: "#00CEC9" },
  { name: "Soziale Medien", value: 18, color: "#FD79A8" },
  { name: "Verweis", value: 10, color: "#FDCB6E" },
  { name: "E-Mail", value: 6, color: "#74b9ff" },
]

const deviceData = [
  { name: "Desktop", value: 58, icon: Monitor, color: "#6C5CE7" },
  { name: "Mobilgerät", value: 36, icon: Smartphone, color: "#00CEC9" },
  { name: "Tablet", value: 6, icon: Monitor, color: "#FDCB6E" },
]

const topPages = [
  { path: "/", title: "Startseite", aufrufe: 4820, verweildauer: "2:34" },
  { path: "/produkte", title: "Produkte", aufrufe: 2340, verweildauer: "3:12" },
  { path: "/blog/social-media-2026", title: "Blog: Social Media 2026", aufrufe: 1890, verweildauer: "4:45" },
  { path: "/kontakt", title: "Kontakt", aufrufe: 1240, verweildauer: "1:18" },
  { path: "/ueber-uns", title: "Über uns", aufrufe: 980, verweildauer: "2:08" },
]

const searchData = [
  { query: "emotionframe", clicks: 890, impressions: 12400, ctr: 7.2, position: 1.2 },
  { query: "social media analytics tool", clicks: 340, impressions: 8900, ctr: 3.8, position: 4.5 },
  { query: "engagement rate berechnen", clicks: 280, impressions: 6200, ctr: 4.5, position: 3.8 },
  { query: "instagram insights tool", clicks: 190, impressions: 5400, ctr: 3.5, position: 6.2 },
  { query: "social media report erstellen", clicks: 145, impressions: 4100, ctr: 3.5, position: 7.1 },
]

const kpis = [
  { label: "Sitzungen", value: "34.200", change: 9.1, icon: Eye },
  { label: "Nutzer", value: "21.800", change: 7.4, icon: Users },
  { label: "Absprungrate", value: "38,2%", change: -2.1, icon: MousePointer },
  { label: "Ø Verweildauer", value: "2:48", change: 5.3, icon: Clock },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Website-Traffic und Suchkonsolen-Daten</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/[0.06] flex items-center justify-center">
                <kpi.icon className="h-4 w-4 text-[#6C5CE7]" />
              </div>
              <span className={`flex items-center gap-0.5 text-[11px] font-bold ${
                kpi.label === "Absprungrate" ? (kpi.change < 0 ? "text-emerald-600" : "text-red-500") : (kpi.change >= 0 ? "text-emerald-600" : "text-red-500")
              }`}>
                {kpi.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change >= 0 ? "+" : ""}{kpi.change}%
              </span>
            </div>
            <p className="text-[18px] font-bold text-gray-900">{kpi.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Traffic-Übersicht</h3>
        <p className="text-[11px] text-gray-400 mb-4">Sitzungen, Nutzer & Seitenaufrufe</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C5CE7" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00CEC9" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#00CEC9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="Sitzungen" stroke="#6C5CE7" strokeWidth={2} fill="url(#gradSessions)" />
              <Area type="monotone" dataKey="Nutzer" stroke="#00CEC9" strokeWidth={2} fill="url(#gradUsers)" />
              <Area type="monotone" dataKey="Seitenaufrufe" stroke="#DFE4EA" strokeWidth={1.5} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sources + Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traffic Sources */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Besucherquellen</h3>
          <div className="flex items-center gap-6">
            <div className="w-[140px] h-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                    {sourceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {sourceData.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[12px] text-gray-600">{s.name}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-gray-900">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Endgeräte</h3>
          <div className="space-y-4">
            {deviceData.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                  <d.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-gray-800">{d.name}</span>
                    <span className="text-[12px] font-bold text-gray-900">{d.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages + Search Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Pages */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Top-Seiten</h3>
          <div className="space-y-2">
            {topPages.map((page, i) => (
              <div key={page.path} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-gray-50/50 transition-colors">
                <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-800 truncate">{page.title}</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{page.path}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-bold text-gray-900">{page.aufrufe.toLocaleString("de-CH")}</p>
                  <p className="text-[10px] text-gray-400">{page.verweildauer} Ø</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Console */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-[#4285F4]" />
            <h3 className="text-[14px] font-semibold text-gray-900">Search Console</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-400">Suchanfrage</th>
                  <th className="text-right py-2 font-medium text-gray-400">Klicks</th>
                  <th className="text-right py-2 font-medium text-gray-400">CTR</th>
                  <th className="text-right py-2 font-medium text-gray-400">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {searchData.map((row) => (
                  <tr key={row.query} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 font-medium text-gray-800 max-w-[180px] truncate">{row.query}</td>
                    <td className="py-2.5 text-right text-gray-600">{row.clicks}</td>
                    <td className="py-2.5 text-right text-gray-600">{row.ctr}%</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        row.position <= 3 ? "bg-emerald-100 text-emerald-700" : row.position <= 10 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                      }`}>{row.position.toFixed(1)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
