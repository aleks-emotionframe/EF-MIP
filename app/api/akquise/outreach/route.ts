import { type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateOutreachEmail, type TemplateType } from "@/lib/akquise/outreach-generator"

const VALID_TEMPLATES: TemplateType[] = ["erstkontakt", "followup1", "followup2", "termin"]

const DEMO_LEADS: Record<string, {
  name: string
  industry: string
  city: string
  analysis: any
  recommendations: any
}> = {
  "1": {
    name: "Restaurant Löwengarten",
    industry: "Gastronomie",
    city: "Zürich",
    analysis: {
      websiteQuality: "gut",
      socialPresence: "mittel",
      seoScore: 72,
      loadTime: 1.8,
      mobileOptimized: true,
      weaknesses: [
        "Website-Ladezeit zu langsam",
        "Unregelmässige Social-Media-Aktivität",
        "Keine Online-Reservierungsmöglichkeit",
        "SEO nicht optimiert",
      ],
      strengths: [
        "Gute Google-Bewertungen (4.2 Sterne)",
        "Instagram und Facebook Präsenz aufgebaut",
      ],
    },
    recommendations: [
      "Instagram-Strategie aufbauen",
      "Google Business optimieren",
      "Website-Geschwindigkeit verbessern",
      "SEO-Grundlagen implementieren",
    ],
  },
  "demo-lead-01": {
    name: "Ristorante Bellavista",
    industry: "Gastronomie",
    city: "Zürich",
    analysis: {
      websiteQuality: "gut",
      socialPresence: "mittel",
      seoScore: 72,
      weaknesses: ["Keine Online-Reservierung", "Social Media unregelmässig"],
      strengths: ["Gute Google-Bewertungen", "Website vorhanden"],
    },
    recommendations: [
      "Online-Reservierungssystem einführen",
      "Instagram-Präsenz ausbauen",
      "Google My Business Beiträge regelmässig veröffentlichen",
    ],
  },
  "demo-lead-02": {
    name: "CrossFit Bern",
    industry: "Fitness",
    city: "Bern",
    analysis: {
      websiteQuality: "sehr gut",
      socialPresence: "stark",
      seoScore: 85,
      weaknesses: ["TikTok noch nicht genutzt", "Keine Testimonial-Videos"],
      strengths: ["Starke Community", "Hohe Google-Bewertung"],
    },
    recommendations: [
      "TikTok-Content-Strategie entwickeln",
      "Testimonial-Videos erstellen",
      "SEO für lokale Suchbegriffe optimieren",
    ],
  },
  "demo-lead-03": {
    name: "Modehaus Schneider",
    industry: "Mode",
    city: "Basel",
    analysis: {
      websiteQuality: "mittel",
      socialPresence: "schwach",
      seoScore: 45,
      weaknesses: ["Veraltete Website", "Kaum Social-Media-Aktivität"],
      strengths: ["Etablierte Marke", "Treue Kundschaft"],
    },
    recommendations: [
      "Website modernisieren",
      "Instagram-Shop einrichten",
      "Lokale SEO-Strategie aufbauen",
    ],
  },
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

  if (!body.template || !VALID_TEMPLATES.includes(body.template)) {
    return Response.json({ error: "Gültiger Template-Typ erforderlich (erstkontakt, followup1, followup2, termin)" }, { status: 400 })
  }

  if (prisma) {
    try {
      const lead = await prisma.lead.findUnique({ where: { id: body.leadId } })

      if (lead) {
        const email = await generateOutreachEmail({
          leadName: lead.name,
          industry: lead.industry,
          city: lead.city ?? undefined,
          analysis: lead.analysis ?? undefined,
          recommendations: lead.recommendations ?? undefined,
          template: body.template,
          customInstructions: body.customInstructions,
        })

        return Response.json(email)
      }
    } catch {}
  }

  const demoLead = DEMO_LEADS[body.leadId]
  if (demoLead) {
    const email = await generateOutreachEmail({
      leadName: demoLead.name,
      industry: demoLead.industry,
      city: demoLead.city,
      analysis: demoLead.analysis,
      recommendations: demoLead.recommendations,
      template: body.template,
      customInstructions: body.customInstructions,
    })

    return Response.json(email)
  }

  const email = await generateOutreachEmail({
    leadName: "Unbekanntes Unternehmen",
    industry: "Allgemein",
    template: body.template,
    customInstructions: body.customInstructions,
  })

  return Response.json(email)
}
