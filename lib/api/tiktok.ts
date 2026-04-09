import type { MetricData } from "./types"

const TT_BASE = "https://open.tiktokapis.com/v2"

export async function fetchTikTokMetrics(
  accessToken: string
): Promise<MetricData[]> {
  const today = new Date().toISOString().slice(0, 10)
  const metrics: MetricData[] = []

  // User info
  const userRes = await fetch(
    `${TT_BASE}/user/info/?fields=follower_count,following_count,likes_count,video_count`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  if (!userRes.ok) throw new Error(`TikTok user API error: ${userRes.status}`)
  const userData = await userRes.json()
  const user = userData.data?.user

  if (user) {
    metrics.push(
      { metricName: "followers", metricValue: user.follower_count ?? 0, period: today },
      { metricName: "following", metricValue: user.following_count ?? 0, period: today },
      { metricName: "total_likes", metricValue: user.likes_count ?? 0, period: today },
      { metricName: "video_count", metricValue: user.video_count ?? 0, period: today }
    )
  }

  // Recent videos
  const videosRes = await fetch(
    `${TT_BASE}/video/list/?fields=like_count,comment_count,share_count,view_count,create_time`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ max_count: 20 }),
    }
  )
  if (videosRes.ok) {
    const videoData = await videosRes.json()
    let totalViews = 0
    let totalLikes = 0
    let totalShares = 0
    let totalComments = 0

    for (const video of videoData.data?.videos ?? []) {
      totalViews += video.view_count ?? 0
      totalLikes += video.like_count ?? 0
      totalShares += video.share_count ?? 0
      totalComments += video.comment_count ?? 0
    }

    metrics.push(
      { metricName: "recent_views", metricValue: totalViews, period: today },
      { metricName: "recent_likes", metricValue: totalLikes, period: today },
      { metricName: "recent_shares", metricValue: totalShares, period: today },
      { metricName: "recent_comments", metricValue: totalComments, period: today }
    )
  }

  return metrics
}
