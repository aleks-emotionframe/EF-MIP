"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AkquiseNav } from "@/components/akquise/akquise-nav"
import {
  ArrowLeft,
  Settings,
  Clock,
  MapPin,
  Building2,
  Plus,
  X,
  Save,
  Check,
  AlertCircle,
  Key,
  Sparkles,
} from "lucide-react"

const DEFAULT_BRANCHES = [
  "Gastronomie",
  "Fitness & Sport",
  "Mode & Retail",
  "Immobilien",
  "Gesundheit & Medizin",
  "Handwerk",
  "Bildung",
  "IT & Software",
  "Tourismus & Hotellerie",
  "Schönheit & Wellness",
]

const DEFAULT_REGIONS = [
  "Zürich",
  "Bern",
  "Basel",
  "Luzern",
  "St. Gallen",
  "Winterthur",
  "Biel",
  "Thun",
  "Aarau",
  "Zug",
]

const TIME_OPTIONS = ["01:00", "02:00", "03:00", "04:00"]

interface AkquiseConfig {
  nightSearchActive: boolean
  searchTime: string
  maxResults: number
  branches: string[]
  regions: string[]
  googlePlacesConfigured: boolean
  anthropicConfigured: boolean
}

export default function AkquiseEinstellungenPage() {
  const [config, setConfig] = useState<AkquiseConfig>({
    nightSearchActive: true,
    searchTime: "02:00",
    maxResults: 20,
    branches: [...DEFAULT_BRANCHES],
    regions: [...DEFAULT_REGIONS],
    googlePlacesConfigured: true,
    anthropicConfigured: true,
  })
  const [newBranch, setNewBranch] = useState("")
  const [newRegion, setNewRegion] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/akquise/config")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.branches) {
          setConfig(data)
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/akquise/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const addBranch = () => {
    const trimmed = newBranch.trim()
    if (trimmed && !config.branches.includes(trimmed)) {
      setConfig({ ...config, branches: [...config.branches, trimmed] })
      setNewBranch("")
    }
  }

  const removeBranch = (branch: string) => {
    setConfig({ ...config, branches: config.branches.filter((b) => b !== branch) })
  }

  const addRegion = () => {
    const trimmed = newRegion.trim()
    if (trimmed && !config.regions.includes(trimmed)) {
      setConfig({ ...config, regions: [...config.regions, trimmed] })
      setNewRegion("")
    }
  }

  const removeRegion = (region: string) => {
    setConfig({ ...config, regions: config.regions.filter((r) => r !== region) })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <AkquiseNav />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/akquise"
            className="p-2 rounded bg-white border border-gray-100 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#6C5CE7]" />
              Akquise-Einstellungen
            </h1>
            <p className="text-sm text-gray-500 mt-1">Konfiguration der automatischen Lead-Suche</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded font-medium text-sm transition ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white hover:opacity-90"
          } disabled:opacity-50`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Gespeichert
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Speichert..." : "Speichern"}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Sucheinstellungen</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Automatische Nachtsuche</p>
                <p className="text-xs text-gray-500 mt-0.5">Leads werden automatisch in der Nacht gesucht</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, nightSearchActive: !config.nightSearchActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.nightSearchActive ? "bg-[#6C5CE7]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.nightSearchActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F172A] block mb-2">Suchzeit</label>
              <select
                value={config.searchTime}
                onChange={(e) => setConfig({ ...config, searchTime: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time} Uhr
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F172A] block mb-2">Max. Ergebnisse pro Suche</label>
              <input
                type="number"
                min={10}
                max={50}
                value={config.maxResults}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    maxResults: Math.min(50, Math.max(10, parseInt(e.target.value) || 10)),
                  })
                }
                className="w-full px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
              />
              <p className="text-xs text-gray-400 mt-1">Zwischen 10 und 50 Ergebnisse</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-[#00CEC9]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Branchen</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {config.branches.map((branch) => (
              <span
                key={branch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-sm font-medium"
              >
                {branch}
                <button
                  onClick={() => removeBranch(branch)}
                  className="hover:bg-[#6C5CE7]/20 rounded-full p-0.5 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBranch()}
              placeholder="Branche hinzufügen..."
              className="flex-1 px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
            />
            <button
              onClick={addBranch}
              disabled={!newBranch.trim()}
              className="inline-flex items-center gap-1 px-3 py-2 rounded bg-[#6C5CE7] text-white text-sm font-medium hover:bg-[#5B4BD6] transition disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Hinzufügen
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-[#00CEC9]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Regionen</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {config.regions.map((region) => (
              <span
                key={region}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00CEC9]/10 text-[#00877D] text-sm font-medium"
              >
                <MapPin className="w-3 h-3" />
                {region}
                <button
                  onClick={() => removeRegion(region)}
                  className="hover:bg-[#00CEC9]/20 rounded-full p-0.5 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRegion()}
              placeholder="Region hinzufügen..."
              className="flex-1 px-3 py-2 rounded border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00CEC9]/30 focus:border-[#00CEC9]"
            />
            <button
              onClick={addRegion}
              disabled={!newRegion.trim()}
              className="inline-flex items-center gap-1 px-3 py-2 rounded bg-[#00CEC9] text-white text-sm font-medium hover:bg-[#00B8B3] transition disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Hinzufügen
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">API-Konfiguration</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded bg-gray-50">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Google Places API</p>
                  <p className="text-xs text-gray-500">Für die Unternehmenssuche</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  config.googlePlacesConfigured
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {config.googlePlacesConfigured ? (
                  <>
                    <Check className="w-3 h-3" />
                    Konfiguriert
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Nicht konfiguriert
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded bg-gray-50">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Anthropic Claude API</p>
                  <p className="text-xs text-gray-500">Für die KI-Analyse</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  config.anthropicConfigured
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {config.anthropicConfigured ? (
                  <>
                    <Check className="w-3 h-3" />
                    Konfiguriert
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Nicht konfiguriert
                  </>
                )}
              </span>
            </div>
            <div className="mt-4 p-4 rounded bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">API-Schlüssel werden als Umgebungsvariablen konfiguriert</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-blue-600 font-mono">GOOGLE_PLACES_API_KEY</p>
                    <p className="text-xs text-blue-600 font-mono">ANTHROPIC_API_KEY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}