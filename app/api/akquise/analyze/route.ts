import { type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEMO_ANALYSIS = {
  leadId: "demo-lead-01",
  score: 78,
  websiteScore: 72,
  socialScore: 55,
  seoScore: 68,
  potentialValue: "CHF 1'200/Mt",
  analysis: {
    websiteQuality: "gut",
    socialPresence: "mittel",
    seoScore: 72,
    loadTime: 1.8,
    mobileOptimized: true,
    hasOnlineBooking: false,
    details: {
      website: {
        hasSSL: true,
        loadTimeMs: 1800,
        mobileResponsive: true,
        hasContactForm: true,
        hasSocialLinks: true,
        contentQuality: "mittel",
        lastUpdated: "2026-04-15",
      },
      social: {
        platforms: ["Instagram", "Facebook"],
        totalFollowers: 2300,
        postFrequency: "2-3x pro Woche",
        engagementRate: 3.2,
        lastPost: "2026-05-19",
      },
      seo: {
        metaTitle: true,
        metaDescription: true,
        h1Tag: true,
        structuredData: false,
        sitemap: false,
        robotsTxt: true,
        pageSpeed: 72,
      },
    },
  },
  recommendations: [
    "Online-Reservierungssystem einführen - Potenzial für 30% mehr Buchungen",
    "Instagram-Präsenz ausbauen (aktuell nur 2300 Follower) - Reels mit Kochvideos",
    "Google My Business Beiträge regelmässig veröffentlichen - 1x pro Woche",
    "Strukturierte Daten (Schema.org Restaurant) implementieren",
    "Sitemap.xml erstellen und in Google Search Console einreichen",
  ],
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  const body = await request.json()

  if (!body.leadId) {
    return Response.json({ error: "leadId ist erforderlich" }, { status: 400 })
  }

  if (!prisma) {
    return Response.json({
      ...DEMO_ANALYSIS,
      leadId: body.leadId,
      message: "Demo-Daten: Keine Datenbank verbunden",
    })
  }

  try {
    const lead = await prisma!.lead.findUnique({ where: { id: body.leadId } })

    if (!lead) {
      return Response.json({ error: "Lead nicht gefunden" }, { status: 404 })
    }

    await prisma!.lead.update({
      where: { id: body.leadId },
      data: { status: "ANALYZING" },
    })

    let result
    try {
      const { analyzeLeadFull } = await import("@/lib/akquise/lead-pipeline")
      result = await analyzeLeadFull(lead)
    } catch {
      return Response.json({
        ...DEMO_ANALYSIS,
        leadId: body.leadId,
        message: "Demo-Daten: Analyse-Pipeline nicht verfügbar oder API-Keys fehlen",
      })
    }

    await prisma!.lead.update({
      where: { id: body.leadId },
      data: {
        status: "ANALYZED",
        score: result.score ?? null,
        websiteScore: result.websiteScore ?? null,
        socialScore: result.socialScore ?? null,
        seoScore: result.seoScore ?? null,
        analysis: result.analysis ?? null,
        recommendations: result.recommendations ?? null,
        potentialValue: result.potentialValue ?? null,
        analyzedAt: new Date(),
      },
    })

    return Response.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}
