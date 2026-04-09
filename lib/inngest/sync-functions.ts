import { inngest } from "./client"
import { prisma } from "@/lib/prisma"
import { refreshAccessToken, type PlatformType } from "@/lib/api/types"
import { fetchGoogleAnalyticsMetrics } from "@/lib/api/google-analytics"
import { fetchSearchConsoleMetrics } from "@/lib/api/search-console"
import { fetchInstagramMetrics } from "@/lib/api/instagram"
import { fetchFacebookMetrics } from "@/lib/api/facebook"
import { fetchYouTubeMetrics } from "@/lib/api/youtube"
import { fetchLinkedInMetrics } from "@/lib/api/linkedin"
import { fetchTikTokMetrics } from "@/lib/api/tiktok"
import type { MetricData } from "@/lib/api/types"

// ─── Helper: refresh token if expired ────────────────────────────
async function getValidToken(integration: {
  id: string
  platform: string
  accessToken: string | null
  refreshToken: string | null
  tokenExpiresAt: Date | string | null
}): Promise<string> {
  if (!integration.accessToken) throw new Error("No access token")

  const isExpired =
    integration.tokenExpiresAt && new Date(integration.tokenExpiresAt) < new Date()

  if (isExpired && integration.refreshToken) {
    const tokens = await refreshAccessToken(
      integration.platform as PlatformType,
      integration.refreshToken
    )

    if (prisma) {
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? integration.refreshToken,
          tokenExpiresAt: tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000)
            : undefined,
        },
      })
    }

    return tokens.access_token
  }

  return integration.accessToken
}

// ─── Helper: save metrics ────────────────────────────────────────
async function saveMetrics(
  organizationId: string,
  integrationId: string,
  platform: PlatformType,
  metrics: MetricData[]
) {
  if (!prisma || metrics.length === 0) return

  await prisma.metric.createMany({
    data: metrics.map((m) => ({
      organizationId,
      integrationId,
      platform,
      metricName: m.metricName,
      metricValue: m.metricValue,
      dimensions: m.dimensions ?? undefined,
      period: m.period,
    })),
  })
}

// ─── Helper: fetch metrics per platform ──────────────────────────
async function fetchMetricsForPlatform(
  platform: PlatformType,
  accessToken: string,
  externalId: string,
  metadata: any
): Promise<MetricData[]> {
  const endDate = new Date().toISOString().slice(0, 10)
  const startDate = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

  switch (platform) {
    case "GOOGLE_ANALYTICS":
      return fetchGoogleAnalyticsMetrics(accessToken, metadata?.propertyId ?? externalId, startDate, endDate)
    case "SEARCH_CONSOLE":
      return fetchSearchConsoleMetrics(accessToken, metadata?.siteUrl ?? `https://${externalId}`, startDate, endDate)
    case "INSTAGRAM":
      return fetchInstagramMetrics(accessToken, externalId)
    case "FACEBOOK":
      return fetchFacebookMetrics(accessToken, externalId)
    case "YOUTUBE":
      return fetchYouTubeMetrics(accessToken, externalId)
    case "LINKEDIN":
      return fetchLinkedInMetrics(accessToken, externalId)
    case "TIKTOK":
      return fetchTikTokMetrics(accessToken)
    default:
      return []
  }
}

// ─── Sync single integration ─────────────────────────────────────
export const syncIntegration = inngest.createFunction(
  {
    id: "sync-integration",
    retries: 3,
    throttle: { limit: 10, period: "1m" },
    triggers: [{ event: "integration/sync" }],
  },
  async ({ event, step }) => {
    if (!prisma) return { skipped: true, reason: "No database" }

    const integrationId = event.data.integrationId as string

    const integration = await step.run("fetch-integration", async () => {
      return prisma!.integration.findUnique({ where: { id: integrationId } })
    })

    if (!integration || integration.status === "DISCONNECTED") {
      return { skipped: true, reason: "Not found or disconnected" }
    }

    await step.run("mark-syncing", async () => {
      await prisma!.integration.update({ where: { id: integrationId }, data: { status: "SYNCING" } })
    })

    try {
      const accessToken = await step.run("refresh-token", () => getValidToken(integration))

      const metrics = await step.run("fetch-metrics", () =>
        fetchMetricsForPlatform(integration.platform as PlatformType, accessToken, integration.externalId ?? "", integration.metadata)
      )

      await step.run("save-metrics", () =>
        saveMetrics(integration.organizationId, integration.id, integration.platform as PlatformType, metrics)
      )

      await step.run("mark-success", () =>
        prisma!.integration.update({
          where: { id: integrationId },
          data: { status: "CONNECTED", lastSyncAt: new Date(), lastSyncError: null },
        })
      )

      return { success: true, metricsCount: metrics.length }
    } catch (err: any) {
      if (prisma) {
        await prisma.integration.update({
          where: { id: integrationId },
          data: { status: "ERROR", lastSyncError: err.message?.slice(0, 500), lastSyncAt: new Date() },
        })
      }
      throw err
    }
  }
)

// ─── Daily sync cron (02:00 UTC) ─────────────────────────────────
export const dailySync = inngest.createFunction(
  {
    id: "daily-sync-all-integrations",
    triggers: [{ cron: "0 2 * * *" }],
  },
  async ({ step }) => {
    if (!prisma) return { skipped: true, reason: "No database" }

    const integrations = await step.run("fetch-active", () =>
      prisma!.integration.findMany({ where: { status: "CONNECTED" }, select: { id: true } })
    )

    if (integrations.length > 0) {
      await step.sendEvent(
        "fan-out-syncs",
        integrations.map((i) => ({ name: "integration/sync" as const, data: { integrationId: i.id } }))
      )
    }

    return { triggered: integrations.length }
  }
)

export const functions = [syncIntegration, dailySync]
