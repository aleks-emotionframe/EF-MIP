import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const references = await prisma!.aiReference.findMany({ orderBy: { createdAt: "desc" } })
    const rules = await prisma!.aiRule.findMany({ orderBy: [{ priority: "desc" }, { createdAt: "desc" }] })
    const feedback = await prisma!.aiFeedback.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
    const insights = await prisma!.conversionInsight.findMany({ orderBy: { createdAt: "desc" } })

    return Response.json({ references, rules, feedback, insights })
  } catch {
    return Response.json({
      references: [],
      rules: [
        { id: "demo-1", title: "Notfall-Nummer", rule: "Sanitär- und Haustechnik-Betriebe brauchen immer eine prominente Notfall-Nummer auf der Website", industry: "Haustechnik", isActive: true, priority: 10 },
        { id: "demo-2", title: "Referenzprojekte", rule: "Jeder Handwerksbetrieb sollte mindestens 5 Referenzprojekte mit Vorher/Nachher-Bildern zeigen", industry: null, isActive: true, priority: 8 },
        { id: "demo-3", title: "Google Bewertungen", rule: "Bei Betrieben mit unter 20 Google-Bewertungen immer empfehlen, aktiv nach Bewertungen zu fragen", industry: null, isActive: true, priority: 9 },
      ],
      feedback: [],
      insights: [],
    })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { action } = body

  try {
    switch (action) {
      case "addReference": {
        const ref = await prisma!.aiReference.create({
          data: { type: body.type, industry: body.industry, url: body.url, name: body.name, description: body.description, data: body.data, score: body.score },
        })
        return Response.json(ref)
      }

      case "deleteReference": {
        await prisma!.aiReference.delete({ where: { id: body.id } })
        return Response.json({ success: true })
      }

      case "addRule": {
        const rule = await prisma!.aiRule.create({
          data: { title: body.title, rule: body.rule, industry: body.industry, priority: body.priority ?? 0 },
        })
        return Response.json(rule)
      }

      case "updateRule": {
        const rule = await prisma!.aiRule.update({
          where: { id: body.id },
          data: { title: body.title, rule: body.rule, industry: body.industry, isActive: body.isActive, priority: body.priority },
        })
        return Response.json(rule)
      }

      case "deleteRule": {
        await prisma!.aiRule.delete({ where: { id: body.id } })
        return Response.json({ success: true })
      }

      case "addFeedback": {
        const fb = await prisma!.aiFeedback.create({
          data: { leadId: body.leadId, recommendationId: body.recommendationId, type: body.type, rating: body.rating, comment: body.comment, originalText: body.originalText },
        })
        return Response.json(fb)
      }

      case "addConversionInsight": {
        const insight = await prisma!.conversionInsight.create({
          data: { leadId: body.leadId, industry: body.industry, city: body.city, score: body.score, winningFactors: body.winningFactors, outreachMethod: body.outreachMethod, timeToConvert: body.timeToConvert, monthlyValue: body.monthlyValue, notes: body.notes },
        })
        return Response.json(insight)
      }

      default:
        return Response.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
