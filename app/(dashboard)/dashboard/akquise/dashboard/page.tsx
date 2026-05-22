"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AkquiseNav } from "@/components/akquise/akquise-nav"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts"
import {
  Target, TrendingUp, Users, Building2, Calendar, Star,
  CheckCircle, Clock, MessageSquare, ArrowRight, Sparkles, Phone,
  ChevronLeft, Loader2,
} from "lucide-react"

interface Reminder {
  id: string
  leadName: string
  title: string
  time: string
  done: boolean
}

interface Activity {
  id: string
  type: "NOTE" | "STATUS_CHANGE" | "REMINDER" | "ANALYSIS"
  message: string
  leadName: string
  timestamp: string
}

const DEMO_KPIS = {
  neueLeads: 156,
  neueLeadsChange: 23,
  recherchiert: 89,
  recherchiertChange: 12,
  angeschrieben: 34,
  angeschriebenChange: 8,
  antwortquote: 41,
  antwortquoteChange: 5,
  termine: 12,
  termineChange: 3,
  konvertiert: 7,
  konvertiertChange: 2,
}

const DEMO_FUNNEL = [
  { stage: "Neu", count: 156, fill: "#3B82F6" },
  { stage: "Recherchiert", count: 89, fill: "#00CEC9" },
  { stage: "Angeschrieben", count: 34, fill: "#F97316" },
  { stage: "Follow-up", count: 18, fill: "#F59E0B" },
  { stage: "Antwort", count: 14, fill: "#10B981" },
  { stage: "Termin", count: 12, fill: "#06B6D4" },
  { stage: "Offerte", count: 9, fill: "#6366F1" },
  { stage: "Kunde", count: 7, fill: "#6C5CE7" },
]

const DEMO_INDUSTRIES = [
  { name: "Gastronomie", value: 42, fill: "#6C5CE7" },
  { name: "Fitness", value: 28, fill: "#00CEC9" },
  { name: "Mode", value: 22, fill: "#F97316" },
  { name: "Immobilien", value: 18, fill: "#E84393" },
  { name: "Gesundheit", value: 16, fill: "#10B981" },
  { name: "IT", value: 12, fill: "#3B82F6" },
  { name: "Handwerk", value: 10, fill: "#F59E0B" },
  { name: "Bildung", value: 8, fill: "#8B5CF6" },
]

const DEMO_WEEKLY = [
  { week: "KW 15", neueLeads: 12, kontaktiert: 4, konvertiert: 0 },
  { week: "KW 16", neueLeads: 15, kontaktiert: 5, konvertiert: 1 },
  { week: "KW 17", neueLeads: 18, kontaktiert: 6, konvertiert: 1 },
  { week: "KW 18", neueLeads: 20, kontaktiert: 8, konvertiert: 1 },
  { week: "KW 19", neueLeads: 22, kontaktiert: 7, konvertiert: 2 },
  { week: "KW 20", neueLeads: 25, kontaktiert: 9, konvertiert: 1 },
  { week: "KW 21", neueLeads: 21, kontaktiert: 10, konvertiert: 0 },
  { week: "KW 22", neueLeads: 23, kontaktiert: 11, konvertiert: 1 },
]

const DEMO_CONVERSION = [
  { branche: "Fitness", rate: 18 },
  { branche: "IT", rate: 15 },
  { branche: "Gastronomie", rate: 12 },
  { branche: "Gesundheit", rate: 10 },
  { branche: "Mode", rate: 8 },
  { branche: "Immobilien", rate: 6 },
  { branche: "Bildung", rate: 5 },
  { branche: "Handwerk", rate: 4 },
]

const DEMO_REMINDERS: Reminder[] = [
  { id: "r1", leadName: "Restaurant Löwengarten", title: "Nachfass-Anruf", time: "09:00", done: false },
  { id: "r2", leadName: "FitZone Basel", title: "Offerte nachsenden", time: "11:30", done: false },
  { id: "r3", leadName: "Schneider Immobilien", title: "Meeting vorbereiten", time: "14:00", done: false },
  { id: "r4", leadName: "Alpine Yoga Studio", title: "Follow-up E-Mail", time: "16:00", done: false },
]

const DEMO_ACTIVITIES: Activity[] = [
  { id: "a1", type: "STATUS_CHANGE", message: "Status geändert zu Kunde", leadName: "LuxusHaar Salon", timestamp: "2026-05-22T08:45:00" },
  { id: "a2", type: "NOTE", message: "Telefonat geführt, Interesse bestätigt", leadName: "Café Monico", timestamp: "2026-05-22T08:30:00" },
  { id: "a3", type: "ANALYSIS", message: "Website-Analyse abgeschlossen (Score: 85)", leadName: "Berghotel Edelweiss", timestamp: "2026-05-22T08:15:00" },
  { id: "a4", type: "REMINDER", message: "Wiedervorlage erstellt für morgen", leadName: "SwissCode Academy", timestamp: "2026-05-22T07:50:00" },
  { id: "a5", type: "STATUS_CHANGE", message: "Status geändert zu Angeschrieben", leadName: "Autohaus Keller", timestamp: "2026-05-21T17:30:00" },
  { id: "a6", type: "NOTE", message: "Erstgespräch vereinbart", leadName: "Bäckerei Hofmann", timestamp: "2026-05-21T16:45:00" },
  { id: "a7", type: "ANALYSIS", message: "Social-Media-Analyse abgeschlossen (Score: 92)", leadName: "Nail Art Studio", timestamp: "2026-05-21T15:20:00" },
  { id: "a8", type: "STATUS_CHANGE", message: "Status geändert zu Recherchiert", leadName: "Weber Treuhand", timestamp: "2026-05-21T14:00:00" },
  { id: "a9", type: "REMINDER", message: "Wiedervorlage erledigt", leadName: "Modehaus Tanner", timestamp: "2026-05-21T11:30:00" },
  { id: "a10", type: "NOTE", message: "Offerte versendet per E-Mail", leadName: "Pizzeria Da Luigi", timestamp: "2026-05-21T10:15:00" },
]

const ACTIVITY_ICONS: Record<Activity["type"], typeof MessageSquare> = {
  NOTE: MessageSquare,
  STATUS_CHANGE: ArrowRight,
  REMINDER: Clock,
  ANALYSIS: Sparkles,
}

const ACTIVITY_COLORS: Record<Activity["type"], string> = {
  NOTE: "#3B82F6",
  STATUS_CHANGE: "#F97316",
  REMINDER: "#6C5CE7",
  ANALYSIS: "#00CEC9",
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const now = new Date("2026-05-22T12:00:00")
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "Gerade eben"
  if (hours < 24) return `Vor ${hours} Std.`
  const days = Math.floor(hours / 24)
  return `Vor ${days} Tag${days > 1 ? "en" : ""}`
}

export default function AkquiseDashboardPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/akquise/reminders?dueToday=true")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setReminders(data)
          } else {
            setReminders(DEMO_REMINDERS)
          }
        } else {
          setReminders(DEMO_REMINDERS)
        }
      } catch {
        setReminders(DEMO_REMINDERS)
      }

      setActivities(DEMO_ACTIVITIES)
      setLoading(false)
    }
    loadData()
  }, [])

  function markDone(id: string) {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: true } : r)))
  }

  const kpiCards = [
    { label: "Neue Leads", value: DEMO_KPIS.neueLeads, change: DEMO_KPIS.neueLeadsChange, icon: Target, color: "#3B82F6" },
    { label: "Recherchiert", value: DEMO_KPIS.recherchiert, change: DEMO_KPIS.recherchiertChange, icon: Building2, color: "#00CEC9" },
    { label: "Angeschrieben", value: DEMO_KPIS.angeschrieben, change: DEMO_KPIS.angeschriebenChange, icon: Phone, color: "#F97316" },
    { label: "Antwortquote", value: `${DEMO_KPIS.antwortquote}%`, change: DEMO_KPIS.antwortquoteChange, icon: TrendingUp, color: "#10B981", suffix: "%" },
    { label: "Termine", value: DEMO_KPIS.termine, change: DEMO_KPIS.termineChange, icon: Calendar, color: "#06B6D4" },
    { label: "Konvertiert", value: DEMO_KPIS.konvertiert, change: DEMO_KPIS.konvertiertChange, icon: Star, color: "#6C5CE7" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F0F5F9" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
          <p className="text-gray-500">Dashboard wird geladen...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: "#F0F5F9" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <AkquiseNav />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Akquise-Dashboard</h1>
            <p className="text-gray-500 mt-1">KPIs und Auswertungen</p>
          </div>
          <Link
            href="/dashboard/akquise"
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm self-start"
          >
            <ChevronLeft className="w-4 h-4" />
            Zur Leadliste
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0F172A]">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              <p className="text-xs mt-2" style={{ color: card.color }}>
                +{card.change}{card.suffix === "%" ? "%" : ""} ggü. Vormonat
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Pipeline-Funnel</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={DEMO_FUNNEL}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <YAxis
                  type="category"
                  dataKey="stage"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                  formatter={(value) => [String(value), "Leads"]}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
                  {DEMO_FUNNEL.map((entry) => (
                    <Cell key={entry.stage} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Leads nach Branche</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={DEMO_INDUSTRIES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DEMO_INDUSTRIES.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                  formatter={(value, name) => [String(value), String(name)]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Leads pro Woche</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={DEMO_WEEKLY} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                />
                <Legend
                  verticalAlign="top"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="neueLeads"
                  name="Neue Leads"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3B82F6" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="kontaktiert"
                  name="Kontaktiert"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#F97316" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="konvertiert"
                  name="Konvertiert"
                  stroke="#6C5CE7"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#6C5CE7" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Top Branchen nach Conversion</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={DEMO_CONVERSION}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="branche"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                  formatter={(value) => [`${value}%`, "Conversion"]}
                />
                <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={24} fill="#E84393" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#6C5CE7]" />
              Wiedervorlagen - Heute fällig
            </span>
          </h2>
          {reminders.filter((r) => !r.done).length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-gray-500">Keine Wiedervorlagen für heute</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <motion.div
                  key={reminder.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: reminder.done ? 0.5 : 1, x: 0 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${reminder.done ? "border-gray-100 bg-gray-50" : "border-gray-200 bg-white"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: reminder.done ? "#F1F5F9" : "#6C5CE715" }}
                    >
                      <Clock className="w-5 h-5" style={{ color: reminder.done ? "#94A3B8" : "#6C5CE7" }} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${reminder.done ? "text-gray-400 line-through" : "text-[#0F172A]"}`}>
                        {reminder.title}
                      </p>
                      <p className="text-xs text-gray-500">{reminder.leadName} &middot; {reminder.time}</p>
                    </div>
                  </div>
                  {!reminder.done && (
                    <button
                      onClick={() => markDone(reminder.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] hover:opacity-90 transition-opacity flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Erledigt
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00CEC9]" />
              Letzte Aktivitäten
            </span>
          </h2>
          <div className="space-y-1">
            {activities.map((activity, i) => {
              const IconComp = ACTIVITY_ICONS[activity.type]
              const iconColor = ACTIVITY_COLORS[activity.type]
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.03 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${iconColor}15` }}
                  >
                    <IconComp className="w-4 h-4" style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F172A]">
                      <span className="font-medium">{activity.leadName}</span>
                      <span className="text-gray-500"> - {activity.message}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
