import type { MetricData } from "./types"

const SC_BASE = "https://www.googleapis.com/webmasters/v3"

export async function fetchSearchConsoleMetrics(
  accessToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<MetricData[]> {
  const res = await fetch(
    `${SC_BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["date"],
        rowLimit: 1000,
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Search Console API error: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  const metrics: MetricData[] = []

  for (const row of data.rows ?? []) {
    const period = row.keys[0]
    metrics.push(
      { metricName: "clicks", metricValue: row.clicks, period },
      { metricName: "impressions", metricValue: row.impressions, period },
      { metricName: "ctr", metricValue: row.ctr, period },
      { metricName: "position", metricValue: row.position, period }
    )
  }

  return metrics
}

export async function fetchTopQueries(
  accessToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<MetricData[]> {
  const res = await fetch(
    `${SC_BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 50,
      }),
    }
  )

  if (!res.ok) throw new Error(`Search Console query API error: ${res.status}`)

  const data = await res.json()
  return (data.rows ?? []).flatMap((row: any) => [
    {
      metricName: "query_clicks",
      metricValue: row.clicks,
      dimensions: { query: row.keys[0] },
      period: `${startDate}_${endDate}`,
    },
    {
      metricName: "query_impressions",
      metricValue: row.impressions,
      dimensions: { query: row.keys[0] },
      period: `${startDate}_${endDate}`,
    },
  ])
}
