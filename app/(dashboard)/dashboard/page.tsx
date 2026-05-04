"use client"

import { Download } from "lucide-react"
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { useCustomer } from "@/components/providers/customer-provider"
import { getCustomerDashboardData } from "@/lib/demo-data"

const tooltipStyle = { background: "white", border: "none", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }

export default function DashboardPage() {
  const { activeCustomer } = useCustomer()
  const data = getCustomerDashboardData(activeCustomer?.id)

  return (
    <div className="space-y-5">
      {/* ─── Row 1: Stats + Visitor Chart ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Heutige Performance</h2>
              <p className="text-[12px] text-gray-400 dark:text-white/40">Zusammenfassung</p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-[11px] font-medium text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <Download className="h-3 w-3" />Export
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`h-4 w-4 ${s.iconColor}`} />
                </div>
                <div>
                  <p className="text-[18px] font-bold text-[#0F172A] dark:text-white leading-tight">{s.value}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/40 leading-tight">{s.label}</p>
                  <p className={`text-[10px] font-semibold leading-tight mt-0.5 ${s.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                    {s.change} ggü. gestern
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white">Besucher-Trends</h2>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6C5CE7]" />Besucher</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00CEC9]" />Neue Follower</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E84393]" />Engagement</span>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="besucher" stroke="#6C5CE7" strokeWidth={2.5} dot={{ r: 3, fill: "#6C5CE7" }} />
                <Line type="monotone" dataKey="neueFollower" stroke="#00CEC9" strokeWidth={2} dot={{ r: 3, fill: "#00CEC9" }} />
                <Line type="monotone" dataKey="engagement" stroke="#E84393" strokeWidth={2} dot={{ r: 3, fill: "#E84393" }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Reach + Satisfaction + Target ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Gesamt-Reichweite</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">Organisch vs. Bezahlt</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.reachData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="online" name="Organisch" fill="#6C5CE7" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="offline" name="Bezahlt" fill="#00CEC9" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#6C5CE7]" />Organisch</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00CEC9]" />Bezahlt</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Kundenzufriedenheit</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-2">Basierend auf Sentiment-Analyse</p>
          <div className="h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.satisfactionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {data.satisfactionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 text-[11px]">
            {data.satisfactionData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Ziel vs. Realität</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-2">Monatliche KPI-Erreichung</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.targetData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar name="Ist" dataKey="ist" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Ziel" dataKey="ziel" stroke="#00CEC9" fill="#00CEC9" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-1 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-[#6C5CE7]" />Ist</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-[#00CEC9] border-dashed" />Ziel</span>
          </div>
        </div>
      </div>

      {/* ─── Row 3: Top Content + Platform + Engagement ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-4">Top Inhalte</h2>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-gray-400 dark:text-white/30 text-left">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium text-right">Engagement</th>
                <th className="pb-3 font-medium text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.topContent.map((c) => (
                <tr key={c.rank} className="border-t border-gray-50 dark:border-white/[0.04]">
                  <td className="py-3 font-semibold text-gray-400 dark:text-white/30">{String(c.rank).padStart(2, "0")}</td>
                  <td className="py-3">
                    <p className="font-medium text-[#0F172A] dark:text-white truncate max-w-[160px]">{c.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">{c.platform}</p>
                  </td>
                  <td className="py-3 text-right font-semibold text-[#0F172A] dark:text-white">{c.engagement}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-0.5">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(Math.abs(c.trend) * 2, 100)}%`,
                            backgroundColor: c.trend >= 0 ? "#00CEC9" : "#F97316",
                          }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ml-1 ${c.trend >= 0 ? "text-[#00CEC9]" : "text-[#F97316]"}`}>
                        {c.trend > 0 ? "+" : ""}{c.trend}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Follower nach Plattform</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-3">Verteilung über alle Kanäle</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.platformData} cx="50%" cy="50%" outerRadius={65} dataKey="value" strokeWidth={2} stroke="#fff">
                  {data.platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {data.platformData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-gray-600 dark:text-white/60">{p.name}</span>
                </span>
                <span className="font-semibold text-[#0F172A] dark:text-white">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">Engagement-Übersicht</h2>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mb-4">Likes, Kommentare & Shares</p>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.engagementBarData} barGap={1}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a0aec0" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="likes" name="Likes" fill="#6C5CE7" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="kommentare" name="Kommentare" fill="#00CEC9" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="shares" name="Shares" fill="#F97316" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#6C5CE7]" />Likes</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00CEC9]" />Kommentare</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#F97316]" />Shares</span>
          </div>
        </div>
      </div>
    </div>
  )
}
