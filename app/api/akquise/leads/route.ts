import { type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEMO_LEADS = [
  { id: "l1", name: "BSZ Sanitär & Heizung AG", industry: "Haustechnik", website: "https://bsz-sanitaer.ch", phone: "+41 44 271 33 44", email: "info@bsz-sanitaer.ch", address: "Industriestrasse 15", city: "Zürich", zip: "8005", canton: "ZH", googlePlaceId: "bsz_01", googleRating: 4.3, googleReviews: 42, socialMedia: { instagram: false, facebook: true, linkedin: false }, status: "RECHERCHIERT", score: 78, websiteScore: 55, socialScore: 20, seoScore: 48, potentialValue: "CHF 2\'200/Mt.", createdAt: "2026-05-22T00:00:00Z", analyzedAt: "2026-05-22T06:00:00Z" },
  { id: "l2", name: "Pema Lüftung GmbH", industry: "Lüftungstechnik", website: "https://pema-lueftung.ch", phone: "+41 52 234 56 78", email: "info@pema-lueftung.ch", address: "Technopark 8", city: "Winterthur", zip: "8406", canton: "ZH", googlePlaceId: "pema_02", googleRating: 4.5, googleReviews: 18, socialMedia: { instagram: false, facebook: false, linkedin: true }, status: "NEU", score: 85, websiteScore: 42, socialScore: 10, seoScore: 35, potentialValue: "CHF 2\'800/Mt.", createdAt: "2026-05-22T00:00:00Z" },
  { id: "l3", name: "Sui Innova GmbH", industry: "Gebäudetechnik", website: "https://sui-innova.ch", phone: "+41 31 398 22 11", email: "info@sui-innova.ch", address: "Könizstrasse 45", city: "Bern", zip: "3008", canton: "BE", googlePlaceId: "sui_03", googleRating: 4.1, googleReviews: 8, socialMedia: { instagram: false, facebook: false, linkedin: true }, status: "NEU", score: 72, websiteScore: 60, socialScore: 15, seoScore: 52, potentialValue: "CHF 1\'900/Mt.", createdAt: "2026-05-22T00:00:00Z" },
  { id: "l4", name: "Sada AG", industry: "Haustechnik", website: "https://sada.ch", phone: "+41 41 310 55 66", email: "info@sada.ch", address: "Obergrundstrasse 120", city: "Luzern", zip: "6005", canton: "LU", googlePlaceId: "sada_04", googleRating: 4.6, googleReviews: 67, socialMedia: { instagram: false, facebook: true, linkedin: true }, status: "RECHERCHIERT", score: 65, websiteScore: 70, socialScore: 25, seoScore: 62, potentialValue: "CHF 1\'600/Mt.", createdAt: "2026-05-21T00:00:00Z", analyzedAt: "2026-05-21T06:00:00Z" },
  { id: "l5", name: "Neukom Marzolo AG", industry: "Sanitär & Heizung", website: "https://neukom-marzolo.ch", phone: "+41 71 245 33 22", email: "info@neukom-marzolo.ch", address: "Rorschacher Strasse 150", city: "St. Gallen", zip: "9006", canton: "SG", googlePlaceId: "neum_05", googleRating: 4.4, googleReviews: 35, socialMedia: { instagram: false, facebook: true, linkedin: false }, status: "NEU", score: 81, websiteScore: 48, socialScore: 12, seoScore: 40, potentialValue: "CHF 2\'500/Mt.", createdAt: "2026-05-21T00:00:00Z" },
  { id: "l6", name: "SHS Haustechnik AG", industry: "Haustechnik", website: "https://shs-haustechnik.ch", phone: "+41 61 311 88 99", email: "info@shs-haustechnik.ch", address: "St. Jakobs-Strasse 85", city: "Basel", zip: "4052", canton: "BS", googlePlaceId: "shs_06", googleRating: 4.2, googleReviews: 29, socialMedia: { instagram: false, facebook: true, linkedin: true }, status: "ANGESCHRIEBEN", score: 74, websiteScore: 58, socialScore: 18, seoScore: 50, potentialValue: "CHF 2\'100/Mt.", createdAt: "2026-05-20T00:00:00Z", analyzedAt: "2026-05-20T06:00:00Z" },
  { id: "l7", name: "Ritschard Gebäudetechnik AG", industry: "Gebäudetechnik", website: "https://ritschard-gebaeudetechnik.ch", phone: "+41 33 222 44 55", email: "info@ritschard-gebaeudetechnik.ch", address: "Allmendstrasse 22", city: "Thun", zip: "3600", canton: "BE", googlePlaceId: "rit_07", googleRating: 4.7, googleReviews: 53, socialMedia: { instagram: false, facebook: true, linkedin: true }, status: "RECHERCHIERT", score: 69, websiteScore: 65, socialScore: 22, seoScore: 58, potentialValue: "CHF 1\'800/Mt.", createdAt: "2026-05-20T00:00:00Z", analyzedAt: "2026-05-20T06:00:00Z" },
]

export async function GET(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")
  const industry = searchParams.get("industry")
  const minScore = searchParams.get("minScore")
  const maxScore = searchParams.get("maxScore")
  const search = searchParams.get("search")
  const limit = parseInt(searchParams.get("limit") || "50", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  if (!prisma) {
    let filtered = [...DEMO_LEADS]
    if (status) filtered = filtered.filter((l) => l.status === status)
    if (industry) filtered = filtered.filter((l) => l.industry === industry)
    if (minScore) filtered = filtered.filter((l) => (l.score ?? 0) >= parseInt(minScore, 10))
    if (maxScore) filtered = filtered.filter((l) => (l.score ?? 0) <= parseInt(maxScore, 10))
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.industry.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q)
      )
    }
    filtered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    return Response.json(filtered.slice(offset, offset + limit))
  }

  try {
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (industry) where.industry = industry
    if (minScore || maxScore) {
      where.score = {}
      if (minScore) (where.score as Record<string, number>).gte = parseInt(minScore, 10)
      if (maxScore) (where.score as Record<string, number>).lte = parseInt(maxScore, 10)
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ]
    }

    const leads = await prisma!.lead.findMany({
      where,
      orderBy: { score: "desc" },
      take: limit,
      skip: offset,
    })

    return Response.json(leads)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  const body = await request.json()

  if (!body.name || !body.industry) {
    return Response.json(
      { error: "Name und Branche sind erforderlich" },
      { status: 400 }
    )
  }

  if (!prisma) {
    const demoLead = {
      id: `demo-lead-manual-${Date.now()}`,
      name: body.name,
      industry: body.industry,
      website: body.website || null,
      phone: body.phone || null,
      email: body.email || null,
      city: body.city || null,
      address: null,
      zip: null,
      canton: null,
      googlePlaceId: null,
      googleRating: null,
      googleReviews: null,
      socialMedia: null,
      status: "NEU",
      score: null,
      analysis: null,
      recommendations: null,
      websiteScore: null,
      socialScore: null,
      seoScore: null,
      potentialValue: null,
      searchBatch: null,
      analyzedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return Response.json(demoLead, { status: 201 })
  }

  try {
    const lead = await prisma!.lead.create({
      data: {
        name: body.name,
        industry: body.industry,
        website: body.website || null,
        phone: body.phone || null,
        email: body.email || null,
        city: body.city || null,
      },
    })

    return Response.json(lead, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}
