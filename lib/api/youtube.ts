import type { MetricData } from "./types"

const YT_BASE = "https://www.googleapis.com/youtube/v3"
const YTA_BASE = "https://youtubeanalytics.googleapis.com/v2"

export async function fetchYouTubeMetrics(
  accessToken: string,
  channelId: string
): Promise<MetricData[]> {
  const today = new Date().toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
  const metrics: MetricData[] = []

  // Channel stats
  const channelRes = await fetch(
    `${YT_BASE}/channels?part=statistics&id=${channelId}&access_token=${accessToken}`
  )
  if (!channelRes.ok) throw new Error(`YouTube channel API error: ${channelRes.status}`)
  const channel = await channelRes.json()
  const stats = channel.items?.[0]?.statistics

  if (stats) {
    metrics.push(
      { metricName: "subscribers", metricValue: parseInt(stats.subscriberCount ?? "0"), period: today },
      { metricName: "total_views", metricValue: parseInt(stats.viewCount ?? "0"), period: today },
      { metricName: "total_videos", metricValue: parseInt(stats.videoCount ?? "0"), period: today }
    )
  }

  // Analytics (last 30 days)
  const analyticsRes = await fetch(
    `${YTA_BASE}/reports?ids=channel==${channelId}&startDate=${thirtyDaysAgo}&endDate=${today}&metrics=views,estimatedMinutesWatched,averageViewDuration,likes,subscribersGained&dimensions=day&access_token=${accessToken}`
  )
  if (analyticsRes.ok) {
    const analytics = await analyticsRes.json()
    const headers = analytics.columnHeaders?.map((h: any) => h.name) ?? []

    for (const row of analytics.rows ?? []) {
      const period = row[0] // date
      headers.forEach((name: string, i: number) => {
        if (i === 0) return // skip date dimension
        metrics.push({
          metricName: name,
          metricValue: row[i],
          period,
        })
      })
    }
  }

  return metrics
}
