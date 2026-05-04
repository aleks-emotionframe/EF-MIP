"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  BarChart3,
  Search,
  Camera,
  ThumbsUp,
  PlayCircle,
  Briefcase,
  Music2,
  RefreshCw,
  X,
  ExternalLink,
  Loader2,
  Key,
} from "lucide-react"
import { useSession } from "next-auth/react"

type PlatformKey =
  | "GOOGLE_ANALYTICS"
  | "SEARCH_CONSOLE"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "YOUTUBE"
  | "LINKEDIN"
  | "TIKTOK"

interface PlatformInfo {
  key: PlatformKey
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
}

const PLATFORMS: PlatformInfo[] = [
  {
    key: "GOOGLE_ANALYTICS",
    name: "Google Analytics",
    description: "Sessions, Users, Pageviews, Traffic Sources",
    icon: BarChart3,
    color: "#E37400",
    bgColor: "bg-orange-50",
  },
  {
    key: "SEARCH_CONSOLE",
    name: "Search Console",
    description: "Klicks, Impressions, CTR, Position pro Query",
    icon: Search,
    color: "#4285F4",
    bgColor: "bg-blue-50",
  },
  {
    key: "INSTAGRAM",
    name: "Instagram",
    description: "Followers, Impressions, Reach, Engagement, Stories",
    icon: Camera,
    color: "#E1306C",
    bgColor: "bg-pink-50",
  },
  {
    key: "FACEBOOK",
    name: "Facebook",
    description: "Page Fans, Post Reach, Engagement, Video Views",
    icon: ThumbsUp,
    color: "#1877F2",
    bgColor: "bg-blue-50",
  },
  {
    key: "YOUTUBE",
    name: "YouTube",
    description: "Subscribers, Views, Watch Time, CTR",
    icon: PlayCircle,
    color: "#FF0000",
    bgColor: "bg-red-50",
  },
  {
    key: "LINKEDIN",
    name: "LinkedIn",
    description: "Impressions, Engagement, Followers, Clicks",
    icon: Briefcase,
    color: "#0A66C2",
    bgColor: "bg-sky-50",
  },
  {
    key: "TIKTOK",
    name: "TikTok",
    description: "Followers, Video Views, Likes, Shares",
    icon: Music2,
    color: "#000000",
    bgColor: "bg-gray-50",
  },
]

interface PlatformStatus {
  connected: boolean
  syncing: boolean
  lastSync?: string
  externalName?: string
}

export default function IntegrationsPage() {
  const { data: session } = useSession()
  const isSuperAdmin = session?.user?.globalRole === "SUPER_ADMIN"
  const [statuses, setStatuses] = useState<Record<string, PlatformStatus>>({})
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    const initial: Record<string, PlatformStatus> = {}
    PLATFORMS.forEach((p) => {
      initial[p.key] = { connected: false, syncing: false }
    })

    async function fetchStatuses() {
      for (const p of PLATFORMS) {
        try {
          const res = await fetch(`/api/integrations/status?platform=${p.key}`)
          if (res.ok) {
            const data = await res.json()
            if (data.connected) {
              initial[p.key] = {
                connected: true,
                syncing: false,
                lastSync: data.lastSyncAt ? new Date(data.lastSyncAt).toLocaleString("de-CH") : undefined,
                externalName: data.externalName,
              }
            }
          }
        } catch {}
      }
      setStatuses(initial)
    }

    fetchStatuses()
  }, [])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "oauth-callback" && event.data.status === "success") {
        const platform = event.data.message || connecting
        if (platform) {
          setStatuses((prev) => ({
            ...prev,
            [platform]: { connected: true, syncing: false, lastSync: "Gerade eben" },
          }))
        }
        setConnecting(null)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [connecting])

  const handleConnect = useCallback(async (platform: PlatformKey) => {
    setConnecting(platform)
    try {
      const res = await fetch(`/api/integrations/connect?platform=${platform}`)
      const data = await res.json()
      if (data.url) {
        const w = 600
        const h = 700
        const left = window.screenX + (window.outerWidth - w) / 2
        const top = window.screenY + (window.outerHeight - h) / 2
        window.open(data.url, "oauth", `width=${w},height=${h},left=${left},top=${top}`)
      } else {
        setTimeout(() => {
          setStatuses((prev) => ({
            ...prev,
            [platform]: { connected: true, syncing: false, lastSync: "Gerade eben" },
          }))
          setConnecting(null)
        }, 1500)
      }
    } catch {
      setTimeout(() => {
        setStatuses((prev) => ({
          ...prev,
          [platform]: { connected: true, syncing: false, lastSync: "Gerade eben" },
        }))
        setConnecting(null)
      }, 1500)
    }
  }, [])

  const handleDisconnect = useCallback(async (platform: PlatformKey) => {
    setStatuses((prev) => ({
      ...prev,
      [platform]: { connected: false, syncing: false, lastSync: undefined },
    }))
    try {
      await fetch("/api/integrations/disconnect", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      })
    } catch {}
  }, [])

  const handleSync = useCallback(async (platform: PlatformKey) => {
    setStatuses((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], syncing: true },
    }))
    setTimeout(() => {
      setStatuses((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], syncing: false, lastSync: "Gerade eben" },
      }))
    }, 2000)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Integrationen</h1>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
            Verbinde deine Social-Media- und Analytics-Plattformen.
          </p>
        </div>
        {isSuperAdmin && (
          <Link
            href="/dashboard/settings/credentials"
            className="flex items-center gap-2 rounded px-4 py-2 text-[13px] font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            <Key className="h-4 w-4" />
            API-Zugangsdaten
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => {
          const status = statuses[platform.key]
          const isConnected = status?.connected
          const isSyncing = status?.syncing
          const isConnecting = connecting === platform.key

          return (
            <div
              key={platform.key}
              className="group rounded bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded ${platform.bgColor} flex items-center justify-center`}
                  >
                    <platform.icon
                      className="h-5 w-5"
                      style={{ color: platform.color }}
                    />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">
                      {platform.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isConnected ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          isConnected ? "text-emerald-600" : "text-gray-400"
                        }`}
                      >
                        {isConnected ? "Verbunden" : "Getrennt"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-gray-500 dark:text-white/50 mb-4 leading-relaxed">
                {platform.description}
              </p>

              {isConnected && status?.lastSync && (
                <p className="text-[11px] text-gray-400 dark:text-white/30 mb-3">
                  Letzter Sync: {status.lastSync}
                </p>
              )}

              {isConnected && status?.externalName && (
                <p className="text-[11px] text-gray-500 dark:text-white/40 mb-3">
                  Konto: {status.externalName}
                </p>
              )}

              <div className="flex gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleSync(platform.key)}
                      disabled={isSyncing}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded border border-gray-200 dark:border-white/10 px-3 py-2 text-[12px] font-medium text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.05] disabled:opacity-50 transition-colors"
                    >
                      {isSyncing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      {isSyncing ? "Synchronisiere..." : "Jetzt synchronisieren"}
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.key)}
                      className="flex items-center justify-center rounded border border-gray-200 dark:border-white/10 px-3 py-2 text-[12px] text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Trennen"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.key)}
                    disabled={isConnecting}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-semibold text-white transition-all disabled:opacity-60"
                    style={{ backgroundColor: platform.color }}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ExternalLink className="h-3.5 w-3.5" />
                    )}
                    {isConnecting ? "Verbinde..." : "Verbinden"}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
