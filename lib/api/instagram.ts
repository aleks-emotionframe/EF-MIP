import type { MetricData } from "./types"

const GRAPH_BASE = "https://graph.facebook.com/v19.0"

export async function fetchInstagramMetrics(
  accessToken: string,
  igUserId: string
): Promise<MetricData[]> {
  const today = new Date().toISOString().slice(0, 10)
  const metrics: MetricData[] = []

  // Account info
  const profileRes = await fetch(
    `${GRAPH_BASE}/${igUserId}?fields=followers_count,media_count&access_token=${accessToken}`
  )
  if (!profileRes.ok) throw new Error(`Instagram profile API error: ${profileRes.status}`)
  const profile = await profileRes.json()

  metrics.push(
    { metricName: "followers", metricValue: profile.followers_count ?? 0, period: today },
    { metricName: "media_count", metricValue: profile.media_count ?? 0, period: today }
  )

  // Insights (last 30 days)
  const insightsRes = await fetch(
    `${GRAPH_BASE}/${igUserId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${accessToken}`
  )
  if (insightsRes.ok) {
    const insights = await insightsRes.json()
    for (const metric of insights.data ?? []) {
      for (const val of metric.values ?? []) {
        metrics.push({
          metricName: metric.name,
          metricValue: val.value,
          period: val.end_time?.slice(0, 10) ?? today,
        })
      }
    }
  }

  // Recent media engagement
  const mediaRes = await fetch(
    `${GRAPH_BASE}/${igUserId}/media?fields=like_count,comments_count,timestamp&limit=25&access_token=${accessToken}`
  )
  if (mediaRes.ok) {
    const media = await mediaRes.json()
    let totalLikes = 0
    let totalComments = 0
    for (const post of media.data ?? []) {
      totalLikes += post.like_count ?? 0
      totalComments += post.comments_count ?? 0
    }
    metrics.push(
      { metricName: "recent_likes", metricValue: totalLikes, period: today },
      { metricName: "recent_comments", metricValue: totalComments, period: today },
      {
        metricName: "engagement",
        metricValue: profile.followers_count > 0
          ? ((totalLikes + totalComments) / Math.min(media.data?.length ?? 1, 25)) / profile.followers_count * 100
          : 0,
        period: today,
      }
    )
  }

  return metrics
}
