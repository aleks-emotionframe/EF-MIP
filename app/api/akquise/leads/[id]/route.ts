import { type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEMO_LEAD = {
  id: "demo-lead-01",
  name: "Ristorante Bellavista",
  industry: "Gastronomie",
  website: "https://bellavista-zh.ch",
  phone: "+41 44 123 45 67",
  email: "info@bellavista-zh.ch",
  address: "Limmatstrasse 42",
  city: "Zürich",
  zip: "8005",
  canton: "ZH",
  googlePlaceId: "ChIJ_demo_01",
  googleRating: 4.5,
  googleReviews: 187,
  socialMedia: { instagram: "@bellavista_zh", facebook: "bellavistazh", followers: 2300 },
  status: "RECHERCHIERT",
  score: 88,
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
  websiteScore: 72,
  socialScore: 55,
  seoScore: 68,
  potentialValue: "CHF 1'200/Mt",
  searchBatch: "batch-2026-05-20",
  analyzedAt: "2026-05-20T14:30:00.000Z",
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-20T14:30:00.000Z",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  const { id } = await params

  if (!prisma) {
    return Response.json({ ...DEMO_LEAD, id })
  }

  try {
    const lead = await prisma!.lead.findUnique({ where: { id } })

    if (!lead) {
      return Response.json({ error: "Lead nicht gefunden" }, { status: 404 })
    }

    return Response.json(lead)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const validStatuses = [
    "NEU",
    "ANGESCHRIEBEN",
    "ANTWORT",
    "ABGELEHNT",
    "KUNDE",
  ]

  if (!body.status || !validStatuses.includes(body.status)) {
    return Response.json(
      { error: "Ungültiger Status. Erlaubt: " + validStatuses.join(", ") },
      { status: 400 }
    )
  }

  if (!prisma) {
    return Response.json({ ...DEMO_LEAD, id, status: body.status, updatedAt: new Date().toISOString() })
  }

  try {
    const lead = await prisma!.lead.update({
      where: { id },
      data: { status: body.status },
    })

    return Response.json(lead)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  const { id } = await params

  if (!prisma) {
    return Response.json({ success: true })
  }

  try {
    await prisma!.lead.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}
