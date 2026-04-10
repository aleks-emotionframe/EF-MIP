import { NextRequest, NextResponse } from "next/server"

const PAGESPEED_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "URL parameter required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY || ""
    const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo${apiKey ? `&key=${apiKey}` : ""}`

    const res = await fetch(apiUrl, { next: { revalidate: 300 } })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: `PageSpeed API error: ${res.status}`, details: errText }, { status: res.status })
    }

    const data = await res.json()
    const lhr = data.lighthouseResult

    const categories = lhr?.categories || {}
    const audits = lhr?.audits || {}

    const result = {
      url: data.id,
      fetchTime: lhr?.fetchTime,
      scores: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      },
      coreWebVitals: {
        lcp: {
          value: audits["largest-contentful-paint"]?.numericValue || 0,
          display: audits["largest-contentful-paint"]?.displayValue || "",
          score: audits["largest-contentful-paint"]?.score || 0,
        },
        fid: {
          value: audits["max-potential-fid"]?.numericValue || 0,
          display: audits["max-potential-fid"]?.displayValue || "",
          score: audits["max-potential-fid"]?.score || 0,
        },
        cls: {
          value: audits["cumulative-layout-shift"]?.numericValue || 0,
          display: audits["cumulative-layout-shift"]?.displayValue || "",
          score: audits["cumulative-layout-shift"]?.score || 0,
        },
        fcp: {
          value: audits["first-contentful-paint"]?.numericValue || 0,
          display: audits["first-contentful-paint"]?.displayValue || "",
          score: audits["first-contentful-paint"]?.score || 0,
        },
        ttfb: {
          value: audits["server-response-time"]?.numericValue || 0,
          display: audits["server-response-time"]?.displayValue || "",
          score: audits["server-response-time"]?.score || 0,
        },
        si: {
          value: audits["speed-index"]?.numericValue || 0,
          display: audits["speed-index"]?.displayValue || "",
          score: audits["speed-index"]?.score || 0,
        },
        tbt: {
          value: audits["total-blocking-time"]?.numericValue || 0,
          display: audits["total-blocking-time"]?.displayValue || "",
          score: audits["total-blocking-time"]?.score || 0,
        },
      },
      opportunities: Object.values(audits)
        .filter((a: any) => a.details?.type === "opportunity" && a.score !== null && a.score < 1)
        .map((a: any) => ({
          title: a.title,
          description: a.description,
          savings: a.details?.overallSavingsMs ? `${Math.round(a.details.overallSavingsMs)} ms` : "",
          score: a.score,
        }))
        .slice(0, 8),
      diagnostics: Object.values(audits)
        .filter((a: any) => a.details?.type === "table" && a.score !== null && a.score < 1)
        .map((a: any) => ({
          title: a.title,
          description: a.description,
          score: a.score,
        }))
        .slice(0, 6),
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch PageSpeed data" }, { status: 500 })
  }
}
