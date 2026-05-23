"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AkquiseNav } from "@/components/akquise/akquise-nav"
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  Trophy,
  Plus,
  Trash2,
  Check,
  X,
  Star,
  Globe,
  Edit,
  ThumbsUp,
  ThumbsDown,
  Save,
} from "lucide-react"

const INDUSTRIES = [
  "Alle Branchen",
  "Haustechnik",
  "Sanitär & Heizung",
  "Lüftungstechnik",
  "Gebäudetechnik",
  "Gastronomie",
  "Fitness",
  "Mode & Retail",
  "Immobilien",
  "Gesundheit",
  "IT & Software",
  "Handwerk",
  "Bildung",
  "Tourismus",
  "Beauty & Wellness",
  "Finanzen",
]

const OUTREACH_METHODS = ["E-Mail", "Telefon", "LinkedIn", "Persönlich"]

const DEMO_RULES = [
  {
    id: "demo-1",
    title: "Notfall-Nummer für Sanitär",
    text: "Sanitär-Betriebe brauchen immer eine Notfall-Nummer auf der Website.",
    industry: "Sanitär & Heizung",
    priority: 9,
    active: true,
  },
  {
    id: "demo-2",
    title: "Öffnungszeiten sichtbar",
    text: "Öffnungszeiten müssen auf der Startseite oder im Header sichtbar sein.",
    industry: "Alle Branchen",
    priority: 7,
    active: true,
  },
  {
    id: "demo-3",
    title: "Referenzen für Handwerk",
    text: "Handwerksbetriebe sollten immer eine Referenz-/Projektseite mit Bildern haben.",
    industry: "Handwerk",
    priority: 8,
    active: true,
  },
]

interface Reference {
  id: string
  name: string
  url: string
  industry: string
  score: number
  description: string
}

interface Rule {
  id: string
  title: string
  text: string
  industry: string
  priority: number
  active: boolean
}

interface FeedbackItem {
  id: string
  rating: number
  comment: string
  recommendationText: string
  createdAt: string
}

interface Conversion {
  id: string
  leadName: string
  factors: string
  method: string
  daysToConvert: number
  monthlyValue: number
  createdAt: string
}

type TabId = "references" | "rules" | "feedback" | "conversions"

export default function KITrainingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("references")
  const [references, setReferences] = useState<Reference[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)

  const [refForm, setRefForm] = useState({ name: "", url: "", industry: "Alle Branchen", description: "", score: 80 })
  const [ruleForm, setRuleForm] = useState({ title: "", text: "", industry: "", priority: 5 })
  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [editRuleForm, setEditRuleForm] = useState({ title: "", text: "", industry: "", priority: 5 })
  const [convForm, setConvForm] = useState({ leadName: "", factors: "", method: "E-Mail", days: 30, monthlyValue: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/akquise/ai-learning")
      .then((res) => res.json())
      .then((data) => {
        if (data.references) setReferences(data.references)
        if (data.rules) setRules(data.rules)
        else setRules(DEMO_RULES)
        if (data.feedback) setFeedback(data.feedback)
        if (data.conversions) setConversions(data.conversions)
      })
      .catch(() => {
        setRules(DEMO_RULES)
      })
      .finally(() => setLoading(false))
  }, [])

  const apiCall = async (action: string, payload: object) => {
    setSaving(true)
    try {
      const res = await fetch("/api/akquise/ai-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      })
      return await res.json()
    } catch {
      return null
    } finally {
      setSaving(false)
    }
  }

  const addReference = async () => {
    if (!refForm.name.trim() || !refForm.url.trim()) return
    const newRef: Reference = {
      id: crypto.randomUUID(),
      ...refForm,
    }
    setReferences((prev) => [...prev, newRef])
    await apiCall("addReference", newRef)
    setRefForm({ name: "", url: "", industry: "Alle Branchen", description: "", score: 80 })
  }

  const deleteReference = async (id: string) => {
    setReferences((prev) => prev.filter((r) => r.id !== id))
    await apiCall("deleteReference", { id })
  }

  const addRule = async () => {
    if (!ruleForm.title.trim() || !ruleForm.text.trim()) return
    const newRule: Rule = {
      id: crypto.randomUUID(),
      title: ruleForm.title,
      text: ruleForm.text,
      industry: ruleForm.industry || "Alle Branchen",
      priority: ruleForm.priority,
      active: true,
    }
    setRules((prev) => [...prev, newRule])
    await apiCall("addRule", newRule)
    setRuleForm({ title: "", text: "", industry: "", priority: 5 })
  }

  const toggleRule = async (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
    const rule = rules.find((r) => r.id === id)
    if (rule) await apiCall("toggleRule", { id, active: !rule.active })
  }

  const deleteRule = async (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
    await apiCall("deleteRule", { id })
  }

  const startEditRule = (rule: Rule) => {
    setEditingRule(rule.id)
    setEditRuleForm({ title: rule.title, text: rule.text, industry: rule.industry, priority: rule.priority })
  }

  const saveEditRule = async (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, title: editRuleForm.title, text: editRuleForm.text, industry: editRuleForm.industry || "Alle Branchen", priority: editRuleForm.priority }
          : r
      )
    )
    await apiCall("updateRule", { id, ...editRuleForm })
    setEditingRule(null)
  }

  const addConversion = async () => {
    if (!convForm.leadName.trim() || !convForm.factors.trim()) return
    const newConv: Conversion = {
      id: crypto.randomUUID(),
      leadName: convForm.leadName,
      factors: convForm.factors,
      method: convForm.method,
      daysToConvert: convForm.days,
      monthlyValue: convForm.monthlyValue,
      createdAt: new Date().toISOString(),
    }
    setConversions((prev) => [...prev, newConv])
    await apiCall("addConversion", newConv)
    setConvForm({ leadName: "", factors: "", method: "E-Mail", days: 30, monthlyValue: 0 })
  }

  const positiveFeedback = feedback.filter((f) => f.rating > 0).length
  const negativeFeedback = feedback.filter((f) => f.rating < 0).length

  const tabs: { id: TabId; label: string; icon: typeof Sparkles }[] = [
    { id: "references", label: "Referenz-Websites", icon: Globe },
    { id: "rules", label: "Regeln & Anweisungen", icon: BookOpen },
    { id: "feedback", label: "Feedback-Übersicht", icon: MessageSquare },
    { id: "conversions", label: "Erfolge & Konversionen", icon: Trophy },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <AkquiseNav />

      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#6C5CE7]" />
          KI-Training
        </h1>
        <p className="text-sm text-gray-500 mt-1">Trainiere die KI mit Beispielen, Regeln und Feedback</p>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#6C5CE7] text-[#6C5CE7]"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded shadow-sm border border-gray-100 p-12 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#6C5CE7] border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Daten werden geladen...</p>
        </div>
      ) : (
        <>
          {activeTab === "references" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-100 rounded p-4 flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Diese Websites werden der KI als Beispiele für gute Online-Auftritte gezeigt. Die KI lernt daraus, was ein Top-Auftritt in dieser Branche aussieht.
                </p>
              </div>

              <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00CEC9]" />
                  Referenz hinzufügen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Name</label>
                    <input
                      type="text"
                      value={refForm.name}
                      onChange={(e) => setRefForm({ ...refForm, name: e.target.value })}
                      placeholder="z.B. Muster Sanitär AG"
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">URL</label>
                    <input
                      type="url"
                      value={refForm.url}
                      onChange={(e) => setRefForm({ ...refForm, url: e.target.value })}
                      placeholder="https://beispiel.ch"
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Branche</label>
                    <select
                      value={refForm.industry}
                      onChange={(e) => setRefForm({ ...refForm, industry: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Score (1-100)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={refForm.score}
                      onChange={(e) => setRefForm({ ...refForm, score: Math.min(100, Math.max(1, parseInt(e.target.value) || 1)) })}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Beschreibung</label>
                    <textarea
                      value={refForm.description}
                      onChange={(e) => setRefForm({ ...refForm, description: e.target.value })}
                      placeholder="Was macht diese Website besonders gut?"
                      rows={2}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={addReference}
                  disabled={saving || !refForm.name.trim() || !refForm.url.trim()}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded font-medium text-sm bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Referenz hinzufügen
                </button>
              </div>

              {references.length > 0 && (
                <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Gespeicherte Referenzen</h2>
                  <div className="space-y-3">
                    {references.map((ref) => (
                      <div key={ref.id} className="flex items-start justify-between p-4 rounded bg-gray-50 border border-gray-100">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-medium text-sm text-[#0F172A]">{ref.name}</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-medium">
                              <Star className="w-3 h-3" />
                              {ref.score}/100
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#00CEC9]/10 text-[#00877D] text-xs font-medium">
                              {ref.industry}
                            </span>
                          </div>
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#6C5CE7] hover:underline">
                            {ref.url}
                          </a>
                          {ref.description && <p className="text-xs text-gray-500 mt-1">{ref.description}</p>}
                        </div>
                        <button
                          onClick={() => deleteReference(ref.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {references.length === 0 && (
                <div className="bg-white rounded shadow-sm border border-gray-100 p-8 text-center">
                  <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Noch keine Referenz-Websites gespeichert.</p>
                  <p className="text-xs text-gray-400 mt-1">Füge oben deine erste Referenz hinzu.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "rules" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-100 rounded p-4 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Diese Regeln werden bei JEDER Analyse berücksichtigt. Beispiel: &quot;Sanitär-Betriebe brauchen immer eine Notfall-Nummer&quot;
                </p>
              </div>

              <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00CEC9]" />
                  Regel hinzufügen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Titel</label>
                    <input
                      type="text"
                      value={ruleForm.title}
                      onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                      placeholder="z.B. Notfall-Nummer Pflicht"
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-[#0F172A] block mb-1">Branche (optional)</label>
                      <select
                        value={ruleForm.industry}
                        onChange={(e) => setRuleForm({ ...ruleForm, industry: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                      >
                        <option value="">Keine Einschränkung</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="text-sm font-medium text-[#0F172A] block mb-1">Priorität</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={ruleForm.priority}
                        onChange={(e) => setRuleForm({ ...ruleForm, priority: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
                        className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Regel-Text</label>
                    <textarea
                      value={ruleForm.text}
                      onChange={(e) => setRuleForm({ ...ruleForm, text: e.target.value })}
                      placeholder="Beschreibe die Regel so, wie die KI sie verstehen soll..."
                      rows={3}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={addRule}
                  disabled={saving || !ruleForm.title.trim() || !ruleForm.text.trim()}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded font-medium text-sm bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Regel hinzufügen
                </button>
              </div>

              <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Aktive Regeln</h2>
                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div key={rule.id} className={`p-4 rounded border transition ${rule.active ? "bg-gray-50 border-gray-100" : "bg-gray-50/50 border-gray-100 opacity-60"}`}>
                      {editingRule === rule.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editRuleForm.title}
                              onChange={(e) => setEditRuleForm({ ...editRuleForm, title: e.target.value })}
                              className="px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                            />
                            <div className="flex gap-3">
                              <select
                                value={editRuleForm.industry}
                                onChange={(e) => setEditRuleForm({ ...editRuleForm, industry: e.target.value })}
                                className="flex-1 px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                              >
                                <option value="">Keine Einschränkung</option>
                                {INDUSTRIES.map((ind) => (
                                  <option key={ind} value={ind}>{ind}</option>
                                ))}
                              </select>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={editRuleForm.priority}
                                onChange={(e) => setEditRuleForm({ ...editRuleForm, priority: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
                                className="w-20 px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                              />
                            </div>
                          </div>
                          <textarea
                            value={editRuleForm.text}
                            onChange={(e) => setEditRuleForm({ ...editRuleForm, text: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveEditRule(rule.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#6C5CE7] text-white text-sm font-medium hover:bg-[#5B4BD6] transition"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Speichern
                            </button>
                            <button
                              onClick={() => setEditingRule(null)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium text-sm text-[#0F172A]">{rule.title}</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-medium">
                                Priorität {rule.priority}
                              </span>
                              {rule.industry && rule.industry !== "Alle Branchen" && (
                                <span className="px-2 py-0.5 rounded-full bg-[#00CEC9]/10 text-[#00877D] text-xs font-medium">
                                  {rule.industry}
                                </span>
                              )}
                              {rule.industry === "Alle Branchen" && (
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                  Alle Branchen
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{rule.text}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-4 shrink-0">
                            <button
                              onClick={() => toggleRule(rule.id)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                rule.active ? "bg-[#00CEC9]" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                  rule.active ? "translate-x-4" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => startEditRule(rule)}
                              className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRule(rule.id)}
                              className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {rules.length === 0 && (
                    <div className="p-8 text-center">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Noch keine Regeln definiert.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "feedback" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-100 rounded p-4 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Feedback das du auf Lead-Analysen gibst, wird hier gesammelt. Die KI lernt daraus was gute vs. schlechte Empfehlungen sind.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-emerald-50">
                    <ThumbsUp className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{positiveFeedback}</p>
                    <p className="text-sm text-gray-500">Positive Bewertungen</p>
                  </div>
                </div>
                <div className="bg-white rounded shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-red-50">
                    <ThumbsDown className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{negativeFeedback}</p>
                    <p className="text-sm text-gray-500">Negative Bewertungen</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Letztes Feedback</h2>
                {feedback.length > 0 ? (
                  <div className="space-y-3">
                    {feedback.map((item) => (
                      <div key={item.id} className="p-4 rounded bg-gray-50 border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full shrink-0 mt-0.5 ${item.rating > 0 ? "bg-emerald-100" : "bg-red-100"}`}>
                            {item.rating > 0 ? (
                              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <ThumbsDown className="w-3.5 h-3.5 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 bg-white rounded p-2 border border-gray-100 mb-2">
                              {item.recommendationText}
                            </p>
                            {item.comment && (
                              <p className="text-sm text-gray-600 italic">&quot;{item.comment}&quot;</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(item.createdAt).toLocaleDateString("de-CH")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Noch kein Feedback vorhanden.</p>
                    <p className="text-xs text-gray-400 mt-1">Bewerte Empfehlungen in der Lead-Analyse, um der KI Feedback zu geben.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "conversions" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-100 rounded p-4 flex items-start gap-3">
                <Trophy className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Wenn ein Lead zum Kunden wird, erfasse hier was funktioniert hat. Die KI nutzt diese Muster für zukünftige Empfehlungen.
                </p>
              </div>

              <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00CEC9]" />
                  Konversion erfassen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Lead auswählen</label>
                    <input
                      type="text"
                      value={convForm.leadName}
                      onChange={(e) => setConvForm({ ...convForm, leadName: e.target.value })}
                      placeholder="Name des konvertierten Leads"
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Outreach-Methode</label>
                    <select
                      value={convForm.method}
                      onChange={(e) => setConvForm({ ...convForm, method: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    >
                      {OUTREACH_METHODS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Zeit bis Konversion (Tage)</label>
                    <input
                      type="number"
                      min={1}
                      value={convForm.days}
                      onChange={(e) => setConvForm({ ...convForm, days: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Monatswert (CHF)</label>
                    <input
                      type="number"
                      min={0}
                      value={convForm.monthlyValue}
                      onChange={(e) => setConvForm({ ...convForm, monthlyValue: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[#0F172A] block mb-1">Erfolgsfaktoren</label>
                    <textarea
                      value={convForm.factors}
                      onChange={(e) => setConvForm({ ...convForm, factors: e.target.value })}
                      placeholder="Was hat bei diesem Lead funktioniert? Welche Argumente haben überzeugt?"
                      rows={3}
                      className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={addConversion}
                  disabled={saving || !convForm.leadName.trim() || !convForm.factors.trim()}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded font-medium text-sm bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Konversion erfassen
                </button>
              </div>

              {conversions.length > 0 ? (
                <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Erfasste Konversionen</h2>
                  <div className="space-y-3">
                    {conversions.map((conv) => (
                      <div key={conv.id} className="p-4 rounded bg-gray-50 border border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm text-[#0F172A]">{conv.leadName}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#00CEC9]/10 text-[#00877D] text-xs font-medium">
                              {conv.method}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-medium">
                              {conv.daysToConvert} Tage
                            </span>
                            {conv.monthlyValue > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                CHF {conv.monthlyValue.toLocaleString("de-CH")}/Mt.
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(conv.createdAt).toLocaleDateString("de-CH")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{conv.factors}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded shadow-sm border border-gray-100 p-8 text-center">
                  <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Noch keine Konversionen erfasst.</p>
                  <p className="text-xs text-gray-400 mt-1">Erfasse oben deine erste erfolgreiche Konversion.</p>
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}
