"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell, Plus, X, Check, AlertTriangle, TrendingUp, TrendingDown,
  Users, Heart, Eye, Trash2, Settings, ToggleLeft, ToggleRight,
  Clock, Sparkles, Target, Mail, ChevronDown,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
interface Notification {
  id: string
  type: "alert" | "trend" | "milestone" | "system"
  title: string
  message: string
  createdAt: string
  read: boolean
  priority: "high" | "medium" | "low"
}

interface AlertRule {
  id: string
  name: string
  metric: string
  platform: string
  condition: "above" | "below" | "change"
  threshold: number
  active: boolean
  notifyEmail: boolean
}

const TYPE_CONFIG = {
  alert: { icon: AlertTriangle, color: "#EF4444", bg: "bg-red-50", label: "Warnung" },
  trend: { icon: TrendingUp, color: "#6C5CE7", bg: "bg-[#6C5CE7]/[0.06]", label: "Trend" },
  milestone: { icon: Target, color: "#00CEC9", bg: "bg-teal-50", label: "Meilenstein" },
  system: { icon: Settings, color: "#6b7280", bg: "bg-gray-50", label: "System" },
}

const PRIORITY_DOT = { high: "bg-red-500", medium: "bg-amber-500", low: "bg-gray-400" }

// ─── Demo Data ──────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "alert", title: "Engagement-Rate unter 3%", message: "Die Facebook Engagement-Rate ist auf 2.1% gefallen – 28% unter dem Durchschnitt der letzten 30 Tage.", createdAt: "Vor 15 Min.", read: false, priority: "high" },
  { id: "n2", type: "milestone", title: "15'000 Instagram Follower erreicht!", message: "Herzlichen Glückwunsch! Ihr Instagram-Account hat die 15'000 Follower-Marke überschritten.", createdAt: "Vor 2 Std.", read: false, priority: "low" },
  { id: "n3", type: "trend", title: "TikTok-Aufrufe +45%", message: "Die Video-Aufrufe auf TikTok sind in den letzten 7 Tagen um 45% gestiegen. Der Beitrag 'Quick Tutorial' performt überdurchschnittlich.", createdAt: "Vor 4 Std.", read: false, priority: "medium" },
  { id: "n4", type: "alert", title: "Ungewöhnlicher Traffic-Spike", message: "Die Website-Sitzungen sind heute 3x höher als normal. Mögliche Ursache: Viraler LinkedIn-Beitrag.", createdAt: "Vor 6 Std.", read: true, priority: "high" },
  { id: "n5", type: "system", title: "Instagram-Sync abgeschlossen", message: "Die Daten von Instagram wurden erfolgreich synchronisiert. 142 neue Datenpunkte.", createdAt: "Vor 8 Std.", read: true, priority: "low" },
  { id: "n6", type: "trend", title: "YouTube Watch Time steigt", message: "Die durchschnittliche Wiedergabezeit ist von 2:30 auf 3:45 gestiegen (+50%). Längere Videos scheinen besser zu performen.", createdAt: "Gestern", read: true, priority: "medium" },
  { id: "n7", type: "alert", title: "Negativer Sentiment erkannt", message: "3 Kommentare mit negativem Sentiment auf dem letzten Instagram-Post. Empfehlung: Zeitnah antworten.", createdAt: "Gestern", read: true, priority: "high" },
  { id: "n8", type: "milestone", title: "100 Newsletter-Abonnenten", message: "Deine E-Mail-Liste 'Premium Kunden' hat 100 aktive Abonnenten erreicht.", createdAt: "Vor 2 Tagen", read: true, priority: "low" },
]

const INITIAL_RULES: AlertRule[] = [
  { id: "r1", name: "Engagement unter Schwelle", metric: "engagement_rate", platform: "Alle", condition: "below", threshold: 3, active: true, notifyEmail: true },
  { id: "r2", name: "Follower-Meilensteine", metric: "followers", platform: "Instagram", condition: "above", threshold: 20000, active: true, notifyEmail: false },
  { id: "r3", name: "Traffic-Anomalie", metric: "sessions", platform: "Website", condition: "change", threshold: 50, active: true, notifyEmail: true },
  { id: "r4", name: "Negative Kommentare", metric: "sentiment", platform: "Alle", condition: "below", threshold: -0.3, active: false, notifyEmail: false },
]

type Tab = "feed" | "regeln"

export default function BenachrichtigungenPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [rules, setRules] = useState(INITIAL_RULES)
  const [tab, setTab] = useState<Tab>("feed")
  const [filterType, setFilterType] = useState<string>("all")
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [expandedNotif, setExpandedNotif] = useState<string | null>(null)

  // Rule form
  const [ruleName, setRuleName] = useState("")
  const [ruleMetric, setRuleMetric] = useState("engagement_rate")
  const [rulePlatform, setRulePlatform] = useState("Alle")
  const [ruleCondition, setRuleCondition] = useState<"above" | "below" | "change">("below")
  const [ruleThreshold, setRuleThreshold] = useState(3)
  const [ruleEmail, setRuleEmail] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const filtered = filterType === "all" ? notifications : notifications.filter((n) => n.type === filterType)

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function deleteNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r))
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  function handleAddRule() {
    if (!ruleName) return
    setRules((prev) => [...prev, { id: `r-${Date.now()}`, name: ruleName, metric: ruleMetric, platform: rulePlatform, condition: ruleCondition, threshold: ruleThreshold, active: true, notifyEmail: ruleEmail }])
    setShowRuleModal(false)
    setRuleName(""); setRuleThreshold(3); setRuleEmail(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#6C5CE7]" />
            <h1 className="text-xl font-semibold text-gray-900">Benachrichtigungen</h1>
            {unreadCount > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>}
          </div>
          <p className="text-[13px] text-gray-500 mt-0.5">Alerts, Trends und Meilensteine im Blick.</p>
        </div>
        <div className="flex gap-2">
          {tab === "feed" && unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2.5 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Check className="h-3.5 w-3.5" />Alle gelesen
            </button>
          )}
          {tab === "regeln" && (
            <button onClick={() => setShowRuleModal(true)} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] px-4 py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#6C5CE7]/30 transition-all">
              <Plus className="h-3.5 w-3.5" />Neue Regel
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
        {([{ key: "feed" as Tab, label: "Benachrichtigungen" }, { key: "regeln" as Tab, label: "Alert-Regeln" }]).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`relative rounded-lg px-5 py-2 text-[13px] font-medium transition-all ${tab === t.key ? "text-gray-900" : "text-gray-500"}`}>
            {tab === t.key && <motion.div layoutId="notif-tab" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB: Feed ───────────────────────────────────────── */}
      {tab === "feed" && (
        <>
          {/* Type Filter */}
          <div className="flex gap-1.5 overflow-x-auto">
            {[{ key: "all", label: "Alle" }, { key: "alert", label: "Warnungen" }, { key: "trend", label: "Trends" }, { key: "milestone", label: "Meilensteine" }, { key: "system", label: "System" }].map((f) => (
              <button key={f.key} onClick={() => setFilterType(f.key)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${filterType === f.key ? "bg-[#6C5CE7] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((notif) => {
              const tc = TYPE_CONFIG[notif.type]
              const isExp = expandedNotif === notif.id
              return (
                <motion.div key={notif.id} layout className={`rounded-xl border bg-white overflow-hidden transition-colors ${notif.read ? "border-gray-100" : "border-[#6C5CE7]/20 bg-[#6C5CE7]/[0.01]"}`}>
                  <button onClick={() => { setExpandedNotif(isExp ? null : notif.id); if (!notif.read) markRead(notif.id) }}
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors">
                    <div className={`w-9 h-9 rounded-xl ${tc.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <tc.icon className="h-4 w-4" style={{ color: tc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!notif.read && <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[notif.priority]} shrink-0`} />}
                        <p className={`text-[13px] font-medium truncate ${notif.read ? "text-gray-700" : "text-gray-900 font-semibold"}`}>{notif.title}</p>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" />{notif.createdAt}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 mt-1 transition-transform ${isExp ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isExp && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4">
                          <div className={`rounded-lg p-3.5 ${tc.bg}`}>
                            <p className="text-[13px] text-gray-700 leading-relaxed">{notif.message}</p>
                          </div>
                          <div className="flex justify-end mt-2">
                            <button onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id) }} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="h-3 w-3" />Entfernen
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16"><Bell className="h-10 w-10 text-gray-200 mx-auto mb-3" /><p className="text-[13px] text-gray-400">Keine Benachrichtigungen</p></div>
            )}
          </div>
        </>
      )}

      {/* ─── TAB: Regeln ─────────────────────────────────────── */}
      {tab === "regeln" && (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className={`rounded-xl border bg-white p-4 flex items-center gap-4 transition-colors ${rule.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <button onClick={() => toggleRule(rule.id)} className="shrink-0">
                {rule.active
                  ? <ToggleRight className="h-6 w-6 text-[#6C5CE7]" />
                  : <ToggleLeft className="h-6 w-6 text-gray-300" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900">{rule.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {rule.metric} · {rule.platform} · {rule.condition === "above" ? "Über" : rule.condition === "below" ? "Unter" : "Änderung >"} {rule.threshold}{rule.condition === "change" ? "%" : ""}
                  {rule.notifyEmail && <span className="ml-2 inline-flex items-center gap-0.5"><Mail className="h-3 w-3" />E-Mail</span>}
                </p>
              </div>
              <button onClick={() => deleteRule(rule.id)} className="rounded-lg p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-16"><Settings className="h-10 w-10 text-gray-200 mx-auto mb-3" /><p className="text-[13px] text-gray-400">Keine Alert-Regeln konfiguriert</p></div>
          )}
        </div>
      )}

      {/* ─── Modal: Neue Regel ───────────────────────────────── */}
      <AnimatePresence>
        {showRuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRuleModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4">Neue Alert-Regel</h2>
              <div className="space-y-3">
                <input value={ruleName} onChange={(e) => setRuleName(e.target.value)} placeholder="Regelname" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] focus:border-[#6C5CE7] focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={ruleMetric} onChange={(e) => setRuleMetric(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] focus:border-[#6C5CE7] focus:outline-none">
                    <option value="engagement_rate">Engagement-Rate</option>
                    <option value="followers">Follower</option>
                    <option value="impressions">Impressionen</option>
                    <option value="sessions">Sitzungen</option>
                    <option value="sentiment">Sentiment</option>
                  </select>
                  <select value={rulePlatform} onChange={(e) => setRulePlatform(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] focus:border-[#6C5CE7] focus:outline-none">
                    <option value="Alle">Alle Plattformen</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={ruleCondition} onChange={(e) => setRuleCondition(e.target.value as any)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-[13px] focus:border-[#6C5CE7] focus:outline-none">
                    <option value="below">Fällt unter</option>
                    <option value="above">Steigt über</option>
                    <option value="change">Ändert sich um</option>
                  </select>
                  <input type="number" value={ruleThreshold} onChange={(e) => setRuleThreshold(Number(e.target.value))} className="rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] focus:border-[#6C5CE7] focus:outline-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={ruleEmail} onChange={(e) => setRuleEmail(e.target.checked)} className="rounded border-gray-300 text-[#6C5CE7] focus:ring-[#6C5CE7]" />
                  <span className="text-[13px] text-gray-600">Auch per E-Mail benachrichtigen</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowRuleModal(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50">Abbrechen</button>
                <button onClick={handleAddRule} disabled={!ruleName} className="flex-1 rounded-xl bg-[#6C5CE7] py-2.5 text-[13px] font-semibold text-white hover:bg-[#5A4BD1] disabled:opacity-50">Erstellen</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
