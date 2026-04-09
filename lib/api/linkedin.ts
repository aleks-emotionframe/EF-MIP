import type { MetricData } from "./types"

const LI_BASE = "https://api.linkedin.com/v2"

export async function fetchLinkedInMetrics(
  accessToken: string,
  organizationId: string
): Promise<MetricData[]> {
  const today = new Date().toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
  const metrics: MetricData[] = []

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Restli-Protocol-Version": "2.0.0",
  }

  // Follower count
  const followerRes = await fetch(
    `${LI_BASE}/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:${organizationId}`,
    { headers }
  )
  if (followerRes.ok) {
    const data = await followerRes.json()
    const totalFollowers = data.elements?.[0]?.followerCounts?.organicFollowerCount ?? 0
    metrics.push({ metricName: "followers", metricValue: totalFollowers, period: today })
  }

  // Page statistics (impressions, engagement)
  const startMs = thirtyDaysAgo.getTime()
  const endMs = Date.now()
  const statsRes = await fetch(
    `${LI_BASE}/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:${organizationId}&timeIntervals.timeGranularityType=DAY&timeIntervals.timeRange.start=${startMs}&timeIntervals.timeRange.end=${endMs}`,
    { headers }
  )
  if (statsRes.ok) {
    const data = await statsRes.json()
    for (const elem of data.elements ?? []) {
      const period = new Date(elem.timeRange?.start ?? Date.now()).toISOString().slice(0, 10)
      const total = elem.totalShareStatistics ?? {}
      metrics.push(
        { metricName: "impressions", metricValue: total.impressionCount ?? 0, period },
        { metricName: "clicks", metricValue: total.clickCount ?? 0, period },
        { metricName: "engagement", metricValue: total.engagement ?? 0, period },
        { metricName: "likes", metricValue: total.likeCount ?? 0, period },
        { metricName: "shares", metricValue: total.shareCount ?? 0, period },
        { metricName: "comments", metricValue: total.commentCount ?? 0, period }
      )
    }
  }

  return metrics
}
