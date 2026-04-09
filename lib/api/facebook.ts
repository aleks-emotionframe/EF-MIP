import type { MetricData } from "./types"

const GRAPH_BASE = "https://graph.facebook.com/v19.0"

export async function fetchFacebookMetrics(
  accessToken: string,
  pageId: string
): Promise<MetricData[]> {
  const today = new Date().toISOString().slice(0, 10)
  const metrics: MetricData[] = []

  // Page info
  const pageRes = await fetch(
    `${GRAPH_BASE}/${pageId}?fields=fan_count,followers_count&access_token=${accessToken}`
  )
  if (!pageRes.ok) throw new Error(`Facebook page API error: ${pageRes.status}`)
  const page = await pageRes.json()

  metrics.push(
    { metricName: "page_fans", metricValue: page.fan_count ?? 0, period: today },
    { metricName: "followers", metricValue: page.followers_count ?? 0, period: today }
  )

  // Page insights
  const insightsRes = await fetch(
    `${GRAPH_BASE}/${pageId}/insights?metric=page_impressions,page_engaged_users,page_post_engagements,page_video_views&period=day&access_token=${accessToken}`
  )
  if (insightsRes.ok) {
    const insights = await insightsRes.json()
    for (const metric of insights.data ?? []) {
      for (const val of metric.values ?? []) {
        metrics.push({
          metricName: metric.name.replace("page_", ""),
          metricValue: val.value,
          period: val.end_time?.slice(0, 10) ?? today,
        })
      }
    }
  }

  // Recent posts reach
  const postsRes = await fetch(
    `${GRAPH_BASE}/${pageId}/posts?fields=message,created_time,shares&limit=25&access_token=${accessToken}`
  )
  if (postsRes.ok) {
    const posts = await postsRes.json()
    let totalShares = 0
    for (const post of posts.data ?? []) {
      totalShares += post.shares?.count ?? 0
    }
    metrics.push(
      { metricName: "recent_shares", metricValue: totalShares, period: today }
    )
  }

  return metrics
}
