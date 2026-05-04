"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Key,
  Shield,
  Check,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Settings,
  ChevronDown,
  Loader2,
  Copy,
  AlertCircle,
} from "lucide-react"

type PlatformKey =
  | "GOOGLE_ANALYTICS"
  | "SEARCH_CONSOLE"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "YOUTUBE"
  | "LINKEDIN"
  | "TIKTOK"

interface CredentialGroup {
  id: string
  name: string
  platforms: PlatformKey[]
  platformLabels: string[]
  idLabel: string
  secretLabel: string
  helpText: string
  helpUrl: string
  color: string
}

interface PlatformStatus {
  configured: boolean
  updatedAt: string
}

const REDIRECT_URI = "https://ef-mip.vercel.app/api/integrations/callback"

const CREDENTIAL_GROUPS: CredentialGroup[] = [
  {
    id: "google",
    name: "Google",
    platforms: ["GOOGLE_ANALYTICS", "SEARCH_CONSOLE", "YOUTUBE"],
    platformLabels: ["Google Analytics", "Search Console", "YouTube"],
    idLabel: "Client ID",
    secretLabel: "Client Secret",
    helpText:
      "Erstelle ein Projekt in der Google Cloud Console → APIs & Services → Credentials → OAuth Client ID",
    helpUrl: "https://console.cloud.google.com/apis/credentials",
    color: "#4285F4",
  },
  {
    id: "meta",
    name: "Meta",
    platforms: ["INSTAGRAM", "FACEBOOK"],
    platformLabels: ["Instagram", "Facebook"],
    idLabel: "App ID",
    secretLabel: "App Secret",
    helpText:
      "Erstelle eine App auf developers.facebook.com → App Settings → Basic",
    helpUrl: "https://developers.facebook.com/apps/",
    color: "#1877F2",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    platforms: ["LINKEDIN"],
    platformLabels: ["LinkedIn"],
    idLabel: "Client ID",
    secretLabel: "Client Secret",
    helpText:
      "Erstelle eine App auf linkedin.com/developers → Auth",
    helpUrl: "https://www.linkedin.com/developers/apps",
    color: "#0A66C2",
  },
  {
    id: "tiktok",
    name: "TikTok",
    platforms: ["TIKTOK"],
    platformLabels: ["TikTok"],
    idLabel: "Client Key",
    secretLabel: "Client Secret",
    helpText:
      "Erstelle eine App auf developers.tiktok.com → Manage Apps",
    helpUrl: "https://developers.tiktok.com/",
    color: "#000000",
  },
]

export default function CredentialsPage() {
  const [statuses, setStatuses] = useState<Record<string, PlatformStatus>>({})
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [formData, setFormData] = useState<
    Record<string, { clientId: string; clientSecret: string }>
  >({})
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchStatuses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/platform-credentials")
      if (res.ok) {
        const data = await res.json()
        setStatuses(data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  const isGroupConfigured = useCallback(
    (group: CredentialGroup) => {
      return group.platforms.some((p) => statuses[p]?.configured)
    },
    [statuses]
  )

  const getGroupUpdatedAt = useCallback(
    (group: CredentialGroup) => {
      for (const p of group.platforms) {
        if (statuses[p]?.updatedAt) {
          return new Date(statuses[p].updatedAt).toLocaleString("de-CH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        }
      }
      return null
    },
    [statuses]
  )

  const toggleGroup = useCallback(
    (groupId: string) => {
      setError(null)
      setSuccess(null)
      if (expandedGroup === groupId) {
        setExpandedGroup(null)
      } else {
        setExpandedGroup(groupId)
        if (!formData[groupId]) {
          setFormData((prev) => ({
            ...prev,
            [groupId]: { clientId: "", clientSecret: "" },
          }))
        }
      }
    },
    [expandedGroup, formData]
  )

  const handleSave = useCallback(
    async (group: CredentialGroup) => {
      const data = formData[group.id]
      if (!data?.clientId || !data?.clientSecret) {
        setError("Bitte fülle beide Felder aus.")
        return
      }

      setSaving(group.id)
      setError(null)
      setSuccess(null)

      try {
        for (const platform of group.platforms) {
          const res = await fetch("/api/admin/platform-credentials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platform,
              clientId: data.clientId,
              clientSecret: data.clientSecret,
            }),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || "Fehler beim Speichern")
          }
        }
        setSuccess(`${group.name}-Credentials erfolgreich gespeichert.`)
        setFormData((prev) => ({
          ...prev,
          [group.id]: { clientId: "", clientSecret: "" },
        }))
        await fetchStatuses()
      } catch (err: any) {
        setError(err.message || "Fehler beim Speichern")
      } finally {
        setSaving(null)
      }
    },
    [formData, fetchStatuses]
  )

  const handleDelete = useCallback(
    async (group: CredentialGroup) => {
      setDeleting(group.id)
      setError(null)
      setSuccess(null)

      try {
        for (const platform of group.platforms) {
          await fetch("/api/admin/platform-credentials", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform }),
          })
        }
        setSuccess(`${group.name}-Credentials wurden entfernt.`)
        await fetchStatuses()
      } catch {
        setError("Fehler beim Entfernen")
      } finally {
        setDeleting(null)
      }
    },
    [fetchStatuses]
  )

  const handleCopyRedirectUri = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(REDIRECT_URI)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
          Platform Credentials
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
          OAuth Client IDs und Secrets für die Plattform-Integrationen verwalten.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-[#6C5CE7]" />
          <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white">
            Redirect URI
          </span>
        </div>
        <p className="text-[12px] text-gray-500 dark:text-white/50 mb-3">
          Diese URI muss bei allen Plattformen als Redirect URI registriert werden.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded border border-gray-200 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/[0.05] px-4 py-2.5 text-[13px] text-[#0F172A] dark:text-white font-mono">
            {REDIRECT_URI}
          </code>
          <button
            onClick={handleCopyRedirectUri}
            className="flex items-center gap-1.5 rounded border border-gray-200 dark:border-white/10 px-3 py-2.5 text-[12px] font-medium text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Kopiert</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Kopieren</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded border p-3 text-[13px] flex items-center gap-2 ${
              error
                ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
                : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {error ? (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Check className="h-4 w-4 flex-shrink-0" />
            )}
            {error || success}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#6C5CE7]" />
        </div>
      ) : (
        <div className="space-y-3">
          {CREDENTIAL_GROUPS.map((group) => {
            const configured = isGroupConfigured(group)
            const updatedAt = getGroupUpdatedAt(group)
            const isExpanded = expandedGroup === group.id
            const isSaving = saving === group.id
            const isDeleting = deleting === group.id
            const data = formData[group.id] || {
              clientId: "",
              clientSecret: "",
            }

            return (
              <motion.div
                key={group.id}
                layout
                className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] overflow-hidden"
              >
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${group.color}15` }}
                    >
                      <Key
                        className="h-5 w-5"
                        style={{ color: group.color }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white">
                          {group.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            configured
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-gray-100 dark:bg-white/[0.05] text-gray-400 dark:text-white/40"
                          }`}
                        >
                          {configured && (
                            <Check className="h-3 w-3" />
                          )}
                          {configured ? "Konfiguriert" : "Nicht konfiguriert"}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-500 dark:text-white/50 mt-0.5">
                        {group.platformLabels.join(", ")}
                        {configured && updatedAt && (
                          <span className="ml-2 text-gray-400 dark:text-white/30">
                            &middot; Aktualisiert: {updatedAt}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400 dark:text-white/30" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100 dark:border-white/[0.06] pt-4">
                        <div className="flex items-start gap-2 mb-4 rounded bg-[#F8FAFC] dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-3">
                          <Settings className="h-4 w-4 text-gray-400 dark:text-white/40 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[12px] text-gray-600 dark:text-white/60">
                              {group.helpText}
                            </p>
                            <a
                              href={group.helpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] text-[#6C5CE7] hover:underline mt-1"
                            >
                              Zur Plattform
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[12px] font-medium text-gray-600 dark:text-white/60 mb-1.5">
                              {group.idLabel}
                            </label>
                            <input
                              type="text"
                              value={data.clientId}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  [group.id]: {
                                    ...prev[group.id],
                                    clientId: e.target.value,
                                  },
                                }))
                              }
                              placeholder={`${group.idLabel} eingeben...`}
                              className="w-full rounded border border-gray-200 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/[0.05] px-4 py-3 text-[13px] text-[#0F172A] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[12px] font-medium text-gray-600 dark:text-white/60 mb-1.5">
                              {group.secretLabel}
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  showSecrets[group.id] ? "text" : "password"
                                }
                                value={data.clientSecret}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    [group.id]: {
                                      ...prev[group.id],
                                      clientSecret: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={`${group.secretLabel} eingeben...`}
                                className="w-full rounded border border-gray-200 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/[0.05] px-4 py-3 pr-12 text-[13px] text-[#0F172A] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowSecrets((prev) => ({
                                    ...prev,
                                    [group.id]: !prev[group.id],
                                  }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
                              >
                                {showSecrets[group.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => handleSave(group)}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white rounded px-4 py-2 text-[13px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            {isSaving ? "Speichern..." : "Speichern"}
                          </button>

                          {configured && (
                            <button
                              onClick={() => handleDelete(group)}
                              disabled={isDeleting}
                              className="flex items-center gap-1.5 rounded border border-red-200 dark:border-red-500/20 px-4 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60 transition-colors"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              {isDeleting ? "Entfernen..." : "Entfernen"}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
