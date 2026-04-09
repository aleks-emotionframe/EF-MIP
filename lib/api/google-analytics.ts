import type { MetricData } from "./types"

const GA4_BASE = "https://analyticsdata.googleapis.com/v1beta"

export async function fetchGoogleAnalyticsMetrics(
  accessToken: string,
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<MetricData[]> {
  const res = await fetch(`${GA4_BASE}/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      dimensions: [{ name: "date" }],
    }),
  })

  if (!res.ok) {
    throw new Error(`GA4 API error: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  const metrics: MetricData[] = []

  for (const row of data.rows ?? []) {
    const date = row.dimensionValues[0].value // YYYYMMDD
    const period = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`

    const metricNames = ["sessions", "users", "pageviews", "bounce_rate", "avg_session_duration"]
    row.metricValues.forEach((v: any, i: number) => {
      metrics.push({
        metricName: metricNames[i],
        metricValue: parseFloat(v.value),
        period,
      })
    })
  }

  return metrics
}

export async function fetchTrafficSources(
  accessToken: string,
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<MetricData[]> {
  const res = await fetch(`${GA4_BASE}/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "sessions" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
    }),
  })

  if (!res.ok) {
    throw new Error(`GA4 Traffic API error: ${res.status}`)
  }

  const data = await res.json()
  return (data.rows ?? []).map((row: any) => ({
    metricName: "sessions_by_source",
    metricValue: parseFloat(row.metricValues[0].value),
    dimensions: { source: row.dimensionValues[0].value },
    period: `${startDate}_${endDate}`,
  }))
}
