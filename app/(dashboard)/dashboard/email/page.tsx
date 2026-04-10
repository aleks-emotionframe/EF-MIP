"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail, Send, Plus, Users, Eye, MousePointer, AlertTriangle,
  Pencil, Trash2, Copy, Clock, CheckCircle2, X, ChevronDown,
  BarChart3, ArrowUpRight, UserPlus, Tag, FileText, Loader2,
  Bold, Italic, Link2, Image as ImageIcon, List, AlignLeft,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
type MainTab = "kampagnen" | "empfaenger" | "neu"
type CampaignStatus = "draft" | "scheduled" | "sent"

interface Campaign {
  id: string
  name: string
  subject: string
  status: CampaignStatus
  listName: string
  sentAt: string | null
  scheduledAt: string | null
  totalSent: number
  totalOpened: number
  totalClicked: number
  openRate: number
  clickRate: number
}

interface EmailListData {
  id: string
  name: string
  subscriberCount: number
  activeCount: number
  createdAt: string
}

// ─── Demo Data ──────────────────────────────────────────────────
const DEMO_CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "April Newsletter", subject: "Neues Feature: KI-Insights jetzt verfügbar", status: "sent", listName: "Alle Kunden", sentAt: "07.04.2026", scheduledAt: null, totalSent: 1240, totalOpened: 558, totalClicked: 186, openRate: 45.0, clickRate: 15.0 },
  { id: "c2", name: "Produkt-Update", subject: "EmotionFrame 2.0 – Was ist neu?", status: "sent", listName: "Premium Kunden", sentAt: "01.04.2026", scheduledAt: null, totalSent: 480, totalOpened: 264, totalClicked: 120, openRate: 55.0, clickRate: 25.0 },
  { id: "c3", name: "Webinar-Einladung", subject: "Live-Webinar: Social Media Trends 2026", status: "scheduled", listName: "Alle Kunden", sentAt: null, scheduledAt: "15.04.2026, 10:00", totalSent: 0, totalOpened: 0, totalClicked: 0, openRate: 0, clickRate: 0 },
  { id: "c4", name: "Willkommens-Serie #1", subject: "Willkommen bei EmotionFrame!", status: "sent", listName: "Neue Kunden", sentAt: "28.03.2026", scheduledAt: null, totalSent: 320, totalOpened: 224, totalClicked: 96, openRate: 70.0, clickRate: 30.0 },
  { id: "c5", name: "Feature-Teaser", subject: "Bald verfügbar: Szenario-Simulator", status: "draft", listName: "Beta-Tester", sentAt: null, scheduledAt: null, totalSent: 0, totalOpened: 0, totalClicked: 0, openRate: 0, clickRate: 0 },
]

const DEMO_LISTS: EmailListData[] = [
  { id: "l1", name: "Alle Kunden", subscriberCount: 1240, activeCount: 1185, createdAt: "01.01.2026" },
  { id: "l2", name: "Premium Kunden", subscriberCount: 480, activeCount: 472, createdAt: "15.01.2026" },
  { id: "l3", name: "Neue Kunden", subscriberCount: 320, activeCount: 318, createdAt: "01.02.2026" },
  { id: "l4", name: "Beta-Tester", subscriberCount: 85, activeCount: 82, createdAt: "10.03.2026" },
  { id: "l5", name: "Newsletter", subscriberCount: 2100, activeCount: 1940, createdAt: "01.06.2025" },
]

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: "Entwurf", color: "text-gray-600", bg: "bg-gray-100", icon: Pencil },
  scheduled: { label: "Geplant", color: "text-blue-600", bg: "bg-blue-100", icon: Clock },
  sent: { label: "Versendet", color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle2 },
}

// ─── Page ───────────────────────────────────────────────────────
export default function EmailPage() {
  const [mainTab, setMainTab] = useState<MainTab>("kampagnen")
  const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS)
  const [lists] = useState(DEMO_LISTS)
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

  // New campaign editor state
  const [newName, setNewName] = useState("")
  const [newSubject, setNewSubject] = useState("")
  const [newPreview, setNewPreview] = useState("")
  const [newList, setNewList] = useState("")
  const [newContent, setNewContent] = useState("")
  const [sending, setSending] = useState(false)
  const [saved, setSaved] = useState(false)

  const totalSubscribers = lists.reduce((a, l) => a + l.activeCount, 0)
  const totalSent = campaigns.filter((c) => c.status === "sent").reduce((a, c) => a + c.totalSent, 0)
  const avgOpenRate = campaigns.filter((c) => c.status === "sent").length > 0
    ? campaigns.filter((c) => c.status === "sent").reduce((a, c) => a + c.openRate, 0) / campaigns.filter((c) => c.status === "sent").length
    : 0

  function handleSaveDraft() {
    if (!newName || !newSubject) return
    setSending(true)
    setTimeout(() => {
      setCampaigns((prev) => [{
        id: `c-${Date.now()}`, name: newName, subject: newSubject, status: "draft" as CampaignStatus,
        listName: lists.find((l) => l.id === newList)?.name ?? "Nicht zugewiesen",
        sentAt: null, scheduledAt: null, totalSent: 0, totalOpened: 0, totalClicked: 0, openRate: 0, clickRate: 0,
      }, ...prev])
      setSending(false)
      setSaved(true)
      setTimeout(() => { setSaved(false); setMainTab("kampagnen"); setNewName(""); setNewSubject(""); setNewPreview(""); setNewContent(""); setNewList("") }, 1500)
    }, 800)
  }

  function handleDelete(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  function handleDuplicate(campaign: Campaign) {
    setCampaigns((prev) => [{
      ...campaign, id: `c-${Date.now()}`, name: `${campaign.name} (Kopie)`, status: "draft" as CampaignStatus,
      sentAt: null, totalSent: 0, totalOpened: 0, totalClicked: 0, openRate: 0, clickRate: 0,
    }, ...prev])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#6C5CE7]" />
            <h1 className="text-2xl font-bold text-[#1B2559] dark:text-white">E-Mail-Marketing</h1>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">Newsletter erstellen, versenden und analysieren.</p>
        </div>
        <button onClick={() => setMainTab("neu")} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] px-4 py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#6C5CE7]/30 transition-all">
          <Plus className="h-3.5 w-3.5" />Neue Kampagne
        </button>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/[0.06] flex items-center justify-center"><Users className="h-4 w-4 text-[#6C5CE7]" /></div>
          </div>
          <p className="text-[24px] font-extrabold text-[#1B2559] dark:text-white">{totalSubscribers.toLocaleString("de-CH")}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Aktive Empfänger</p>
        </div>
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Send className="h-4 w-4 text-emerald-600" /></div>
          </div>
          <p className="text-[24px] font-extrabold text-[#1B2559] dark:text-white">{totalSent.toLocaleString("de-CH")}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">E-Mails versendet</p>
        </div>
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Eye className="h-4 w-4 text-blue-600" /></div>
          </div>
          <p className="text-[24px] font-extrabold text-[#1B2559] dark:text-white">{avgOpenRate.toFixed(1)}%</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Ø Öffnungsrate</p>
        </div>
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><MousePointer className="h-4 w-4 text-amber-600" /></div>
          </div>
          <p className="text-[24px] font-extrabold text-[#1B2559] dark:text-white">{campaigns.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Kampagnen</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
        {([
          { key: "kampagnen" as MainTab, label: "Kampagnen" },
          { key: "empfaenger" as MainTab, label: "Empfänger-Listen" },
          { key: "neu" as MainTab, label: "Neue Kampagne" },
        ]).map((tab) => (
          <button key={tab.key} onClick={() => setMainTab(tab.key)}
            className={`relative rounded-lg px-5 py-2 text-[13px] font-medium transition-all ${mainTab === tab.key ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {mainTab === tab.key && <motion.div layoutId="email-tab" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB: Kampagnen ──────────────────────────────────── */}
      {mainTab === "kampagnen" && (
        <div className="space-y-2">
          {campaigns.map((c) => {
            const sc = STATUS_CONFIG[c.status]
            const isExp = expandedCampaign === c.id
            return (
              <div key={c.id} className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <button onClick={() => setExpandedCampaign(isExp ? null : c.id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}>
                    <sc.icon className={`h-4 w-4 ${sc.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-[#1B2559] dark:text-white truncate">{c.name}</p>
                      <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5 truncate">{c.subject}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-[12px] text-gray-500 shrink-0">
                    {c.status === "sent" && (
                      <>
                        <div className="text-right"><p className="font-bold text-[#1B2559] dark:text-white">{c.totalSent.toLocaleString("de-CH")}</p><p className="text-[10px] text-gray-400">Versendet</p></div>
                        <div className="text-right"><p className="font-semibold text-emerald-600">{c.openRate}%</p><p className="text-[10px] text-gray-400">Geöffnet</p></div>
                        <div className="text-right"><p className="font-semibold text-blue-600">{c.clickRate}%</p><p className="text-[10px] text-gray-400">Geklickt</p></div>
                      </>
                    )}
                    {c.status === "scheduled" && <p className="text-[12px] text-blue-600">Geplant: {c.scheduledAt}</p>}
                    {c.status === "draft" && <p className="text-[12px] text-gray-400">Entwurf</p>}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isExp ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isExp && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3">
                        {/* Stats bars for sent campaigns */}
                        {c.status === "sent" && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-[10px] text-gray-400">Versendet</p>
                              <p className="text-[16px] font-bold text-gray-900">{c.totalSent.toLocaleString("de-CH")}</p>
                            </div>
                            <div className="rounded-lg bg-emerald-50 p-3">
                              <p className="text-[10px] text-gray-400">Geöffnet</p>
                              <p className="text-[16px] font-bold text-emerald-700">{c.totalOpened.toLocaleString("de-CH")} <span className="text-[12px] font-normal">({c.openRate}%)</span></p>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3">
                              <p className="text-[10px] text-gray-400">Geklickt</p>
                              <p className="text-[16px] font-bold text-blue-700">{c.totalClicked.toLocaleString("de-CH")} <span className="text-[12px] font-normal">({c.clickRate}%)</span></p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-[10px] text-gray-400">Empfänger-Liste</p>
                              <p className="text-[14px] font-bold text-[#1B2559] dark:text-white">{c.listName}</p>
                            </div>
                          </div>
                        )}
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleDuplicate(c) }} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
                            <Copy className="h-3.5 w-3.5" />Duplizieren
                          </button>
                          {c.status === "draft" && (
                            <button className="flex items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#5A4BD1] transition-colors">
                              <Send className="h-3.5 w-3.5" />Jetzt senden
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id) }} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[12px] text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors ml-auto">
                            <Trash2 className="h-3.5 w-3.5" />Löschen
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── TAB: Empfänger-Listen ───────────────────────────── */}
      {mainTab === "empfaenger" && (
        <div className="space-y-3">
          {lists.map((list) => (
            <div key={list.id} className="rounded-2xl bg-white shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/[0.06] flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-[#6C5CE7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-bold text-[#1B2559] dark:text-white">{list.name}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">Erstellt: {list.createdAt}</p>
              </div>
              <div className="hidden sm:flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-[14px] font-bold text-gray-900">{list.subscriberCount.toLocaleString("de-CH")}</p>
                  <p className="text-[10px] text-gray-400">Empfänger</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-emerald-600">{list.activeCount.toLocaleString("de-CH")}</p>
                  <p className="text-[10px] text-gray-400">Aktiv</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-gray-900">{((list.activeCount / list.subscriberCount) * 100).toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-400">Aktiv-Rate</p>
                </div>
              </div>
            </div>
          ))}

          <button className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 py-4 text-[12px] font-medium text-gray-400 hover:text-[#6C5CE7] hover:border-[#6C5CE7]/30 transition-colors">
            <Plus className="h-3.5 w-3.5" />Neue Liste erstellen
          </button>
        </div>
      )}

      {/* ─── TAB: Neue Kampagne ──────────────────────────────── */}
      {mainTab === "neu" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Editor */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl bg-white shadow-sm p-6 space-y-4">
              <h2 className="text-[16px] font-bold text-[#1B2559] dark:text-white">Kampagne erstellen</h2>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Kampagnen-Name</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="z.B. April Newsletter"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Betreffzeile</label>
                <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="z.B. Entdecke unsere neuen Features"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none" />
                <p className="text-[11px] text-gray-400">{newSubject.length}/60 Zeichen (ideal: 30-60)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vorschau-Text</label>
                <input value={newPreview} onChange={(e) => setNewPreview(e.target.value)} placeholder="Kurzer Text der nach dem Betreff angezeigt wird"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Empfänger-Liste</label>
                <select value={newList} onChange={(e) => setNewList(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none appearance-none">
                  <option value="">Liste wählen...</option>
                  {lists.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.activeCount} Empfänger)</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Inhalt</label>
                {/* Simple toolbar */}
                <div className="flex items-center gap-1 border border-gray-200 border-b-0 rounded-t-xl px-2 py-1.5 bg-gray-50">
                  {[Bold, Italic, Link2, ImageIcon, List, AlignLeft].map((Icon, i) => (
                    <button key={i} className="rounded p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Schreibe deinen Newsletter-Inhalt...&#10;&#10;Hallo {{vorname}},&#10;&#10;wir haben spannende Neuigkeiten für dich..."
                  rows={12}
                  className="w-full rounded-b-xl border border-gray-200 bg-white px-4 py-3 text-[13px] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 focus:outline-none resize-none" />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSaveDraft} disabled={sending || !newName || !newSubject}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <FileText className="h-4 w-4" />}
                  {saved ? "Gespeichert!" : "Als Entwurf speichern"}
                </button>
                <button disabled={!newName || !newSubject || !newList}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] py-3 text-[13px] font-semibold text-white hover:shadow-lg hover:shadow-[#6C5CE7]/30 disabled:opacity-50 transition-all">
                  <Send className="h-4 w-4" />Jetzt versenden
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden sticky top-20">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vorschau</p>
              </div>
              <div className="p-5">
                {/* Email preview */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-white p-4 border-b border-gray-100">
                    <p className="text-[10px] text-gray-400">Von: EmotionFrame &lt;newsletter@emotionframe.com&gt;</p>
                    <p className="text-[10px] text-gray-400">An: empfaenger@beispiel.ch</p>
                    <p className="text-[14px] font-semibold text-[#1B2559] dark:text-white mt-1">{newSubject || "Betreffzeile..."}</p>
                    {newPreview && <p className="text-[11px] text-gray-400 mt-0.5">{newPreview}</p>}
                  </div>
                  <div className="bg-gradient-to-b from-[#6C5CE7] to-[#a29bfe] px-6 py-5 text-center">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto">
                      <span className="text-white font-bold text-sm">EF</span>
                    </div>
                    <h3 className="text-white font-bold text-[16px] mt-2">{newName || "Kampagnen-Name"}</h3>
                  </div>
                  <div className="px-6 py-5 bg-white">
                    <div className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-line min-h-[120px]">
                      {newContent || "Dein Newsletter-Inhalt wird hier angezeigt...\n\nHallo {{vorname}},\n\nDein Inhalt kommt hier hin."}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">EmotionFrame · Musterstrasse 1 · 8000 Zürich</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Abmelden | Im Browser anzeigen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
