import { searchBusinesses } from "./google-places"
import { analyzeWebsite } from "./website-analyzer"
import { analyzeSocialPresence } from "./social-analyzer"
import { generateLeadAnalysis } from "./ai-analyzer"
import type { WebsiteAnalysis } from "./website-analyzer"
import type { SocialAnalysis } from "./social-analyzer"
import type { AIAnalysis } from "./ai-analyzer"

export function calculateLeadScore(
  websiteScore: number,
  socialScore: number,
  seoScore: number,
  googleRating?: number
): number {
  const ratingScore = googleRating != null ? (googleRating / 5) * 100 : 50
  const rawScore =
    websiteScore * 0.3 +
    socialScore * 0.35 +
    seoScore * 0.2 +
    ratingScore * 0.15
  return Math.round(100 - rawScore)
}

export async function analyzeLeadFull(lead: {
  name: string
  industry: string
  website?: string
  googlePlaceId?: string
  googleRating?: number
  googleReviews?: number
  city?: string
}): Promise<{
  websiteScore: number
  socialScore: number
  seoScore: number
  score: number
  analysis: AIAnalysis
  recommendations: AIAnalysis["recommendations"]
  potentialValue: string
}> {
  let websiteAnalysis: WebsiteAnalysis | undefined
  let socialAnalysis: SocialAnalysis | undefined

  if (lead.website) {
    try {
      websiteAnalysis = await analyzeWebsite(lead.website)
    } catch {}
  }

  try {
    socialAnalysis = await analyzeSocialPresence(lead.name, lead.website)
  } catch {}

  const websiteScore = websiteAnalysis?.overallScore ?? 0
  const socialScore = socialAnalysis?.overallScore ?? 0
  const seoScore = websiteAnalysis?.seoScore ?? 0

  let aiAnalysis: AIAnalysis
  try {
    aiAnalysis = await generateLeadAnalysis({
      name: lead.name,
      industry: lead.industry,
      website: websiteAnalysis,
      social: socialAnalysis,
      googleRating: lead.googleRating,
      googleReviews: lead.googleReviews,
      city: lead.city,
    })
  } catch {
    aiAnalysis = {
      summary: "",
      overallScore: 0,
      strengths: [],
      weaknesses: [],
      recommendations: [],
      potentialValue: "",
      competitorInsights: "",
      quickWins: [],
      longTermStrategy: "",
    }
  }

  const score = calculateLeadScore(websiteScore, socialScore, seoScore, lead.googleRating)

  return {
    websiteScore,
    socialScore,
    seoScore,
    score,
    analysis: aiAnalysis,
    recommendations: aiAnalysis.recommendations,
    potentialValue: aiAnalysis.potentialValue,
  }
}

export async function runSearchPipeline(config: {
  branches: string[]
  regions: string[]
  maxResults: number
}): Promise<{ found: number; analyzed: number; errors: number }> {
  const { prisma } = await import("@/lib/prisma")
  if (!prisma) {
    return { found: 0, analyzed: 0, errors: 0 }
  }

  const allPlaces = new Map<string, any>()

  for (const branch of config.branches) {
    for (const region of config.regions) {
      try {
        const results = await searchBusinesses(branch, region)
        for (const place of results) {
          if (place.placeId && !allPlaces.has(place.placeId)) {
            allPlaces.set(place.placeId, { ...place, industry: branch })
          }
        }
      } catch {}
    }
  }

  let found = allPlaces.size
  let analyzed = 0
  let errors = 0
  let processed = 0

  for (const [placeId, place] of allPlaces) {
    if (processed >= config.maxResults) break

    try {
      const existing = await prisma.lead.findUnique({
        where: { googlePlaceId: placeId },
      })
      if (existing) {
        found--
        continue
      }

      const lead = await prisma.lead.create({
        data: {
          name: place.name,
          industry: place.industry,
          website: place.website || null,
          phone: place.phone || null,
          address: place.address,
          city: place.city,
          zip: place.zip,
          canton: place.canton,
          googlePlaceId: place.placeId,
          googleRating: place.rating || null,
          googleReviews: place.reviewCount || null,
          status: "RECHERCHIERT",
          searchBatch: new Date().toISOString().slice(0, 10),
        },
      })

      try {
        const result = await analyzeLeadFull({
          name: place.name,
          industry: place.industry,
          website: place.website,
          googlePlaceId: place.placeId,
          googleRating: place.rating,
          googleReviews: place.reviewCount,
          city: place.city,
        })

        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            websiteScore: result.websiteScore,
            socialScore: result.socialScore,
            seoScore: result.seoScore,
            score: result.score,
            analysis: result.analysis as any,
            recommendations: result.recommendations as any,
            status: "RECHERCHIERT",
            analyzedAt: new Date(),
          },
        })

        analyzed++
      } catch {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { status: "NEU" },
        })
        errors++
      }

      processed++
    } catch {
      errors++
      processed++
    }
  }

  return { found, analyzed, errors }
}
