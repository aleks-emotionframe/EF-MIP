"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, Camera,
  ThumbsUp, PlayCircle, Briefcase, Music2, Check,
  Calendar as CalendarIcon, Image as ImageIcon, Pencil, Trash2,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
type ViewMode = "month" | "week"

interface Post {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  platform: string
  title: string
  content: string
  status: "geplant" | "entwurf" | "veroeffentlicht"
  color: string
}

const PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: Camera, color: "#E1306C" },
  { key: "facebook", label: "Facebook", icon: ThumbsUp, color: "#1877F2" },
  { key: "youtube", label: "YouTube", icon: PlayCircle, color: "#FF0000" },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase, color: "#0A66C2" },
  { key: "tiktok", label: "TikTok", icon: Music2, color: "#000000" },
]

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

// ─── Demo posts ─────────────────────────────────────────────────
const INITIAL_POSTS: Post[] = [
  { id: "p1", date: "2026-04-10", time: "10:00", platform: "instagram", title: "Produkt-Reel", content: "Neues Feature zeigen mit Behind-the-Scenes", status: "geplant", color: "#E1306C" },
  { id: "p2", date: "2026-04-10", time: "14:00", platform: "linkedin", title: "Branchen-Insight", content: "Artikel über aktuelle Marketing-Trends", status: "geplant", color: "#0A66C2" },
  { id: "p3", date: "2026-04-12", time: "18:00", platform: "tiktok", title: "Quick-Tipp Video", content: "3 Tipps für mehr Engagement", status: "entwurf", color: "#000000" },
  { id: "p4", date: "2026-04-14", time: "09:00", platform: "facebook", title: "Kundenstory", content: "Case Study TechVision", status: "geplant", color: "#1877F2" },
  { id: "p5", date: "2026-04-15", time: "12:00", platform: "instagram", title: "Karussell-Post", content: "5 Strategien für Social Media 2026", status: "geplant", color: "#E1306C" },
  { id: "p6", date: "2026-04-17", time: "16:00", platform: "youtube", title: "Tutorial-Video", content: "EmotionFrame Walkthrough", status: "entwurf", color: "#FF0000" },
  { id: "p7", date: "2026-04-08", time: "11:00", platform: "instagram", title: "Story-Serie", content: "Tag im Büro", status: "veroeffentlicht", color: "#E1306C" },
  { id: "p8", date: "2026-04-09", time: "15:00", platform: "linkedin", title: "Team-Update", content: "Neues Teammitglied vorstellen", status: "veroeffentlicht", color: "#0A66C2" },
  { id: "p9", date: "2026-04-20", time: "10:00", platform: "instagram", title: "Gewinnspiel", content: "Monatsgewinnspiel April", status: "geplant", color: "#E1306C" },
  { id: "p10", date: "2026-04-22", time: "14:00", platform: "tiktok", title: "Trend-Video", content: "Aktuellen TikTok-Trend nutzen", status: "entwurf", color: "#000000" },
]

const STATUS_STYLE = {
  geplant: { bg: "bg-blue-100", text: "text-blue-700", label: "Geplant" },
  entwurf: { bg: "bg-gray-100", text: "text-gray-600", label: "Entwurf" },
  veroeffentlicht: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Veröffentlicht" },
}

// ─── Helpers ────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

// ─── Page ───────────────────────────────────────────────────────
export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)) // April 2026
  const [view, setView] = useState<ViewMode>("month")
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Form
  const [formDate, setFormDate] = useState("")
  const [formTime, setFormTime] = useState("10:00")
  const [formPlatform, setFormPlatform] = useState("instagram")
  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formStatus, setFormStatus] = useState<Post["status"]>("geplant")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = formatDate(new Date())

  const postsByDate = useMemo(() => {
    const map: Record<string, Post[]> = {}
    posts.forEach((p) => { (map[p.date] ??= []).push(p) })
    return map
  }, [posts])

  function navigate(dir: number) {
    setCurrentDate(new Date(year, month + dir, 1))
  }

  function openCreate(date?: string) {
    setEditingPost(null)
    setFormDate(date ?? formatDate(currentDate))
    setFormTime("10:00"); setFormPlatform("instagram"); setFormTitle(""); setFormContent(""); setFormStatus("geplant")
    setShowModal(true)
  }

  function openEdit(post: Post) {
    setEditingPost(post)
    setFormDate(post.date); setFormTime(post.time); setFormPlatform(post.platform); setFormTitle(post.title); setFormContent(post.content); setFormStatus(post.status)
    setShowModal(true)
  }

  function handleSave() {
    if (!formTitle || !formDate) return
    const platform = PLATFORMS.find((p) => p.key === formPlatform)!
    if (editingPost) {
      setPosts((prev) => prev.map((p) => p.id === editingPost.id ? { ...p, date: formDate, time: formTime, platform: formPlatform, title: formTitle, content: formContent, status: formStatus, color: platform.color } : p))
    } else {
      setPosts((prev) => [...prev, { id: `p-${Date.now()}`, date: formDate, time: formTime, platform: formPlatform, title: formTitle, content: formContent, status: formStatus, color: platform.color }])
    }
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  // Week view dates
  const weekStart = useMemo(() => {
    const d = new Date(currentDate)
    const day = d.getDay()
    const diff = d.getDate() - (day === 0 ? 6 : day - 1)
    return new Date(d.setDate(diff))
  }, [currentDate])

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [weekStart])

  // Stats
  const thisMonthPosts = posts.filter((p) => p.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
  const plannedCount = thisMonthPosts.filter((p) => p.status === "geplant").length
  const draftCount = thisMonthPosts.filter((p) => p.status === "entwurf").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#6C5CE7]" />
            <h1 className="text-xl font-semibold text-gray-900">Content-Kalender</h1>
          </div>
          <p className="text-[13px] text-gray-500 mt-0.5">Plane und verwalte deine Social-Media-Beiträge.</p>
        </div>
        <button onClick={() => openCreate()} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] px-4 py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#6C5CE7]/30 transition-all">
          <Plus className="h-3.5 w-3.5" />Beitrag planen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-[20px] font-bold text-gray-900">{thisMonthPosts.length}</p>
          <p className="text-[11px] text-gray-400">Beiträge im {MONTH_NAMES[month]}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-[20px] font-bold text-blue-600">{plannedCount}</p>
          <p className="text-[11px] text-gray-400">Geplant</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-[20px] font-bold text-gray-500">{draftCount}</p>
          <p className="text-[11px] text-gray-400">Entwürfe</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 hover:bg-gray-100 transition-colors"><ChevronLeft className="h-4 w-4 text-gray-600" /></button>
          <h2 className="text-[15px] font-semibold text-gray-900 w-40 text-center">{MONTH_NAMES[month]} {year}</h2>
          <button onClick={() => navigate(1)} className="rounded-lg p-2 hover:bg-gray-100 transition-colors"><ChevronRight className="h-4 w-4 text-gray-600" /></button>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
          {(["month", "week"] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`relative rounded-lg px-4 py-1.5 text-[12px] font-medium transition-all ${view === v ? "text-gray-900" : "text-gray-500"}`}>
              {view === v && <motion.div layoutId="cal-view" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">{v === "month" ? "Monat" : "Woche"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Month View ──────────────────────────────────────── */}
      {view === "month" && (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase">{d}</div>
            ))}
          </div>
          {/* Days grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-50 bg-gray-50/30" />
            ))}
            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const dayPosts = postsByDate[dateStr] ?? []
              const isToday = dateStr === today

              return (
                <div key={day}
                  onClick={() => openCreate(dateStr)}
                  className={`min-h-[100px] border-b border-r border-gray-50 p-1.5 cursor-pointer hover:bg-[#6C5CE7]/[0.02] transition-colors ${isToday ? "bg-[#6C5CE7]/[0.03]" : ""}`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-medium ${isToday ? "bg-[#6C5CE7] text-white" : "text-gray-600"}`}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.slice(0, 3).map((post) => (
                      <button key={post.id} onClick={(e) => { e.stopPropagation(); openEdit(post) }}
                        className="w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium text-white truncate"
                        style={{ backgroundColor: post.color }}>
                        {post.time} {post.title}
                      </button>
                    ))}
                    {dayPosts.length > 3 && <p className="text-[9px] text-gray-400 px-1">+{dayPosts.length - 3} weitere</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Week View ───────────────────────────────────────── */}
      {view === "week" && (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          <div className="grid grid-cols-7">
            {weekDates.map((date) => {
              const dateStr = formatDate(date)
              const dayPosts = (postsByDate[dateStr] ?? []).sort((a, b) => a.time.localeCompare(b.time))
              const isToday = dateStr === today
              return (
                <div key={dateStr} className={`border-r border-gray-50 last:border-r-0 ${isToday ? "bg-[#6C5CE7]/[0.02]" : ""}`}>
                  <div className={`p-3 border-b border-gray-100 text-center ${isToday ? "bg-[#6C5CE7]/[0.05]" : ""}`}>
                    <p className="text-[10px] text-gray-400 uppercase">{WEEKDAYS[weekDates.indexOf(date)]}</p>
                    <p className={`text-[16px] font-bold mt-0.5 ${isToday ? "text-[#6C5CE7]" : "text-gray-900"}`}>{date.getDate()}</p>
                  </div>
                  <div className="p-2 space-y-1.5 min-h-[300px]">
                    {dayPosts.map((post) => {
                      const pl = PLATFORMS.find((p) => p.key === post.platform)
                      return (
                        <button key={post.id} onClick={() => openEdit(post)}
                          className="w-full text-left rounded-lg border p-2.5 hover:shadow-sm transition-shadow"
                          style={{ borderColor: `${post.color}30`, backgroundColor: `${post.color}06` }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            {pl && <pl.icon className="h-3 w-3" style={{ color: post.color }} />}
                            <span className="text-[10px] font-medium" style={{ color: post.color }}>{post.time}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-gray-800 leading-tight">{post.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{post.content}</p>
                        </button>
                      )
                    })}
                    <button onClick={() => openCreate(dateStr)} className="w-full rounded-lg border border-dashed border-gray-200 p-2 text-[10px] text-gray-400 hover:text-[#6C5CE7] hover:border-[#6C5CE7]/30 transition-colors flex items-center justify-center gap-1">
                      <Plus className="h-3 w-3" />Hinzufügen
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Modal: Beitrag erstellen/bearbeiten ─────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white border border-gray-200 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-gray-900">{editingPost ? "Beitrag bearbeiten" : "Beitrag planen"}</h2>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-1 hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                {/* Platform */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Plattform</label>
                  <div className="flex gap-2 mt-2">
                    {PLATFORMS.map((p) => (
                      <button key={p.key} onClick={() => setFormPlatform(p.key)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${formPlatform === p.key ? "text-white" : "bg-gray-50 text-gray-600 border border-gray-200"}`}
                        style={formPlatform === p.key ? { backgroundColor: p.color } : {}}>
                        <p.icon className="h-3.5 w-3.5" />{p.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Datum</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] mt-1.5 focus:border-[#6C5CE7] focus:outline-none" /></div>
                  <div><label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Uhrzeit</label>
                    <input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] mt-1.5 focus:border-[#6C5CE7] focus:outline-none" /></div>
                </div>
                {/* Title */}
                <div><label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Titel</label>
                  <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="z.B. Produkt-Reel" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] mt-1.5 focus:border-[#6C5CE7] focus:outline-none" /></div>
                {/* Content */}
                <div><label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Beschreibung</label>
                  <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={3} placeholder="Was soll der Beitrag beinhalten?" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] mt-1.5 focus:border-[#6C5CE7] focus:outline-none resize-none" /></div>
                {/* Status */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</label>
                  <div className="flex gap-2 mt-2">
                    {(["entwurf", "geplant", "veroeffentlicht"] as Post["status"][]).map((s) => {
                      const st = STATUS_STYLE[s]
                      return (
                        <button key={s} onClick={() => setFormStatus(s)}
                          className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${formStatus === s ? `${st.bg} ${st.text}` : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                          {st.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {editingPost && (
                    <button onClick={() => { handleDelete(editingPost.id); setShowModal(false) }} className="rounded-xl border border-red-200 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">Abbrechen</button>
                  <button onClick={handleSave} disabled={!formTitle || !formDate} className="flex-1 rounded-xl bg-[#6C5CE7] py-2.5 text-[13px] font-semibold text-white hover:bg-[#5A4BD1] disabled:opacity-50 transition-colors">
                    {editingPost ? "Speichern" : "Planen"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
